import { useState } from "react";
import { useAppDispatch } from "../hooks/useAppDispatch.js";
import { useAppSelector } from "../hooks/useAppSelector.js";
import { uploadStudentData } from "../store/studentDataThunks.js";
import FileInput from "./common/FileInput.jsx";
import Button from "./common/Button.jsx";
import ErrorMessage from "./common/ErrorMessage.jsx";
import { studentFileSchema } from "../utils/validators.js";
import { formatFileSize } from "../utils/formatters.js";
import { toast } from "react-hot-toast";

const StudentUploadForm = () => {
  const dispatch = useAppDispatch();
  const { uploadStatus, error } = useAppSelector((state) => state.studentData);
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFileError("");

    if (selectedFile) {
      // Validate file
      studentFileSchema
        .validate({ file: selectedFile }, { abortEarly: false })
        .then(() => {
          setFile(selectedFile);
        })
        .catch((err) => {
          if (err.inner && err.inner[0]) {
            setFileError(err.inner[0].message);
          } else {
            setFileError("Invalid file type. Please select .csv or .pdf");
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
      toast.error("Please select a valid student file");
      return;
    }

    try {
      await toast.promise(dispatch(uploadStudentData({ file })).unwrap(), {
        loading: "Uploading student data...",
        success: "Student data uploaded successfully",
        error: (err) =>
          (typeof err === "string" && err) || err?.message || "Upload failed",
      });
      setFile(null);
      setFileError("");
      // Reset file input
      e.target.reset();
      // Note: No need to call fetchLatestStudentData here -
      // uploadStudentData thunk already fetches it automatically
    } catch (err) {
      const message =
        (typeof err === "string" && err) || err?.message || "Upload failed";
      setFileError(message);
    }
  };

  const isLoading = uploadStatus === "loading";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FileInput
        label="Student Data File"
        accept=".csv,.pdf"
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
        {isLoading ? "Uploading..." : "Upload Student Data"}
      </Button>
    </form>
  );
};

export default StudentUploadForm;
