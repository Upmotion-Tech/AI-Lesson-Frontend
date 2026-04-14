import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import {
  Edit,
  ShieldCheck,
  ShieldX,
  Trash2,
  Undo2,
  Users,
  UserCheck,
  UserMinus,
  Crown,
  GraduationCap,
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
import {
  changeUserRoleAdmin,
  fetchAdminStats,
  fetchAllUsersAdmin,
  setUserAccessAdmin,
  updateUserByAdmin,
} from "../../store/adminThunks.js";
import Input from "../../components/common/Input.jsx";
import { getUserAvatarUrl } from "../../utils/userAvatar.js";
import {
  getRoleLabel,
  getHighestPrivilegeLevel,
  canManageUser,
  canManageRole,
  normalizeRoles,
  isSuperAdmin,
} from "../../utils/roleHierarchy.js";

const getInitials = (name) => {
  if (!name) return "U";
  return name.substring(0, 2).toUpperCase();
};

const AdminUsersPage = () => {
  const dispatch = useAppDispatch();
  const { users, usersPagination, usersStatus } = useAppSelector((state) => state.admin);
  const { user: currentUser } = useAppSelector((state) => state.auth);

  const currentUserRoles = normalizeRoles(currentUser?.role);

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [editForm, setEditForm] = useState({ name: "", email: "" });
  const [isSavingEdit, setIsSavingEdit] = useState(false);

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

  const openEditModal = useCallback((user) => {
    setSelectedUser(user);
    setEditForm({ name: user?.name || "", email: user?.email || "" });
  }, []);

  const closeEditModal = useCallback(() => {
    setSelectedUser(null);
  }, []);

  const handleRoleChange = useCallback(
    async (user, role) => {
      if (!canManageUser(currentUserRoles, user.role)) {
        toast.error("You cannot manage this user");
        return;
      }

      if (!canManageRole(currentUserRoles, role)) {
        toast.error("You cannot assign this role");
        return;
      }

      try {
        await dispatch(changeUserRoleAdmin({ id: user._id, role: [role] })).unwrap();
        toast.success("Role updated");
        dispatch(fetchAdminStats());
      } catch (error) {
        toast.error(error || "Failed to update role");
      }
    },
    [dispatch, currentUserRoles]
  );

  const handleAccessAction = useCallback(
    async (user, action) => {
      if (!canManageUser(currentUserRoles, user.role)) {
        toast.error("You cannot manage this user");
        return;
      }

      try {
        await dispatch(setUserAccessAdmin({ id: user._id, action })).unwrap();
        toast.success("Access updated");
        dispatch(fetchAdminStats());
      } catch (error) {
        toast.error(error || "Failed to update access");
      }
    },
    [dispatch, currentUserRoles]
  );

  const bulkAccessAction = useCallback(
    async (selectedRows, action) => {
      if (!selectedRows.length) return;
      const manageableRows = selectedRows.filter((u) => canManageUser(currentUserRoles, u.role));
      if (!manageableRows.length) {
        toast.error("No selected users are manageable");
        return;
      }

      try {
        await Promise.all(
          manageableRows.map((user) =>
            dispatch(setUserAccessAdmin({ id: user._id, action })).unwrap()
          )
        );
        toast.success("Bulk access action completed");
        setSelectedUserIds([]);
        dispatch(fetchAdminStats());
      } catch (error) {
        toast.error(error || "Failed to update access");
      }
    },
    [dispatch, currentUserRoles]
  );

  const roleLabelFn = useCallback((role) => getRoleLabel(role), []);

  const statusConfig = useCallback((user) => {
    if (user?.Deleted?.isDeleted) return { label: "Revoked", variant: "danger" };
    if (user?.isDeactivated) return { label: "Suspended", variant: "warning" };
    return { label: "Active", variant: "success" };
  }, []);

  const roleOptions = useMemo(() => {
    const list = [
      { value: "", label: "All" },
      { value: "teacher", label: "Teacher" },
      { value: "admin", label: "Admin" },
    ];
    if (isSuperAdmin(currentUserRoles)) {
      list.push({ value: "super_admin", label: "Super Admin" });
    }
    return list;
  }, [currentUserRoles]);

  const statusOptions = useMemo(
    () => [
      { value: "", label: "All" },
      { value: "active", label: "Active" },
      { value: "suspended", label: "Suspended" },
      { value: "revoked", label: "Revoked" },
    ],
    []
  );

  const subscriptionOptions = useMemo(
    () => [
      { value: "", label: "All" },
      { value: "free", label: "Free" },
      { value: "trial", label: "Trial" },
      { value: "active", label: "Active" },
      { value: "past_due", label: "Past Due" },
      { value: "canceled", label: "Canceled" },
    ],
    []
  );

  const columns = useMemo(
    () => [
      {
        key: "user",
        header: "User",
        searchKey: [(u) => u?.name, (u) => u?.email],
        render: (user) => {
          const role = Array.isArray(user.role) ? user.role[0] : user.role || "teacher";
          const isSuper = role === "super_admin";
          const isAdminRole = role === "admin";
          return (
            <div className="flex items-center gap-4 min-w-[280px]">
              <div className="h-10 w-10 shrink-0 rounded-full bg-linear-to-br from-indigo-100 to-indigo-50 border border-indigo-100 flex items-center justify-center overflow-hidden shadow-sm">
                {user.profileImage ? (
                  <img src={getUserAvatarUrl(user.profileImage)} alt={user.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-sm font-bold text-indigo-700">{getInitials(user.name)}</span>
                )}
              </div>
              <div className="flex flex-col min-w-[140px]">
                <p className="font-semibold text-foreground truncate">{user.name}</p>
                <p className="text-[13px] text-muted-foreground font-medium truncate">{user.email}</p>
                <div className="inline-flex items-center gap-1 mt-1 text-xs font-black uppercase tracking-wider">
                  {isSuper ? <ShieldAlert className="h-3.5 w-3.5" /> : isAdminRole ? <Crown className="h-3.5 w-3.5" /> : <GraduationCap className="h-3.5 w-3.5 text-slate-400" />}
                  <span className={isSuper ? "text-red-600" : isAdminRole ? "text-indigo-600" : "text-slate-500"}>{roleLabelFn(role)}</span>
                </div>
              </div>
            </div>
          );
        },
      },
      {
        key: "subscription",
        header: "Subscription",
        searchKey: [(u) => u?.subscription?.status, (u) => u?.subscription?.planName],
        render: (user) => {
          const subStatus = user.subscription?.status || "free";
          const planLabel = user.subscription?.planName || "Trial / Default";
          return (
            <div className="flex flex-col gap-1 min-w-[140px]">
              <Badge variant={subStatus === "active" ? "success" : "default"} className="uppercase text-[10px] tracking-wider font-extrabold">
                {subStatus}
              </Badge>
              <p className="text-xs text-muted-foreground font-medium truncate capitalize">Plan: {planLabel}</p>
            </div>
          );
        },
      },
      {
        key: "status",
        header: "Status",
        searchKey: [(u) => statusConfig(u).label],
        render: (user) => {
          const status = statusConfig(user);
          return (
            <div className="min-w-[100px]">
              <Badge variant={status.variant} className="shadow-none">
                {status.label}
              </Badge>
            </div>
          );
        },
      },
      {
        key: "actions",
        header: "Actions",
        render: (user) => {
          return (
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => openEditModal(user)}
              >
                <Edit className="h-3.5 w-3.5" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleRoleChange(user, isSuperAdmin(currentUserRoles) ? "admin" : "teacher")}
              >
                <ShieldCheck className="h-3.5 w-3.5" />
              </Button>
            </div>
          );
        },
      },
    ],
    [currentUserRoles, handleRoleChange, openEditModal, roleLabelFn, statusConfig]
  );

  const filters = useMemo(
    () => [
      { id: "role", label: "Role", options: roleOptions, getValue: (user) => (Array.isArray(user.role) ? user.role[0] : user.role || "teacher") },
      { id: "status", label: "Status", options: statusOptions, getValue: (user) => (user?.Deleted?.isDeleted ? "revoked" : user?.isDeactivated ? "suspended" : "active") },
      { id: "subscription", label: "Subscription", options: subscriptionOptions, getValue: (user) => user.subscription?.status || "free" },
    ],
    [roleOptions, statusOptions, subscriptionOptions]
  );

  const rowActions = useMemo(
    () => [
      {
        key: "access-activate",
        label: "Activate Account",
        icon: <UserCheck className="h-4 w-4 text-emerald-500" />,
        hidden: (user) => !user?.isDeactivated,
        onClick: (user) => handleAccessAction(user, "activate"),
      },
      {
        key: "access-suspend",
        label: "Suspend Account",
        icon: <ShieldX className="h-4 w-4 text-amber-500" />,
        hidden: (user) => user?.isDeactivated,
        onClick: (user) => handleAccessAction(user, "suspend"),
      },
      {
        key: "access-restore",
        label: "Restore User",
        icon: <Undo2 className="h-4 w-4 text-indigo-500" />,
        hidden: (user) => !user?.Deleted?.isDeleted,
        onClick: (user) => handleAccessAction(user, "restore"),
      },
      {
        key: "access-revoke",
        label: "Delete",
        icon: <Trash2 className="h-4 w-4 text-rose-500" />,
        destructive: true,
        hidden: (user) => user?.Deleted?.isDeleted,
        onClick: (user) => handleAccessAction(user, "revoke"),
      },
    ],
    [handleAccessAction]
  );

  const bulkActions = useMemo(
    () => [
      { key: "bulk-activate", label: "Activate", variant: "outline", onClick: (rows) => bulkAccessAction(rows, "activate"), disabled: (rows) => rows.every((u) => !u?.isDeactivated) },
      { key: "bulk-suspend", label: "Suspend", variant: "outline", onClick: (rows) => bulkAccessAction(rows, "suspend"), disabled: (rows) => rows.every((u) => u?.isDeactivated) },
      { key: "bulk-restore", label: "Restore", variant: "outline", onClick: (rows) => bulkAccessAction(rows, "restore"), disabled: (rows) => rows.every((u) => !u?.Deleted?.isDeleted) },
      { key: "bulk-revoke", label: "Delete", variant: "danger", onClick: (rows) => bulkAccessAction(rows, "revoke"), disabled: (rows) => rows.every((u) => u?.Deleted?.isDeleted) },
    ],
    [bulkAccessAction]
  );

  const handleSaveEdit = async (event) => {
    event.preventDefault();
    if (!selectedUser) return;

    try {
      setIsSavingEdit(true);
      await dispatch(
        updateUserByAdmin({ userId: selectedUser._id, name: editForm.name, email: editForm.email })
      ).unwrap();
      toast.success("User updated");
      closeEditModal();
    } catch (error) {
      toast.error(error || "Failed to update user");
    } finally {
      setIsSavingEdit(false);
    }
  };

  return (
    <PageTransition>
      <div className="space-y-8 pb-16">
        <div className="rounded-3xl bg-linear-to-br from-slate-900 to-indigo-900 text-white p-8 shadow-xl">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8" />
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-300">Admin</p>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">Users</h1>
            </div>
          </div>
        </div>

        <Card className="rounded-2xl border-0 ring-1 ring-border/50 shadow-md">
          <DataTable
            className="p-2"
            title="Overview"
            description="Manage your users seamlessly. Multi-select for bulk actions or search for specific students and admins."
            data={users}
            loading={usersStatus === "loading"}
            columns={columns}
            filters={filters}
            enableSelection
            selectedRowIds={selectedUserIds}
            onSelectionChange={setSelectedUserIds}
            rowActions={rowActions}
            bulkActions={bulkActions}
            initialPageSize={10}
            searchPlaceholder="Search by name, email, role, subscription"
            serverPagination={usersPagination}
            onFetchParamsChange={handleFetchParamsChange}
          />
        </Card>
      </div>

      <Modal isOpen={Boolean(selectedUser)} onClose={closeEditModal} title="Edit User Account" size="md">
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <Input label="Full Name" value={editForm.name} onChange={(event) => setEditForm((prev) => ({ ...prev, name: event.target.value }))} required />
          <Input label="Email" value={editForm.email} type="email" onChange={(event) => setEditForm((prev) => ({ ...prev, email: event.target.value }))} required />
          <div className="pt-2">
            <Button type="submit" loading={isSavingEdit}>Save Changes</Button>
          </div>
        </form>
      </Modal>
    </PageTransition>
  );
};

export default AdminUsersPage;
