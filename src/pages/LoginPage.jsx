import { motion } from "framer-motion";
import LoginForm from "../components/LoginForm.jsx";
import { Sparkles, Rocket, BrainCircuit, Zap, ArrowRight, ShieldCheck } from "lucide-react";

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-[rgb(var(--color-background))] flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-500/5 rounded-full blur-[120px] animate-pulse" />
      </div>

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Side: Brand Story */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="hidden lg:flex flex-col space-y-12"
        >
          <div className="space-y-6">
             <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-600/10 border border-indigo-600/10 text-indigo-600 text-xs font-black uppercase tracking-[0.2em]">
              <Sparkles className="h-4 w-4" />
              Intelligence Powered
            </div>
            <h1 className="text-6xl font-black text-slate-900 tracking-tighter leading-[1.05]">
              Instructional <br />
              <span className="gradient-text">Excellence</span> <br />
              Redefined.
            </h1>
            <p className="text-xl text-slate-500 font-medium max-w-md leading-relaxed">
              Synthesize your curriculum and student data into high-impact, personalized lesson plans in seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {[
              { icon: BrainCircuit, title: "Deep Synthesis", desc: "AI scans every word of your curriculum PDF for standards.", color: "bg-indigo-600" },
              { icon: ShieldCheck, title: "Tier 1/2/3 Support", desc: "Automatically adjusts instruction for every student tier.", color: "bg-emerald-600" },
              { icon: Zap, title: "Instant Generation", desc: "Go from raw PDF to beautiful lesson plan in 30 seconds.", color: "bg-amber-500" }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="flex items-start gap-5 p-6 rounded-[2rem] bg-white shadow-xl shadow-slate-200/50 border border-slate-100 group hover:shadow-2xl transition-all"
              >
                <div className={`h-12 w-12 rounded-2xl ${feature.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 mb-1 uppercase tracking-wider text-xs">{feature.title}</h4>
                  <p className="text-sm text-slate-500 font-medium leading-snug">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Side: Auth Card */}
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          className="w-full max-w-[480px] mx-auto"
        >
          <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] border border-slate-100 relative overflow-hidden">
             {/* Abstract Decorations */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16" />
             
             <div className="relative z-10 space-y-10">
               <div className="text-center space-y-2">
                 <div className="h-20 w-20 rounded-[2rem] bg-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-indigo-500/40 rotate-12">
                   <Rocket className="h-10 w-10 text-white" />
                 </div>
                 <h2 className="text-3xl font-black text-slate-900 tracking-tight">Welcome back</h2>
                 <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Educator Portal Access</p>
               </div>

               <LoginForm />

           
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
