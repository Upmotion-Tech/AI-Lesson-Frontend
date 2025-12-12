import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppDispatch } from "../hooks/useAppDispatch.js";
import { useAppSelector } from "../hooks/useAppSelector.js";
import {
  fetchLessonPlan,
  updateLessonPlan,
  deleteLessonPlan,
} from "../store/lessonThunks.js";
import Card from "../components/common/Card.jsx";
import Button from "../components/common/Button.jsx";
import Modal from "../components/common/Modal.jsx";
import ErrorMessage from "../components/common/ErrorMessage.jsx";
import { CardSkeleton } from "../components/common/Skeleton.jsx";
import PageTransition from "../components/common/PageTransition.jsx";
import { toast } from "react-hot-toast";
import {
  ArrowLeft,
  Download,
  FileText,
  FileDown,
  Save,
  Edit2,
  X,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import apiClient from "../utils/apiClient.js";

const LessonViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    current: lessonPlan,
    status,
    error,
  } = useAppSelector((state) => state.lessons);

  const [activeTab, setActiveTab] = useState("base");
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchLessonPlan(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (lessonPlan) {
      setEditedData({
        objective: lessonPlan.objective || "",
        materials: lessonPlan.materials || [],
        instructionalSequence: lessonPlan.instructionalSequence || {
          presentation: "",
          modeling: "",
          guidedPractice: "",
          independentPractice: "",
        },
        formativeCheckpoints: lessonPlan.formativeCheckpoints || [],
        closingTask: lessonPlan.closingTask || "",
      });
    }
  }, [lessonPlan]);

  const handleExport = async (format, planType) => {
    try {
      const response = await apiClient.get(
        `/lessons/${id}/export/${format}?type=${planType}`,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `lesson-plan-${planType}-${id}.${format === "pdf" ? "pdf" : "docx"}`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success(`${format.toUpperCase()} exported successfully`);
    } catch (error) {
      toast.error(`Failed to export ${format.toUpperCase()}`);
    }
  };

  const handleSave = async () => {
    if (!editedData) return;

    try {
      let updates = {};
      if (activeTab === "base") {
        updates = editedData;
      } else {
        updates = {
          tierPlans: {
            ...lessonPlan.tierPlans,
            [activeTab]: editedData,
          },
        };
      }

      await dispatch(updateLessonPlan({ lessonId: id, updates }));
      setIsEditing(false);
      toast.success("Lesson plan updated successfully");
    } catch (error) {
      toast.error("Failed to update lesson plan");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (lessonPlan) {
      const currentPlan =
        activeTab === "base" ? lessonPlan : lessonPlan.tierPlans?.[activeTab];
      setEditedData({
        objective: currentPlan?.objective || "",
        materials: currentPlan?.materials || [],
        instructionalSequence: currentPlan?.instructionalSequence || {
          presentation: "",
          modeling: "",
          guidedPractice: "",
          independentPractice: "",
        },
        formativeCheckpoints: currentPlan?.formativeCheckpoints || [],
        closingTask: currentPlan?.closingTask || "",
      });
    }
  };

  const getCurrentPlan = () => {
    if (!lessonPlan) return null;
    if (activeTab === "base") {
      return lessonPlan;
    }
    return lessonPlan.tierPlans?.[activeTab];
  };

  const currentPlan = getCurrentPlan();

  const handleDeleteClick = () => {
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await dispatch(deleteLessonPlan(id)).unwrap();
      toast.success("Lesson plan deleted successfully");
      navigate("/lessons");
    } catch (error) {
      toast.error(error || "Failed to delete lesson plan");
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
                Lesson Plan
              </h1>
            </div>
          </div>
          <CardSkeleton count={1} />
        </div>
      </PageTransition>
    );
  }

  if (error || !lessonPlan) {
    return (
      <div className="space-y-4">
        <ErrorMessage message={error || "Lesson plan not found"} />
        <Button onClick={() => navigate("/lessons")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Lesson Plans
        </Button>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/lessons")}
              className="p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                Lesson Plan
              </h1>
              {lessonPlan.standard?.code && (
                <p className="text-sm text-muted-foreground mt-1">
                  {lessonPlan.standard.code}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => handleExport("pdf", activeTab)}
              className="flex items-center gap-2"
            >
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                PDF
              </div>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleExport("word", activeTab)}
              className="flex items-center gap-2"
            >
              <div className="flex items-center gap-2">
                <FileDown className="h-4 w-4" />
                Word
              </div>
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteClick}
              className="flex items-center gap-2"
            >
              <div className="flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                Delete
              </div>
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <div className="flex gap-2 overflow-x-auto">
            {[
              { id: "base", label: "Base Plan" },
              { id: "tier1", label: "Tier 1" },
              { id: "tier2", label: "Tier 2" },
              { id: "tier3", label: "Tier 3" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsEditing(false);
                }}
                className={`px-4 py-2 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-primary text-primary font-medium"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Lesson Plan Content */}
        {currentPlan && (
          <Card>
            <div className="space-y-6">
              {/* Edit/Save Controls */}
              <div className="flex justify-end gap-2">
                {!isEditing ? (
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <Edit2 className="h-4 w-4" />
                      Edit
                    </div>
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      className="flex items-center gap-2"
                    >
                      <div className="flex items-center gap-2">
                        <X className="h-4 w-4" />
                        Cancel
                      </div>
                    </Button>
                    <Button
                      onClick={handleSave}
                      className="flex items-center gap-2"
                    >
                      <div className="flex items-center gap-2">
                        <Save className="h-4 w-4" />
                        Save
                      </div>
                    </Button>
                  </>
                )}
              </div>

              {/* Objective */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Lesson Objective</h3>
                {isEditing ? (
                  <textarea
                    value={editedData?.objective || ""}
                    onChange={(e) =>
                      setEditedData({
                        ...editedData,
                        objective: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-border rounded-lg bg-background text-foreground min-h-[100px]"
                  />
                ) : (
                  <p className="text-card-foreground">
                    {currentPlan.objective || "N/A"}
                  </p>
                )}
              </div>

              {/* Materials */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Materials</h3>
                {isEditing ? (
                  <div className="space-y-2">
                    {(editedData?.materials || []).map((material, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={material}
                          onChange={(e) => {
                            const newMaterials = [...editedData.materials];
                            newMaterials[index] = e.target.value;
                            setEditedData({
                              ...editedData,
                              materials: newMaterials,
                            });
                          }}
                          className="flex-1 p-2 border border-border rounded-lg bg-background text-foreground"
                        />
                        <Button
                          variant="outline"
                          onClick={() => {
                            const newMaterials = editedData.materials.filter(
                              (_, i) => i !== index
                            );
                            setEditedData({
                              ...editedData,
                              materials: newMaterials,
                            });
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditedData({
                          ...editedData,
                          materials: [...(editedData.materials || []), ""],
                        });
                      }}
                    >
                      Add Material
                    </Button>
                  </div>
                ) : (
                  <ul className="list-disc list-inside space-y-1 text-card-foreground">
                    {currentPlan.materials?.length > 0 ? (
                      currentPlan.materials.map((material, index) => (
                        <li key={index}>{material}</li>
                      ))
                    ) : (
                      <li>No materials listed</li>
                    )}
                  </ul>
                )}
              </div>

              {/* Instructional Sequence */}
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Instructional Sequence
                </h3>
                <div className="space-y-4">
                  {[
                    { key: "presentation", label: "Presentation" },
                    { key: "modeling", label: "Modeling" },
                    { key: "guidedPractice", label: "Guided Practice" },
                    {
                      key: "independentPractice",
                      label: "Independent Practice",
                    },
                  ].map((section) => (
                    <div key={section.key}>
                      <h4 className="font-medium mb-1">{section.label}</h4>
                      {isEditing ? (
                        <textarea
                          value={
                            editedData?.instructionalSequence?.[section.key] ||
                            ""
                          }
                          onChange={(e) =>
                            setEditedData({
                              ...editedData,
                              instructionalSequence: {
                                ...editedData.instructionalSequence,
                                [section.key]: e.target.value,
                              },
                            })
                          }
                          className="w-full p-3 border border-border rounded-lg bg-background text-foreground min-h-[80px]"
                        />
                      ) : (
                        <p className="text-card-foreground">
                          {currentPlan.instructionalSequence?.[section.key] ||
                            "N/A"}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Formative Checkpoints */}
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Formative Checkpoints
                </h3>
                {isEditing ? (
                  <div className="space-y-2">
                    {(editedData?.formativeCheckpoints || []).map(
                      (checkpoint, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={checkpoint}
                            onChange={(e) => {
                              const newCheckpoints = [
                                ...editedData.formativeCheckpoints,
                              ];
                              newCheckpoints[index] = e.target.value;
                              setEditedData({
                                ...editedData,
                                formativeCheckpoints: newCheckpoints,
                              });
                            }}
                            className="flex-1 p-2 border border-border rounded-lg bg-background text-foreground"
                          />
                          <Button
                            variant="outline"
                            onClick={() => {
                              const newCheckpoints =
                                editedData.formativeCheckpoints.filter(
                                  (_, i) => i !== index
                                );
                              setEditedData({
                                ...editedData,
                                formativeCheckpoints: newCheckpoints,
                              });
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      )
                    )}
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditedData({
                          ...editedData,
                          formativeCheckpoints: [
                            ...(editedData.formativeCheckpoints || []),
                            "",
                          ],
                        });
                      }}
                    >
                      Add Checkpoint
                    </Button>
                  </div>
                ) : (
                  <ul className="list-disc list-inside space-y-1 text-card-foreground">
                    {currentPlan.formativeCheckpoints?.length > 0 ? (
                      currentPlan.formativeCheckpoints.map(
                        (checkpoint, index) => <li key={index}>{checkpoint}</li>
                      )
                    ) : (
                      <li>No checkpoints listed</li>
                    )}
                  </ul>
                )}
              </div>

              {/* Closing Task */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Closing Task</h3>
                {isEditing ? (
                  <textarea
                    value={editedData?.closingTask || ""}
                    onChange={(e) =>
                      setEditedData({
                        ...editedData,
                        closingTask: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-border rounded-lg bg-background text-foreground min-h-[100px]"
                  />
                ) : (
                  <p className="text-card-foreground">
                    {currentPlan.closingTask || "N/A"}
                  </p>
                )}
              </div>
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
                  This action cannot be undone. The lesson plan and all its tier
                  plans will be permanently deleted.
                </p>
                {lessonPlan && (
                  <div className="mt-3 p-3 bg-muted rounded-lg border border-border">
                    <p className="text-xs text-muted-foreground mb-1">
                      Lesson Plan:
                    </p>
                    <p className="text-sm font-medium text-foreground line-clamp-2">
                      {lessonPlan.objective || "Untitled Lesson Plan"}
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

export default LessonViewPage;
