import { useEffect, useState } from "react";
import { useAppDispatch } from "../hooks/useAppDispatch.js";
import { useAppSelector } from "../hooks/useAppSelector.js";
import { useNavigate } from "react-router-dom";
import CurriculumUploadForm from "../components/CurriculumUploadForm.jsx";
import CurriculumCard from "../components/CurriculumCard.jsx";
import Card from "../components/common/Card.jsx";
import Loader from "../components/common/Loader.jsx";
import PageTransition from "../components/common/PageTransition.jsx";
import { BookOpen, Upload, Plus } from "lucide-react";
import {
  fetchAllCurricula,
  deleteCurriculum,
} from "../store/curriculumThunks.js";
import EmptyState from "../components/common/EmptyState.jsx";
import Button from "../components/common/Button.jsx";
import Modal from "../components/common/Modal.jsx";
import { toast } from "react-hot-toast";

const UploadCurriculumPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { list: curricula, status } = useAppSelector(
    (state) => state.curriculum
  );

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchAllCurricula());
    }
  }, [dispatch, status]);

  const handleDelete = async (curriculumId) => {
    try {
      await dispatch(deleteCurriculum(curriculumId)).unwrap();
      toast.success("Curriculum deleted successfully");
    } catch (error) {
      toast.error(error || "Failed to delete curriculum");
      throw error;
    }
  };

  const handleUploadSuccess = (result) => {
    setIsUploadModalOpen(false);
    if (result && result.curriculum && result.curriculum._id) {
      navigate(`/curriculum/${result.curriculum._id}`);
    } else {
      // Fallback if we can't get the ID immediately, just refresh list
      dispatch(fetchAllCurricula());
    }
  };

  const isLoading = status === "loading";

  return (
    <PageTransition>
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="pb-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <span>Upload Curriculum</span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Upload your curriculum files (.pdf, .docx, or .txt). The system will
              extract text content for lesson generation.
            </p>
          </div>
          <Button
            onClick={() => setIsUploadModalOpen(true)}
            className="w-full sm:w-auto"
            icon={<Plus className="h-4 w-4" />}
          >
            Upload New Curriculum
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-6">
          {/* Curricula List */}
          <div>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader size="lg" />
              </div>
            ) : curricula.length === 0 ? (
              <Card className="border-l-4 border-l-muted">
                <EmptyState
                  message="No curriculum uploaded yet. Upload a file to get started."
                  icon={BookOpen}
                />
              </Card>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-foreground">
                    My Curricula ({curricula.length})
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {curricula.map((curriculum) => (
                    <CurriculumCard
                      key={curriculum._id}
                      curriculum={curriculum}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Upload Modal */}
        <Modal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          title="Upload New Curriculum"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg border border-primary/10 text-sm">
              <Upload className="h-4 w-4 text-primary shrink-0" />
              <span className="text-muted-foreground">
                Supported formats: PDF, DOCX, TXT
              </span>
            </div>
            <CurriculumUploadForm onSuccess={handleUploadSuccess} />
          </div>
        </Modal>
      </div>
    </PageTransition>
  );
};

export default UploadCurriculumPage;
