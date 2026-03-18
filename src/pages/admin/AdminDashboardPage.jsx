import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { Shield } from "lucide-react";
import { useAppDispatch } from "../../hooks/useAppDispatch.js";
import { useAppSelector } from "../../hooks/useAppSelector.js";
import Card from "../../components/common/Card.jsx";
import Modal from "../../components/common/Modal.jsx";
import Input from "../../components/common/Input.jsx";
import Button from "../../components/common/Button.jsx";
import PageTransition from "../../components/common/PageTransition.jsx";
import AdminStatsCards from "../../components/admin/AdminStatsCards.jsx";
import AdminUsersTable from "../../components/admin/AdminUsersTable.jsx";
import {
  changeUserRoleAdmin,
  fetchAdminStats,
  fetchAllUsersAdmin,
  setUserAccessAdmin,
  updateUserByAdmin,
} from "../../store/adminThunks.js";

const AdminDashboardPage = () => {
  const dispatch = useAppDispatch();
  const { stats, users, usersStatus } = useAppSelector(
    (state) => state.admin
  );

  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    status: "free",
    planName: "free",
  });
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  useEffect(() => {
    dispatch(fetchAdminStats());
    dispatch(fetchAllUsersAdmin());
  }, [dispatch]);

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users;
    const term = search.toLowerCase();
    return users.filter(
      (user) =>
        user.name?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term)
    );
  }, [users, search]);

  const openEditModal = (user) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name || "",
      email: user.email || "",
      status: user.subscription?.status || "free",
      planName: user.subscription?.planName || "free",
    });
  };

  const closeEditModal = () => {
    setSelectedUser(null);
  };

  const handleRoleChange = async (user, role) => {
    try {
      await dispatch(changeUserRoleAdmin({ id: user._id, role: [role] })).unwrap();
      toast.success("Role updated");
    } catch (error) {
      toast.error(error || "Failed to update role");
    }
  };

  const handleAccessAction = async (user, action) => {
    try {
      await dispatch(setUserAccessAdmin({ id: user._id, action })).unwrap();
      toast.success("Access updated");
      dispatch(fetchAdminStats());
    } catch (error) {
      toast.error(error || "Failed to update access");
    }
  };

  const handleSaveEdit = async (event) => {
    event.preventDefault();
    if (!selectedUser) return;

    try {
      setIsSavingEdit(true);
      await dispatch(
        updateUserByAdmin({
          userId: selectedUser._id,
          name: editForm.name,
          email: editForm.email,
          subscription: {
            status: editForm.status,
            planName: editForm.planName,
          },
        })
      ).unwrap();
      toast.success("User updated");
      closeEditModal();
      dispatch(fetchAdminStats());
    } catch (error) {
      toast.error(error || "Failed to update user");
    } finally {
      setIsSavingEdit(false);
    }
  };

  return (
    <PageTransition>
      <div className="space-y-8 pb-16">
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-indigo-900 text-white p-8 shadow-xl">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8" />
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-300">
                Admin
              </p>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                Management Dashboard
              </h1>
            </div>
          </div>
        </div>

        <AdminStatsCards stats={stats} />

        <Card className="rounded-2xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h2 className="text-xl font-black text-slate-900">User Management</h2>
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name or email"
              className="md:w-80"
            />
          </div>
          <AdminUsersTable
            users={filteredUsers}
            loading={usersStatus === "loading"}
            onEdit={openEditModal}
            onRoleChange={handleRoleChange}
            onAccessAction={handleAccessAction}
          />
        </Card>
      </div>

      <Modal
        isOpen={Boolean(selectedUser)}
        onClose={closeEditModal}
        title="Edit User Account"
        size="md"
      >
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <Input
            label="Full Name"
            value={editForm.name}
            onChange={(event) =>
              setEditForm((prev) => ({ ...prev, name: event.target.value }))
            }
            required
          />
          <Input
            label="Email"
            value={editForm.email}
            type="email"
            onChange={(event) =>
              setEditForm((prev) => ({ ...prev, email: event.target.value }))
            }
            required
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Subscription Status
              </label>
              <select
                className="w-full px-3 py-2 bg-card border border-border rounded-lg"
                value={editForm.status}
                onChange={(event) =>
                  setEditForm((prev) => ({ ...prev, status: event.target.value }))
                }
              >
                <option value="free">Free</option>
                <option value="trial">Trial</option>
                <option value="active">Active</option>
                <option value="past_due">Past Due</option>
                <option value="canceled">Canceled</option>
              </select>
            </div>
            <Input
              label="Plan Name"
              value={editForm.planName}
              onChange={(event) =>
                setEditForm((prev) => ({ ...prev, planName: event.target.value }))
              }
            />
          </div>
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

export default AdminDashboardPage;
