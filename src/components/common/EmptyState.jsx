import { Inbox } from "lucide-react";
import Button from "./Button.jsx";

const EmptyState = ({
  message,
  actionLabel,
  onAction,
  icon = Inbox,
  className = "",
}) => {
  const IconComponent = icon;
  return (
    <div className={`text-center py-12 ${className}`}>
      <IconComponent className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <p className="text-muted-foreground mb-4">{message}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
