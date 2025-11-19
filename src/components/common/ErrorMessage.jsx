import { AlertCircle } from "lucide-react";

const ErrorMessage = ({ message, className = "" }) => {
  if (!message) return null;

  return (
    <div
      className={`flex items-center gap-2 bg-danger/10 border border-danger/20 text-danger px-4 py-3 rounded-lg ${className}`}
    >
      <AlertCircle className="h-5 w-5 flex-shrink-0" />
      <p className="text-sm">{message}</p>
    </div>
  );
};

export default ErrorMessage;
