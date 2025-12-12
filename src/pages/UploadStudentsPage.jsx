import { useEffect } from "react";
import { useAppDispatch } from "../hooks/useAppDispatch.js";
import { useAppSelector } from "../hooks/useAppSelector.js";
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
import { toast } from "react-hot-toast";
import { Users, Upload } from "lucide-react";

const UploadStudentsPage = () => {
  const dispatch = useAppDispatch();
  const { list: studentDataList, status } = useAppSelector(
    (state) => state.studentData
  );

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

  const isLoading = status === "loading";

  return (
    <PageTransition>
      <div className="space-y-4 sm:space-y-6">
        <div className="pb-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
            <div className="p-2 bg-success/10 rounded-lg">
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-success" />
            </div>
            <span>Upload Student Data</span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Upload student data files (.csv or .pdf). The system will parse
            student names and scores, then assign performance tiers
            automatically.
          </p>
        </div>

        {/* Upload Form */}
        <Card
          title="Upload New Student Data"
          className="border-l-4 border-l-success lg:col-span-1"
        >
          <div className="flex items-center gap-2 mb-4 p-2 bg-success/5 rounded-lg border border-success/10">
            <Upload className="h-5 w-5 text-success" />
            <span className="text-sm text-muted-foreground">
              Supported formats: CSV, PDF
            </span>
          </div>
          <StudentUploadForm />
        </Card>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Student Data List */}
          <div className="lg:col-span-2">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </div>
    </PageTransition>
  );
};

export default UploadStudentsPage;
