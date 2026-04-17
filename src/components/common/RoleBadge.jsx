import { GraduationCap, Shield, Crown, Briefcase } from "lucide-react";
import { formatRoleLabel, formatSystemRoleLabel } from "../../utils/roleUtils.js";

/**
 * Badge component for displaying educational roles
 * @param {Object} props
 * @param {string} props.role - The educational role value
 * @param {string} [props.size] - Size variant: 'sm', 'md', 'lg'
 * @param {boolean} [props.showIcon] - Whether to show the icon
 */
export const EducationalRoleBadge = ({ role, size = "md", showIcon = true }) => {
  const sizeClasses = {
    sm: "text-[10px] px-2 py-0.5",
    md: "text-xs px-2.5 py-1",
    lg: "text-sm px-3 py-1.5",
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-3.5 w-3.5",
    lg: "h-4 w-4",
  };

  const label = formatRoleLabel(role);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium bg-indigo-100 text-indigo-700 ${sizeClasses[size]}`}
    >
      {showIcon && <GraduationCap className={iconSizes[size]} />}
      {label}
    </span>
  );
};

/**
 * Badge component for displaying system roles
 * @param {Object} props
 * @param {string|string[]} props.role - The system role value(s)
 * @param {string} [props.size] - Size variant: 'sm', 'md', 'lg'
 * @param {boolean} [props.showIcon] - Whether to show the icon
 */
export const SystemRoleBadge = ({ role, size = "md", showIcon = true }) => {
  const sizeClasses = {
    sm: "text-[10px] px-2 py-0.5",
    md: "text-xs px-2.5 py-1",
    lg: "text-sm px-3 py-1.5",
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-3.5 w-3.5",
    lg: "h-4 w-4",
  };

  const roles = Array.isArray(role) ? role : [role];
  const isSuperAdmin = roles.includes("super_admin");
  const isAdmin = roles.includes("admin") && !isSuperAdmin;

  const variantClasses = isSuperAdmin
    ? "bg-red-100 text-red-700"
    : isAdmin
    ? "bg-purple-100 text-purple-700"
    : "bg-slate-100 text-slate-700";

  const Icon = isSuperAdmin ? Crown : isAdmin ? Shield : Briefcase;
  const label = isSuperAdmin
    ? "Super Admin"
    : isAdmin
    ? "Admin"
    : formatSystemRoleLabel(role);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${variantClasses} ${sizeClasses[size]}`}
    >
      {showIcon && <Icon className={iconSizes[size]} />}
      {label}
    </span>
  );
};

/**
 * Combined role badge that shows both system and educational roles
 * @param {Object} props
 * @param {Object} props.user - User object containing role and educationalRole
 * @param {string} [props.size] - Size variant: 'sm', 'md', 'lg'
 */
export const UserRoleBadge = ({ user, size = "md" }) => {
  if (!user) return null;

  const systemRoles = user?.role || ["teacher"];
  const educationalRole = user?.educationalRole || "teacher";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <SystemRoleBadge role={systemRoles} size={size} />
      <EducationalRoleBadge role={educationalRole} size={size} />
    </div>
  );
};

export default EducationalRoleBadge;
