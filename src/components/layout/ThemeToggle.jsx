import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import IconButton from "../common/IconButton.jsx";

const ThemeToggle = () => {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first, then system preference
    const saved = localStorage.getItem("theme");
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <IconButton
      onClick={toggleTheme}
      variant="ghost"
      size="md"
      aria-label="Toggle theme"
      className="p-2 rounded-md bg-muted hover:bg-muted-foreground/20 transition-colors"
    >
      {theme === "light" ? (
        <Moon size={18} className="text-foreground" />
      ) : (
        <Sun size={18} className="text-foreground" />
      )}
    </IconButton>
  );
};

export default ThemeToggle;
