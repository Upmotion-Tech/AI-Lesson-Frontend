import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../hooks/useAppDispatch.js";
import { useAppSelector } from "../hooks/useAppSelector.js";
import {
  fetchCurriculumById,
  deleteCurriculum,
} from "../store/curriculumThunks.js";
import Card from "../components/common/Card.jsx";
import Button from "../components/common/Button.jsx";
import Modal from "../components/common/Modal.jsx";
import ErrorMessage from "../components/common/ErrorMessage.jsx";
import { CardSkeleton } from "../components/common/Skeleton.jsx";
import PageTransition from "../components/common/PageTransition.jsx";
import { toast } from "react-hot-toast";
import {
  ArrowLeft,
  FileText,
  Calendar,
  Trash2,
  AlertTriangle,
  BookOpen,
} from "lucide-react";
import { formatDate } from "../utils/formatters.js";

const CurriculumViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    current: curriculum,
    status,
    error,
  } = useAppSelector((state) => state.curriculum);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showFullText, setShowFullText] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchCurriculumById(id));
    }
  }, [id, dispatch]);

  const handleDeleteClick = () => {
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await dispatch(deleteCurriculum(id)).unwrap();
      toast.success("Curriculum deleted successfully");
      navigate("/upload-curriculum");
    } catch (error) {
      toast.error(error || "Failed to delete curriculum");
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
  };

  if (status === "loading") {
    return (
      <PageTransition>
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                Curriculum Details
              </h1>
            </div>
          </div>
          <CardSkeleton count={1} />
        </div>
      </PageTransition>
    );
  }

  if (error || !curriculum) {
    return (
      <PageTransition>
        <div className="space-y-4">
          <ErrorMessage message={error || "Curriculum not found"} />
          <Button onClick={() => navigate("/upload-curriculum")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Curricula
          </Button>
        </div>
      </PageTransition>
    );
  }

  const textContent = curriculum.rawText || "No text content available";
  const shouldTruncate = textContent.length > 500;
  const displayText = showFullText
    ? textContent
    : textContent.substring(0, 500) + (shouldTruncate ? "..." : "");

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/upload-curriculum")}
              className="p-2 h-10 w-10 rounded-full hover:bg-muted"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                Curriculum Analysis
              </h1>
              {curriculum.originalFilename && (
                <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                  <FileText className="h-4 w-4" />
                  {curriculum.originalFilename}
                  <span className="text-border">•</span>
                  {formatDate(curriculum.createdAt)}
                </p>
              )}
            </div>
          </div>
          <Button
            variant="danger"
            onClick={handleDeleteClick}
            className="w-full sm:w-auto"
            icon={<Trash2 className="h-4 w-4" />}
          >
            Delete Curriculum
          </Button>
        </div>

        {/* AI Analysis Summary Card */}
        <div className="grid grid-cols-1 gap-6">
          <Card className="border-l-4 border-l-primary shadow-md">
            <div className="space-y-6">
              {/* Summary Header */}
              <div className="flex items-center gap-3 border-b border-border pb-4">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    Executive Summary
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    AI-generated analysis of the curriculum content
                  </p>
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Summary Text */}
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                      Content Overview
                    </h3>
                    <p className="text-foreground/90 leading-relaxed text-lg">
                      {curriculum.summary ||
                        "No summary available. This content will be analyzed when you generate a lesson plan."}
                    </p>
                  </div>
                </div>

                {/* Side Stats */}
                <div className="space-y-6 md:border-l border-border md:pl-6">
                  {/* Grade Level */}
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                      Target Grade Level
                    </h3>
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-secondary/20 text-secondary-foreground font-semibold text-sm border border-secondary/30">
                      {curriculum.gradeLevelEstimate || "Not specified"}
                    </div>
                  </div>

                  {/* Topics */}
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                      Key Topics
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {curriculum.topics && curriculum.topics.length > 0 ? (
                        curriculum.topics.map((topic, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-md bg-muted text-muted-foreground text-xs font-medium border border-border"
                          >
                            {topic}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground italic">
                          No topics detected
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Raw Text Content (Collapsible/Secondary) */}
          <Card className="bg-muted/30">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <h2 className="text-lg font-semibold text-foreground">
                    Source Content
                  </h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFullText(!showFullText)}
                >
                  {showFullText ? "Show Less" : "Show Full Content"}
                </Button>
              </div>

              <div
                className={`text-sm text-muted-foreground font-mono bg-background p-4 rounded-lg border border-border overflow-y-auto transition-all duration-300 ${
                  showFullText ? "max-h-[600px]" : "max-h-[150px]"
                }`}
              >
                <div className="whitespace-pre-wrap">{textContent}</div>
              </div>
              {!showFullText && shouldTruncate && (
                <p className="text-xs text-center text-muted-foreground italic">
                  Preview showing first 500 characters. Click "Show Full
                  Content" to see all {textContent.length.toLocaleString()}{" "}
                  characters.
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={handleCancelDelete}
        title="Delete Curriculum"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-danger/10 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-danger" />
            </div>
            <div className="flex-1">
              <p className="text-foreground font-medium mb-1">
                Are you sure you want to delete this curriculum?
              </p>
              <p className="text-sm text-muted-foreground">
                This action cannot be undone. All lesson plans associated with
                this curriculum will still exist, but you won't be able to
                generate new lessons from it.
              </p>
              <div className="mt-3 p-3 bg-muted rounded-lg border border-border">
                <p className="text-xs text-muted-foreground mb-1">
                  Curriculum:
                </p>
                <p className="text-sm font-medium text-foreground">
                  {curriculum.originalFilename || "Untitled Curriculum"}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={handleCancelDelete}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmDelete}
              loading={isDeleting}
              icon={<Trash2 className="h-4 w-4" />}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </Modal>
    </PageTransition>
  );
};

export default CurriculumViewPage;
