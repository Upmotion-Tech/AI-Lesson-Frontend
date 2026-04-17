// Educational role display name mapping
export const EDUCATIONAL_ROLE_DISPLAY_NAMES = {
  teacher: "Teacher",
  special_education_teacher: "Special Education Teacher",
  teacher_assistant: "Teacher Assistant",
  interventionist: "Interventionist",
  instructional_coach: "Instructional Coach",
  administrator: "Administrator",
};

// System role display name mapping
export const SYSTEM_ROLE_DISPLAY_NAMES = {
  teacher: "Teacher",
  admin: "Admin",
  super_admin: "Super Admin",
};

/**
 * Format educational role value to display name
 * @param {string} role - The role value
 * @returns {string} - The formatted display name
 */
export const formatRoleLabel = (role) => {
  if (!role) return "Teacher";
  return EDUCATIONAL_ROLE_DISPLAY_NAMES[role] || role;
};

/**
 * Format system role value to display name
 * @param {string} role - The role value
 * @returns {string} - The formatted display name
 */
export const formatSystemRoleLabel = (role) => {
  if (!role) return "Teacher";
  return SYSTEM_ROLE_DISPLAY_NAMES[role] || role;
};

/**
 * Check if user has a specific system role
 * @param {string[]|string} userRoles - User's roles
 * @param {string} roleToCheck - Role to check for
 * @returns {boolean}
 */
export const hasRole = (userRoles, roleToCheck) => {
  if (!userRoles) return false;
  const roles = Array.isArray(userRoles) ? userRoles : [userRoles];
  return roles.includes(roleToCheck);
};

/**
 * Check if user has any of the specified roles
 * @param {string[]|string} userRoles - User's roles
 * @param {string[]} rolesToCheck - Roles to check for
 * @returns {boolean}
 */
export const hasAnyRole = (userRoles, rolesToCheck) => {
  if (!userRoles || !rolesToCheck?.length) return false;
  const roles = Array.isArray(userRoles) ? userRoles : [userRoles];
  return rolesToCheck.some((role) => roles.includes(role));
};

/**
 * Check if user is an admin or super admin
 * @param {string[]|string} userRoles - User's roles
 * @returns {boolean}
 */
export const isAdmin = (userRoles) => {
  return hasAnyRole(userRoles, ["admin", "super_admin"]);
};

/**
 * Check if user is a super admin
 * @param {string[]|string} userRoles - User's roles
 * @returns {boolean}
 */
export const isSuperAdmin = (userRoles) => {
  return hasRole(userRoles, "super_admin");
};

/**
 * Get all available educational roles
 * @returns {Array<{value: string, label: string}>}
 */
export const getAvailableEducationalRoles = () => {
  return Object.entries(EDUCATIONAL_ROLE_DISPLAY_NAMES).map(([value, label]) => ({
    value,
    label,
  }));
};
