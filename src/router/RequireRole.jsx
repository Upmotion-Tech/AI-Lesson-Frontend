import { Navigate } from "react-router-dom";
import { useAppSelector } from "../hooks/useAppSelector.js";

const normalizeRoles = (role) => {
  if (Array.isArray(role)) return role;
  if (!role) return [];
  return [role];
};

const RequireRole = ({ roles = [], children, fallbackPath = "/" }) => {
  const userRole = useAppSelector((state) => state.auth.user?.role);
  const userRoles = normalizeRoles(userRole);
  const allowedRoles = Array.isArray(roles) ? roles : [roles];
  const hasRole = userRoles.some((role) => allowedRoles.includes(role));

  if (!hasRole) {
    return <Navigate to={fallbackPath} replace />;
  }

  return children;
};

export default RequireRole;
