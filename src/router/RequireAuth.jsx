import { useAppSelector } from "../hooks/useAppSelector.js";
import { Navigate } from "react-router-dom";

const RequireAuth = ({ children }) => {
  const { user, token, status } = useAppSelector((state) => state.auth);
  const tokenFromStorage = localStorage.getItem("token");
  const hasAuth = (user && token) || tokenFromStorage;

  if (status === "loading") {
    return null; // Don't redirect while loading
  }

  if (!hasAuth) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RequireAuth;


