import { useEffect, useState } from "react";
import { useAppDispatch } from "../hooks/useAppDispatch.js";
import { useAppSelector } from "../hooks/useAppSelector.js";
import { useNavigate } from "react-router-dom";
import {
  fetchAllStudentData,
  deleteStudentData,
} from "../store/studentDataThunks.js";
import StudentUploadForm from "../components/StudentUploadForm.jsx";
import StudentDataCard from "../components/StudentDataCard.jsx";
import Card from "../components/common/Card.jsx";
import Loader from "../components/common/Loader.jsx";
import PageTransition from "../components/common/PageTransition.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import Button from "../components/common/Button.jsx";
import Modal from "../components/common/Modal.jsx";
import { toast } from "react-hot-toast";
import { Users, Upload, Plus } from "lucide-react";

const UploadStudentsPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { list: studentDataList, status } = useAppSelector(
    (state) => state.studentData
  );

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchAllStudentData());
    }
  }, [dispatch, status]);

  const handleDelete = async (studentDataId) => {
    try {
      await dispatch(deleteStudentData(studentDataId)).unwrap();
      toast.success("Student data deleted successfully");
    } catch (error) {
      toast.error(error || "Failed to delete student data");
      throw error;
    }
  };

  const handleUploadSuccess = (result) => {
    setIsUploadModalOpen(false);
    if (result && result.studentData && result.studentData._id) {
      navigate(`/students/${result.studentData._id}`);
    } else {
      // Fallback if we can't get the ID immediately, just refresh list
      dispatch(fetchAllStudentData());
    }
  };

  const isLoading = status === "loading";

  return (
    <PageTransition>
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="pb-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
              <div className="p-2 bg-success/10 rounded-lg">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-success" />
              </div>
              <span>Student Data</span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Manage your student data records.
            </p>
          </div>
          <Button
            onClick={() => setIsUploadModalOpen(true)}
            className="w-full sm:w-auto"
            icon={<Plus className="h-4 w-4" />}
          >
            Upload New Student Data
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-6">
          {/* Student Data List */}
          <div>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader size="lg" />
              </div>
            ) : studentDataList.length === 0 ? (
              <Card className="border-l-4 border-l-muted">
                <EmptyState
                  message="No student data uploaded yet. Upload a file to get started."
                  icon={Users}
                />
              </Card>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-foreground">
                    My Student Data ({studentDataList.length})
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {studentDataList.map((studentData) => (
                    <StudentDataCard
                      key={studentData._id}
                      studentData={studentData}
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
          title="Upload New Student Data"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-success/5 rounded-lg border border-success/10 text-sm">
              <Upload className="h-4 w-4 text-success shrink-0" />
              <span className="text-muted-foreground">
                Supported formats: CSV, PDF
              </span>
            </div>
            <StudentUploadForm onSuccess={handleUploadSuccess} />
          </div>
        </Modal>
      </div>
    </PageTransition>
  );
};

export default UploadStudentsPage;
