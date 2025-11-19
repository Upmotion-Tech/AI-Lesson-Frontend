import { Loader2 } from "lucide-react";

const Button = ({
  children,
  onClick,
  disabled = false,
  variant = "primary",
  type = "button",
  size = "md",
  className = "",
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const sizeClasses = {
    xs: "px-2 py-1 text-xs",
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const variants = {
    primary:
      "bg-primary text-primary-foreground hover:opacity-90 focus:ring-primary shadow-sm hover:shadow",
    secondary:
      "bg-secondary text-foreground hover:bg-secondary/80 focus:ring-secondary",
    ghost: "hover:bg-muted text-foreground focus:ring-muted",
    outline:
      "border-2 border-border text-foreground hover:bg-muted focus:ring-border",
    danger:
      "bg-danger text-white hover:opacity-90 focus:ring-danger shadow-sm hover:shadow",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses[size] || sizeClasses.md} ${
        variants[variant]
      } ${className}`}
      {...props}
    >
      {disabled && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
};

export default Button;
