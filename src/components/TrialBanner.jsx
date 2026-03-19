import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks/useAppSelector.js";
import { AlertTriangle, Clock, Zap } from "lucide-react";

const TrialBanner = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const subscription = user?.subscription;

  if (!subscription) return null;

  const { status, trialEndsAt } = subscription;

  if (status === "active") return null;

  if (status === "trial" && trialEndsAt) {
    const daysLeft = Math.ceil(
      (new Date(trialEndsAt) - new Date()) / (1000 * 60 * 60 * 24)
    );

    if (daysLeft <= 0) {
      // Trial technically expired but cron hasn't run yet
      return (
        <div className="flex items-center justify-between gap-4 rounded-xl bg-red-50 border border-red-200 px-5 py-3 mb-6">
          <div className="flex items-center gap-2 text-red-700">
            <AlertTriangle size={18} />
            <span className="text-sm font-medium">Your free trial has expired.</span>
          </div>
          <button
            onClick={() => navigate("/upgrade")}
            className="shrink-0 text-sm font-semibold bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-lg transition-colors"
          >
            Subscribe Now
          </button>
        </div>
      );
    }

    const isUrgent = daysLeft <= 5;

    return (
      <div
        className={`flex items-center justify-between gap-4 rounded-xl px-5 py-3 mb-6 border ${
          isUrgent
            ? "bg-amber-50 border-amber-200"
            : "bg-emerald-50 border-emerald-200"
        }`}
      >
        <div
          className={`flex items-center gap-2 text-sm font-medium ${
            isUrgent ? "text-amber-700" : "text-emerald-700"
          }`}
        >
          <Clock size={18} />
          <span>
            {isUrgent
              ? `Only ${daysLeft} day${daysLeft === 1 ? "" : "s"} left in your free trial.`
              : `${daysLeft} days left in your free trial.`}
          </span>
        </div>
        <button
          onClick={() => navigate("/upgrade")}
          className={`shrink-0 text-sm font-semibold px-4 py-1.5 rounded-lg transition-colors text-white ${
            isUrgent
              ? "bg-amber-500 hover:bg-amber-600"
              : "bg-emerald-600 hover:bg-emerald-700"
          }`}
        >
          Upgrade Now
        </button>
      </div>
    );
  }

  if (status === "past_due") {
    return (
      <div className="flex items-center justify-between gap-4 rounded-xl bg-amber-50 border border-amber-200 px-5 py-3 mb-6">
        <div className="flex items-center gap-2 text-amber-700">
          <AlertTriangle size={18} />
          <span className="text-sm font-medium">
            Your last payment failed. Update your payment method or retry from the billing portal.
          </span>
        </div>
        <button
          onClick={() => navigate("/upgrade")}
          className="shrink-0 text-sm font-semibold bg-amber-500 hover:bg-amber-600 text-white px-4 py-1.5 rounded-lg transition-colors"
        >
          Update Payment
        </button>
      </div>
    );
  }

  if (status === "canceled") {
    return (
      <div className="flex items-center justify-between gap-4 rounded-xl bg-red-50 border border-red-200 px-5 py-3 mb-6">
        <div className="flex items-center gap-2 text-red-700">
          <Zap size={18} />
          <span className="text-sm font-medium">
            Your access has ended. Subscribe to keep using AI features.
          </span>
        </div>
        <button
          onClick={() => navigate("/upgrade")}
          className="shrink-0 text-sm font-semibold bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-lg transition-colors"
        >
          Subscribe Now
        </button>
      </div>
    );
  }

  return null;
};

export default TrialBanner;
