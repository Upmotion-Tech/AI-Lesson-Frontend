import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Mail } from "lucide-react";
import apiClient from "../utils/apiClient.js";
import Input from "../components/common/Input.jsx";
import Button from "../components/common/Button.jsx";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setIsSubmitting(true);
      await apiClient.post("/auth/forgot-password-otp", {
        email: email.trim(),
      });
      toast.success("OTP sent to your email");
      navigate("/reset-password", { state: { email: email.trim() } });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[rgb(var(--color-background))] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-100 shadow-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="h-14 w-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto">
            <Mail className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Forgot Password</h1>
          <p className="text-sm text-slate-500 font-medium">
            Enter your email and we will send a reset OTP.
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
          <Button type="submit" className="w-full" loading={isSubmitting}>
            Send OTP
          </Button>
        </form>

        <p className="text-center text-sm text-slate-500">
          Remembered your password?{" "}
          <Link to="/login" className="text-indigo-600 font-semibold hover:opacity-80">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
