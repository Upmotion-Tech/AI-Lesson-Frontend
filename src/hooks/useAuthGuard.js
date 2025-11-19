import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "./useAppSelector.js";

export const useAuthGuard = () => {
  const navigate = useNavigate();
  const { user, token } = useAppSelector((state) => state.auth);
  const tokenFromStorage = localStorage.getItem("token");
  const isAuthenticated = (user && token) || tokenFromStorage;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return isAuthenticated;
};


