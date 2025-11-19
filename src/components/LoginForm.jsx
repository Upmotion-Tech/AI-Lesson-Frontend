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
  const { status } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: "",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await loginSchema.validate(formData, { abortEarly: false });
      setValidationErrors({});

      const { email, password, rememberMe } = formData;
      const result = await dispatch(login({ email, password, rememberMe }));
      if (login.fulfilled.match(result)) {
        toast.success("Verification code sent to your email");
        navigate("/otp", {
          replace: true,
          state: {
            email: formData.email,
            fromLogin: true,
          },
        });
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
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleChange}
            className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
          />
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
