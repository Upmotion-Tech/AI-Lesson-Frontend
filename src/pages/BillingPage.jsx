import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../hooks/useAppDispatch.js";
import { useAppSelector } from "../hooks/useAppSelector.js";
import { openBillingPortal } from "../store/subscriptionThunks.js";
import { toast } from "react-hot-toast";
import PageTransition from "../components/common/PageTransition.jsx";
import {
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  ExternalLink,
  Zap,
  Receipt,
  Settings,
} from "lucide-react";

const STATUS_CONFIG = {
  trial: {
    label: "Free Trial",
    icon: Clock,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
  active: {
    label: "Active",
    icon: CheckCircle,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
  past_due: {
    label: "Payment Failed",
    icon: AlertTriangle,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  canceled: {
    label: "Canceled",
    icon: XCircle,
    color: "text-red-500",
    bg: "bg-red-50",
    border: "border-red-200",
  },
};

const BillingPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [portalLoading, setPortalLoading] = useState(false);

  const subscription = user?.subscription;
  const status = subscription?.status ?? "trial";
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.trial;
  const StatusIcon = config.icon;

  const trialDaysLeft = subscription?.trialEndsAt
    ? Math.max(0, Math.ceil((new Date(subscription.trialEndsAt) - new Date()) / (1000 * 60 * 60 * 24)))
    : null;

  const handleOpenPortal = async () => {
    setPortalLoading(true);
    try {
      const url = await dispatch(openBillingPortal()).unwrap();
      window.location.href = url;
    } catch (err) {
      toast.error(err || "Could not open billing portal.");
      setPortalLoading(false);
    }
  };

  const hasBillingPortal = status === "active" || status === "past_due";

  return (
    <PageTransition>
      <div className="space-y-8 pb-16 max-w-2xl">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Billing</h1>
          <p className="text-sm text-slate-500 mt-1">
            View your subscription status and manage your billing details.
          </p>
        </div>

        {/* Subscription Status Card */}
        <div className={`rounded-2xl border ${config.border} ${config.bg} p-6`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <StatusIcon size={22} className={config.color} />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-0.5">
                  Subscription Status
                </p>
                <p className={`text-lg font-bold ${config.color}`}>{config.label}</p>
              </div>
            </div>

            {status === "trial" && trialDaysLeft !== null && (
              <div className="text-right">
                <p className="text-2xl font-bold text-slateald-900">{trialDaysLeft}</p>
                <p className="text-xs text-slate-400">days left</p>
              </div>
            )}

            {status === "active" && subscription?.currentPeriodEnd && (
              <div className="text-right">
                <p className="text-xs text-slate-400">Renews on</p>
                <p className="text-sm font-semibold text-slate-700">
                  {new Date(subscription.currentPeriodEnd).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            )}
          </div>

          {subscription?.planName && (
            <div className="mt-4 pt-4 border-t border-white/60">
              <p className="text-xs text-slate-400">Plan</p>
              <p className="text-sm font-bold text-slate-700 capitalize">{subscription.planName}</p>
            </div>
          )}
        </div>

        {/* Alert for past_due */}
        {status === "past_due" && (
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4">
            <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800">Payment required</p>
              <p className="text-xs text-amber-600 mt-0.5">
                Your last payment failed. Open the billing portal to update your payment method or retry the payment — access will be restored automatically once the payment clears.
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Subscribe / Upgrade */}
          {(status === "trial" || status === "canceled") && (
            <button
              onClick={() => navigate("/upgrade")}
              className="flex items-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl px-5 py-4 transition-colors text-left"
            >
              <Zap size={20} className="shrink-0" />
              <div>
                <p className="text-sm font-bold">
                  {status === "canceled" ? "Resubscribe" : "Upgrade to Pro"}
                </p>
                <p className="text-xs text-emerald-100">Unlock all AI features</p>
              </div>
            </button>
          )}

          {/* Billing Portal — invoice history, update card, cancel */}
          {hasBillingPortal && (
            <>
              <button
                onClick={handleOpenPortal}
                disabled={portalLoading}
                className="flex items-center gap-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 transition-colors text-left disabled:opacity-50"
              >
                <Receipt size={20} className="text-slate-500 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-slate-800">Invoice History</p>
                  <p className="text-xs text-slate-400">View & download past invoices</p>
                </div>
                <ExternalLink size={14} className="text-slate-300 ml-auto shrink-0" />
              </button>

              <button
                onClick={handleOpenPortal}
                disabled={portalLoading}
                className="flex items-center gap-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 transition-colors text-left disabled:opacity-50"
              >
                <CreditCard size={20} className="text-slate-500 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-slate-800">
                    {status === "past_due" ? "Update Payment Method" : "Manage Payment Method"}
                  </p>
                  <p className="text-xs text-slate-400">Update card or retry payment</p>
                </div>
                <ExternalLink size={14} className="text-slate-300 ml-auto shrink-0" />
              </button>

              <button
                onClick={handleOpenPortal}
                disabled={portalLoading}
                className="flex items-center gap-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 transition-colors text-left disabled:opacity-50"
              >
                <Settings size={20} className="text-slate-500 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-slate-800">Manage Subscription</p>
                  <p className="text-xs text-slate-400">Cancel or modify your plan</p>
                </div>
                <ExternalLink size={14} className="text-slate-300 ml-auto shrink-0" />
              </button>
            </>
          )}

        </div>

        {portalLoading && (
          <p className="text-xs text-center text-slate-400">Opening billing portal...</p>
        )}

        <p className="text-xs text-slate-400">
          Billing is securely handled by Stripe. Your payment details are never stored on our servers.
        </p>

      </div>
    </PageTransition>
  );
};

export default BillingPage;
