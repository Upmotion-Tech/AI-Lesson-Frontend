import { useEffect } from "react";
import { useAppDispatch } from "../hooks/useAppDispatch.js";
import { useAppSelector } from "../hooks/useAppSelector.js";
import { fetchLatestStudentData } from "../store/studentDataThunks.js";
import StudentUploadForm from "../components/StudentUploadForm.jsx";
import StudentPreviewTable from "../components/StudentPreviewTable.jsx";
import Card from "../components/common/Card.jsx";
import Loader from "../components/common/Loader.jsx";
import Badge from "../components/common/Badge.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import { Users, Upload, TrendingUp } from "lucide-react";

const UploadStudentsPage = () => {
  const dispatch = useAppDispatch();
  const { latest, status } = useAppSelector((state) => state.studentData);

  useEffect(() => {
    if (status === "idle" && !latest) {
      dispatch(fetchLatestStudentData());
    }
  }, [dispatch, status, latest]);

  const isLoading = status === "loading";

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

  const tierDist = getTierDistribution(latest?.students);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="pb-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
          <div className="p-2 bg-success/10 rounded-lg">
            <Users className="h-6 w-6 sm:h-8 sm:w-8 text-success" />
          </div>
          <span>Upload Student Data</span>
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Upload student data file (.csv or .pdf). The system will parse student
          names and scores, then assign performance tiers automatically.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card 
          title="Upload New Student Data" 
          className="border-l-4 border-l-success"
        >
          <div className="flex items-center gap-2 mb-4 p-2 bg-success/5 rounded-lg border border-success/10">
            <Upload className="h-5 w-5 text-success" />
            <span className="text-sm text-muted-foreground">
              Supported formats: CSV, PDF
            </span>
          </div>
          <StudentUploadForm />
        </Card>

        {latest && (
          <Card title="Summary" className="border-l-4 border-l-primary">
            <div className="space-y-4">
              <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-xs text-muted-foreground mb-1">Total Students</p>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <p className="text-2xl font-bold text-primary">
                    {latest.students?.length || 0}
                  </p>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium text-card-foreground">
                    Tier Distribution
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-success/10 rounded-lg border border-success/20">
                    <span className="text-sm text-card-foreground font-medium">Tier 1 (≥70)</span>
                    <Badge variant="success">{tierDist.tier1}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-warning/10 rounded-lg border border-warning/20">
                    <span className="text-sm text-card-foreground font-medium">Tier 2 (55-69)</span>
                    <Badge variant="warning">{tierDist.tier2}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-danger/10 rounded-lg border border-danger/20">
                    <span className="text-sm text-card-foreground font-medium">Tier 3 (&lt;55)</span>
                    <Badge variant="danger">{tierDist.tier3}</Badge>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader size="lg" />
        </div>
      ) : latest ? (
        <StudentPreviewTable students={latest.students} />
      ) : (
        <Card className="border-l-4 border-l-muted">
          <EmptyState
            message="No student data uploaded yet. Upload a file to get started."
            icon={Users}
          />
        </Card>
      )}
    </div>
  );
};

export default UploadStudentsPage;
