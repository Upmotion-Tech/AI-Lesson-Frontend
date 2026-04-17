import { useAppSelector } from "../../hooks/useAppSelector.js";
import { hasRole, hasAnyRole, isAdmin, isSuperAdmin } from "../../utils/roleUtils.js";

/**
 * Component that conditionally renders children based on user's system roles
 * @param {Object} props
 * @param {string|string[]} props.requiredRoles - Role(s) required to view the content
 * @param {React.ReactNode} props.children - Content to render if user has required role
 * @param {React.ReactNode} [props.fallback] - Content to render if user doesn't have required role
 * @param {boolean} [props.requireAll] - If true, user must have all specified roles. If false, any role is sufficient
 */
export const RequireRole = ({
  requiredRoles,
  children,
  fallback = null,
  requireAll = false,
}) => {
  const { user } = useAppSelector((state) => state.auth);
  const userRoles = user?.role || [];

  const hasAccess = requireAll
    ? requiredRoles.every((role) => hasRole(userRoles, role))
    : hasAnyRole(userRoles, requiredRoles);

  return hasAccess ? children : fallback;
};

/**
 * Component that conditionally renders children based on user's educational role
 * @param {Object} props
 * @param {string|string[]} props.requiredRoles - Educational role(s) required to view the content
 * @param {React.ReactNode} props.children - Content to render if user has required role
 * @param {React.ReactNode} [props.fallback] - Content to render if user doesn't have required role
 * @param {boolean} [props.requireAll] - If true, user must have all specified roles
 */
export const RequireEducationalRole = ({
  requiredRoles,
  children,
  fallback = null,
  requireAll = false,
}) => {
  const { user } = useAppSelector((state) => state.auth);
  const educationalRole = user?.educationalRole || "teacher";

  const requiredRolesArray = Array.isArray(requiredRoles)
    ? requiredRoles
    : [requiredRoles];

  const hasAccess = requireAll
    ? requiredRolesArray.every((role) => educationalRole === role)
    : requiredRolesArray.includes(educationalRole);

  return hasAccess ? children : fallback;
};

/**
 * Component that only renders for admin users
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to render for admins
 * @param {React.ReactNode} [props.fallback] - Content to render for non-admins
 */
export const AdminOnly = ({ children, fallback = null }) => {
  const { user } = useAppSelector((state) => state.auth);
  const userRoles = user?.role || [];

  return isAdmin(userRoles) ? children : fallback;
};

/**
 * Component that only renders for super admin users
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to render for super admins
 * @param {React.ReactNode} [props.fallback] - Content to render for non-super-admins
 */
export const SuperAdminOnly = ({ children, fallback = null }) => {
  const { user } = useAppSelector((state) => state.auth);
  const userRoles = user?.role || [];

  return isSuperAdmin(userRoles) ? children : fallback;
};

/**
 * Component that renders children only if user has an active subscription
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to render for subscribed users
 * @param {React.ReactNode} [props.fallback] - Content to render for non-subscribed users
 * @param {boolean} [props.includeTrial] - Whether to include trial users as subscribed (default: true)
 */
export const RequireSubscription = ({ children, fallback = null, includeTrial = true }) => {
  const { user } = useAppSelector((state) => state.auth);
  const subscription = user?.subscription;

  const hasActiveSubscription =
    subscription?.status === "active" ||
    (includeTrial && subscription?.status === "trial");

  return hasActiveSubscription ? children : fallback;
};

export default RequireRole;
