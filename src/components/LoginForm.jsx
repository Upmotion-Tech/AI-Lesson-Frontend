import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch } from "../hooks/useAppDispatch.js";
import { useAppSelector } from "../hooks/useAppSelector.js";
import { login } from "../store/authThunks.js";
import Input from "./common/Input.jsx";
import Button from "./common/Button.jsx";
import ErrorMessage from "./common/ErrorMessage.jsx";
import { loginSchema } from "../utils/validators.js";
import { toast } from "react-hot-toast";

const LoginForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status, otpRequired } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (validationErrors[e.target.name]) {
      setValidationErrors({
        ...validationErrors,
        [e.target.name]: "",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await loginSchema.validate(formData, { abortEarly: false });
      setValidationErrors({});

      const result = await dispatch(login(formData));
      if (login.fulfilled.match(result)) {
        if (result.payload.otpRequired) {
          // Redirect to OTP verification page
          navigate("/verify-otp", { 
            state: { email: formData.email },
            replace: true 
          });
        } else {
          toast.success("Logged in successfully");
          navigate("/");
        }
      } else {
        const message =
          result.payload || result.error?.message || "Login failed";
        toast.error(message);
      }
    } catch (err) {
      if (err.inner) {
        const errors = {};
        err.inner.forEach((error) => {
          errors[error.path] = error.message;
        });
        setValidationErrors(errors);
      }
    }
  };

  const isLoading = status === "loading";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Enter your email"
        error={validationErrors.email}
        required
      />
      <Input
        label="Password"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Enter your password"
        error={validationErrors.password}
        required
        showPasswordToggle
      />

      <div className="flex items-center">
        <input
          type="checkbox"
          id="rememberMe"
          name="rememberMe"
          checked={formData.rememberMe}
          onChange={(e) =>
            setFormData({ ...formData, rememberMe: e.target.checked })
          }
          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
        />
        <label
          htmlFor="rememberMe"
          className="ml-2 block text-sm text-muted-foreground"
        >
          Remember me
        </label>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Logging in..." : "Login"}
      </Button>
      <div className="text-center text-sm text-muted-foreground mt-4">
        Don't have an account?{" "}
        <Link
          to="/signup"
          className="text-primary hover:opacity-80 font-medium"
        >
          Sign up here
        </Link>
      </div>
    </form>
  );
};

export default LoginForm;
