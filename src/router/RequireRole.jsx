import { Navigate } from "react-router-dom";
import { useAppSelector } from "../hooks/useAppSelector.js";
import { normalizeRoles, hasRole as checkRole } from "../utils/roleHierarchy.js";

const RequireRole = ({ roles = [], children, fallbackPath = "/" }) => {
  const { user, status } = useAppSelector((state) => state.auth);

  if (status === "loading") {
    return null; // Don't redirect while auth data is still fetching
  }

  const userRole = user?.role;
  const userRoles = normalizeRoles(userRole);
  const allowedRoles = Array.isArray(roles) ? roles : [roles];
  const hasRequiredRole = checkRole(userRoles, allowedRoles);

  if (!hasRequiredRole) {
    return <Navigate to={fallbackPath} replace />;
  }

  return children;
};

export default RequireRole;
