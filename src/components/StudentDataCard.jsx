import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Card from "./common/Card.jsx";
import Button from "./common/Button.jsx";
import Modal from "./common/Modal.jsx";
import Badge from "./common/Badge.jsx";
import { formatDateShort } from "../utils/formatters.js";
import { Users, Trash2, AlertTriangle, Calendar, ArrowRight } from "lucide-react";

const StudentDataCard = ({ studentData, onDelete }) => {
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
      await onDelete(studentData._id);
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

  const getTierDistribution = (students) => {
    if (!students || students.length === 0)
      return { tier1: 0, tier2: 0, tier3: 0 };
    return students.reduce(
      (acc, student) => {
        acc[`tier${student.tier}`] = (acc[`tier${student.tier}`] || 0) + 1;
        return acc;
      },
      { tier1: 0, tier2: 0, tier3: 0 }
    );
  };

  const tierDist = getTierDistribution(studentData?.students);
  const totalStudents = studentData?.students?.length || 0;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card
          className="border-l-4 border-l-success group relative cursor-pointer"
          clickable
          onClick={() => navigate(`/students/${studentData._id}`)}
        >
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-success shrink-0" />
                  <h3 className="text-lg font-semibold text-card-foreground line-clamp-1">
                    {studentData.originalFilename || "Student Data File"}
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDateShort(studentData.createdAt)}</span>
                </div>
              </div>
              <button
                onClick={handleDeleteClick}
                className="p-1.5 rounded-lg hover:bg-danger/10 text-muted-foreground hover:text-danger transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                title="Delete student data"
                aria-label="Delete student data"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            {/* Total Students */}
            <div className="p-3 bg-success/10 rounded-lg border border-success/20">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-card-foreground">
                  Total Students
                </span>
                <span className="text-2xl font-bold text-success">
                  {totalStudents}
                </span>
              </div>
            </div>

            {/* Tier Distribution */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">
                Tier Distribution
              </p>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between p-2 bg-success/10 rounded-lg border border-success/20">
                  <span className="text-xs text-card-foreground">Tier 1 (≥70)</span>
                  <Badge variant="success">{tierDist.tier1}</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-warning/10 rounded-lg border border-warning/20">
                  <span className="text-xs text-card-foreground">Tier 2 (55-69)</span>
                  <Badge variant="warning">{tierDist.tier2}</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-danger/10 rounded-lg border border-danger/20">
                  <span className="text-xs text-card-foreground">Tier 3 (&lt;55)</span>
                  <Badge variant="danger">{tierDist.tier3}</Badge>
                </div>
              </div>
            </div>

            {/* View Details Indicator */}
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <span className="text-xs text-muted-foreground">
                Click to view details
              </span>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-success group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={handleCancelDelete}
        title="Delete Student Data"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-danger/10 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-danger" />
            </div>
            <div className="flex-1">
              <p className="text-foreground font-medium mb-1">
                Are you sure you want to delete this student data?
              </p>
              <p className="text-sm text-muted-foreground">
                This action cannot be undone. All lesson plans associated with
                this student data will still exist, but you won't be able to
                generate new lessons from it.
              </p>
              <div className="mt-3 p-3 bg-muted rounded-lg border border-border">
                <p className="text-xs text-muted-foreground mb-1">Student Data:</p>
                <p className="text-sm font-medium text-foreground">
                  {studentData.originalFilename || "Untitled Student Data"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {totalStudents} students
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

export default StudentDataCard;

