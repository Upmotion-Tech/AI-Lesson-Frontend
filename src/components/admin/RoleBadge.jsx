/**
 * RoleBadge Component
 * Displays role with appropriate styling based on privilege level
 */
import { Crown, GraduationCap, ShieldAlert } from "lucide-react";
import { normalizeRoles } from "../../utils/roleHierarchy.js";

const RoleBadge = ({ role, size = "md" }) => {
  const userRoles = normalizeRoles(role);
  const isSuperAdmin = userRoles.includes("super_admin");
  const isAdmin = userRoles.includes("admin");
  
  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 pl-2.5 py-1.5 text-xs",
    lg: "px-4 py-2 text-sm",
  };

  const baseClasses = `gap-1.5 flex items-center rounded-full font-semibold border shadow-sm ${sizeClasses[size]}`;

  if (isSuperAdmin) {
    return (
      <div className={`${baseClasses} bg-red-50/50 text-red-700 border-red-100/50`}>
        <ShieldAlert className={size === "sm" ? "h-3 w-3" : "h-4 w-4"} />
        <span>Super Admin</span>
      </div>
    );
  }

  if (isAdmin) {
    return (
      <div className={`${baseClasses} bg-indigo-50/50 text-indigo-700 border-indigo-100/50`}>
        <Crown className={size === "sm" ? "h-3 w-3" : "h-4 w-4"} />
        <span>Admin</span>
      </div>
    );
  }

  return (
    <div className={`${baseClasses} bg-slate-50 text-slate-700 border-slate-100`}>
      <GraduationCap className={`${size === "sm" ? "h-3 w-3" : "h-4 w-4"} text-slate-400`} />
      <span>Teacher</span>
    </div>
  );
};

export default RoleBadge;
