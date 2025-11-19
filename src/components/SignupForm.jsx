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
        navigate("/login", { replace: true });
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
