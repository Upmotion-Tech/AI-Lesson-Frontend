import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { KeyRound } from "lucide-react";
import apiClient from "../utils/apiClient.js";
import Input from "../components/common/Input.jsx";
import Button from "../components/common/Button.jsx";

const ResetPasswordPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(location.state?.email || "");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email.trim() || !otpCode.trim() || !newPassword || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    try {
      setIsSubmitting(true);
      await apiClient.post("/auth/reset-password-otp", {
        email: email.trim(),
        otpCode: otpCode.trim(),
        newPassword,
      });
      toast.success("Password reset successfully");
      navigate("/login");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to reset password");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[rgb(var(--color-background))] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-100 shadow-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="h-14 w-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto">
            <KeyRound className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Reset Password</h1>
          <p className="text-sm text-slate-500 font-medium">
            Enter your OTP and choose a new password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
          />
          <Input
            label="OTP Code"
            value={otpCode}
            onChange={(event) => setOtpCode(event.target.value)}
            placeholder="Enter OTP from email"
            required
          />
          <Input
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            showPasswordToggle
            required
          />
          <Input
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            showPasswordToggle
            required
          />
          <Button type="submit" className="w-full" loading={isSubmitting}>
            Reset Password
          </Button>
        </form>

        <p className="text-center text-sm text-slate-500">
          Back to{" "}
          <Link to="/login" className="text-indigo-600 font-semibold hover:opacity-80">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
