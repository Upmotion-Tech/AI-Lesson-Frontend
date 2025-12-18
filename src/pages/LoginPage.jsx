import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks/useAppSelector.js";
import Card from "../components/common/Card.jsx";
import { BookOpen, Sparkles } from "lucide-react";
import LoginForm from "../components/LoginForm.jsx";

const LoginPage = () => {
  const navigate = useNavigate();
  const { user, token, otpRequired } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (otpRequired) {
      navigate("/verify-otp", { replace: true });
    } else if (user && token) {
      navigate("/", { replace: true });
    }
  }, [user, token, otpRequired, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center gap-2 p-3 bg-primary/10 rounded-full mb-4">
            <BookOpen className="h-6 w-6 text-primary" />
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            AI Lesson Planner
          </h1>
          <p className="text-sm text-muted-foreground">
            Intelligent lesson planning made simple
          </p>
        </div>
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <h2 className="text-xl sm:text-2xl font-bold text-card-foreground mb-6 text-center">
            Welcome Back
          </h2>
          <LoginForm />
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
