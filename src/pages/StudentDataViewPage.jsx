import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../hooks/useAppDispatch.js";
import { useAppSelector } from "../hooks/useAppSelector.js";
import {
  fetchStudentDataById,
  deleteStudentData,
} from "../store/studentDataThunks.js";
import Card from "../components/common/Card.jsx";
import Button from "../components/common/Button.jsx";
import Modal from "../components/common/Modal.jsx";
import Table from "../components/common/Table.jsx";
import Badge from "../components/common/Badge.jsx";
import ErrorMessage from "../components/common/ErrorMessage.jsx";
import { CardSkeleton } from "../components/common/Skeleton.jsx";
import PageTransition from "../components/common/PageTransition.jsx";
import { toast } from "react-hot-toast";
import {
  ArrowLeft,
  Users,
  Trash2,
  AlertTriangle,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { formatDate } from "../utils/formatters.js";

const StudentDataViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    current: studentData,
    status,
    error,
  } = useAppSelector((state) => state.studentData);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchStudentDataById(id));
    }
  }, [id, dispatch]);

  const handleDeleteClick = () => {
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await dispatch(deleteStudentData(id)).unwrap();
      toast.success("Student data deleted successfully");
      navigate("/upload-students");
    } catch (error) {
      toast.error(error || "Failed to delete student data");
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
  };

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

  const getTierVariant = (tier) => {
    switch (tier) {
      case 1:
        return "success";
      case 2:
        return "warning";
      case 3:
        return "danger";
      default:
        return "default";
    }
  };

  const handleRowClick = (student) => {
    setSelectedStudent(student);
  };

  const closeStudentModal = () => {
    setSelectedStudent(null);
  };

  if (status === "loading") {
    return (
      <PageTransition>
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                Student Data Details
              </h1>
            </div>
          </div>
          <CardSkeleton count={1} />
        </div>
      </PageTransition>
    );
  }

  if (error || !studentData) {
    return (
      <PageTransition>
        <div className="space-y-4">
          <ErrorMessage message={error || "Student data not found"} />
          <Button onClick={() => navigate("/upload-students")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Student Data
          </Button>
        </div>
      </PageTransition>
    );
  }

  const tierDist = getTierDistribution(studentData.students);
  const totalStudents = studentData.students?.length || 0;

  return (
    <PageTransition>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/upload-students")}
              className="p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                Student Data Details
              </h1>
              {studentData.originalFilename && (
                <p className="text-sm text-muted-foreground mt-1">
                  {studentData.originalFilename}
                </p>
              )}
            </div>
          </div>
          <Button variant="danger" onClick={handleDeleteClick}>
            <div className="flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              Delete
            </div>
          </Button>
        </div>

        {/* Summary Card */}
        <Card>
          <div className="space-y-6">
            {/* File Info */}
            <div className="flex items-start gap-3 p-4 bg-success/10 rounded-lg border border-success/20">
              <Users className="h-6 w-6 text-success shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Uploaded on
                    </p>
                    <p className="text-sm font-medium text-card-foreground">
                      {formatDate(studentData.createdAt)}
                    </p>
                  </div>
                  {studentData.originalFilename && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Filename
                      </p>
                      <p className="text-sm font-medium text-card-foreground">
                        {studentData.originalFilename}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Total Students */}
            <div className="p-4 bg-success/10 rounded-lg border border-success/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-success" />
                  <span className="text-sm font-medium text-card-foreground">
                    Total Students
                  </span>
                </div>
                <span className="text-3xl font-bold text-success">
                  {totalStudents}
                </span>
              </div>
            </div>

            {/* Tier Distribution */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <h2 className="text-lg font-semibold text-card-foreground">
                  Tier Distribution
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-4 bg-success/10 rounded-lg border border-success/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-card-foreground">
                      Tier 1 (≥70)
                    </span>
                    <Badge variant="success">{tierDist.tier1}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Grade-level expectation
                  </p>
                </div>
                <div className="p-4 bg-warning/10 rounded-lg border border-warning/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-card-foreground">
                      Tier 2 (55-69)
                    </span>
                    <Badge variant="warning">{tierDist.tier2}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Reduced complexity
                  </p>
                </div>
                <div className="p-4 bg-danger/10 rounded-lg border border-danger/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-card-foreground">
                      Tier 3 (&lt;55)
                    </span>
                    <Badge variant="danger">{tierDist.tier3}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Simplified scaffolding
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Students Table */}
        {studentData.students && studentData.students.length > 0 && (
          <Card title="All Students">
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <Table>
                  <Table.Header>
                    <Table.Row>
                      <Table.Head>Name</Table.Head>
                      <Table.Head>Score</Table.Head>
                      <Table.Head>Scaled Score</Table.Head>
                      <Table.Head>Projected SS</Table.Head>
                      <Table.Head>Percentile Rank</Table.Head>
                      <Table.Head>Tier</Table.Head>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {studentData.students.map((student, idx) => (
                      <Table.Row
                        key={idx}
                        className="hover:bg-muted/50 cursor-pointer"
                        onClick={() => handleRowClick(student)}
                      >
                        <Table.Cell className="font-medium">
                          {student.name}
                        </Table.Cell>
                        <Table.Cell>{student.score ?? "-"}</Table.Cell>
                        <Table.Cell>{student.scaledScore ?? "-"}</Table.Cell>
                        <Table.Cell>
                          {student.projectedScaledScore ?? "-"}
                        </Table.Cell>
                        <Table.Cell>
                          {student.percentileRank
                            ? `${student.percentileRank}%`
                            : "-"}
                        </Table.Cell>
                        <Table.Cell>
                          <Badge variant={getTierVariant(student.tier)}>
                            Tier {student.tier}
                          </Badge>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={handleCancelDelete}
        title="Delete Student Data"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-danger/10 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-danger" />
            </div>
            <div className="flex-1">
              <p className="text-foreground font-medium mb-1">
                Are you sure you want to delete this student data?
              </p>
              <p className="text-sm text-muted-foreground">
                This action cannot be undone. All lesson plans associated with
                this student data will still exist, but you won't be able to
                generate new lessons from it.
              </p>
              <div className="mt-3 p-3 bg-muted rounded-lg border border-border">
                <p className="text-xs text-muted-foreground mb-1">
                  Student Data:
                </p>
                <p className="text-sm font-medium text-foreground">
                  {studentData.originalFilename || "Untitled Student Data"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {totalStudents} students
                </p>
              </div>
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

      {/* Student Details Modal */}
      <Modal
        isOpen={!!selectedStudent}
        onClose={closeStudentModal}
        title="Student Details"
        size="xl"
      >
        {selectedStudent && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium text-lg">{selectedStudent.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tier</p>
                <Badge variant={getTierVariant(selectedStudent.tier)}>
                  Tier {selectedStudent.tier}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Score</p>
                <p className="font-medium">{selectedStudent.score ?? "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Scaled Score</p>
                <p className="font-medium">
                  {selectedStudent.scaledScore ?? "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Projected Scaled Score
                </p>
                <p className="font-medium">
                  {selectedStudent.projectedScaledScore ?? "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Percentile Rank</p>
                <p className="font-medium">
                  {selectedStudent.percentileRank
                    ? `${selectedStudent.percentileRank}%`
                    : "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Grade</p>
                <p className="font-medium">{selectedStudent.grade ?? "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Benchmark Category
                </p>
                <p className="font-medium">
                  {selectedStudent.benchmarkCategory ?? "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Test Date</p>
                <p className="font-medium">{selectedStudent.testDate ?? "-"}</p>
              </div>
            </div>

            {selectedStudent.suggestedSkills &&
              selectedStudent.suggestedSkills.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    Suggested Skills
                  </h3>
                  <div className="bg-muted/30 rounded-lg overflow-hidden border border-border">
                    <Table>
                      <Table.Header>
                        <Table.Row>
                          <Table.Head>Domain</Table.Head>
                          <Table.Head>Grade</Table.Head>
                          <Table.Head>Skill</Table.Head>
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        {selectedStudent.suggestedSkills.map((skill, index) => (
                          <Table.Row key={index}>
                            <Table.Cell>{skill.domain}</Table.Cell>
                            <Table.Cell>{skill.grade ?? "-"}</Table.Cell>
                            <Table.Cell>{skill.skill}</Table.Cell>
                          </Table.Row>
                        ))}
                      </Table.Body>
                    </Table>
                  </div>
                </div>
              )}

            <div className="flex justify-end pt-4">
              <Button onClick={closeStudentModal}>Close</Button>
            </div>
          </div>
        )}
      </Modal>
    </PageTransition>
  );
};

export default StudentDataViewPage;
