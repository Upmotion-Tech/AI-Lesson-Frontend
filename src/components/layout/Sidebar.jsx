import { NavLink } from "react-router-dom";
import { LayoutDashboard, BookOpen, Users, Sparkles } from "lucide-react";

const Sidebar = ({ isMobileOpen = false, onClose = () => {} }) => {
  const navItems = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/upload-curriculum", label: "Upload Curriculum", icon: BookOpen },
    { path: "/upload-students", label: "Upload Students", icon: Users },
    { path: "/generate-lesson", label: "Generate Lesson", icon: Sparkles },
  ];

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-16 lg:top-0 bottom-0 left-0 z-40 w-64 bg-card border-r border-border transform ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } transition-transform duration-300 ease-in-out shadow-lg lg:shadow-none`}
      >
        <nav className="p-4 h-full overflow-y-auto">
          <div className="mb-10">
            <div className="flex items-center justify-center w-full">
              <h3 className="text-xl font-bold text-card-foreground">
                AI Lesson Planner
              </h3>
            </div>
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
                      `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:bg-muted hover:text-card-foreground"
                      }`
                    }
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <span className="font-medium">{item.label}</span>
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
