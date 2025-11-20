const   Card = ({ children, className = "", title, ...props }) => {
  return (
    <div
      className={`bg-card border border-border rounded-lg shadow-sm p-4 sm:p-6 transition-shadow duration-200 ${className}`}
      {...props}
    >
      {title && (
        <h3 className="text-base sm:text-lg font-semibold text-card-foreground mb-4">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};

export default Card;
