import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppDispatch } from "../hooks/useAppDispatch.js";
import { useAppSelector } from "../hooks/useAppSelector.js";
import { fetchLatestCurriculum } from "../store/curriculumThunks.js";
import { fetchLatestStudentData } from "../store/studentDataThunks.js";
import Card from "../components/common/Card.jsx";
import Button from "../components/common/Button.jsx";
import { CardSkeleton } from "../components/common/Skeleton.jsx";
import Badge from "../components/common/Badge.jsx";
import PageTransition from "../components/common/PageTransition.jsx";
import { formatDateShort } from "../utils/formatters.js";
import { BookOpen, Users, Sparkles, TrendingUp, FileText } from "lucide-react";

const DashboardPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
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
      <PageTransition>
        <div className="space-y-4 sm:space-y-6">
          <div className="pb-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Dashboard
            </h1>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <CardSkeleton count={3} />
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-4 sm:space-y-6">
      <div className="pb-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          Dashboard
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Overview of your curriculum and student data
        </p>
      </div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
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
        {/* Curriculum Card */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0 },
          }}
        >
          <Card className="border-l-4 border-l-primary">
          <div className="space-y-4 flex flex-col justify-between h-full gap-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-card-foreground">
                  Curriculum
                </h3>
              </div>

              {curriculum ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    <span>
                      Last uploaded: {formatDateShort(curriculum.createdAt)}
                    </span>
                  </div>
                  <div className="p-2 bg-success/10 rounded-lg border border-success/20">
                    <p className="text-xs text-muted-foreground">
                      Content Size
                    </p>
                    <p className="text-sm font-semibold text-success">
                      {curriculum.rawText
                        ? `${(curriculum.rawText.length / 1000).toFixed(
                            1
                          )}K characters`
                        : "No text content"}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    No curriculum uploaded yet
                  </p>
                </div>
              )}
            </div>
            <Button
              variant="primary"
              onClick={() => navigate("/upload-curriculum")}
              className="w-full"
              size="sm"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Upload Curriculum
            </Button>
          </div>
        </Card>
        </motion.div>

        {/* Student Data Card */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0 },
          }}
        >
          <Card className="border-l-4 border-l-success">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-success" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-card-foreground">
                Student Data
              </h3>
            </div>
            {studentData ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  <span>
                    Last uploaded: {formatDateShort(studentData.createdAt)}
                  </span>
                </div>
                <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="text-xs text-muted-foreground">
                    Total Students
                  </p>
                  <p className="text-lg font-bold text-primary">
                    {studentData.students?.length || 0}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="success" className="text-xs">
                    Tier 1: {tierDist.tier1}
                  </Badge>
                  <Badge variant="warning" className="text-xs">
                    Tier 2: {tierDist.tier2}
                  </Badge>
                  <Badge variant="danger" className="text-xs">
                    Tier 3: {tierDist.tier3}
                  </Badge>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  No student data uploaded yet
                </p>
              </div>
            )}
            <Button
              variant="primary"
              onClick={() => navigate("/upload-students")}
              className="w-full"
              size="sm"
            >
              <Users className="h-4 w-4 mr-2" />
              Upload Student Data
            </Button>
          </div>
        </Card>
        </motion.div>

        {/* Lesson Generation Card */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0 },
          }}
          className="sm:col-span-2 lg:col-span-1"
        >
          <Card className="border-l-4 border-l-primary">
          <div className="space-y-4 flex flex-col justify-between h-full gap-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-card-foreground">
                  Lesson Generation
                </h3>
              </div>
              <div className="p-3 bg-muted rounded-lg border border-border">
                <p className="text-sm text-card-foreground">
                  Generate personalized lesson plans based on your curriculum
                  and student data.
                </p>
              </div>
            </div>
            <Button
              variant="primary"
              onClick={() => navigate("/generate-lesson")}
              className="w-full"
              size="sm"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Go to Generate Lesson
            </Button>
          </div>
        </Card>
        </motion.div>
      </motion.div>
      </div>
    </PageTransition>
  );
};

export default DashboardPage;
