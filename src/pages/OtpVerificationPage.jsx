import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppDispatch } from "../hooks/useAppDispatch.js";
import { useAppSelector } from "../hooks/useAppSelector.js";
import { verifyLoginOtp, resendLoginOtp } from "../store/authThunks.js";
import Button from "../components/common/Button.jsx";
import { ShieldCheck, Mail, ArrowRight, RefreshCcw, CheckCircle2 } from "lucide-react";
import { toast } from "react-hot-toast";

const OtpVerificationPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { otpToken, pendingUser, otpVerificationStatus, otpResendStatus } = useAppSelector((state) => state.auth);
  
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    if (!otpToken) {
      navigate("/login");
    }
  }, [otpToken, navigate]);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length < 6) {
      toast.error("Please enter the full 6-digit code");
      return;
    }

    try {
      await dispatch(verifyLoginOtp({ otp: otpString, otpToken })).unwrap();
      toast.success("Security verified!");
      navigate("/");
    } catch (error) {
      toast.error(error || "Invalid verification code");
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    try {
      await dispatch(resendLoginOtp({ email: pendingUser.email })).unwrap();
      setTimer(60);
      toast.success("New code sent to your email");
    } catch (error) {
      toast.error(error || "Failed to resend code");
    }
  };

  return (
    <div className="min-h-screen bg-[rgb(var(--color-background))] flex items-center justify-center p-4 relative overflow-hidden">
       {/* Background Decor */}
       <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-indigo-500/5 rounded-full blur-[150px]" />
       </div>

       <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[500px] relative z-10"
      >
        <Card className="rounded-[3rem] p-8 md:p-14 shadow-2xl border-none bg-white overflow-hidden relative">
           <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-500" />
           
           <div className="relative z-10 space-y-10">
              <div className="text-center space-y-4">
                 <div className="h-20 w-20 rounded-[2.5rem] bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-xl border border-indigo-100 scale-110">
                    <ShieldCheck className="h-10 w-10" />
                 </div>
                 <h2 className="text-3xl font-black text-slate-900 tracking-tight">Security Check</h2>
                 <p className="text-sm font-medium text-slate-500 leading-relaxed">
                    We've sent a 6-digit verification code to <br />
                    <span className="text-indigo-600 font-black">{pendingUser?.email || "your email"}</span>
                 </p>
              </div>

              <form onSubmit={handleVerify} className="space-y-8">
                 <div className="flex justify-center gap-3">
                    {otp.map((data, index) => (
                      <input
                        key={index}
                        type="text"
                        maxLength="1"
                        className="w-12 h-16 md:w-14 md:h-20 text-center text-2xl font-black rounded-2xl border-2 border-slate-100 bg-slate-50/50 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all text-slate-900 shadow-sm"
                        value={data}
                        onChange={(e) => handleChange(e.target, index)}
                        onFocus={(e) => e.target.select()}
                      />
                    ))}
                 </div>

                 <Button
                    type="submit"
                    isLoading={otpVerificationStatus === "loading"}
                    className="w-full h-16 rounded-[2rem] bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-xl shadow-indigo-500/40 text-lg group"
                 >
                    Verify & Continue
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                 </Button>
              </form>

              <div className="pt-6 border-t border-slate-50 text-center space-y-6">
                 <div className="flex items-center justify-center gap-2">
                    {timer > 0 ? (
                      <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl text-slate-400 text-xs font-black uppercase tracking-widest border border-slate-100">
                         Resend in {timer}s
                      </div>
                    ) : (
                      <button 
                        onClick={handleResend}
                        disabled={otpResendStatus === "loading"}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-black uppercase tracking-widest border border-indigo-100 rounded-xl transition-all"
                      >
                         <RefreshCcw className={`h-3 w-3 ${otpResendStatus === "loading" ? "animate-spin" : ""}`} />
                         Resend Secure Code
                      </button>
                    )}
                 </div>
                 
                 <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase text-slate-300 tracking-[0.2em]">
                    <ShieldCheck className="h-3 w-3" />
                    Encrypted Multi-Factor Auth
                 </div>
              </div>
           </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default OtpVerificationPage;
