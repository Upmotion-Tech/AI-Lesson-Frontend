import { useAppDispatch } from "../hooks/useAppDispatch.js";
import { useAppSelector } from "../hooks/useAppSelector.js";
import { generateLesson } from "../store/lessonThunks.js";
import Button from "../components/common/Button.jsx";
import ErrorMessage from "./common/ErrorMessage.jsx";
import { toast } from "react-hot-toast";

const LessonGeneratePlaceholder = () => {
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((state) => state.lessons);

  const handleGenerate = async () => {
    const result = await dispatch(generateLesson());
    if (generateLesson.fulfilled.match(result)) {
      toast(result.payload.message);
    } else {
      toast.error(
        result.payload || result.error?.message || "Failed to generate lesson"
      );
    }
  };

  const isLoading = status === "loading";

  return (
    <div className="space-y-4">
      {error && <ErrorMessage message={error} />}
      <Button
        onClick={handleGenerate}
        disabled={isLoading}
        className="w-full py-4 text-lg"
      >
        {isLoading ? "Generating..." : "Generate Lesson Plan"}
      </Button>
    </div>
  );
};

export default LessonGeneratePlaceholder;
