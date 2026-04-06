/**
 * Role Hierarchy Utilities
 * Provides helpers for role-based access control with hierarchy support
 */

// Role privilege levels: higher number = more privileges
export const roleHierarchy = {
  teacher: 0,
  admin: 1,
  super_admin: 2,
};

// Valid roles in the system
export const VALID_ROLES = ["teacher", "admin", "super_admin"];

// Get the highest privilege level for a user with multiple roles
export const getHighestPrivilegeLevel = (userRoles) => {
  if (!userRoles) return -1;
  const roles = Array.isArray(userRoles) ? userRoles : [userRoles];
  return Math.max(...roles.map(role => roleHierarchy[role] ?? -1), -1);
};

// Check if user has required role(s)
export const hasRole = (userRoles, requiredRoles) => {
  const roles = Array.isArray(userRoles) ? userRoles : userRoles ? [userRoles] : [];
  const required = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
  return roles.some((role) => required.includes(role));
};

// Check if user is admin or super_admin
export const isAdmin = (userRoles) => {
  return hasRole(userRoles, ["admin", "super_admin"]);
};

// Check if user is super_admin
export const isSuperAdmin = (userRoles) => {
  return hasRole(userRoles, ["super_admin"]);
};

// Check if user can manage another user (hierarchy-based)
export const canManageUser = (userRoles, targetUserRoles) => {
  const userLevel = getHighestPrivilegeLevel(userRoles);
  const targetLevel = getHighestPrivilegeLevel(targetUserRoles);
  
  if (userLevel === 2) return true; // Super admin can manage anyone
  return userLevel > targetLevel; // Must have strictly higher privilege
};

// Check if user can manage a specific role
export const canManageRole = (userRoles, targetRole) => {
  const userLevel = getHighestPrivilegeLevel(userRoles);
  const targetLevel = roleHierarchy[targetRole] ?? -1;
  return userLevel > targetLevel; // Must have strictly higher privilege
};

// Get available roles that a user can assign (based on their own role)
export const getAssignableRoles = (userRoles) => {
  const userLevel = getHighestPrivilegeLevel(userRoles);
  
  if (userLevel < 0) return []; // No role
  
  const assignable = VALID_ROLES.filter(role => {
    const roleLevel = roleHierarchy[role] ?? -1;
    return roleLevel < userLevel; // Can only assign lower roles
  });
  
  return assignable;
};

// Get role display label
export const getRoleLabel = (role) => {
  const labels = {
    teacher: "Teacher",
    admin: "Admin",
    super_admin: "Super Admin",
  };
  
  if (Array.isArray(role)) {
    return role.map(r => labels[r] || r).join(", ");
  }
  
  return labels[role] || role;
};

// Normalize role to array format
export const normalizeRoles = (role) => {
  if (Array.isArray(role)) return role;
  if (!role) return [];
  return [role];
};
