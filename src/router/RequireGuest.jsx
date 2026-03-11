import { Navigate } from "react-router-dom";
import { useAppSelector } from "../hooks/useAppSelector.js";

const RequireGuest = ({ children }) => {
  const { user, token } = useAppSelector((state) => state.auth);
  const tokenFromStorage = localStorage.getItem("token");
  const hasAuth = (user && token) || tokenFromStorage;

  if (hasAuth) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RequireGuest;
