import { useCallback, useEffect, useMemo } from "react";
import { toast } from "react-hot-toast";
import { ShieldAlert, ShieldCheck, ShieldX, Trash2, Undo2 } from "lucide-react";
import { useAppDispatch } from "../../hooks/useAppDispatch.js";
import { useAppSelector } from "../../hooks/useAppSelector.js";
import Card from "../../components/common/Card.jsx";
import Badge from "../../components/common/Badge.jsx";
import DataTable from "../../components/common/DataTable.jsx";
import PageTransition from "../../components/common/PageTransition.jsx";
import { fetchAdminStats, fetchAllUsersAdmin, setUserAccessAdmin } from "../../store/adminThunks.js";

const AdminModerationPage = () => {
  const dispatch = useAppDispatch();
  const { users } = useAppSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAllUsersAdmin());
  }, [dispatch]);

  const statusConfig = useCallback((user) => {
    if (user?.Deleted?.isDeleted) {
      return { label: "Revoked", variant: "danger" };
    }
    if (user?.isDeactivated) {
      return { label: "Suspended", variant: "warning" };
    }
    return { label: "Active", variant: "success" };
  }, []);

  const handleAction = useCallback(
    async (user, action) => {
      try {
        await dispatch(setUserAccessAdmin({ id: user._id, action })).unwrap();
        toast.success("Moderation action applied");
        dispatch(fetchAdminStats());
      } catch (error) {
        toast.error(error || "Failed to apply action");
      }
    },
    [dispatch]
  );

  const columns = useMemo(
    () => [
      {
        key: "user",
        header: "User",
        searchKey: [(u) => u?.name, (u) => u?.email],
        render: (user) => (
          <div className="min-w-56">
            <p className="font-semibold text-foreground">{user.name}</p>
            <p className="text-xs text-muted-foreground font-medium">{user.email}</p>
          </div>
        ),
      },
      {
        key: "status",
        header: "Current Status",
        searchKey: [(u) => statusConfig(u).label],
        render: (user) => {
          const status = statusConfig(user);
          return <Badge variant={status.variant}>{status.label}</Badge>;
        },
      },
    ],
    [statusConfig]
  );

  const rowActions = useMemo(
    () => [
      {
        key: "activate",
        label: "Activate",
        icon: <ShieldCheck className="h-4 w-4" />,
        hidden: (user) => !user?.isDeactivated,
        onClick: (user) => handleAction(user, "activate"),
      },
      {
        key: "suspend",
        label: "Suspend",
        icon: <ShieldX className="h-4 w-4" />,
        hidden: (user) => user?.isDeactivated,
        onClick: (user) => handleAction(user, "suspend"),
      },
      {
        key: "restore",
        label: "Restore",
        icon: <Undo2 className="h-4 w-4" />,
        hidden: (user) => !user?.Deleted?.isDeleted,
        onClick: (user) => handleAction(user, "restore"),
      },
      {
        key: "revoke",
        label: "Revoke",
        icon: <Trash2 className="h-4 w-4" />,
        destructive: true,
        hidden: (user) => Boolean(user?.Deleted?.isDeleted),
        onClick: (user) => handleAction(user, "revoke"),
      },
    ],
    [handleAction]
  );

  return (
    <PageTransition>
      <div className="space-y-8 pb-16">
        <div className="rounded-3xl bg-linear-to-br from-slate-900 to-indigo-900 text-white p-8 shadow-xl">
          <div className="flex items-center gap-3">
            <ShieldAlert className="h-8 w-8" />
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-300">
                Admin
              </p>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                Moderation
              </h1>
            </div>
          </div>
        </div>

        <Card>
          <DataTable
            title="Account Monitoring"
            description="Search and apply moderation actions."
            data={users}
            columns={columns}
            rowActions={rowActions}
            searchPlaceholder="Search by name or email"
            initialPageSize={10}
          />
        </Card>
      </div>
    </PageTransition>
  );
};

export default AdminModerationPage;
