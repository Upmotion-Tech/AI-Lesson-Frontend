import { NavLink } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";
import {
  Shield,
  Users,
  CreditCard,
  ShieldAlert,
  LayoutDashboard,
  FileText,
  Package,
  Crown,
  User,
  Settings,
} from "lucide-react";
import AiLessonLogo from "../../assets/Ai-lesson-logo.png";
import { useAppSelector } from "../../hooks/useAppSelector.js";
import { usePermissions } from "../../hooks/usePermissions.js";
import { getRoleLabel } from "../../utils/roleHierarchy.js";

const AdminSidebar = ({ isMobileOpen = false, onClose = () => {} }) => {
  const { userRoles, isSuperAdmin } = usePermissions();
  const { user } = useAppSelector((state) => state.auth);

  // Get user permissions (default to false if not set)
  const permissions = user?.permissions || { content: false, packages: false };

  // Build nav items based on role and permissions
  const navItems = [
    { path: "/admin", label: "Overview", icon: LayoutDashboard, color: "text-indigo-600" },
    { path: "/admin/users", label: "Users", icon: Users, color: "text-emerald-600" },
    { path: "/profile", label: "Profile", icon: User, color: "text-blue-600" },
    { path: "/settings", label: "Settings", icon: Settings, color: "text-slate-600" },
  ];
  
  if (isSuperAdmin) {
    navItems.splice(2, 0, { path: "/admin/admins", label: "Admins", icon: Crown, color: "text-purple-600" });
  }

  // Show Subscriptions and Packages only if user has packages permission or is super_admin
  if (isSuperAdmin || permissions.packages) {
    navItems.push(
      {
        path: "/admin/subscriptions",
        label: "Subscriptions",
        icon: CreditCard,
        color: "text-amber-600",
      },
      {
        path: "/admin/packages",
        label: "Packages",
        icon: Package,
        color: "text-violet-600",
      }
    );
  }

  // Show Content only if user has content permission or is super_admin
  if (isSuperAdmin || permissions.content) {
    navItems.push({
      path: "/admin/content",
      label: "Content",
      icon: FileText,
      color: "text-blue-500",
    });
  }

  return (
    <>
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-[280px] bg-white border-r border-slate-100 flex flex-col shadow-2xl shadow-indigo-500/5 transition-transform duration-300 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="h-24 flex items-center px-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <img
                src={AiLessonLogo}
                alt="Logo"
                className="h-7 w-7 invert brightness-0"
              />
            </div>
            <div>
              <span className="text-sm font-black text-slate-900 tracking-tight leading-none block">
                Lesson Orbit
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">
                Admin Portal
              </span>
              <span className={`text-[10px] font-semibold uppercase tracking-widest ${isSuperAdmin ? "text-red-600" : "text-slate-500"}`}>
                {getRoleLabel(userRoles)}
              </span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin"}
              onClick={onClose}
              className={({ isActive }) =>
                `group flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 ${
                  isActive
                    ? "bg-slate-900 text-white shadow-xl shadow-slate-900/10"
                    : "text-slate-500 hover:bg-slate-50"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={`h-5 w-5 ${isActive ? "text-white" : item.color}`}
                  />
                  <span
                    className={`text-xs font-black uppercase tracking-widest ${
                      isActive ? "text-white" : "text-slate-500"
                    }`}
                  >
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {isSuperAdmin && (
            <div className="p-4 rounded-2xl bg-red-600 text-white mb-3">
              <div className="flex items-center gap-2 mb-2">
                <ShieldAlert className="h-4 w-4" />
                <p className="text-[10px] font-black uppercase tracking-widest text-red-200">
                  Super Admin
                </p>
              </div>
              <p className="text-xs font-semibold leading-relaxed">
                Highest privilege. Full system control.
              </p>
            </div>
          )}
          <div className={`p-4 rounded-2xl ${isSuperAdmin ? "bg-slate-100" : "bg-indigo-600 text-white"}`}>
            <div className="flex items-center gap-2 mb-2">
              <Shield className={`h-4 w-4 ${isSuperAdmin ? "text-slate-600" : ""}`} />
              <p className={`text-[10px] font-black uppercase tracking-widest ${isSuperAdmin ? "text-slate-500" : "text-indigo-200"}`}>
                Security
              </p>
            </div>
            <p className={`text-xs font-semibold leading-relaxed ${isSuperAdmin ? "text-slate-700" : ""}`}>
              Admin controls are server-validated with role checks.
            </p>
          </div>
      </aside>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-md z-40"
            onClick={onClose}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminSidebar;
