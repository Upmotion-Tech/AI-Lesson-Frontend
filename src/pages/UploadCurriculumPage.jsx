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
    <div className="space-y-6 sm:space-y-8">
      <div className="relative overflow-hidden rounded-2xl border bg-linear-to-br from-primary/5 via-background to-secondary/10 p-6 sm:p-8">
        <div className="flex flex-wrap gap-4 sm:gap-6 items-center">
          <div className="p-3 sm:p-4 rounded-2xl bg-background/90 shadow-inner flex items-center justify-center">
            <BookOpen className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
          </div>
          <div className="flex-1 min-w-[220px]">
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
              Curriculum Workspace
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Upload & Preview Curriculum
            </h1>
            <p className="text-sm text-muted-foreground max-w-3xl mt-2">
              Upload your curriculum files (.pdf, .docx, .txt) and instantly
              preview extracted content and objectives before generating
              lessons.
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          {[
            { label: "Supported Types", value: "PDF · DOCX · TXT" },
            { label: "Max Size", value: "20 MB" },
            { label: "Processing", value: "Automatic Parsing" },
            { label: "Last Upload", value: latest ? "Available" : "Not yet" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl border bg-background/60 px-3 py-2 text-center"
            >
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                {item.label}
              </p>
              <p className="font-semibold text-foreground">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        <Card
          title="Upload New Curriculum"
          className="border border-border/60 shadow-lg shadow-primary/5"
          headerClassName="flex items-center gap-2"
        >
          <CurriculumUploadForm />
        </Card>

        <div className="min-h-[420px] space-y-3">
          {isLoading ? (
            <Card className="flex h-full items-center justify-center border border-border/60">
              <Loader size="lg" />
            </Card>
          ) : latest ? (
            <CurriculumPreviewCard curriculum={latest} />
          ) : (
            <Card className="h-full border border-dashed border-muted-foreground/30 bg-muted/40">
              <EmptyState
                message="No curriculum uploaded yet. Start by adding your first file to unlock previews and objective extraction."
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
