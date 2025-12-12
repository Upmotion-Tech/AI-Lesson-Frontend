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
  const { current: curriculum, status, error } = useAppSelector(
    (state) => state.curriculum
  );

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
  const shouldTruncate = textContent.length > 2000;
  const displayText = showFullText
    ? textContent
    : textContent.substring(0, 2000) + (shouldTruncate ? "..." : "");

  return (
    <PageTransition>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/upload-curriculum")}
              className="p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                Curriculum Details
              </h1>
              {curriculum.originalFilename && (
                <p className="text-sm text-muted-foreground mt-1">
                  {curriculum.originalFilename}
                </p>
              )}
            </div>
          </div>
          <Button variant="danger" onClick={handleDeleteClick}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>

        {/* Curriculum Information */}
        <Card>
          <div className="space-y-6">
            {/* File Info */}
            <div className="flex items-start gap-3 p-4 bg-primary/10 rounded-lg border border-primary/20">
              <FileText className="h-6 w-6 text-primary shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Uploaded on
                    </p>
                    <p className="text-sm font-medium text-card-foreground">
                      {formatDate(curriculum.createdAt)}
                    </p>
                  </div>
                  {curriculum.originalFilename && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Filename
                      </p>
                      <p className="text-sm font-medium text-card-foreground">
                        {curriculum.originalFilename}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Text Content */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-card-foreground">
                  Text Content
                </h2>
                <span className="text-sm text-muted-foreground">
                  {textContent.length.toLocaleString()} characters
                </span>
              </div>
              <div className="bg-muted p-4 rounded-lg border border-border">
                <div className="text-sm text-card-foreground whitespace-pre-wrap max-h-[600px] overflow-y-auto">
                  {displayText}
                </div>
                {shouldTruncate && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowFullText(!showFullText)}
                      className="w-full"
                    >
                      {showFullText ? "Show Less" : "Show Full Text"}
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Extracted Objectives */}
            {curriculum.extractedObjectives &&
              curriculum.extractedObjectives.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-card-foreground mb-3">
                    Extracted Objectives
                  </h2>
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <ul className="space-y-3">
                      {curriculum.extractedObjectives.map((obj, idx) => (
                        <li
                          key={idx}
                          className="text-sm text-card-foreground flex items-start gap-3"
                        >
                          <span className="text-primary font-bold shrink-0 mt-1">
                            {idx + 1}.
                          </span>
                          <span className="flex-1">{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

            {/* No Objectives Message */}
            {(!curriculum.extractedObjectives ||
              curriculum.extractedObjectives.length === 0) && (
              <div className="bg-muted/50 border border-border rounded-lg p-4 text-center">
                <BookOpen className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  No objectives extracted yet. Objectives will be extracted when
                  you generate a lesson plan using this curriculum.
                </p>
              </div>
            )}
          </div>
        </Card>
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
                <p className="text-xs text-muted-foreground mb-1">Curriculum:</p>
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

