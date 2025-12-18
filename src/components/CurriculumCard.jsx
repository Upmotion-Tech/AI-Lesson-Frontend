import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Card from "./common/Card.jsx";
import Button from "./common/Button.jsx";
import Modal from "./common/Modal.jsx";
import { formatDateShort, truncateText } from "../utils/formatters.js";
import { FileText, Trash2, AlertTriangle, Calendar, ArrowRight } from "lucide-react";

const CurriculumCard = ({ curriculum, onDelete }) => {
  const navigate = useNavigate();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(curriculum._id);
      setDeleteModalOpen(false);
    } catch (error) {
      // Error handling is done in parent component
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
  };

  const textPreview = curriculum.rawText
    ? truncateText(curriculum.rawText, 200)
    : "No text content available";

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card
          className="border-l-4 border-l-primary group relative cursor-pointer"
          clickable
          onClick={() => navigate(`/curriculum/${curriculum._id}`)}
        >
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-5 w-5 text-primary shrink-0" />
                  <h3 className="text-lg font-semibold text-card-foreground line-clamp-1">
                    {curriculum.originalFilename || "Curriculum File"}
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDateShort(curriculum.createdAt)}</span>
                </div>
              </div>
              <button
                onClick={handleDeleteClick}
                className="p-1.5 rounded-lg hover:bg-danger/10 text-muted-foreground hover:text-danger transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                title="Delete curriculum"
                aria-label="Delete curriculum"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            {/* Text Preview */}
            <div className="p-3 bg-muted rounded-lg border border-border">
              <p className="text-sm text-card-foreground line-clamp-3">
                {textPreview}
              </p>
              {curriculum.rawText && (
                <p className="text-xs text-muted-foreground mt-2">
                  {curriculum.rawText.length.toLocaleString()} characters
                </p>
              )}
            </div>

            {/* Objectives */}
            {curriculum.extractedObjectives &&
              curriculum.extractedObjectives.length > 0 && (
                <div className="p-2 bg-primary/5 rounded-lg border border-primary/20">
                  <p className="text-xs text-muted-foreground mb-1">
                    Extracted Objectives ({curriculum.extractedObjectives.length})
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {curriculum.extractedObjectives.slice(0, 2).map((obj, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-background px-2 py-1 rounded border border-border text-card-foreground"
                      >
                        {truncateText(obj, 40)}
                      </span>
                    ))}
                    {curriculum.extractedObjectives.length > 2 && (
                      <span className="text-xs text-muted-foreground px-2 py-1">
                        +{curriculum.extractedObjectives.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              )}

            {/* View Details Indicator */}
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <span className="text-xs text-muted-foreground">
                Click to view details
              </span>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        </Card>
      </motion.div>

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
    </>
  );
};

export default CurriculumCard;

