const Card = ({
  children,
  className = "",
  title,
  description,
  action,
  titleAs = "h3",
  headerClassName = "",
  bodyClassName = "",
  ...props
}) => {
  const hasHeader = title || description || action;
  const TitleTag = titleAs;

  return (
    <div
      className={`bg-card/95 border border-border/70 rounded-2xl shadow-sm shadow-black/5 p-4 sm:p-6 transition-shadow duration-200 hover:shadow-md ${className}`}
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
    </div>
  );
};

export default Card;
