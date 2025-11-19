import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const RequireAuth = ({ children }) => {
  const { user, token } = useSelector((state) => state.auth);
  const tokenFromStorage = localStorage.getItem("token");
  const hasAuth = (user && token) || tokenFromStorage;

  if (!hasAuth) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RequireAuth;

