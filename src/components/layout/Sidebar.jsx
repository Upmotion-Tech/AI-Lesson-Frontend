import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAppSelector } from "../../hooks/useAppSelector.js";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Sparkles,
  PanelLeftClose,
  PanelLeftOpen,
  FileText,
  ChevronRight,
  Zap,
  Library,
  UserCircle2,
  Settings,
  Mail,
  Shield,
} from "lucide-react";
import AiLessonLogo from "../../assets/Ai-lesson-logo.png";

const Sidebar = ({ isMobileOpen = false, onClose = () => {} }) => {
  const location = useLocation();
  const userRole = useAppSelector((state) => state.auth.user?.role);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebarCollapsed");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  const navItems = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard, color: "text-indigo-600", bg: "bg-indigo-50" },
    { path: "/upload-curriculum", label: "Upload Curriculum", icon: Library, color: "text-amber-600", bg: "bg-amber-50" },
    { path: "/upload-students", label: "Upload Students", icon: Users, color: "text-emerald-600", bg: "bg-emerald-50" },
    { path: "/generate-lesson", label: "Generate Lesson", icon: Sparkles, color: "text-violet-600", bg: "bg-violet-50" },
    { path: "/lessons", label: "My Lesson Plans", icon: FileText, color: "text-rose-600", bg: "bg-rose-50" },
    { path: "/profile", label: "Profile", icon: UserCircle2, color: "text-sky-600", bg: "bg-sky-50" },
    { path: "/settings", label: "Settings", icon: Settings, color: "text-slate-600", bg: "bg-slate-100" },
    { path: "/legal", label: "Legal Docs", icon: FileText, color: "text-slate-500", bg: "bg-slate-100" },
  ];

  const normalizedRoles = Array.isArray(userRole) ? userRole : userRole ? [userRole] : [];
  const isAdmin = normalizedRoles.includes("admin");
  if (isAdmin) {
    navItems.push({
      path: "/admin",
      label: "Admin",
      icon: Shield,
      color: "text-fuchsia-600",
      bg: "bg-fuchsia-50",
    });
  }

  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  const textVariants = {
    expanded: { opacity: 1, x: 0, width: "auto" },
    collapsed: { opacity: 0, x: -8, width: 0 }
  };

  return (
    <>
      <motion.aside
        initial={false}
        animate={{
          width: isCollapsed ? 96 : 280,
        }}
        transition={{ type: "spring", stiffness: 260, damping: 30, mass: 0.8 }}
        style={{ willChange: "width" }}
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 bg-white border-r border-slate-100 flex flex-col shadow-2xl shadow-indigo-500/5 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Sidebar Brand/Header */}
        <div className={`relative h-24 flex items-center mb-4 transition-all duration-300 ${isCollapsed ? "px-4" : "px-6"}`}>
           <div className={`flex items-center w-full overflow-hidden ${isCollapsed ? "justify-center" : "gap-4"}`}>
              {/* Logo - Always Visible */}
              <div className={`rounded-xl bg-indigo-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/30 transition-all duration-300 ${isCollapsed ? "h-10 w-10" : "h-12 w-12"}`}>
                 <img src={AiLessonLogo} alt="Logo" className={`invert brightness-0 transition-all duration-300 ${isCollapsed ? "h-6 w-6" : "h-7 w-7"}`} />
              </div>
              
              {/* Brand Text - Hidden when collapsed */}
              {!isCollapsed && (
                 <motion.div
                   initial={{ opacity: 0, x: -12 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -12 }}
                   transition={{ duration: 0.2 }}
                   className="flex flex-col min-w-0"
                 >
                    <span className="text-sm font-black text-slate-900 tracking-tight leading-none truncate">Lesson Orbit</span>
                 </motion.div>
              )}
           </div>

           {/* Toggle Arrow - Floating on the edge */}
           <button 
                onClick={toggleCollapse}
                className="absolute -right-3 top-10 h-7 w-7 bg-white border border-slate-100 rounded-full shadow-sm flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all z-50 cursor-pointer"
              >
                {isCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
              </button>
        </div>

        {/* Navigation Core */}
        <nav className="flex-1 mx-auto px-4 space-y-2 overflow-y-auto">
           {navItems.map((item) => {
             const isActive = location.pathname === item.path;
             return (
               <NavLink
                 key={item.path}
                 to={item.path}
                 onClick={onClose}
                 className={`group flex items-center gap-2 p-4 rounded-2xl transition-all duration-300 relative overflow-hidden ${
                   isActive 
                    ? "bg-slate-900 text-white shadow-xl shadow-slate-900/10" 
                    : "text-slate-500 hover:bg-slate-50"
                 }`}
               >
                 {isActive && (
                    <motion.div 
                      layoutId="sidebar-active"
                      className="absolute inset-0 bg-slate-900" 
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                 )}
                 <div className={`relative z-10 flex items-center justify-center h-6 w-6 shrink-0 transition-transform group-hover:scale-110 ${isActive ? "text-white" : item.color}`}>
                   <item.icon className="h-5 w-5" />
                 </div>
                 <motion.span
                   variants={textVariants}
                   animate={isCollapsed ? "collapsed" : "expanded"}
                   transition={{ duration: 0.2 }}
                   className={`relative z-10 text-xs font-black uppercase tracking-widest whitespace-nowrap overflow-hidden ${
                     isActive ? "text-white" : "text-slate-500"
                   }`}
                 >
                   {item.label}
                 </motion.span>
                 {isActive && !isCollapsed && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute right-4 z-10">
                       <ChevronRight className="h-4 w-4 text-white opacity-40" />
                    </motion.div>
                 )}
               </NavLink>
             );
           })}
        </nav>

        {/* Sidebar Footer/Utilities */}
        <div className="p-4 border-t border-slate-50 space-y-4">
           {!isCollapsed && (
              <div className="p-5 rounded-[2rem] bg-indigo-600 text-white relative overflow-hidden group">
                 <Zap className="absolute -bottom-4 -right-4 h-20 w-20 opacity-10 group-hover:scale-125 transition-transform" />
                 <p className="text-[10px] font-black uppercase tracking-widest mb-1 text-indigo-200">Need Help?</p>
                 <p className="text-xs font-bold leading-relaxed mb-4">Contact our support team for any assistance.</p>
                 <a 
                   href="mailto:customerSupport@scottmanconsulting.com"
                   className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-md transition-all"
                 >
                   <Mail className="h-3.5 w-3.5" />
                   Email Support
                 </a>
              </div>
           )}
           {isCollapsed && (
             <a
               href="mailto:customerSupport@scottmanconsulting.com"
               className="flex h-11 w-11 mx-auto items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-100 transition-colors"
               title="Email Support"
               aria-label="Email Support"
             >
               <Mail className="h-4 w-4" />
             </a>
           )}
        </div>
      </motion.aside>

      {/* Mobile Back-overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-md z-40"
            onClick={onClose}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
