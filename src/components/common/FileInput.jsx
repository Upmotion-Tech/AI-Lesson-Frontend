import { Upload, File } from "lucide-react";
import { useMemo, useState } from "react";

const FileInput = ({
  label,
  accept,
  onChange = () => {},
  error,
  required = false,
  className = "",
  name,
  id,
  ...props
}) => {
  const [fileName, setFileName] = useState("");

  const inputId = useMemo(() => {
    if (id) return id;
    const normalizedLabel = (label || "file-input")
      .toLowerCase()
      .replace(/\s+/g, "-");
    return `file-input-${normalizedLabel}`;
  }, [id, label]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileName(file ? file.name : "");
    onChange(e);
  };

  return (
    <div className="w-full">
      {label && (
        <label
          className="block text-sm font-medium text-foreground mb-1.5"
          htmlFor={inputId}
        >
          {label}
          {required && <span className="text-danger ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          type="file"
          id={inputId}
          name={name || inputId}
          accept={accept}
          onChange={handleFileChange}
          required={required}
          className="peer absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        <div
          className={`pointer-events-none flex items-center gap-3 px-4 py-3 border-2 border-dashed rounded-lg transition-all duration-200 ${
            error
              ? "border-danger bg-danger/5 peer-focus-visible:border-danger"
              : "border-border bg-muted/30 peer-hover:border-primary/50 peer-hover:bg-muted/50 peer-focus-visible:border-primary/60"
          } ${className}`}
        >
          <Upload className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-foreground flex-1">
            {fileName || "Click to upload or drag and drop"}
          </span>
          {fileName && <File className="h-4 w-4 text-muted-foreground" />}
        </div>
      </div>
      {error && (
        <p id={`${inputId}-error`} className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
};

export default FileInput;
