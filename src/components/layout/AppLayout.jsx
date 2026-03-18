import { useEffect, useState } from "react";
import Header from "./Header.jsx";
import Sidebar from "./Sidebar.jsx";
import { useAppSelector } from "../../hooks/useAppSelector.js";
import AdminSidebar from "../admin/AdminSidebar.jsx";

const AppLayout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const userRole = useAppSelector((state) => state.auth.user?.role);
  const normalizedRoles = Array.isArray(userRole) ? userRole : userRole ? [userRole] : [];
  const isAdmin = normalizedRoles.includes("admin");
  const SidebarComponent = isAdmin ? AdminSidebar : Sidebar;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const handleToggleMenu = () =>
    setIsMobileMenuOpen((previousState) => !previousState);
  const handleCloseMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <SidebarComponent isMobileOpen={isMobileMenuOpen} onClose={handleCloseMenu} />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <Header
          onToggleMenu={handleToggleMenu}
          isMobileMenuOpen={isMobileMenuOpen}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
};

export default AppLayout;
