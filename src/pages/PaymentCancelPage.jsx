import { useNavigate } from "react-router-dom";
import { XCircle } from "lucide-react";

const PaymentCancelPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-10 max-w-md w-full text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-5">
          <XCircle size={36} className="text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Payment cancelled</h1>
        <p className="text-slate-500 text-sm mb-8">
          No charge was made. You can subscribe anytime when you're ready.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/upgrade")}
            className="w-full py-3 rounded-xl font-semibold text-sm bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full py-3 rounded-xl font-semibold text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelPage;
