import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppDispatch } from "../hooks/useAppDispatch.js";
import { useAppSelector } from "../hooks/useAppSelector.js";
import { fetchAllCurricula } from "../store/curriculumThunks.js";
import { fetchAllStudentData } from "../store/studentDataThunks.js";
import { fetchAllLessonPlans } from "../store/lessonThunks.js";
import Card from "../components/common/Card.jsx";
import Button from "../components/common/Button.jsx";
import { CardSkeleton } from "../components/common/Skeleton.jsx";
import Badge from "../components/common/Badge.jsx";
import PageTransition from "../components/common/PageTransition.jsx";
import TierDistributionChart from "../components/analytics/TierDistributionChart.jsx";
import LessonPlansChart from "../components/analytics/LessonPlansChart.jsx";
import ResourceCountChart from "../components/analytics/ResourceCountChart.jsx";
import { formatDateShort } from "../utils/formatters.js";
import {
  BookOpen,
  Users,
  Sparkles,
  TrendingUp,
  FileText,
  BarChart3,
  Activity,
} from "lucide-react";

const DashboardPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { list: curricula, status: curriculumStatus } = useAppSelector(
    (state) => state.curriculum
  );
  const { list: studentDataList, status: studentDataStatus } = useAppSelector(
    (state) => state.studentData
  );
  const { list: lessons, status: lessonsStatus } = useAppSelector(
    (state) => state.lessons
  );

  useEffect(() => {
    dispatch(fetchAllCurricula());
    dispatch(fetchAllStudentData());
    dispatch(fetchAllLessonPlans());
  }, [dispatch]);

  const isLoading =
    curriculumStatus === "loading" ||
    studentDataStatus === "loading" ||
    lessonsStatus === "loading";

  const latestCurriculum = curricula[0];
  const latestStudentData = studentDataList[0];

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

  // Aggregate tier distribution across all student data
  const aggregateTierDist = studentDataList.reduce(
    (acc, studentData) => {
      const dist = getTierDistribution(studentData.students);
      acc.tier1 += dist.tier1;
      acc.tier2 += dist.tier2;
      acc.tier3 += dist.tier3;
      return acc;
    },
    { tier1: 0, tier2: 0, tier3: 0 }
  );

  const tierDist = getTierDistribution(latestStudentData?.students);

  // Calculate total students across all records
  const totalStudents = studentDataList.reduce(
    (sum, sd) => sum + (sd.students?.length || 0),
    0
  );

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
          {/* <motion.div
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

                  {latestCurriculum ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FileText className="h-4 w-4" />
                        <span>
                          Last uploaded:{" "}
                          {formatDateShort(latestCurriculum.createdAt)}
                        </span>
                      </div>
                      <div className="p-2 bg-success/10 rounded-lg border border-success/20">
                        <p className="text-xs text-muted-foreground">
                          Total Curricula
                        </p>
                        <p className="text-lg font-bold text-success">
                          {curricula.length}
                        </p>
                      </div>
                      <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
                        <p className="text-xs text-muted-foreground">
                          Content Size
                        </p>
                        <p className="text-sm font-semibold text-primary">
                          {latestCurriculum.rawText
                            ? `${(
                                latestCurriculum.rawText.length / 1000
                              ).toFixed(1)}K characters`
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
                  size="sm "
                >
                  <div className="flex items-center justify-center gap-2">
                    <div className="flex items-center justify-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      <span>Upload Curriculum</span>
                    </div>
                  </div>
                </Button>
              </div>
            </Card>
          </motion.div> */}

          {/* Student Data Card */}
          {/* <motion.div
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
                {latestStudentData ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <TrendingUp className="h-4 w-4" />
                      <span>
                        Last uploaded:{" "}
                        {formatDateShort(latestStudentData.createdAt)}
                      </span>
                    </div>
                    <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
                      <p className="text-xs text-muted-foreground">
                        Total Records
                      </p>
                      <p className="text-lg font-bold text-primary">
                        {studentDataList.length}
                      </p>
                    </div>
                    <div className="p-2 bg-success/10 rounded-lg border border-success/20">
                      <p className="text-xs text-muted-foreground">
                        Total Students
                      </p>
                      <p className="text-lg font-bold text-success">
                        {totalStudents}
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
                  <div className="flex items-center justify-center gap-2">
                    <Users className="h-4 w-4 mr-2" />
                    Upload Student Data
                  </div>
                </Button>
              </div>
            </Card>
          </motion.div> */}

          {/* Lesson Generation Card */}
          {/* <motion.div
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
                      Generate personalized lesson plans based on your
                      curriculum and student data.
                    </p>
                  </div>
                </div>
                <Button
                  variant="primary"
                  onClick={() => navigate("/generate-lesson")}
                  className="w-full"
                  size="sm"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Go to Generate Lesson
                  </div>
                </Button>
              </div>
            </Card>
          </motion.div> */}
        </motion.div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-primary">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Curricula</p>
                <p className="text-2xl font-bold text-primary">
                  {curricula.length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="border-l-4 border-l-success">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <Users className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold text-success">
                  {totalStudents}
                </p>
              </div>
            </div>
          </Card>

          <Card className="border-l-4 border-l-warning">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning/10 rounded-lg">
                <Sparkles className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Lesson Plans</p>
                <p className="text-2xl font-bold text-warning">
                  {lessons.length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="border-l-4 border-l-primary">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Activity className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Student Records</p>
                <p className="text-2xl font-bold text-primary">
                  {studentDataList.length}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Analytics Section */}
        <div className="space-y-4 sm:space-y-6">
          {/* <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Analytics</h2>
          </div> */}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Resource Count Chart */}
            <Card
              title="Resource Overview"
              className="border-l-4 border-l-primary"
            >
              <ResourceCountChart
                curricula={curricula}
                studentData={studentDataList}
                lessons={lessons}
              />
            </Card>

            {/* Tier Distribution Chart */}
            <Card
              title="Tier Distribution"
              className="border-l-4 border-l-success"
            >
              <TierDistributionChart data={aggregateTierDist} />
            </Card>
          </div>

          {/* Lesson Plans Over Time */}
          {lessons.length > 0 && (
            <Card
              title="Lesson Plans Generated Over Time"
              className="border-l-4 border-l-primary"
            >
              <LessonPlansChart lessons={lessons} />
            </Card>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default DashboardPage;
