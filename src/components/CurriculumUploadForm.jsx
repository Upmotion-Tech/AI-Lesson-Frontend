import { useState, useEffect, useMemo } from "react";
import { useAppDispatch } from "../hooks/useAppDispatch.js";
import { useAppSelector } from "../hooks/useAppSelector.js";
import { uploadCurriculum } from "../store/curriculumThunks.js";
import { resetUploadStatus } from "../store/curriculumSlice.js";
import FileInput from "./common/FileInput.jsx";
import Button from "./common/Button.jsx";
import ErrorMessage from "./common/ErrorMessage.jsx";
import Loader from "./common/Loader.jsx";
import { curriculumFileSchema } from "../utils/validators.js";
import { formatFileSize } from "../utils/formatters.js";
import { toast } from "react-hot-toast";
import {
  CloudUpload,
  ShieldCheck,
  Sparkles,
  Clock,
  CheckCircle2,
} from "lucide-react";

const CurriculumUploadForm = () => {
  const dispatch = useAppDispatch();
  const { uploadStatus, error } = useAppSelector((state) => state.curriculum);
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState("");

  // Reset upload status when component mounts or file changes
  useEffect(() => {
    if (uploadStatus === "succeeded" || uploadStatus === "failed") {
      // Auto-reset after 2 seconds if succeeded, or allow manual reset if failed
      if (uploadStatus === "succeeded") {
        const timer = setTimeout(() => {
          dispatch(resetUploadStatus());
        }, 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [uploadStatus, dispatch]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFileError("");

    // Reset upload status when a new file is selected
    if (uploadStatus !== "idle" && uploadStatus !== "loading") {
      dispatch(resetUploadStatus());
    }

    if (selectedFile) {
      // Validate file
      curriculumFileSchema
        .validate({ file: selectedFile }, { abortEarly: false })
        .then(() => {
          setFile(selectedFile);
        })
        .catch((err) => {
          if (err.inner && err.inner[0]) {
            setFileError(err.inner[0].message);
          } else {
            setFileError(
              "Invalid file type. Please select .pdf, .docx, or .txt"
            );
          }
          setFile(null);
        });
    } else {
      setFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setFileError("Please select a file");
      toast.error("Please select a valid curriculum file");
      return;
    }

    try {
      await toast.promise(dispatch(uploadCurriculum({ file })).unwrap(), {
        loading: "Uploading curriculum...",
        success: "Curriculum uploaded successfully",
        error: (err) =>
          (typeof err === "string" && err) || err?.message || "Upload failed",
      });
      setFile(null);
      setFileError("");
      // Reset file input
      e.target.reset();
    } catch (err) {
      const message =
        (typeof err === "string" && err) ||
        err?.message ||
        "An unexpected error occurred";
      setFileError(message);
    }
  };

  const isLoading = uploadStatus === "loading";

  const statusConfig = useMemo(() => {
    switch (uploadStatus) {
      case "loading":
        return {
          label: "Uploading in progress",
          tone: "text-warning",
          bg: "bg-warning/10 border-warning/30",
        };
      case "succeeded":
        return {
          label: "Upload successful",
          tone: "text-success",
          bg: "bg-success/10 border-success/30",
        };
      case "failed":
        return {
          label: "Upload failed",
          tone: "text-danger",
          bg: "bg-danger/10 border-danger/30",
        };
      default:
        return {
          label: "Awaiting file",
          tone: "text-muted-foreground",
          bg: "bg-muted/40 border-border/60",
        };
    }
  }, [uploadStatus]);

  const helperHighlights = [
    {
      icon: Sparkles,
      title: "Smart extraction",
      description: "Objectives auto-detected from text content.",
    },
    {
      icon: ShieldCheck,
      title: "Secure storage",
      description: "Your files are encrypted during upload.",
    },
    {
      icon: Clock,
      title: "Fast processing",
      description: "Average processing completes in under a minute.",
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div
        className={`rounded-2xl border px-4 py-3 text-sm font-medium flex items-center gap-3 ${statusConfig.bg}`}
      >
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex h-2.5 w-2.5 rounded-full ${
              uploadStatus === "succeeded"
                ? "bg-success"
                : uploadStatus === "failed"
                ? "bg-danger"
                : uploadStatus === "loading"
                ? "bg-warning"
                : "bg-muted-foreground/50"
            }`}
          />
          <span className={statusConfig.tone}>{statusConfig.label}</span>
        </div>
        {uploadStatus !== "idle" && uploadStatus !== "loading" && (
          <Button
            type="button"
            size="xs"
            variant="ghost"
            onClick={() => dispatch(resetUploadStatus())}
            className="ml-auto text-xs"
          >
            Reset
          </Button>
        )}
      </div>

      <div className="space-y-3 rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-4 sm:p-5">
        <div className="flex flex-col gap-3">
          <FileInput
            label="Curriculum File"
            accept=".pdf,.docx,.txt"
            name="curriculumFile"
            onChange={handleFileChange}
            error={fileError}
            required
            className="bg-background"
          />
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span className="rounded-full border border-border/60 px-3 py-1">
              Max 20 MB
            </span>
            <span className="rounded-full border border-border/60 px-3 py-1">
              PDF · DOCX · TXT
            </span>
            <span className="rounded-full border border-border/60 px-3 py-1">
              Organized in folders
            </span>
          </div>
        </div>

        {file && (
          <div className="rounded-xl bg-background p-3 shadow-inner text-sm text-muted-foreground">
            <div className="flex items-center gap-2 font-medium text-card-foreground">
              <CheckCircle2 className="h-4 w-4 text-success" />
              Ready to upload
            </div>
            <p className="mt-1 text-xs sm:text-sm">
              {file.name} • {formatFileSize(file.size)}
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {helperHighlights.map(({ icon, title, description }) => {
          const Icon = icon;
          return (
            <div
              key={title}
              className="rounded-2xl border border-border/60 bg-background/80 p-3 flex gap-3"
            >
              <div className="rounded-full bg-primary/10 p-2 text-primary shrink-0 h-fit">
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-card-foreground">
                  {title}
                </p>
                <p className="text-xs text-muted-foreground">{description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {error && <ErrorMessage message={error} />}

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-xl py-3 text-base font-semibold flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <Loader size="sm" />
        ) : (
          <>
            <div className="flex items-center justify-center gap-2">
              <CloudUpload className="h-5 w-5" />
              Upload Curriculum
            </div>
          </>
        )}
      </Button>

      {uploadStatus === "failed" && (
        <div className="text-center text-xs text-muted-foreground">
          Upload failed. Please try again or reset the uploader.
        </div>
      )}
    </form>
  );
};

export default CurriculumUploadForm;
