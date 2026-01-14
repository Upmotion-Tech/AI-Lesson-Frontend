import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Sparkles, Rocket } from "lucide-react";

const LoginSuccessPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[rgb(var(--color-background))] flex items-center justify-center p-4 overflow-hidden">
       {/* Background Decor */}
       <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-emerald-500/5 rounded-full blur-[150px]" />
       </div>

       <motion.div 
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="text-center space-y-8 relative z-10"
      >
        <div className="relative">
           <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="h-32 w-32 rounded-[3.5rem] bg-emerald-600 flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/40 relative z-10"
          >
             <CheckCircle2 className="h-16 w-16 text-white" />
          </motion.div>
          
          {/* Particles */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-dashed border-emerald-200 rounded-full opacity-50"
          />
        </div>

        <div className="space-y-4">
           <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100">
              <Sparkles className="h-3.5 w-3.5" />
              Authorization Secure
           </div>
           <h1 className="text-4xl font-black text-slate-900 tracking-tight">Access Granted</h1>
           <p className="text-slate-500 font-medium text-lg italic">Initializing your personalized workspace...</p>
        </div>

        <div className="flex justify-center pt-8">
           <div className="flex items-center gap-1">
              {[1, 2, 3].map(i => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  className="h-2 w-2 rounded-full bg-emerald-400"
                />
              ))}
           </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginSuccessPage;
