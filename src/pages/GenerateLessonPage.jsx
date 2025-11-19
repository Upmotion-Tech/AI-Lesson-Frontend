import { useEffect } from "react";
import { useAppDispatch } from "../hooks/useAppDispatch.js";
import { useAppSelector } from "../hooks/useAppSelector.js";
import { fetchLatestCurriculum } from "../store/curriculumThunks.js";
import { fetchLatestStudentData } from "../store/studentDataThunks.js";
import LessonGeneratePlaceholder from "../components/LessonGeneratePlaceholder.jsx";
import Card from "../components/common/Card.jsx";
import Loader from "../components/common/Loader.jsx";
import Badge from "../components/common/Badge.jsx";
import { formatDateShort, truncateText } from "../utils/formatters.js";
import { Sparkles, BookOpen, Users, TrendingUp } from "lucide-react";

const GenerateLessonPage = () => {
  const dispatch = useAppDispatch();
  const { latest: curriculum, status: curriculumStatus } = useAppSelector(
    (state) => state.curriculum
  );
  const { latest: studentData, status: studentDataStatus } = useAppSelector(
    (state) => state.studentData
  );

  useEffect(() => {
    dispatch(fetchLatestCurriculum());
    dispatch(fetchLatestStudentData());
  }, [dispatch]);

  const isLoading =
    curriculumStatus === "loading" || studentDataStatus === "loading";

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="pb-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
          </div>
          <span>Generate Lesson Plan</span>
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Generate personalized lesson plans based on your curriculum and
          student performance data.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Curriculum Summary */}
        <Card title="Curriculum Summary" className="border-l-4 border-l-primary">
          {curriculum ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-2 bg-primary/10 rounded-lg border border-primary/20">
                <BookOpen className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Uploaded on</p>
                  <p className="text-sm font-medium text-card-foreground">
                    {formatDateShort(curriculum.createdAt)}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-card-foreground mb-2">Preview</p>
                <div className="bg-muted p-3 rounded-lg border border-border max-h-48 overflow-y-auto">
                  <p className="text-sm text-card-foreground">
                    {truncateText(curriculum.rawText, 300)}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-muted rounded-lg text-center">
              <p className="text-muted-foreground">No curriculum uploaded yet</p>
            </div>
          )}
        </Card>

        {/* Student Data Summary */}
        <Card title="Student Data Summary" className="border-l-4 border-l-success">
          {studentData ? (
            <div className="space-y-4">
              <div className="p-3 bg-success/10 rounded-lg border border-success/20">
                <p className="text-xs text-muted-foreground mb-1">Total Students</p>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-success" />
                  <p className="text-2xl font-bold text-success">
                    {studentData.students?.length || 0}
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
          ) : (
            <div className="p-4 bg-muted rounded-lg text-center">
              <p className="text-muted-foreground">No student data uploaded yet</p>
            </div>
          )}
        </Card>
      </div>

      <Card title="Generate Lesson Plan" className="border-l-4 border-l-primary">
        <LessonGeneratePlaceholder />
      </Card>
    </div>
  );
};

export default GenerateLessonPage;
