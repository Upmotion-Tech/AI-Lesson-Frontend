import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const Button = ({
  children,
  onClick,
  disabled = false,
  loading = false,
  variant = "primary",
  type = "button",
  size = "md",
  className = "",
  icon,
  iconPosition = "left",
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";

  const sizeClasses = {
    xs: "px-2 py-1 text-xs gap-1",
    sm: "px-3 py-1.5 text-sm gap-1.5",
    md: "px-4 py-2 text-base gap-2",
    lg: "px-6 py-3 text-lg gap-2",
  };

  const variants = {
    primary:
      "bg-primary text-primary-foreground hover:opacity-90 focus:ring-primary shadow-sm hover:shadow-md hover:shadow-primary/20",
    secondary:
      "bg-secondary text-foreground hover:bg-secondary/80 focus:ring-secondary",
    ghost: "hover:bg-muted text-foreground focus:ring-muted",
    outline:
      "border-2 border-border text-foreground hover:bg-muted focus:ring-border hover:border-primary/50",
    danger:
      "bg-danger text-white hover:opacity-90 focus:ring-danger shadow-sm hover:shadow-md hover:shadow-danger/20",
    success:
      "bg-success text-white hover:opacity-90 focus:ring-success shadow-sm hover:shadow-md hover:shadow-success/20",
  };

  const isLoading = loading || disabled;
  const showIcon = icon && !isLoading;

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      className={`${baseClasses} ${sizeClasses[size] || sizeClasses.md} ${
        variants[variant]
      } ${className}`}
      aria-busy={loading}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin shrink-0" />}
      {showIcon && iconPosition === "left" && (
        <span className="shrink-0">{icon}</span>
      )}
      <span>{children}</span>
      {showIcon && iconPosition === "right" && (
        <span className="shrink-0">{icon}</span>
      )}
    </motion.button>
  );
};

export default Button;
