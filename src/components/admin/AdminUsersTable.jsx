import { Edit, ShieldCheck, ShieldX, Trash2, Undo2 } from "lucide-react";
import Button from "../common/Button.jsx";

const roleToLabel = (role) => (Array.isArray(role) ? role.join(", ") : role || "teacher");

const AdminUsersTable = ({
  users = [],
  onEdit,
  onRoleChange,
  onAccessAction,
  loading = false,
}) => {
  if (loading) {
    return <div className="text-sm text-slate-500 font-medium">Loading users...</div>;
  }

  if (!users.length) {
    return <div className="text-sm text-slate-500 font-medium">No users found.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-widest text-slate-500 border-b border-slate-100">
            <th className="py-3 pr-4">User</th>
            <th className="py-3 pr-4">Role</th>
            <th className="py-3 pr-4">Subscription</th>
            <th className="py-3 pr-4">Status</th>
            <th className="py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="border-b border-slate-50">
              <td className="py-4 pr-4">
                <p className="font-semibold text-slate-900">{user.name}</p>
                <p className="text-xs text-slate-500">{user.email}</p>
              </td>
              <td className="py-4 pr-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-700">
                    {roleToLabel(user.role)}
                  </span>
                  <select
                    className="text-xs border border-slate-200 rounded-md px-2 py-1"
                    value={Array.isArray(user.role) ? user.role[0] : user.role || "teacher"}
                    onChange={(event) => onRoleChange(user, event.target.value)}
                  >
                    <option value="teacher">Teacher</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </td>
              <td className="py-4 pr-4">
                <p className="text-xs font-semibold text-slate-700">
                  {user.subscription?.status || "free"}
                </p>
                <p className="text-xs text-slate-500">{user.subscription?.planName || "free"}</p>
              </td>
              <td className="py-4 pr-4">
                {user.Deleted?.isDeleted ? (
                  <span className="text-xs font-bold text-rose-600">Revoked</span>
                ) : user.isDeactivated ? (
                  <span className="text-xs font-bold text-amber-600">Suspended</span>
                ) : (
                  <span className="text-xs font-bold text-emerald-600">Active</span>
                )}
              </td>
              <td className="py-4">
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="xs"
                    variant="outline"
                    icon={<Edit className="h-3 w-3" />}
                    onClick={() => onEdit(user)}
                  >
                    Edit
                  </Button>
                  {user.isDeactivated ? (
                    <Button
                      size="xs"
                      variant="secondary"
                      icon={<ShieldCheck className="h-3 w-3" />}
                      onClick={() => onAccessAction(user, "activate")}
                    >
                      Activate
                    </Button>
                  ) : (
                    <Button
                      size="xs"
                      variant="secondary"
                      icon={<ShieldX className="h-3 w-3" />}
                      onClick={() => onAccessAction(user, "suspend")}
                    >
                      Suspend
                    </Button>
                  )}
                  {user.Deleted?.isDeleted ? (
                    <Button
                      size="xs"
                      variant="outline"
                      icon={<Undo2 className="h-3 w-3" />}
                      onClick={() => onAccessAction(user, "restore")}
                    >
                      Restore
                    </Button>
                  ) : (
                    <Button
                      size="xs"
                      variant="danger"
                      icon={<Trash2 className="h-3 w-3" />}
                      onClick={() => onAccessAction(user, "revoke")}
                    >
                      Revoke
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsersTable;
