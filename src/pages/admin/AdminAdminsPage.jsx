import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Plus,
  FileText,
  Package,
  Check,
  X,
  Loader2,
  UserX,
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
import Select from "../../components/common/Select.jsx";
import {
  fetchAdminStats,
  fetchAllUsersAdmin,
  setUserAccessAdmin,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  hardDeleteAdmin,
  checkEmailAvailability,
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
  const navigate = useNavigate();
  const { users, usersPagination, usersStatus } = useAppSelector((state) => state.admin);
  const { user: currentUser } = useAppSelector((state) => state.auth);

  const currentUserRoles = normalizeRoles(currentUser?.role);
  const isSuperAdmin = currentUserRoles.includes("super_admin");

  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [selectedAdminIds, setSelectedAdminIds] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Email check state
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [emailAvailability, setEmailAvailability] = useState(null); // null | "available" | "taken" | "invalid"

  // Create form state
  const [createForm, setCreateForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "admin",
    permissions: { content: false, packages: false },
  });

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    role: "admin",
    permissions: { content: false, packages: false },
  });

  // Filter to only show admins and super_admins
  const admins = useMemo(
    () => users.filter((u) => {
      const roles = Array.isArray(u.role) ? u.role : [u.role];
      return roles.some(r => ["admin", "super_admin", "moderator"].includes(r));
    }),
    [users]
  );

  useEffect(() => {
    dispatch(fetchAllUsersAdmin({ page: 1, limit: 10, role: "admins" }));
    dispatch(fetchAdminStats());
  }, [dispatch]);

  const handleFetchParamsChange = useCallback(
    (params) => {
      dispatch(fetchAllUsersAdmin({ ...params, role: "admins" }));
    },
    [dispatch]
  );

  // Create modal handlers
  const openCreateModal = useCallback(() => {
    setCreateForm({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "admin",
      permissions: { content: false, packages: false },
    });
    setEmailAvailability(null);
    setIsCheckingEmail(false);
    setIsCreateModalOpen(true);
  }, []);

  const closeCreateModal = useCallback(() => {
    setIsCreateModalOpen(false);
    setEmailAvailability(null);
  }, []);

  // Email availability check effect
  useEffect(() => {
    if (!isCreateModalOpen || !createForm.email) {
      setEmailAvailability(null);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(createForm.email)) {
      setEmailAvailability("invalid");
      return;
    }

    setIsCheckingEmail(true);
    const timeoutId = setTimeout(async () => {
      try {
        const isAvailable = await dispatch(checkEmailAvailability(createForm.email)).unwrap();
        setEmailAvailability(isAvailable ? "available" : "taken");
      } catch (error) {
        console.error("Failed to check email:", error);
      } finally {
        setIsCheckingEmail(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [createForm.email, isCreateModalOpen, dispatch]);

  const handleCreateAdmin = async (event) => {
    event.preventDefault();
    if (!createForm.name || !createForm.email) return;

    if (emailAvailability === "taken") {
      toast.error("Email is already registered");
      return;
    }

    if (emailAvailability === "invalid") {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!createForm.password) {
      toast.error("Password is required");
      return;
    }
    if (createForm.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (createForm.password !== createForm.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setIsSaving(true);
      const { confirmPassword, ...payload } = createForm;
      await dispatch(createAdmin(payload)).unwrap();
      toast.success("Admin created successfully");
      closeCreateModal();
      dispatch(fetchAdminStats());
    } catch (error) {
      toast.error(error || "Failed to create admin");
    } finally {
      setIsSaving(false);
    }
  };

  // Edit modal handlers
  const openEditModal = useCallback((admin) => {
    setSelectedAdmin(admin);
    const role = Array.isArray(admin.role) ? admin.role[0] : admin.role || "admin";
    const permissions = admin.permissions || { content: false, packages: false };
    setEditForm({
      name: admin?.name || "",
      email: admin?.email || "",
      role,
      permissions: {
        content: permissions.content ?? false,
        packages: permissions.packages ?? false,
      },
    });
  }, []);

  const closeEditModal = useCallback(() => {
    setSelectedAdmin(null);
  }, []);

  const handleSaveEdit = async (event) => {
    event.preventDefault();
    if (!selectedAdmin) return;

    try {
      setIsSaving(true);
      await dispatch(updateAdmin({
        id: selectedAdmin._id,
        name: editForm.name,
        email: editForm.email,
        role: editForm.role,
        permissions: editForm.permissions,
      })).unwrap();
      toast.success("Admin updated");
      closeEditModal();
      dispatch(fetchAdminStats());
    } catch (error) {
      toast.error(error || "Failed to update admin");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAdmin = async (admin) => {
    if (!window.confirm(`Are you sure you want to delete ${admin.name}?`)) return;
    try {
      await dispatch(deleteAdmin(admin._id)).unwrap();
      toast.success("Admin deleted");
      dispatch(fetchAdminStats());
    } catch (error) {
      toast.error(error || "Failed to delete admin");
    }
  };

  const handleHardDeleteAdmin = async (admin) => {
    if (!window.confirm(`PERMANENT DELETE: Are you sure you want to permanently delete ${admin.name}? This action cannot be undone.`)) return;
    try {
      await dispatch(hardDeleteAdmin(admin._id)).unwrap();
      toast.success("Admin permanently deleted");
      dispatch(fetchAdminStats());
    } catch (error) {
      toast.error(error || "Failed to permanently delete admin");
    }
  };

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
      const manageableRows = selectedRows.filter((a) => a._id !== currentUser?._id && canManageUser(currentUserRoles, a.role));
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
        onClick: (admin) => {
          if (admin._id === currentUser?._id) {
            navigate("/settings");
          } else {
            openEditModal(admin);
          }
        },
      },
      {
        key: "access-activate",
        label: "Activate",
        icon: <UserCheck className="h-4 w-4 text-emerald-500" />,
        hidden: (admin) => admin._id === currentUser?._id || !admin?.isDeactivated || !canManageUser(currentUserRoles, admin.role),
        onClick: (admin) => handleAccessAction(admin, "activate"),
      },
      {
        key: "access-suspend",
        label: "Suspend",
        icon: <ShieldX className="h-4 w-4 text-amber-500" />,
        hidden: (admin) => admin._id === currentUser?._id || admin?.isDeactivated || !canManageUser(currentUserRoles, admin.role),
        onClick: (admin) => handleAccessAction(admin, "suspend"),
      },
      {
        key: "access-restore",
        label: "Restore",
        icon: <Undo2 className="h-4 w-4 text-indigo-500" />,
        hidden: (admin) => admin._id === currentUser?._id || !admin?.Deleted?.isDeleted || !canManageUser(currentUserRoles, admin.role),
        onClick: (admin) => handleAccessAction(admin, "restore"),
      },
      {
        key: "access-revoke",
        label: "Soft Delete",
        icon: <Trash2 className="h-4 w-4 text-rose-500" />,
        destructive: true,
        hidden: (admin) => admin._id === currentUser?._id || admin?.Deleted?.isDeleted || !canManageUser(currentUserRoles, admin.role),
        onClick: (admin) => handleAccessAction(admin, "revoke"),
      },
      {
        key: "permanent-delete",
        label: "Permanent Delete",
        icon: <UserX className="h-4 w-4 text-red-600 font-bold" />,
        destructive: true,
        hidden: (admin) => admin._id === currentUser?._id || !canManageUser(currentUserRoles, admin.role),
        onClick: (admin) => handleHardDeleteAdmin(admin),
      },
    ],
    [currentUserRoles, openEditModal, handleAccessAction, handleHardDeleteAdmin]
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8" />
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-300">Admin Panel</p>
                <h1 className="text-3xl md:text-4xl font-black tracking-tight">Manage Admins</h1>
              </div>
            </div>
            {isSuperAdmin && (
              <Button
                onClick={openCreateModal}
                className="bg-white text-slate-900 hover:bg-slate-100"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Admin
              </Button>
            )}
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

      {/* Create Admin Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        title="Create New Admin"
        size="md"
      >
        <form onSubmit={handleCreateAdmin} className="space-y-4">
          <Input
            label="Full Name"
            value={createForm.name}
            onChange={(event) => setCreateForm((prev) => ({ ...prev, name: event.target.value }))}
            required
          />
          <Input
            label="Email"
            value={createForm.email}
            type="email"
            onChange={(event) => setCreateForm((prev) => ({ ...prev, email: event.target.value }))}
            required
            suffix={
              isCheckingEmail ? (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              ) : emailAvailability === "available" ? (
                <Check className="h-4 w-4 text-emerald-500" />
              ) : emailAvailability === "taken" ? (
                <X className="h-4 w-4 text-rose-500" />
              ) : null
            }
            error={emailAvailability === "taken" ? "Email is already taken" : null}
          />
          <Input
            label="Password"
            value={createForm.password}
            type="password"
            showPasswordToggle
            onChange={(event) => setCreateForm((prev) => ({ ...prev, password: event.target.value }))}
            required
            minLength={8}
          />
          <Input
            label="Confirm Password"
            value={createForm.confirmPassword}
            type="password"
            showPasswordToggle
            onChange={(event) => setCreateForm((prev) => ({ ...prev, confirmPassword: event.target.value }))}
            required
            error={createForm.confirmPassword && createForm.password !== createForm.confirmPassword ? "Passwords do not match" : null}
          />
          <Select
            label="Role"
            value={createForm.role}
            onChange={(event) => {
              const newRole = event.target.value;
              setCreateForm(prev => {
                const newState = { ...prev, role: newRole };
                if (newRole === "super_admin") {
                  newState.permissions = { content: true, packages: true };
                }
                return newState;
              });
            }}
            options={[
              { value: "admin", label: "Admin" },
              { value: "super_admin", label: "Super Admin" },
            ]}
          />

          {/* Permissions Section */}
          <div className="space-y-3 pt-2">
            <p className="text-sm font-semibold text-foreground">Module Permissions</p>
            <div className="space-y-2">
              <label className={`flex items-center gap-3 p-3 rounded-xl border border-border transition-colors ${createForm.role === "super_admin" ? "bg-muted/30 cursor-not-allowed opacity-75" : "hover:bg-muted/50 cursor-pointer"}`}>
                <input
                  type="checkbox"
                  checked={createForm.role === "super_admin" ? true : createForm.permissions.content}
                  disabled={createForm.role === "super_admin"}
                  onChange={(e) => setCreateForm((prev) => ({
                    ...prev,
                    permissions: { ...prev.permissions, content: e.target.checked },
                  }))}
                  className={`h-4 w-4 rounded border-gray-300 focus:ring-indigo-500 ${createForm.role === "super_admin" ? "text-indigo-400 cursor-not-allowed" : "text-indigo-600"}`}
                />
                <div className="flex items-center gap-2">
                  <FileText className={`h-4 w-4 ${createForm.role === "super_admin" ? "text-blue-400" : "text-blue-500"}`} />
                  <span className="text-sm font-medium">Content Management</span>
                </div>
              </label>
              <label className={`flex items-center gap-3 p-3 rounded-xl border border-border transition-colors ${createForm.role === "super_admin" ? "bg-muted/30 cursor-not-allowed opacity-75" : "hover:bg-muted/50 cursor-pointer"}`}>
                <input
                  type="checkbox"
                  checked={createForm.role === "super_admin" ? true : createForm.permissions.packages}
                  disabled={createForm.role === "super_admin"}
                  onChange={(e) => setCreateForm((prev) => ({
                    ...prev,
                    permissions: { ...prev.permissions, packages: e.target.checked },
                  }))}
                  className={`h-4 w-4 rounded border-gray-300 focus:ring-indigo-500 ${createForm.role === "super_admin" ? "text-indigo-400 cursor-not-allowed" : "text-indigo-600"}`}
                />
                <div className="flex items-center gap-2">
                  <Package className={`h-4 w-4 ${createForm.role === "super_admin" ? "text-violet-400" : "text-violet-500"}`} />
                  <span className="text-sm font-medium">Packages & Subscriptions</span>
                </div>
              </label>
            </div>
            <p className="text-xs text-muted-foreground">
              These permissions only apply to admins. Super admins always have full access.
            </p>
          </div>

          <div className="pt-2 flex gap-3">
            <Button type="button" variant="outline" onClick={closeCreateModal}>
              Cancel
            </Button>
            <Button type="submit" loading={isSaving} className="flex-1">
              Create Admin
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Admin Modal */}
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
          <Select
            label="Role"
            value={editForm.role}
            onChange={(event) => {
              const newRole = event.target.value;
              setEditForm(prev => {
                const newState = { ...prev, role: newRole };
                if (newRole === "super_admin") {
                  newState.permissions = { content: true, packages: true };
                }
                return newState;
              });
            }}
            options={[
              { value: "admin", label: "Admin" },
              { value: "super_admin", label: "Super Admin" },
            ]}
          />

          {/* Permissions Section */}
          <div className="space-y-3 pt-2">
            <p className="text-sm font-semibold text-foreground">Module Permissions</p>
            <div className="space-y-2">
              <label className={`flex items-center gap-3 p-3 rounded-xl border border-border transition-colors ${editForm.role === "super_admin" ? "bg-muted/30 cursor-not-allowed opacity-75" : "hover:bg-muted/50 cursor-pointer"}`}>
                <input
                  type="checkbox"
                  checked={editForm.role === "super_admin" ? true : editForm.permissions.content}
                  disabled={editForm.role === "super_admin"}
                  onChange={(e) => setEditForm((prev) => ({
                    ...prev,
                    permissions: { ...prev.permissions, content: e.target.checked },
                  }))}
                  className={`h-4 w-4 rounded border-gray-300 focus:ring-indigo-500 ${editForm.role === "super_admin" ? "text-indigo-400 cursor-not-allowed" : "text-indigo-600"}`}
                />
                <div className="flex items-center gap-2">
                  <FileText className={`h-4 w-4 ${editForm.role === "super_admin" ? "text-blue-400" : "text-blue-500"}`} />
                  <span className="text-sm font-medium">Content Management</span>
                </div>
              </label>
              <label className={`flex items-center gap-3 p-3 rounded-xl border border-border transition-colors ${editForm.role === "super_admin" ? "bg-muted/30 cursor-not-allowed opacity-75" : "hover:bg-muted/50 cursor-pointer"}`}>
                <input
                  type="checkbox"
                  checked={editForm.role === "super_admin" ? true : editForm.permissions.packages}
                  disabled={editForm.role === "super_admin"}
                  onChange={(e) => setEditForm((prev) => ({
                    ...prev,
                    permissions: { ...prev.permissions, packages: e.target.checked },
                  }))}
                  className={`h-4 w-4 rounded border-gray-300 focus:ring-indigo-500 ${editForm.role === "super_admin" ? "text-indigo-400 cursor-not-allowed" : "text-indigo-600"}`}
                />
                <div className="flex items-center gap-2">
                  <Package className={`h-4 w-4 ${editForm.role === "super_admin" ? "text-violet-400" : "text-violet-500"}`} />
                  <span className="text-sm font-medium">Packages & Subscriptions</span>
                </div>
              </label>
            </div>
            <p className="text-xs text-muted-foreground">
              These permissions only apply to admins. Super admins always have full access.
            </p>
          </div>

          <div className="pt-2 flex gap-3">
            <Button type="button" variant="outline" onClick={closeEditModal}>
              Cancel
            </Button>
            <Button type="submit" loading={isSaving} className="flex-1">
              Save Changes
            </Button>
            {isSuperAdmin && selectedAdmin && (
              <Button
                type="button"
                variant="danger"
                onClick={() => handleDeleteAdmin(selectedAdmin)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </form>
      </Modal>
    </PageTransition>
  );
};

export default AdminAdminsPage;
