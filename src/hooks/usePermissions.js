/**
 * usePermissions Hook
 * Provides permission checking utilities based on role hierarchy
 */
import { useAppSelector } from "./useAppSelector.js";
import {
  hasRole,
  isAdmin,
  isSuperAdmin,
  canManageUser,
  canManageRole,
  getAssignableRoles,
  normalizeRoles,
} from "../utils/roleHierarchy.js";

export const usePermissions = () => {
  const { user } = useAppSelector((state) => state.auth);
  const userRoles = normalizeRoles(user?.role);

  return {
    // User info
    userRoles,
    isAdmin: isAdmin(userRoles),
    isSuperAdmin: isSuperAdmin(userRoles),
    
    // Permission checks
    hasRole: (requiredRoles) => hasRole(userRoles, requiredRoles),
    canManageUser: (targetUserRoles) => canManageUser(userRoles, targetUserRoles),
    canManageRole: (targetRole) => canManageRole(userRoles, targetRole),
    
    // Available actions
    getAssignableRoles: () => getAssignableRoles(userRoles),
  };
};
