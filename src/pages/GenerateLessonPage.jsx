import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAppDispatch } from "../hooks/useAppDispatch.js";
import { useAppSelector } from "../hooks/useAppSelector.js";
import { fetchAllCurricula } from "../store/curriculumThunks.js";
import { fetchAllStudentData } from "../store/studentDataThunks.js";
import LessonGeneratePlaceholder from "../components/LessonGeneratePlaceholder.jsx";
import Card from "../components/common/Card.jsx";
import Select from "../components/common/Select.jsx";
import { CardSkeleton } from "../components/common/Skeleton.jsx";
import Badge from "../components/common/Badge.jsx";
import PageTransition from "../components/common/PageTransition.jsx";
import { formatDateShort, truncateText } from "../utils/formatters.js";
import { Sparkles, BookOpen, Users, TrendingUp } from "lucide-react";

const GenerateLessonPage = () => {
  const dispatch = useAppDispatch();
  const { list: curricula, status: curriculumStatus } = useAppSelector(
    (state) => state.curriculum
  );
  const { list: studentDataList, status: studentDataStatus } = useAppSelector(
    (state) => state.studentData
  );

  const [selectedCurriculumId, setSelectedCurriculumId] = useState("");
  const [selectedStudentDataId, setSelectedStudentDataId] = useState("");

  useEffect(() => {
    dispatch(fetchAllCurricula());
    dispatch(fetchAllStudentData());
  }, [dispatch]);

  // Set default selections when data loads
  useEffect(() => {
    if (curricula.length > 0 && !selectedCurriculumId) {
      setSelectedCurriculumId(curricula[0]._id);
    }
  }, [curricula, selectedCurriculumId]);

  useEffect(() => {
    if (studentDataList.length > 0 && !selectedStudentDataId) {
      setSelectedStudentDataId(studentDataList[0]._id);
    }
  }, [studentDataList, selectedStudentDataId]);

  const isLoading =
    curriculumStatus === "loading" || studentDataStatus === "loading";

  const selectedCurriculum = curricula.find((c) => c._id === selectedCurriculumId);
  const selectedStudentData = studentDataList.find(
    (s) => s._id === selectedStudentDataId
  );

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

  const tierDist = getTierDistribution(selectedStudentData?.students);

  const curriculumOptions = curricula.map((c) => ({
    value: c._id,
    label: c.originalFilename || `Curriculum - ${formatDateShort(c.createdAt)}`,
  }));

  const studentDataOptions = studentDataList.map((s) => ({
    value: s._id,
    label: s.originalFilename || `Student Data - ${formatDateShort(s.createdAt)} (${s.students?.length || 0} students)`,
  }));

  if (isLoading) {
    return (
      <PageTransition>
        <div className="space-y-4 sm:space-y-6">
          <div className="pb-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <span>Generate Lesson Plan</span>
            </h1>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <CardSkeleton count={2} />
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
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

      {/* Selection Section */}
      <Card title="Select Resources" className="border-l-4 border-l-primary">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Select Curriculum"
            value={selectedCurriculumId}
            onChange={(e) => setSelectedCurriculumId(e.target.value)}
            options={curriculumOptions}
            required
            disabled={isLoading || curricula.length === 0}
          />
          <Select
            label="Select Student Data"
            value={selectedStudentDataId}
            onChange={(e) => setSelectedStudentDataId(e.target.value)}
            options={studentDataOptions}
            required
            disabled={isLoading || studentDataList.length === 0}
          />
        </div>
        {curricula.length === 0 && (
          <p className="mt-2 text-sm text-muted-foreground">
            No curricula available. Please upload a curriculum first.
          </p>
        )}
        {studentDataList.length === 0 && (
          <p className="mt-2 text-sm text-muted-foreground">
            No student data available. Please upload student data first.
          </p>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Curriculum Summary */}
        <Card title="Curriculum Preview" className="border-l-4 border-l-primary">
          {selectedCurriculum ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-2 bg-primary/10 rounded-lg border border-primary/20">
                <BookOpen className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Uploaded on</p>
                  <p className="text-sm font-medium text-card-foreground">
                    {formatDateShort(selectedCurriculum.createdAt)}
                  </p>
                </div>
              </div>
              {selectedCurriculum.originalFilename && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Filename</p>
                  <p className="text-sm font-medium text-card-foreground">
                    {selectedCurriculum.originalFilename}
                  </p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-card-foreground mb-2">Preview</p>
                <div className="bg-muted p-3 rounded-lg border border-border max-h-48 overflow-y-auto">
                  <p className="text-sm text-card-foreground">
                    {truncateText(selectedCurriculum.rawText, 300)}
                  </p>
                </div>
              </div>
              {selectedCurriculum.extractedObjectives &&
                selectedCurriculum.extractedObjectives.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-card-foreground mb-2">
                      Extracted Objectives ({selectedCurriculum.extractedObjectives.length})
                    </p>
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-2">
                      <ul className="space-y-1">
                        {selectedCurriculum.extractedObjectives.map((obj, idx) => (
                          <li
                            key={idx}
                            className="text-xs text-card-foreground flex items-start gap-2"
                          >
                            <span className="text-primary font-bold shrink-0">•</span>
                            <span className="flex-1">{truncateText(obj, 100)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
            </div>
          ) : (
            <div className="p-4 bg-muted rounded-lg text-center">
              <p className="text-muted-foreground">
                {curricula.length === 0
                  ? "No curriculum uploaded yet"
                  : "Please select a curriculum"}
              </p>
            </div>
          )}
        </Card>

        {/* Student Data Summary */}
        <Card title="Student Data Preview" className="border-l-4 border-l-success">
          {selectedStudentData ? (
            <div className="space-y-4">
              <div className="p-3 bg-success/10 rounded-lg border border-success/20">
                <p className="text-xs text-muted-foreground mb-1">Total Students</p>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-success" />
                  <p className="text-2xl font-bold text-success">
                    {selectedStudentData.students?.length || 0}
                  </p>
                </div>
              </div>
              {selectedStudentData.originalFilename && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Filename</p>
                  <p className="text-sm font-medium text-card-foreground">
                    {selectedStudentData.originalFilename}
                  </p>
                </div>
              )}
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
              <p className="text-muted-foreground">
                {studentDataList.length === 0
                  ? "No student data uploaded yet"
                  : "Please select student data"}
              </p>
            </div>
          )}
        </Card>
      </div>

      <Card title="Generate Lesson Plan" className="border-l-4 border-l-primary">
        <LessonGeneratePlaceholder
          selectedCurriculumId={selectedCurriculumId}
          selectedStudentDataId={selectedStudentDataId}
        />
      </Card>
      </div>
    </PageTransition>
  );
};

export default GenerateLessonPage;
