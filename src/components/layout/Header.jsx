import { useAppDispatch } from "../../hooks/useAppDispatch.js";
import { useAppSelector } from "../../hooks/useAppSelector.js";
import { useNavigate } from "react-router-dom";
import { clearAuth } from "../../store/authSlice.js";
import { LogOut, Menu, User, X, Sparkles, Bell, Search } from "lucide-react";
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
    <header className="sticky top-0 z-40 w-full border-b border-slate-100 bg-white/80 backdrop-blur-xl transition-all duration-300">
      <div className="flex h-20 items-center justify-between px-6 sm:px-10">
        <div className="flex items-center gap-6">
          {renderMenuToggle()}
          {/* <div className="hidden md:flex items-center gap-3 py-2 px-4 bg-slate-50 border border-slate-100 rounded-2xl group transition-all hover:bg-white hover:shadow-lg hover:shadow-indigo-500/5 cursor-pointer">
             <Search className="h-4 w-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
             <span className="text-xs font-bold text-slate-400 group-hover:text-slate-600 transition-colors">Search anything...</span>
             <kbd className="hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border border-slate-200 bg-white px-1.5 font-mono text-[10px] font-black text-slate-400 opacity-100">
               <span className="text-xs">⌘</span>K
             </kbd>
          </div> */}
        </div>
        
        <div className="flex items-center gap-4 md:gap-8">
          {/* <div className="flex items-center gap-2">
             <IconButton variant="ghost" className="text-slate-400 hover:text-indigo-600 relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 h-2 w-2 bg-rose-500 rounded-full border-2 border-white" />
             </IconButton>
          </div> */}

          <div className="h-8 w-px bg-slate-100" />

          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                   <p className="text-sm font-black text-slate-900 leading-none">{user.name || "Elevated User"}</p>
                   <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-1">Instructor Portal</p>
                </div>
                <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-500/20 text-sm border-2 border-white">
                  {user.name ? user.name[0].toUpperCase() : <User className="h-5 w-5" />}
                </div>
              </div>
            )}
            
            <IconButton 
              variant="ghost" 
              onClick={handleLogout}
              className="text-slate-400 hover:text-rose-500 transition-colors"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </IconButton>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
