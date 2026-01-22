import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Sparkles,
  PanelLeftClose,
  PanelLeftOpen,
  FileText,
  ChevronRight,
  Zap,
  Library,
  GraduationCap
} from "lucide-react";
import IconButton from "../common/IconButton.jsx";
import AiLessonLogo from "../../assets/Ai-lesson-logo.png";

const Sidebar = ({ isMobileOpen = false, onClose = () => {} }) => {
  const location = useLocation();
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
  ];

  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  const textVariants = {
    expanded: { opacity: 1, x: 0, display: "block" },
    collapsed: { opacity: 0, x: -10, transitionEnd: { display: "none" } }
  };

  return (
    <>
      <motion.aside
        initial={false}
        animate={{ 
          width: isCollapsed ? 88 : 280,
          x: isMobileOpen ? 0 : 0 
        }}
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 bg-white border-r border-slate-100 flex flex-col transition-all duration-500 ease-in-out shadow-2xl shadow-indigo-500/5 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Sidebar Brand/Header */}
        <div className="h-24 flex items-center px-6 mb-4">
           <div className="flex items-center gap-4 overflow-hidden">
              <div className="h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/30">
                 <img src={AiLessonLogo} alt="Logo" className="h-7 w-7 invert brightness-0" />
              </div>
              {!isCollapsed && (
                 <motion.div
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   className="flex flex-col"
                 >
                    <span className="text-sm font-black text-slate-900 tracking-tight leading-none">Lesson Orbit </span>
                    
                 </motion.div>
              )}
           </div>
        </div>

        {/* Navigation Core */}
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
           {navItems.map((item) => {
             const isActive = location.pathname === item.path;
             return (
               <NavLink
                 key={item.path}
                 to={item.path}
                 onClick={onClose}
                 className={`group flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 relative overflow-hidden ${
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
                 {!isCollapsed && (
                    <motion.span
                      variants={textVariants}
                      animate={isCollapsed ? "collapsed" : "expanded"}
                      className={`relative z-10 text-xs font-black uppercase tracking-widest ${isActive ? "text-white" : "text-slate-500"}`}
                    >
                      {item.label}
                    </motion.span>
                 )}
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
        {/* <div className="p-4 border-t border-slate-50 space-y-4">
           {!isCollapsed && (
              <div className="p-5 rounded-[2rem] bg-indigo-600 text-white relative overflow-hidden group">
                 <Zap className="absolute -bottom-4 -right-4 h-20 w-20 opacity-10 group-hover:scale-125 transition-transform" />
                 <p className="text-[10px] font-black uppercase tracking-widest mb-1 text-indigo-200">System Priority</p>
                 <p className="text-xs font-bold leading-relaxed mb-4">You have 4 new AI insights available.</p>
                 <button className="text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-md transition-all">
                    View Insights
                 </button>
              </div>
           )}

           <div className={`flex items-center gap-4 ${isCollapsed ? "justify-center" : "px-3"}`}>
              <IconButton 
                onClick={toggleCollapse}
                className="text-slate-400 hover:bg-slate-50 h-12 w-12 rounded-2xl flex items-center justify-center"
              >
                {isCollapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
              </IconButton>
           </div>
        </div> */}
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
