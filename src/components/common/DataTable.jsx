import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, ChevronLeft, ChevronRight, MoreVertical } from "lucide-react";
import Table from "./Table.jsx";
import Input from "./Input.jsx";
import Select from "./Select.jsx";
import Button from "./Button.jsx";
import IconButton from "./IconButton.jsx";

const defaultPageSizeOptions = [5, 10, 25, 100];

const toArray = (value) => {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null) return [];
  return [value];
};

const ActionMenu = ({ actions = [], row }) => {
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState(null);

  const visibleActions = useMemo(() => {
    return actions
      .filter((action) => (action?.hidden ? !action.hidden(row) : true))
      .map((action) => ({
        ...action,
        disabled: action?.disabled ? action.disabled(row) : false,
      }));
  }, [actions, row]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!open) return;

      const clickedTrigger = triggerRef.current?.contains(event.target);
      const clickedMenu = menuRef.current?.contains(event.target);

      if (!clickedTrigger && !clickedMenu) {
        setOpen(false);
        setMenuPos(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const updatePosition = useCallback(() => {
    if (!open) return;
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const measured = menuRef.current?.getBoundingClientRect();
    const menuWidth = measured?.width ?? 208;
    const menuHeight = measured?.height ?? 240;
    const gap = 8;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;
    const openUp = spaceBelow < menuHeight && spaceAbove > spaceBelow;

    const left = Math.min(Math.max(rect.right - menuWidth, 8), viewportWidth - menuWidth - 8);
    const maxTop = viewportHeight - menuHeight - 8;
    const rawTop = openUp ? rect.top - menuHeight - gap : rect.bottom + gap;
    const top = Math.min(Math.max(rawTop, 8), Math.max(maxTop, 8));

    setMenuPos({ top, left });
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const raf = requestAnimationFrame(() => updatePosition());

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, updatePosition]);

  if (!visibleActions.length) return null;

  return (
    <div ref={triggerRef} className="relative inline-flex">
      <IconButton
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() =>
          setOpen((prev) => {
            const next = !prev;
            if (!next) setMenuPos(null);
            return next;
          })
        }
        className="border border-border/70 bg-card hover:bg-muted shadow-sm"
      >
        <MoreVertical className="h-4 w-4" />
      </IconButton>
      {open
        ? createPortal(
            <div
              ref={menuRef}
              role="menu"
              style={{
                position: "fixed",
                top: menuPos?.top ?? -9999,
                left: menuPos?.left ?? -9999,
                visibility: menuPos ? "visible" : "hidden",
              }}
              className="w-52 max-h-60 overflow-auto rounded-2xl border border-border bg-card shadow-xl shadow-black/10 z-50"
            >
              {visibleActions.map((action) => (
                <button
                  key={action.key}
                  type="button"
                  role="menuitem"
                  disabled={action.disabled}
                  onClick={() => {
                    if (action.disabled) return;
                    action.onClick(row);
                    setOpen(false);
                    setMenuPos(null);
                  }}
                  className={`w-full px-3 py-2 text-left text-sm font-semibold flex items-center gap-2 transition-colors ${
                    action.destructive
                      ? "text-danger hover:bg-danger/10"
                      : "text-foreground hover:bg-muted"
                  } ${action.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {action.icon ? <span className="shrink-0">{action.icon}</span> : null}
                  <span className="flex-1">{action.label}</span>
                </button>
              ))}
            </div>,
            document.body
          )
        : null}
    </div>
  );
};

const DataTable = ({
  data = [],
  columns = [],
  getRowId,
  loading = false,
  emptyMessage = "No records found.",
  title,
  description,
  enableSelection = false,
  selectedRowIds,
  onSelectionChange,
  rowActions = [],
  bulkActions = [],
  initialPageSize = 10,
  pageSizeOptions = defaultPageSizeOptions,
  enableSearch = true,
  searchPlaceholder = "Search...",
  searchKeys = [],
  filters = [],
  className = "",
  serverPagination,
  onFetchParamsChange,
}) => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [page, setPage] = useState(1);
  const [internalSelectedRowIds, setInternalSelectedRowIds] = useState([]);
  const [filterState, setFilterState] = useState(() => {
    const state = {};
    filters.forEach((filter) => {
      state[filter.id] = filter.defaultValue ?? "";
    });
    return state;
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  const effectiveSelectedRowIds = selectedRowIds ?? internalSelectedRowIds;

  const selection = useMemo(
    () => (enableSelection ? new Set(effectiveSelectedRowIds) : undefined),
    [enableSelection, effectiveSelectedRowIds]
  );

  useEffect(() => {
    if (onFetchParamsChange) {
      onFetchParamsChange({
        search: debouncedSearch,
        page,
        limit: pageSize,
        ...filterState,
      });
    }
  }, [debouncedSearch, page, pageSize, filterState, onFetchParamsChange]);

  const normalizedSearchKeys = useMemo(() => {
    if (searchKeys && searchKeys.length) return searchKeys;

    const potentialKeys = columns
      .map((col) => col.searchKey)
      .filter(Boolean)
      .flatMap(toArray);

    return [...new Set(potentialKeys)];
  }, [columns, searchKeys]);

  const filteredData = useMemo(() => {
    if (serverPagination) return data; 

    const term = search.trim().toLowerCase();

    return data.filter((row) => {
      const passesSearch = !term
        ? true
        : normalizedSearchKeys.some((key) => {
            const value = typeof key === "function" ? key(row) : row?.[key];
            return String(value ?? "").toLowerCase().includes(term);
          });

      if (!passesSearch) return false;

      const passesFilters = filters.every((filter) => {
        const selected = filterState[filter.id];
        if (selected === "" || selected === undefined || selected === null) {
          return true;
        }

        const value = filter.getValue(row);
        return filter.match
          ? filter.match(value, selected, row)
          : String(value ?? "") === String(selected);
      });

      return passesFilters;
    });
  }, [data, search, normalizedSearchKeys, filters, filterState, serverPagination]);

  const total = serverPagination ? serverPagination.total : filteredData.length;
  const totalPages = serverPagination ? serverPagination.totalPages : Math.max(1, Math.ceil(total / pageSize));
  const currentPage = serverPagination ? serverPagination.page : Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const pageData = useMemo(() => {
    if (serverPagination) return filteredData;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, startIndex, pageSize, serverPagination]);

  const rowIdFor = useCallback(
    (row) => {
      if (getRowId) return getRowId(row);
      return row?._id ?? row?.id;
    },
    [getRowId]
  );

  const hasActionsColumn = useMemo(() => {
    return rowActions.length > 0 || columns.some((c) => c.key === "actions");
  }, [rowActions, columns]);

  const colSpan = useMemo(() => {
    return columns.length + (enableSelection ? 1 : 0) + (hasActionsColumn ? 1 : 0);
  }, [columns.length, enableSelection, hasActionsColumn]);

  const allVisibleIds = useMemo(() => {
    if (!enableSelection) return [];
    return pageData.map(rowIdFor).filter(Boolean);
  }, [pageData, enableSelection, rowIdFor]);

  const allVisibleSelected = useMemo(() => {
    if (!enableSelection || !selection) return false;
    if (!allVisibleIds.length) return false;
    return allVisibleIds.every((id) => selection.has(id));
  }, [enableSelection, selection, allVisibleIds]);

  const someVisibleSelected = useMemo(() => {
    if (!enableSelection || !selection) return false;
    return allVisibleIds.some((id) => selection.has(id));
  }, [enableSelection, selection, allVisibleIds]);

  const selectedRows = useMemo(() => {
    if (!enableSelection || !selection) return [];
    const selectedSet = selection;
    return filteredData.filter((row) => selectedSet.has(rowIdFor(row)));
  }, [enableSelection, selection, filteredData, rowIdFor]);

  const setSelected = (nextSet) => {
    const next = Array.from(nextSet);
    if (onSelectionChange) {
      onSelectionChange(next);
      return;
    }

    setInternalSelectedRowIds(next);
  };

  const toggleRow = (row) => {
    if (!enableSelection || !selection) return;
    const id = rowIdFor(row);
    if (!id) return;

    const next = new Set(selection);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const toggleAllVisible = () => {
    if (!enableSelection || !selection) return;

    const next = new Set(selection);
    if (allVisibleSelected) {
      allVisibleIds.forEach((id) => next.delete(id));
    } else {
      allVisibleIds.forEach((id) => next.add(id));
    }
    setSelected(next);
  };

  const headerCheckboxRef = useRef(null);
  useEffect(() => {
    if (!headerCheckboxRef.current) return;
    headerCheckboxRef.current.indeterminate =
      !allVisibleSelected && someVisibleSelected;
  }, [allVisibleSelected, someVisibleSelected]);

  return (
    <div className={`space-y-4 ${className}`}> 
      {(title || description || enableSearch || filters.length || bulkActions.length) && (
        <div className="flex flex-col gap-3">
          {(title || description) && (
            <div>
              {title && (
                <h3 className="text-lg font-black text-foreground">{title}</h3>
              )}
              {description && (
                <p className="text-sm text-muted-foreground font-medium">
                  {description}
                </p>
              )}
            </div>
          )}

          {enableSelection && selectedRows.length > 0 && bulkActions.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border border-primary/20 bg-primary/5 shadow-sm mb-2 animate-in fade-in slide-in-from-top-4">
              <div className="flex items-center gap-3">
                <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold leading-none px-2 shadow-sm">
                  {selectedRows.length}
                </span>
                <span className="text-sm font-semibold text-primary">users selected</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {bulkActions.map((action) => (
                  <Button
                    key={action.key}
                    size="sm"
                    variant={action.variant || "outline"}
                    className={action.className || ""}
                    disabled={action.disabled ? action.disabled(selectedRows) : false}
                    onClick={() => action.onClick(selectedRows)}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>
          )}

              {enableSearch && (
                <div className="w-full">
                  <Input
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                    placeholder={searchPlaceholder}
                    className="w-full bg-card"
                    aria-label="Search"
                  />
                </div>
              )}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-muted/5 p-4 rounded-2xl border border-border/50">

            {filters.map((filter) => (
              <div key={filter.id} className="w-full">
                <Select
                  label={filter.label}
                  value={filterState[filter.id]}
                  onChange={(e) => {
                    setFilterState((prev) => ({
                      ...prev,
                      [filter.id]: e.target.value,
                    }));
                    setPage(1);
                  }}
                  options={filter.options}
                  className="bg-card w-full"
                />
              </div>
            ))}
          </div>
        </div>
      )}



      <div className="rounded-2xl border border-border/70 bg-card/70 overflow-hidden shadow-sm">
        <Table className={className}>
          <Table.Header className="bg-muted/30">
            <Table.Row>
              {enableSelection && (
                <Table.Head className="w-10">
                  <input
                    ref={headerCheckboxRef}
                    type="checkbox"
                    checked={allVisibleSelected}
                    onChange={toggleAllVisible}
                    className="h-4 w-4 accent-primary"
                    aria-label="Select all rows"
                  />
                </Table.Head>
              )}

              {columns.map((col) => (
                <Table.Head
                  key={col.key}
                  className={col.headClassName || ""}
                >
                  {col.header}
                </Table.Head>
              ))}

              {hasActionsColumn && (
                <Table.Head className="text-right">Actions</Table.Head>
              )}
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {loading ? (
              <Table.Row>
                <Table.Cell
                  className="py-8 text-center text-sm font-semibold text-muted-foreground"
                  colSpan={colSpan}
                >
                  Loading...
                </Table.Cell>
              </Table.Row>
            ) : pageData.length ? (
              pageData.map((row) => {
                const id = rowIdFor(row);
                const isSelected = enableSelection && selection ? selection.has(id) : false;

                return (
                  <Table.Row key={id ?? JSON.stringify(row)} className="hover:bg-muted/30">
                    {enableSelection && (
                      <Table.Cell className="w-10">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleRow(row)}
                          className="h-4 w-4 accent-primary"
                          aria-label="Select row"
                        />
                      </Table.Cell>
                    )}

                    {columns.map((col) => (
                      <Table.Cell key={col.key} className={col.cellClassName || ""}>
                        {col.render ? col.render(row) : row?.[col.key]}
                      </Table.Cell>
                    ))}

                    {hasActionsColumn && (
                      <Table.Cell className="text-right">
                        <ActionMenu actions={rowActions} row={row} />
                      </Table.Cell>
                    )}
                  </Table.Row>
                );
              })
            ) : (
              <Table.Row>
                <Table.Cell
                  className="py-10 text-center text-sm font-semibold text-muted-foreground"
                  colSpan={colSpan}
                >
                  {emptyMessage}
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-card p-4 rounded-xl border border-border/40 shadow-sm mt-4">
        <div className="flex items-center gap-4">
          <div className="text-sm font-medium text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{total ? startIndex + 1 : 0}</span> to <span className="font-semibold text-foreground">{Math.min(startIndex + pageSize, total)}</span> of <span className="font-semibold text-foreground">{total}</span>
          </div>
          <div className="h-4 w-px bg-border hidden sm:block"></div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-[0.15em] text-muted-foreground">
              Rows
            </span>
            <div className="relative">
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="appearance-none rounded-lg border border-border/70 bg-muted/30 px-3 py-1.5 pr-8 text-sm font-bold text-foreground shadow-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all cursor-pointer"
                aria-label="Rows per page"
              >
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="border-border/70 bg-card hover:bg-muted/50 text-foreground font-semibold px-3 shadow-none"
            disabled={currentPage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            icon={<ChevronLeft className="h-4 w-4" />}
          >
            Prev
          </Button>
          <div className="text-sm font-bold text-foreground px-4 py-1.5 bg-muted/20 rounded-md border border-border/40">
            {currentPage} <span className="text-muted-foreground font-normal mx-1">/</span> {totalPages}
          </div>
          <Button
            size="sm"
            variant="outline"
            className="border-border/70 bg-card hover:bg-muted/50 text-foreground font-semibold px-3 shadow-none"
            disabled={currentPage >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            iconPosition="right"
            icon={<ChevronRight className="h-4 w-4" />}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
