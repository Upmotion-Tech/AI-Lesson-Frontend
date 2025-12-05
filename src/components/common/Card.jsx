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
      {hasHeader && (
        <div
          className={`mb-4 flex flex-wrap items-start gap-3 sm:gap-4 ${headerClassName}`}
        >
          <div className="flex-1 min-w-[180px]">
            {title && (
              <TitleTag className="text-base sm:text-lg font-semibold text-card-foreground">
                {title}
              </TitleTag>
            )}
            {description && (
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </CardWrapper>
  );
};

export default Card;
