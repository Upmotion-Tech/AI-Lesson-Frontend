import { useAppDispatch } from "../hooks/useAppDispatch.js";
import { useAppSelector } from "../hooks/useAppSelector.js";
import { generateLesson } from "../store/lessonThunks.js";
import Button from "../components/common/Button.jsx";
import ErrorMessage from "../components/common/ErrorMessage.jsx";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AlertCircle, CheckCircle2 } from "lucide-react";

const LessonGeneratePlaceholder = ({
  selectedCurriculumId,
  selectedStudentDataId,
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status, error } = useAppSelector((state) => state.lessons);

  const handleGenerate = async () => {
    if (!selectedCurriculumId || !selectedStudentDataId) {
      toast.error("Please select both curriculum and student data");
      return;
    }

    const result = await dispatch(
      generateLesson({
        curriculumId: selectedCurriculumId,
        studentDataId: selectedStudentDataId,
      })
    );

    if (generateLesson.fulfilled.match(result)) {
      toast.success("Lesson plan generated successfully!");
      // Navigate to lesson viewer
      navigate(`/lessons/${result.payload._id}`);
    } else {
      toast.error(
        result.payload || result.error?.message || "Failed to generate lesson"
      );
    }
  };

  const isLoading = status === "loading";
  const canGenerate = selectedCurriculumId && selectedStudentDataId;

  return (
    <div className="space-y-4">
      {error && <ErrorMessage message={error} />}

      {!canGenerate && (
        <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-warning mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-card-foreground mb-1">
              Missing Requirements
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              {!selectedCurriculumId && <li>• Select a curriculum</li>}
              {!selectedStudentDataId && <li>• Select student data</li>}
            </ul>
          </div>
        </div>
      )}

      {canGenerate && (
        <div className="p-4 bg-success/10 border border-success/20 rounded-lg flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-success mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-card-foreground">
              Ready to generate lesson plan
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              This will create a base lesson plan and three tiered versions
              based on your curriculum and student performance data.
            </p>
          </div>
        </div>
      )}

      <Button
        onClick={handleGenerate}
        disabled={isLoading || !canGenerate}
        className="w-full py-4 text-lg"
      >
        {isLoading ? "Generating Lesson Plan..." : "Generate Lesson Plan"}
      </Button>

      {isLoading && (
        <p className="text-sm text-muted-foreground text-center">
          This may take a minute. Please don't close this page.
        </p>
      )}
    </div>
  );
};

export default LessonGeneratePlaceholder;
