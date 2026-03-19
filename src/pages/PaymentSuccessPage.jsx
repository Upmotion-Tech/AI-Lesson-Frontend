import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, Loader } from "lucide-react";
import apiClient from "../utils/apiClient.js";

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [status, setStatus] = useState("verifying"); // verifying | valid | invalid

  useEffect(() => {
    if (!sessionId) {
      navigate("/", { replace: true });
      return;
    }

    apiClient
      .get(`/packages/verify/${sessionId}`)
      .then((res) => {
        if (res.data.valid) {
          setStatus("valid");
        } else {
          navigate("/", { replace: true });
        }
      })
      .catch(() => navigate("/", { replace: true }));
  }, [sessionId, navigate]);

  if (status === "verifying") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size={28} className="animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-emerald-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-10 max-w-md w-full text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-5">
          <CheckCircle size={36} className="text-emerald-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">You're all set!</h1>
        <p className="text-slate-500 text-sm mb-8">
          Your subscription is now active. You have full access to all AI features.
        </p>
        <button
          onClick={() => navigate("/")}
          className="w-full py-3 rounded-xl font-semibold text-sm bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
