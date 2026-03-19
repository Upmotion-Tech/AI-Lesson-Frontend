import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { CreditCard } from "lucide-react";
import { useAppDispatch } from "../../hooks/useAppDispatch.js";
import { useAppSelector } from "../../hooks/useAppSelector.js";
import Card from "../../components/common/Card.jsx";
import Button from "../../components/common/Button.jsx";
import Badge from "../../components/common/Badge.jsx";
import DataTable from "../../components/common/DataTable.jsx";
import PageTransition from "../../components/common/PageTransition.jsx";
import { fetchAdminStats, fetchAllUsersAdmin, updateUserByAdmin } from "../../store/adminThunks.js";
import apiClient from "../../utils/apiClient.js";

const AdminSubscriptionsPage = () => {
  const dispatch = useAppDispatch();
  const { users } = useAppSelector((state) => state.admin);
  const [editing, setEditing] = useState({});
  const [activePlanName, setActivePlanName] = useState(null);

  useEffect(() => {
    dispatch(fetchAllUsersAdmin());
    apiClient.get("/packages/admin/all").then((res) => {
      const first = res.data.plans.find((p) => p.isActive);
      if (first) setActivePlanName(first.name);
    }).catch(() => {});
  }, [dispatch]);

  const setField = useCallback((userId, key, value) => {
    setEditing((prev) => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [key]: value,
      },
    }));
  }, []);

  const saveSubscription = useCallback(
    async (user) => {
      const patch = editing[user._id];
      if (!patch) return;

      try {
        await dispatch(
          updateUserByAdmin({
            userId: user._id,
            subscription: {
              status: patch.status ?? user.subscription?.status ?? "trial",
              planName: patch.status === "active" ? activePlanName : null,
            },
          })
        ).unwrap();
        toast.success("Subscription updated");
        dispatch(fetchAdminStats());
      } catch (error) {
        toast.error(error || "Failed to update subscription");
      }
    },
    [dispatch, editing]
  );

  const statusOptions = useMemo(
    () => ["trial", "active", "canceled"],
    []
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
        header: "Status",
        searchKey: [(u) => u?.subscription?.status],
        render: (user) => {
          const value = editing[user._id]?.status ?? user.subscription?.status ?? "trial";
          return (
            <div className="flex items-center gap-3">
              <select
                className="text-sm font-semibold rounded-lg border border-border bg-card px-3 py-2"
                value={value}
                onChange={(event) => setField(user._id, "status", event.target.value)}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <Badge variant={value === "active" ? "success" : "default"}>{value}</Badge>
            </div>
          );
        },
      },
      {
        key: "save",
        header: "Save",
        render: (user) => {
          const isDirty = Boolean(editing[user._id]);
          return (
            <Button
              size="sm"
              disabled={!isDirty}
              onClick={() => saveSubscription(user)}
            >
              Save
            </Button>
          );
        },
      },
    ],
    [editing, saveSubscription, setField, statusOptions]
  );

  return (
    <PageTransition>
      <div className="space-y-8 pb-16">
        <div className="rounded-3xl bg-linear-to-br from-slate-900 to-indigo-900 text-white p-8 shadow-xl">
          <div className="flex items-center gap-3">
            <CreditCard className="h-8 w-8" />
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-300">
                Admin
              </p>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                Subscriptions
              </h1>
            </div>
          </div>
        </div>

        <Card>
          <DataTable
            title="Subscription Monitoring"
            description="Edit subscription status/plan and save changes."
            data={users}
            columns={columns}
            searchPlaceholder="Search by name, email, status, plan"
            initialPageSize={10}
          />
        </Card>
      </div>
    </PageTransition>
  );
};

export default AdminSubscriptionsPage;
