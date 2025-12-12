import { useState, useEffect } from "react";
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
  CheckCircle2,
  CloudUpload,
  FileText,
  Upload,
  Folder,
} from "lucide-react";

const helperHighlights = [
  {
    icon: FileText,
    title: "Multiple Formats",
    description: "Support for PDF, DOCX, and TXT files",
  },
  {
    icon: Upload,
    title: "Easy Upload",
    description: "Drag and drop or click to select",
  },
  {
    icon: Folder,
    title: "Organized",
    description: "Files are organized automatically",
  },
];

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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        loading={isLoading}
        className="w-full rounded-xl py-3 text-base font-semibold"
        icon={<CloudUpload className="h-5 w-5" />}
      >
        Upload Curriculum
      </Button>

      {uploadStatus === "failed" && (
        <div className="text-center">
          <p className="text-xs text-danger mb-2">
            Upload failed. Please try again.
          </p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => dispatch(resetUploadStatus())}
            className="text-xs"
          >
            Reset
          </Button>
        </div>
      )}
    </form>
  );
};

export default CurriculumUploadForm;
