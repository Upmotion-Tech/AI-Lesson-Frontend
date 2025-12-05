import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Sparkles,
  PanelLeftClose,
  PanelLeftOpen,
  FileText,
} from "lucide-react";
import AiLesson from "../../assets/Ai-lesson.png";
import AiLessonLogo from "../../assets/Ai-lesson-logo.png";

const Sidebar = ({
  isMobileOpen = false,
  onClose = () => {},
  isCollapsed = false,
  onToggleCollapse = () => {},
}) => {
  const navItems = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/upload-curriculum", label: "Upload Curriculum", icon: BookOpen },
    { path: "/upload-students", label: "Upload Students", icon: Users },
    { path: "/generate-lesson", label: "Generate Lesson", icon: Sparkles },
    { path: "/lessons", label: "My Lesson Plans", icon: FileText },
  ];

  const sidebarWidth = isCollapsed ? "w-20" : "w-64";
  const navPadding = isCollapsed ? "p-3" : "p-4";

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-16 lg:top-0 bottom-0 left-0 z-40 ${sidebarWidth} bg-card border-r border-border transform ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } transition-transform duration-300 ease-in-out shadow-lg lg:shadow-none`}
      >
        <nav className={`${navPadding} h-full overflow-y-auto`}>
          <div className="mb-6 space-y-4">
            <div className="flex items-center justify-center w-full">
              {isCollapsed ? (
                <img
                  src={AiLessonLogo}
                  alt="logo"
                  className={`transition-all duration-300 ${
                    isCollapsed ? "w-12" : "w-2/3"
                  }`}
                />
              ) : (
                <img
                  src={AiLesson}
                  alt="logo"
                  className={`transition-all duration-300 ${
                    isCollapsed ? "w-12" : "w-2/3"
                  }`}
                />
              )}
            </div>
            <button
              type="button"
              onClick={onToggleCollapse}
              className={`flex w-full items-center rounded-lg border border-border/70 bg-muted/50 px-3 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground ${
                isCollapsed ? "justify-center" : "justify-between"
              }`}
              aria-pressed={isCollapsed}
            >
              <span className={isCollapsed ? "sr-only" : ""}>
                {isCollapsed ? "Show labels" : "Hide labels"}
              </span>
              {isCollapsed ? (
                <PanelLeftOpen className="h-4 w-4" aria-hidden="true" />
              ) : (
                <PanelLeftClose className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:bg-muted hover:text-card-foreground"
                      } ${
                        isCollapsed
                          ? "justify-center px-2 py-3"
                          : "gap-3 px-4 py-3"
                      }`
                    }
                    title={item.label}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <span
                      className={`font-medium transition-all duration-300 ${
                        isCollapsed
                          ? "pointer-events-none opacity-0 w-0 overflow-hidden"
                          : "opacity-100"
                      }`}
                      aria-hidden={isCollapsed}
                    >
                      {item.label}
                    </span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-foreground/50 z-30 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default Sidebar;
