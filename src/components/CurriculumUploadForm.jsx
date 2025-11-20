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

  console.log("isLoading", isLoading);
  console.log("uploadStatus", uploadStatus);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FileInput
        label="Curriculum File"
        accept=".pdf,.docx,.txt"
        name="curriculumFile"
        onChange={handleFileChange}
        error={fileError}
        required
      />
      {file && (
        <p className="text-sm text-muted-foreground">
          Selected: {file.name} ({formatFileSize(file.size)})
        </p>
      )}
      {error && <ErrorMessage message={error} />}
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? <Loader size="sm" /> : "Upload Curriculum"}
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
