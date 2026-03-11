import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch } from "../hooks/useAppDispatch.js";
import { useAppSelector } from "../hooks/useAppSelector.js";
import { signup } from "../store/authThunks.js";
import Input from "./common/Input.jsx";
import Select from "./common/Select.jsx";
import Button from "./common/Button.jsx";
import ErrorMessage from "./common/ErrorMessage.jsx";
import { signupSchema } from "../utils/validators.js";
import { toast } from "react-hot-toast";

const SignupForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });

  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
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
      await signupSchema.validate(formData, { abortEarly: false });
      setValidationErrors({});

      const result = await dispatch(
        signup({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        })
      );

      if (signup.fulfilled.match(result)) {
        toast.success("Account created successfully");
        navigate("/");
      } else {
        const message =
          result.payload || result.error?.message || "Signup failed";
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
        label="Full Name"
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Enter your full name"
        error={validationErrors.name}
        required
      />
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
        placeholder="Enter your password (min 6 characters)"
        error={validationErrors.password}
        required
        showPasswordToggle
      />
      <Input
        label="Confirm Password"
        type="password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        placeholder="Confirm your password"
        error={validationErrors.confirmPassword}
        required
        showPasswordToggle
      />

      <div className="space-y-2">
        <label className="flex items-start gap-3 text-sm text-slate-600">
          <input
            type="checkbox"
            name="termsAccepted"
            checked={formData.termsAccepted}
            onChange={handleChange}
            className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            required
          />
          <span>
            I agree to the{" "}
            <Link to="/legal/terms" className="text-emerald-700 font-semibold hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/legal/privacy" className="text-emerald-700 font-semibold hover:underline">
              Privacy Policy
            </Link>
            .
          </span>
        </label>
        {validationErrors.termsAccepted && (
          <p className="text-sm text-danger">{validationErrors.termsAccepted}</p>
        )}
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Creating account..." : "Sign Up"}
      </Button>
      <div className="text-center text-sm text-muted-foreground mt-4">
        Already have an account?{" "}
        <Link to="/login" className="text-primary hover:opacity-80 font-medium">
          Login here
        </Link>
      </div>
    </form>
  );
};

export default SignupForm;
