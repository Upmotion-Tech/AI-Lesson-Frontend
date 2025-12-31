import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch } from "../hooks/useAppDispatch.js";
import { setCredentials } from "../store/authSlice.js";
import { fetchMe } from "../store/authThunks.js";
import { toast } from "react-hot-toast";

const LoginSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (error) {
      toast.error(decodeURIComponent(error));
      navigate("/login", { replace: true });
      return;
    }

    if (token) {
      // Store token in localStorage
      localStorage.setItem("token", token);
      
      // Set credentials in Redux
      dispatch(setCredentials({ token, user: null }));
      
      // Fetch user data
      dispatch(fetchMe())
        .then((result) => {
          if (fetchMe.fulfilled.match(result)) {
            toast.success("Login successful");
            navigate("/", { replace: true });
          } else {
            toast.error("Failed to fetch user data");
            navigate("/login", { replace: true });
          }
        })
        .catch(() => {
          toast.error("An error occurred");
          navigate("/login", { replace: true });
        });
    } else {
      toast.error("No token received");
      navigate("/login", { replace: true });
    }
  }, [searchParams, navigate, dispatch]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Completing login...</p>
      </div>
    </div>
  );
};

export default LoginSuccessPage;

