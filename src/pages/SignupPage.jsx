import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks/useAppSelector.js";
import SignupForm from "../components/SignupForm.jsx";
import Card from "../components/common/Card.jsx";
import { BookOpen, Sparkles, UserPlus } from "lucide-react";

const SignupPage = () => {
  const navigate = useNavigate();
  const { user, token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (user && token) {
      navigate("/", { replace: true });
    }
  }, [user, token, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center gap-2 p-3 bg-success/10 rounded-full mb-4">
            <UserPlus className="h-6 w-6 text-success" />
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Join AI Lesson
          </h1>
          <p className="text-sm text-muted-foreground">
            Start creating amazing lesson plans today
          </p>
        </div>
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <h2 className="text-xl sm:text-2xl font-bold text-card-foreground mb-2 text-center">
            Create an Account
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-6">
            Sign up to start using AI Lesson
          </p>
          <SignupForm />
        </Card>
      </div>
    </div>
  );
};

export default SignupPage;
