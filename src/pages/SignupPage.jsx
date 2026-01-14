import { motion } from "framer-motion";
import SignupForm from "../components/SignupForm.jsx";
import { Sparkles, BrainCircuit, Rocket, ShieldCheck, ArrowRight, UserPlus } from "lucide-react";

const SignupPage = () => {
  return (
    <div className="min-h-screen bg-[rgb(var(--color-background))] flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-5%] right-[-5%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px] animate-pulse" />
      </div>

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Side: Signup Info */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="hidden lg:flex flex-col space-y-12"
        >
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-600/10 border border-emerald-600/10 text-emerald-600 text-xs font-black uppercase tracking-[0.2em]">
              <Rocket className="h-4 w-4" />
              Join the future
            </div>
            <h1 className="text-6xl font-black text-slate-900 tracking-tighter leading-[1.05]">
              Empower Your <br />
              <span className="text-emerald-600">Teaching</span> <br />
              with AI Core.
            </h1>
            <p className="text-xl text-slate-500 font-medium max-w-md leading-relaxed">
              Create your account to start generating high-impact instruction and tracking student progress with precision.
            </p>
          </div>

          <div className="space-y-6">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Trusted by modern educators</p>
            <div className="grid grid-cols-1 gap-4">
               {[
                 { icon: ShieldCheck, title: "FERPA Compliant", desc: "Your student data is encrypted and remains private.", color: "bg-emerald-600" },
                 { icon: BrainCircuit, title: "Expert Analysis", desc: "Our models are trained specifically for educational standards.", color: "bg-indigo-600" }
               ].map((item, i) => (
                 <div key={i} className="flex items-center gap-4 p-5 rounded-2xl bg-white/50 backdrop-blur-md border border-slate-100 shadow-sm">
                    <div className={`h-10 w-10 rounded-xl ${item.color} flex items-center justify-center text-white shadow-lg`}>
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider">{item.title}</h4>
                      <p className="text-xs text-slate-500 font-medium">{item.desc}</p>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </motion.div>

        {/* Right Side: Signup Card */}
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          className="w-full max-w-[500px] mx-auto"
        >
          <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] border border-slate-100 relative overflow-hidden">
             {/* Abstract Decorations */}
             <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/5 rounded-full -ml-16 -mb-16" />
             
             <div className="relative z-10 space-y-10">
               <div className="text-center space-y-2">
                 <div className="h-20 w-20 rounded-[2rem] bg-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-emerald-500/40 -rotate-12">
                   <UserPlus className="h-10 w-10 text-white" />
                 </div>
                 <h2 className="text-3xl font-black text-slate-900 tracking-tight">Create Account</h2>
                 <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Start your journey today</p>
               </div>

               <SignupForm />

            
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignupPage;
