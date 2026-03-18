import { Users, CreditCard, ShieldAlert, Archive } from "lucide-react";
import Card from "../common/Card.jsx";

const statConfig = [
  {
    key: "totalUsers",
    label: "Total Users",
    icon: Users,
    color: "text-indigo-600",
  },
  {
    key: "activeSubscriptions",
    label: "Active Subs",
    icon: CreditCard,
    color: "text-emerald-600",
  },
  {
    key: "suspendedUsers",
    label: "Suspended",
    icon: ShieldAlert,
    color: "text-amber-600",
  },
  {
    key: "deletedUsers",
    label: "Revoked",
    icon: Archive,
    color: "text-rose-600",
  },
  {
    key: "totalTeachers",
    label: "Total Teachers",
    icon: Users,
    color: "text-blue-600",
  },
  {
    key: "totalAdmins",
    label: "Total Admins",
    icon: ShieldAlert,
    color: "text-purple-600",
  },
];

const AdminStatsCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {statConfig.map((item) => (
        <Card key={item.key}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                {item.label}
              </p>
              <p className="text-3xl font-black text-slate-900 mt-2">
                {stats?.[item.key] ?? 0}
              </p>
            </div>
            <item.icon className={`h-6 w-6 ${item.color}`} />
          </div>
        </Card>
      ))}
    </div>
  );
};

export default AdminStatsCards;
