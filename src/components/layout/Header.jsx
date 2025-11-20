import { useAppDispatch } from "../../hooks/useAppDispatch.js";
import { useAppSelector } from "../../hooks/useAppSelector.js";
import { useNavigate } from "react-router-dom";
import { clearAuth } from "../../store/authSlice.js";
import { LogOut, Menu, User, X } from "lucide-react";
import Button from "../common/Button.jsx";
import IconButton from "../common/IconButton.jsx";
import ThemeToggle from "./ThemeToggle.jsx";

const Header = ({ onToggleMenu, isMobileMenuOpen }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(clearAuth());
    navigate("/login");
  };

  const renderMenuToggle = () => {
    if (!onToggleMenu) {
      return null;
    }

    return (
      <IconButton
        onClick={onToggleMenu}
        variant="ghost"
        size="md"
        className="lg:hidden"
        aria-label={`${isMobileMenuOpen ? "Close" : "Open"} navigation menu`}
      >
        {isMobileMenuOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </IconButton>
    );
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-card/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          {renderMenuToggle()}
          <h1 className="text-xl font-bold text-card-foreground">
            AI Lesson Planner
          </h1>
        </div>
        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">{user.name || user.email}</span>
            </div>
          )}
          <ThemeToggle />
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
