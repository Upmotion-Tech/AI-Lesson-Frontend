import { useEffect, useState } from "react";
import { useAppDispatch } from "../hooks/useAppDispatch.js";
import { useAppSelector } from "../hooks/useAppSelector.js";
import { fetchPlans, startCheckout, openBillingPortal } from "../store/subscriptionThunks.js";
import { toast } from "react-hot-toast";
import { CheckCircle, Zap, ArrowLeft, AlertTriangle } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

const REASON_MESSAGES = {
  TRIAL_EXPIRED: "Your free trial has expired. Subscribe to continue using AI features.",
  SUBSCRIPTION_REQUIRED:
    "Your subscription is no longer active. This may be due to a failed payment or cancellation.",
};

const UpgradePage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reason = searchParams.get("reason");
  const { user } = useAppSelector((state) => state.auth);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const subscription = user?.subscription;
  const isActive = subscription?.status === "active";

  useEffect(() => {
    dispatch(fetchPlans())
      .unwrap()
      .then(setPlans)
      .catch(() => toast.error("Failed to load plan details"))
      .finally(() => setLoading(false));
  }, [dispatch]);

  const handleCheckout = async (priceId) => {
    setCheckoutLoading(true);
    try {
      const url = await dispatch(startCheckout(priceId)).unwrap();
      window.location.href = url;
    } catch (err) {
      toast.error(err || "Could not start checkout. Please try again.");
      setCheckoutLoading(false);
    }
  };

  const handleManageBilling = async () => {
    setCheckoutLoading(true);
    try {
      const url = await dispatch(openBillingPortal()).unwrap();
      window.location.href = url;
    } catch (err) {
      toast.error(err || "Could not open billing portal.");
      setCheckoutLoading(false);
    }
  };

  const plan = plans[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        {reason && REASON_MESSAGES[reason] && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-6 text-sm">
            <AlertTriangle size={17} className="shrink-0 mt-0.5" />
            <span>{REASON_MESSAGES[reason]}</span>
          </div>
        )}

        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-100 mb-4">
            <Zap size={28} className="text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            {isActive ? "Your Subscription" : "Unlock Full Access"}
          </h1>
          <p className="text-slate-500 text-sm">
            {isActive
              ? "Manage your active subscription below."
              : "One plan. Everything included. No limits."}
          </p>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 animate-pulse">
            <div className="h-6 bg-slate-100 rounded w-1/2 mx-auto mb-4" />
            <div className="h-10 bg-slate-100 rounded w-1/3 mx-auto mb-6" />
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-4 bg-slate-100 rounded w-full" />
              ))}
            </div>
          </div>
        ) : plan ? (
          <div className="bg-white rounded-2xl shadow-sm border-2 border-emerald-500 p-8">
            <div className="text-center mb-6">
              <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-3">
                Unlimited Plan
              </span>
              <div className="flex items-end justify-center gap-1">
                <span className="text-4xl font-bold text-slate-900">${plan.price}</span>
                <span className="text-slate-400 mb-1">/month</span>
              </div>
              {!isActive && (
                <p className="text-sm text-emerald-600 font-medium mt-1">
                  Includes {plan.trialDays}-day free trial
                </p>
              )}
            </div>

            <ul className="space-y-3 mb-8">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-sm text-slate-600">
                  <CheckCircle size={17} className="text-emerald-500 mt-0.5 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            {isActive ? (
              <button
                onClick={handleManageBilling}
                disabled={checkoutLoading}
                className="w-full py-3 rounded-xl font-semibold text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors disabled:opacity-50"
              >
                {checkoutLoading ? "Opening portal..." : "Manage Billing"}
              </button>
            ) : subscription?.status === "past_due" ? (
              <>
                <button
                  onClick={handleManageBilling}
                  disabled={checkoutLoading}
                  className="w-full py-3 rounded-xl font-semibold text-sm bg-amber-500 hover:bg-amber-600 text-white transition-colors disabled:opacity-50"
                >
                  {checkoutLoading ? "Opening portal..." : "Manage Billing & Retry Payment"}
                </button>
                <p className="text-center text-xs text-slate-400 mt-3">
                  In the billing portal you can update your card or retry the payment directly if your account now has funds.
                </p>
              </>
            ) : (
              <button
                onClick={() => handleCheckout(plan.stripePriceId)}
                disabled={checkoutLoading}
                className="w-full py-3 rounded-xl font-semibold text-sm bg-emerald-600 hover:bg-emerald-700 text-white transition-colors disabled:opacity-50"
              >
                {checkoutLoading ? "Redirecting..." : "Subscribe Now"}
              </button>
            )}

            <p className="text-center text-xs text-slate-400 mt-4">
              Secured by Stripe · Cancel anytime
            </p>
          </div>
        ) : (
          <p className="text-center text-slate-500">No plan available at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default UpgradePage;
