import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAppDispatch } from "../hooks/useAppDispatch.js";
import { useAppSelector } from "../hooks/useAppSelector.js";
import { fetchAllLessonPlans, deleteLessonPlan, updateLessonPlan } from "../store/lessonThunks.js";
import Card from "../components/common/Card.jsx";
import Button from "../components/common/Button.jsx";
import Badge from "../components/common/Badge.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import Modal from "../components/common/Modal.jsx";
import { LessonPlanCardSkeleton } from "../components/common/Skeleton.jsx";
import PageTransition from "../components/common/PageTransition.jsx";
import { formatDateShort, truncateText } from "../utils/formatters.js";
import {
  FileText,
  Calendar,
  BookOpen,
  Users,
  ArrowRight,
  Sparkles,
  Search,
  Trash2,
  AlertTriangle,
  Pencil,
  Check,
  X,
} from "lucide-react";

const LessonPlansPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { list: lessonPlans, status } = useAppSelector((state) => state.lessons);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingTitleId, setEditingTitleId] = useState(null);
  const [editingTitleValue, setEditingTitleValue] = useState("");
  const [savingTitleId, setSavingTitleId] = useState(null);

  useEffect(() => {
    dispatch(fetchAllLessonPlans());
  }, [dispatch]);

  const filteredPlans = lessonPlans.filter((plan) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      plan.title?.toLowerCase().includes(query) ||
      plan.objective?.toLowerCase().includes(query) ||
      plan.standard?.code?.toLowerCase().includes(query) ||
      plan.standard?.description?.toLowerCase().includes(query)
    );
  });

  const handleDeleteClick = (e, plan) => {
    e.stopPropagation(); // Prevent card navigation
    setLessonToDelete(plan);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!lessonToDelete) return;

    setIsDeleting(true);
    try {
      await dispatch(deleteLessonPlan(lessonToDelete._id)).unwrap();
      toast.success("Lesson plan deleted successfully");
      setDeleteModalOpen(false);
      setLessonToDelete(null);
    } catch (error) {
      toast.error(error || "Failed to delete lesson plan");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setLessonToDelete(null);
  };

  const handleTitleEditStart = (e, plan) => {
    e.stopPropagation();
    setEditingTitleId(plan._id);
    setEditingTitleValue(plan.title || plan.objective || "");
  };

  const handleTitleSave = async (e, planId) => {
    e.stopPropagation();
    const newTitle = editingTitleValue.trim();
    setSavingTitleId(planId);
    try {
      await dispatch(updateLessonPlan({ lessonId: planId, updates: { title: newTitle } })).unwrap();
      toast.success("Title updated");
    } catch (err) {
      toast.error(err || "Failed to update title");
    } finally {
      setSavingTitleId(null);
      setEditingTitleId(null);
      setEditingTitleValue("");
    }
  };

  const handleTitleCancel = (e) => {
    if (e) e.stopPropagation();
    setEditingTitleId(null);
    setEditingTitleValue("");
  };

  if (status === "loading" && lessonPlans.length === 0) {
    return (
      <PageTransition>
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                </div>
                <span>My Lesson Plans</span>
              </h1>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <LessonPlanCardSkeleton count={6} />
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            </div>
            <span>My Lesson Plans</span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            View and manage all your generated lesson plans
          </p>
        </div>
        <Button
          onClick={() => navigate("/generate-lesson")}
          icon={<Sparkles className="h-4 w-4" />}
        >
          Generate New
        </Button>
      </div>

      {/* Search Bar */}
      {lessonPlans.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by objective or standard..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      )}

      {/* Lesson Plans Grid */}
      {filteredPlans.length === 0 && lessonPlans.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No Lesson Plans Yet"
          description="Generate your first lesson plan to get started"
          actionLabel="Generate Lesson Plan"
          onAction={() => navigate("/generate-lesson")}
        />
      ) : filteredPlans.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No lesson plans match your search query.
            </p>
          </div>
        </Card>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {filteredPlans.map((plan, index) => (
            <motion.div
              key={plan._id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.3 }}
            >
              <Card
                className="border-l-4 border-l-primary group relative"
                clickable
                onClick={() => { if (editingTitleId !== plan._id) navigate(`/lessons/${plan._id}`); }}
              >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    {editingTitleId === plan._id ? (
                      <div
                        className="flex items-center gap-1 mb-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          autoFocus
                          value={editingTitleValue}
                          onChange={(e) => setEditingTitleValue(e.target.value)}
                          onKeyDown={(e) => {
                            e.stopPropagation();
                            if (e.key === "Enter") handleTitleSave(e, plan._id);
                            if (e.key === "Escape") handleTitleCancel(e);
                          }}
                          onBlur={() => handleTitleCancel()}
                          className="flex-1 min-w-0 text-sm font-semibold border border-primary rounded px-2 py-1 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <button
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={(e) => handleTitleSave(e, plan._id)}
                          disabled={savingTitleId === plan._id}
                          className="p-1 rounded hover:bg-success/10 text-success transition-colors shrink-0"
                          title="Save title"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={handleTitleCancel}
                          className="p-1 rounded hover:bg-danger/10 text-muted-foreground hover:text-danger transition-colors shrink-0"
                          title="Cancel"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-start gap-1 group/title mb-1">
                        <h3 className="text-lg font-semibold text-card-foreground line-clamp-2 group-hover:text-primary transition-colors">
                          {plan.title || plan.objective || "Untitled Lesson Plan"}
                        </h3>
                        <button
                          onClick={(e) => handleTitleEditStart(e, plan)}
                          className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover/title:opacity-100 shrink-0 mt-0.5"
                          title="Edit title"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                    {plan.curriculumId?.gradeLevelEstimate && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Grade: <span className="font-medium text-foreground">{plan.curriculumId.gradeLevelEstimate}</span>
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge
                      variant={plan.status === "PUBLISHED" ? "success" : "warning"}
                      className="shrink-0"
                    >
                      {plan.status || "DRAFT"}
                    </Badge>
                    <button
                      onClick={(e) => handleDeleteClick(e, plan)}
                      className="p-1.5 rounded-lg hover:bg-danger/10 text-muted-foreground hover:text-danger transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete lesson plan"
                      aria-label="Delete lesson plan"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Standard Info */}
                {plan.standard?.description && (
                  <div className="p-2 bg-muted rounded-lg border border-border">
                    <p className="text-xs text-muted-foreground mb-1">
                      Aligned Standard
                    </p>
                    <p className="text-sm text-card-foreground line-clamp-2">
                      {truncateText(plan.standard.description, 100)}
                    </p>
                  </div>
                )}

                {/* Metadata */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {formatDateShort(plan.createdAt || new Date())}
                    </span>
                  </div>

                  {plan.curriculumId && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <BookOpen className="h-4 w-4" />
                      <span className="line-clamp-1">
                        Curriculum:{" "}
                        {plan.curriculumId.extractedObjectives?.length > 0
                          ? `${plan.curriculumId.extractedObjectives.length} objectives`
                          : "Available"}
                      </span>
                    </div>
                  )}

                  {plan.studentDataId && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>
                        {plan.studentDataId.students?.length || 0} students
                      </span>
                    </div>
                  )}
                </div>

                {/* Tier Plans Indicator */}
                <div className="flex items-center gap-2 pt-2 border-t border-border">
                  <div className="flex gap-1">
                    {[1, 2, 3].map((tier) => (
                      <div
                        key={tier}
                        className={`w-2 h-2 rounded-full ${
                          plan.tierPlans?.[`tier${tier}`]?.objective
                            ? "bg-success"
                            : "bg-muted"
                        }`}
                        title={`Tier ${tier} ${plan.tierPlans?.[`tier${tier}`]?.objective ? "Available" : "Not Available"}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground flex-1">
                    Tier plans available
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Stats */}
      {lessonPlans.length > 0 && (
        <Card className="bg-muted/50">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Total Lesson Plans: <strong className="text-foreground">{lessonPlans.length}</strong>
            </span>
            {searchQuery && (
              <span className="text-muted-foreground">
                Showing: <strong className="text-foreground">{filteredPlans.length}</strong> results
              </span>
            )}
          </div>
        </Card>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={handleCancelDelete}
        title="Delete Lesson Plan"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-danger/10 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-danger" />
            </div>
            <div className="flex-1">
              <p className="text-foreground font-medium mb-1">
                Are you sure you want to delete this lesson plan?
              </p>
              <p className="text-sm text-muted-foreground">
                This action cannot be undone. The lesson plan and all its tier plans will be permanently deleted.
              </p>
              {lessonToDelete && (
                <div className="mt-3 p-3 bg-muted rounded-lg border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Lesson Plan:</p>
                  <p className="text-sm font-medium text-foreground line-clamp-2">
                    {lessonToDelete.title || lessonToDelete.objective || "Untitled Lesson Plan"}
                  </p>
                </div>
              )}
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
      </div>
    </PageTransition>
  );
};

export default LessonPlansPage;

