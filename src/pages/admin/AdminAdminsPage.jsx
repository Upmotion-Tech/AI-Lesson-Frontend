import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import {
  Edit,
  Trash2,
  Undo2,
  Shield,
  UserCheck,
  ShieldX,
  Crown,
  ShieldAlert,
} from "lucide-react";
import { useAppDispatch } from "../../hooks/useAppDispatch.js";
import { useAppSelector } from "../../hooks/useAppSelector.js";
import Card from "../../components/common/Card.jsx";
import Modal from "../../components/common/Modal.jsx";
import Button from "../../components/common/Button.jsx";
import Badge from "../../components/common/Badge.jsx";
import PageTransition from "../../components/common/PageTransition.jsx";
import DataTable from "../../components/common/DataTable.jsx";
import Input from "../../components/common/Input.jsx";
import {
  fetchAdminStats,
  fetchAllUsersAdmin,
  setUserAccessAdmin,
  updateUserByAdmin,
} from "../../store/adminThunks.js";
import { getUserAvatarUrl } from "../../utils/userAvatar.js";
import {
  getRoleLabel,
  canManageUser,
  normalizeRoles,
} from "../../utils/roleHierarchy.js";

const getInitials = (name) => {
  if (!name) return "A";
  return name.substring(0, 2).toUpperCase();
};

const AdminAdminsPage = () => {
  const dispatch = useAppDispatch();
  const { users, usersPagination, usersStatus } = useAppSelector((state) => state.admin);
  const { user: currentUser } = useAppSelector((state) => state.auth);

  const currentUserRoles = normalizeRoles(currentUser?.role);

  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [selectedAdminIds, setSelectedAdminIds] = useState([]);
  const [editForm, setEditForm] = useState({ name: "", email: "", role: "admin" });
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Filter to only show admins and super_admins
  const admins = useMemo(
    () => users.filter((u) => {
      const role = Array.isArray(u.role) ? u.role[0] : u.role;
      return role === "admin" || role === "super_admin";
    }),
    [users]
  );

  useEffect(() => {
    dispatch(fetchAllUsersAdmin({ page: 1, limit: 10 }));
    dispatch(fetchAdminStats());
  }, [dispatch]);

  const handleFetchParamsChange = useCallback(
    (params) => {
      dispatch(fetchAllUsersAdmin(params));
    },
    [dispatch]
  );

  const openEditModal = useCallback((admin) => {
    setSelectedAdmin(admin);
    const role = Array.isArray(admin.role) ? admin.role[0] : admin.role;
    setEditForm({ name: admin?.name || "", email: admin?.email || "", role });
  }, []);

  const closeEditModal = useCallback(() => {
    setSelectedAdmin(null);
  }, []);

  const handleAccessAction = useCallback(
    async (admin, action) => {
      if (!canManageUser(currentUserRoles, admin.role)) {
        toast.error("You cannot manage this admin");
        return;
      }

      try {
        await dispatch(setUserAccessAdmin({ id: admin._id, action })).unwrap();
        toast.success("Admin access updated");
        dispatch(fetchAdminStats());
      } catch (error) {
        toast.error(error || "Failed to update admin");
      }
    },
    [dispatch, currentUserRoles]
  );

  const bulkAccessAction = useCallback(
    async (selectedRows, action) => {
      if (!selectedRows.length) return;
      const manageableRows = selectedRows.filter((a) => canManageUser(currentUserRoles, a.role));
      if (!manageableRows.length) {
        toast.error("No selected admins are manageable");
        return;
      }

      try {
        await Promise.all(
          manageableRows.map((admin) =>
            dispatch(setUserAccessAdmin({ id: admin._id, action })).unwrap()
          )
        );
        toast.success("Bulk action completed");
        setSelectedAdminIds([]);
        dispatch(fetchAdminStats());
      } catch (error) {
        toast.error(error || "Failed to perform action");
      }
    },
    [dispatch, currentUserRoles]
  );

  const handleSaveEdit = async (event) => {
    event.preventDefault();
    if (!selectedAdmin) return;

    try {
      setIsSavingEdit(true);
      await dispatch(
        updateUserByAdmin({ userId: selectedAdmin._id, name: editForm.name, email: editForm.email })
      ).unwrap();
      toast.success("Admin updated");
      closeEditModal();
      dispatch(fetchAdminStats());
    } catch (error) {
      toast.error(error || "Failed to update admin");
    } finally {
      setIsSavingEdit(false);
    }
  };

  const roleLabelFn = useCallback((role) => getRoleLabel(role), []);

  const statusConfig = useCallback((admin) => {
    if (admin?.Deleted?.isDeleted) return { label: "Revoked", variant: "danger" };
    if (admin?.isDeactivated) return { label: "Suspended", variant: "warning" };
    return { label: "Active", variant: "success" };
  }, []);

  const statusOptions = useMemo(
    () => [
      { value: "", label: "All" },
      { value: "active", label: "Active" },
      { value: "suspended", label: "Suspended" },
      { value: "revoked", label: "Revoked" },
    ],
    []
  );

  const columns = useMemo(
    () => [
      {
        key: "admin",
        header: "Admin",
        searchKey: [(a) => a?.name, (a) => a?.email],
        render: (admin) => {
          const role = Array.isArray(admin.role) ? admin.role[0] : admin.role || "admin";
          const isSuper = role === "super_admin";
          return (
            <div className="flex items-center gap-4 min-w-[280px]">
              <div className="h-10 w-10 shrink-0 rounded-full bg-linear-to-br from-indigo-100 to-indigo-50 border border-indigo-100 flex items-center justify-center overflow-hidden shadow-sm">
                {admin.profileImage ? (
                  <img src={getUserAvatarUrl(admin.profileImage)} alt={admin.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-sm font-bold text-indigo-700">{getInitials(admin.name)}</span>
                )}
              </div>
              <div className="flex flex-col min-w-[140px]">
                <p className="font-semibold text-foreground truncate">{admin.name}</p>
                <p className="text-[13px] text-muted-foreground font-medium truncate">{admin.email}</p>
                <div className="inline-flex items-center gap-1 mt-1 text-xs font-black uppercase tracking-wider">
                  {isSuper ? <ShieldAlert className="h-3.5 w-3.5 text-red-600" /> : <Crown className="h-3.5 w-3.5 text-indigo-600" />}
                  <span className={isSuper ? "text-red-600" : "text-indigo-600"}>{roleLabelFn(role)}</span>
                </div>
              </div>
            </div>
          );
        },
      },
      {
        key: "status",
        header: "Status",
        searchKey: [(a) => statusConfig(a).label],
        render: (admin) => {
          const status = statusConfig(admin);
          return (
            <div className="min-w-[100px]">
              <Badge variant={status.variant} className="shadow-none">
                {status.label}
              </Badge>
            </div>
          );
        },
      },
    ],
    [roleLabelFn, statusConfig]
  );

  const filters = useMemo(
    () => [
      {
        id: "status",
        label: "Status",
        options: statusOptions,
        getValue: (admin) => (admin?.Deleted?.isDeleted ? "revoked" : admin?.isDeactivated ? "suspended" : "active"),
      },
    ],
    [statusOptions]
  );

  const rowActions = useMemo(
    () => [
      {
        key: "edit",
        label: "Edit",
        icon: <Edit className="h-4 w-4 text-blue-500" />,
        hidden: (admin) => !canManageUser(currentUserRoles, admin.role),
        onClick: (admin) => openEditModal(admin),
      },
      {
        key: "access-activate",
        label: "Activate",
        icon: <UserCheck className="h-4 w-4 text-emerald-500" />,
        hidden: (admin) => !admin?.isDeactivated || !canManageUser(currentUserRoles, admin.role),
        onClick: (admin) => handleAccessAction(admin, "activate"),
      },
      {
        key: "access-suspend",
        label: "Suspend",
        icon: <ShieldX className="h-4 w-4 text-amber-500" />,
        hidden: (admin) => admin?.isDeactivated || !canManageUser(currentUserRoles, admin.role),
        onClick: (admin) => handleAccessAction(admin, "suspend"),
      },
      {
        key: "access-restore",
        label: "Restore",
        icon: <Undo2 className="h-4 w-4 text-indigo-500" />,
        hidden: (admin) => !admin?.Deleted?.isDeleted || !canManageUser(currentUserRoles, admin.role),
        onClick: (admin) => handleAccessAction(admin, "restore"),
      },
      {
        key: "access-revoke",
        label: "Delete",
        icon: <Trash2 className="h-4 w-4 text-rose-500" />,
        destructive: true,
        hidden: (admin) => admin?.Deleted?.isDeleted || !canManageUser(currentUserRoles, admin.role),
        onClick: (admin) => handleAccessAction(admin, "revoke"),
      },
    ],
    [currentUserRoles, openEditModal, handleAccessAction]
  );

  const bulkActions = useMemo(
    () => [
      {
        key: "bulk-activate",
        label: "Activate",
        variant: "outline",
        onClick: (rows) => bulkAccessAction(rows, "activate"),
        disabled: (rows) => rows.every((a) => !a?.isDeactivated),
      },
      {
        key: "bulk-suspend",
        label: "Suspend",
        variant: "outline",
        onClick: (rows) => bulkAccessAction(rows, "suspend"),
        disabled: (rows) => rows.every((a) => a?.isDeactivated),
      },
      {
        key: "bulk-revoke",
        label: "Delete",
        variant: "danger",
        onClick: (rows) => bulkAccessAction(rows, "revoke"),
        disabled: (rows) => rows.every((a) => a?.Deleted?.isDeleted),
      },
    ],
    [bulkAccessAction]
  );

  return (
    <PageTransition>
      <div className="space-y-8 pb-16">
        <div className="rounded-3xl bg-linear-to-br from-slate-900 to-indigo-900 text-white p-8 shadow-xl">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8" />
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-300">Admin Panel</p>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">Manage Admins</h1>
            </div>
          </div>
        </div>

        <Card className="rounded-2xl border-0 ring-1 ring-border/50 shadow-md">
          <DataTable
            className="p-2"
            title="Admin List"
            description="Create, update, and manage admin accounts. Only users with higher privileges can modify admins."
            data={admins}
            loading={usersStatus === "loading"}
            columns={columns}
            filters={filters}
            enableSelection
            selectedRowIds={selectedAdminIds}
            onSelectionChange={setSelectedAdminIds}
            rowActions={rowActions}
            bulkActions={bulkActions}
            initialPageSize={10}
            searchPlaceholder="Search by name or email"
            serverPagination={usersPagination}
            onFetchParamsChange={handleFetchParamsChange}
          />
        </Card>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={Boolean(selectedAdmin)}
        onClose={closeEditModal}
        title="Edit Admin Account"
        size="md"
      >
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <Input
            label="Full Name"
            value={editForm.name}
            onChange={(event) => setEditForm((prev) => ({ ...prev, name: event.target.value }))}
            required
          />
          <Input
            label="Email"
            value={editForm.email}
            type="email"
            onChange={(event) => setEditForm((prev) => ({ ...prev, email: event.target.value }))}
            required
          />
          <div className="pt-2">
            <Button type="submit" loading={isSavingEdit}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </PageTransition>
  );
};

export default AdminAdminsPage;
