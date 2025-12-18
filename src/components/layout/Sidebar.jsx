import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Sparkles,
  PanelLeftClose,
  PanelLeftOpen,
  FileText,
} from "lucide-react";
import ThemeToggle from "./ThemeToggle.jsx";
import IconButton from "../common/IconButton.jsx";
import AiLesson from "../../assets/Ai-lesson.png";
import AiLessonLogo from "../../assets/Ai-lesson-logo.png";

const Sidebar = ({ isMobileOpen = false, onClose = () => {} }) => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebarCollapsed");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  const navItems = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/upload-curriculum", label: "Upload Curriculum", icon: BookOpen },
    { path: "/upload-students", label: "Upload Students", icon: Users },
    { path: "/generate-lesson", label: "Generate Lesson", icon: Sparkles },
    { path: "/lessons", label: "My Lesson Plans", icon: FileText },
  ];

  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  const sidebarVariants = {
    expanded: {
      width: "256px",
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    collapsed: {
      width: "80px",
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  const logoVariants = {
    expanded: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.2,
        delay: 0.1,
      },
    },
    collapsed: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.2,
      },
    },
  };

  const logoIconVariants = {
    expanded: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.2,
      },
    },
    collapsed: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.2,
        delay: 0.1,
      },
    },
  };

  const textVariants = {
    expanded: {
      opacity: 1,
      width: "auto",
      marginLeft: "12px",
      transition: {
        duration: 0.2,
        delay: 0.1,
      },
    },
    collapsed: {
      opacity: 0,
      width: 0,
      marginLeft: 0,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <>
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={
          isMobileOpen
            ? { x: 0 }
            : isCollapsed
            ? { x: 0, width: "80px" }
            : { x: 0, width: "256px" }
        }
        className={`fixed lg:static top-16 lg:top-0 bottom-0 left-0 z-40 bg-card border-r border-border ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } shadow-lg lg:shadow-none overflow-hidden`}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          width: {
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1],
          },
          x: {
            type: "spring",
            stiffness: 300,
            damping: 30,
          },
        }}
      >
        <nav className="p-4 h-full overflow-y-auto flex flex-col">
          {/* Header with Toggle */}
          <motion.div
            className="mb-6 w-full"
            initial={false}
            animate={isCollapsed ? "collapsed" : "expanded"}
          >
            <AnimatePresence mode="wait">
              {!isCollapsed ? (
                <motion.div
                  key="expanded-header"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-between gap-2 w-full"
                >
                  <motion.div
                    variants={logoVariants}
                    animate={isCollapsed ? "collapsed" : "expanded"}
                    className="flex-1"
                  >
                    <img
                      src={AiLesson}
                      alt="AI Lesson Planner"
                      className="h-14 w-full object-contain"
                    />
                  </motion.div>
                  {/* Collapse Toggle (Desktop only) */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <IconButton
                      onClick={toggleCollapse}
                      variant="ghost"
                      size="sm"
                      className="hidden lg:flex p-2 rounded-md hover:bg-muted transition-colors"
                      aria-label="Collapse sidebar"
                    >
                      <PanelLeftClose className="h-5 w-5 text-muted-foreground" />
                    </IconButton>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="collapsed-header"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center gap-3"
                >
                  <motion.div
                    variants={logoIconVariants}
                    animate={isCollapsed ? "collapsed" : "expanded"}
                  >
                    <img
                      src={AiLessonLogo}
                      alt="AI Lesson Planner"
                      className="h-10 w-10 object-contain"
                    />
                  </motion.div>
                  {/* Collapse Toggle (Desktop only) */}
                  <IconButton
                    onClick={toggleCollapse}
                    variant="ghost"
                    size="sm"
                    className="hidden lg:flex p-2 rounded-md hover:bg-muted transition-colors w-full justify-center"
                    aria-label="Expand sidebar"
                  >
                    <PanelLeftOpen className="h-5 w-5 text-muted-foreground" />
                  </IconButton>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Navigation Items */}
          <ul className="space-y-2 flex-1">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.li
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.2,
                    delay: index * 0.05,
                  }}
                >
                  <NavLink
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:bg-muted hover:text-card-foreground"
                      } ${isCollapsed ? "justify-center" : ""}`
                    }
                    title={isCollapsed ? item.label : ""}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                    </motion.div>
                    <AnimatePresence>
                      {!isCollapsed && (
                        <motion.span
                          variants={textVariants}
                          animate={isCollapsed ? "collapsed" : "expanded"}
                          initial="collapsed"
                          exit="collapsed"
                          className="font-medium whitespace-nowrap overflow-hidden"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </NavLink>
                </motion.li>
              );
            })}
          </ul>
        </nav>
      </motion.aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-0 bg-foreground/50 z-30 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
