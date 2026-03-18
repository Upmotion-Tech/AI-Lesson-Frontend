import { Navigate } from "react-router-dom";
import { useAppSelector } from "../hooks/useAppSelector.js";

const normalizeRoles = (role) => {
  if (Array.isArray(role)) return role;
  if (!role) return [];
  return [role];
};

const RequireRole = ({ roles = [], children, fallbackPath = "/" }) => {
  const { user, status } = useAppSelector((state) => state.auth);

  if (status === "loading") {
    return null; // Don't redirect while auth data is still fetching
  }

  const userRole = user?.role;
  const userRoles = normalizeRoles(userRole);
  const allowedRoles = Array.isArray(roles) ? roles : [roles];
  const hasRole = userRoles.some((role) => allowedRoles.includes(role));

  if (!hasRole) {
    return <Navigate to={fallbackPath} replace />;
  }

  return children;
};

export default RequireRole;
