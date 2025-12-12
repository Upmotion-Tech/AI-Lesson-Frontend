import { motion } from "framer-motion";

const Card = ({
  children,
  className = "",
  title,
  description,
  action,
  titleAs = "h3",
  headerClassName = "",
  bodyClassName = "",
  onClick,
  clickable = false,
  hoverable = true,
  ...props
}) => {
  const hasHeader = title || description || action;
  const TitleTag = titleAs;
  const isInteractive = onClick || clickable;

  const cardClasses = `bg-card/95 border border-border/70 rounded-2xl shadow-sm shadow-black/5 p-4 sm:p-6 transition-all duration-300 ${
    hoverable && !isInteractive
      ? "hover:shadow-lg hover:shadow-black/10 hover:-translate-y-0.5"
      : ""
  } ${
    isInteractive
      ? "cursor-pointer hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 active:scale-[0.99]"
      : ""
  } ${className}`;

  const CardWrapper = isInteractive ? motion.div : motion.div;

  return (
    <CardWrapper
      onClick={onClick}
      whileHover={isInteractive ? { y: -2 } : {}}
      whileTap={isInteractive ? { scale: 0.99 } : {}}
      className={cardClasses}
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onKeyDown={
        isInteractive && onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick(e);
              }
            }
          : undefined
      }
      {...props}
    >
      {title && (
        <h3 className="text-base sm:text-lg font-semibold text-card-foreground mb-4">
          {title}
        </h3>
      )}
      <div className={bodyClassName}>{children}</div>
    </CardWrapper>
  );
};

export default Card;
