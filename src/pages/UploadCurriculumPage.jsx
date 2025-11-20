import { useEffect } from "react";
import { useAppDispatch } from "../hooks/useAppDispatch.js";
import { useAppSelector } from "../hooks/useAppSelector.js";
import CurriculumUploadForm from "../components/CurriculumUploadForm.jsx";
import CurriculumPreviewCard from "../components/CurriculumPreviewCard.jsx";
import Card from "../components/common/Card.jsx";
import Loader from "../components/common/Loader.jsx";
import { BookOpen, Upload } from "lucide-react";
import { fetchLatestCurriculum } from "../store/curriculumThunks.js";
import EmptyState from "../components/common/EmptyState.jsx";

const UploadCurriculumPage = () => {
  const dispatch = useAppDispatch();
  const { latest, status } = useAppSelector((state) => state.curriculum);

  useEffect(() => {
    if (status === "idle" && !latest) {
      dispatch(fetchLatestCurriculum());
    }
  }, [dispatch, status, latest]);

  const isLoading = status === "loading";

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="pb-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
          </div>
          <span>Upload Curriculum</span>
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Upload your curriculum file (.pdf, .docx, or .txt). The system will
          extract text content for lesson generation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card
          title="Upload New Curriculum"
          className="border-l-4 border-l-primary"
        >
          <div className="flex items-center gap-2 mb-4 p-2 bg-primary/5 rounded-lg border border-primary/10">
            <Upload className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted-foreground">
              Supported formats: PDF, DOCX, TXT
            </span>
          </div>
          <CurriculumUploadForm />
        </Card>

        <div className="min-h-[400px]">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader size="lg" />
            </div>
          ) : latest ? (
            <CurriculumPreviewCard curriculum={latest} />
          ) : (
            <Card className="h-full border-l-4 border-l-muted">
              <EmptyState
                message="No curriculum uploaded yet. Upload a file to get started."
                icon={BookOpen}
              />
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadCurriculumPage;
