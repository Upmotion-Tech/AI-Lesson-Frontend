import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../hooks/useAppDispatch.js";
import { useAppSelector } from "../hooks/useAppSelector.js";
import { fetchAllLessonPlans } from "../store/lessonThunks.js";
import Card from "../components/common/Card.jsx";
import Loader from "../components/common/Loader.jsx";
import Badge from "../components/common/Badge.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import { formatDateShort, truncateText } from "../utils/formatters.js";
import {
  FileText,
  Calendar,
  BookOpen,
  Users,
  ArrowRight,
  Sparkles,
  Search,
} from "lucide-react";
import { useState } from "react";

const LessonPlansPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { list: lessonPlans, status } = useAppSelector((state) => state.lessons);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchAllLessonPlans());
  }, [dispatch]);

  const filteredPlans = lessonPlans.filter((plan) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      plan.objective?.toLowerCase().includes(query) ||
      plan.standard?.code?.toLowerCase().includes(query) ||
      plan.standard?.description?.toLowerCase().includes(query)
    );
  });

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            </div>
            <span>My Lesson Plans</span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            View and manage all your generated lesson plans
          </p>
        </div>
        <button
          onClick={() => navigate("/generate-lesson")}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
        >
          <Sparkles className="h-4 w-4" />
          Generate New
        </button>
      </div>

      {/* Search Bar */}
      {lessonPlans.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by objective or standard..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      )}

      {/* Lesson Plans Grid */}
      {filteredPlans.length === 0 && lessonPlans.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No Lesson Plans Yet"
          description="Generate your first lesson plan to get started"
          actionLabel="Generate Lesson Plan"
          onAction={() => navigate("/generate-lesson")}
        />
      ) : filteredPlans.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No lesson plans match your search query.
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredPlans.map((plan) => (
            <Card
              key={plan._id}
              className="hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-primary group"
              onClick={() => navigate(`/lessons/${plan._id}`)}
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-card-foreground mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                      {plan.objective || "Untitled Lesson Plan"}
                    </h3>
                    {plan.standard?.code && (
                      <p className="text-xs text-muted-foreground font-mono">
                        {plan.standard.code}
                      </p>
                    )}
                  </div>
                  <Badge
                    variant={plan.status === "PUBLISHED" ? "success" : "warning"}
                    className="shrink-0"
                  >
                    {plan.status || "DRAFT"}
                  </Badge>
                </div>

                {/* Standard Info */}
                {plan.standard?.description && (
                  <div className="p-2 bg-muted rounded-lg border border-border">
                    <p className="text-xs text-muted-foreground mb-1">
                      Aligned Standard
                    </p>
                    <p className="text-sm text-card-foreground line-clamp-2">
                      {truncateText(plan.standard.description, 100)}
                    </p>
                  </div>
                )}

                {/* Metadata */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {formatDateShort(plan.createdAt || new Date())}
                    </span>
                  </div>

                  {plan.curriculumId && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <BookOpen className="h-4 w-4" />
                      <span className="line-clamp-1">
                        Curriculum:{" "}
                        {plan.curriculumId.extractedObjectives?.length > 0
                          ? `${plan.curriculumId.extractedObjectives.length} objectives`
                          : "Available"}
                      </span>
                    </div>
                  )}

                  {plan.studentDataId && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>
                        {plan.studentDataId.students?.length || 0} students
                      </span>
                    </div>
                  )}
                </div>

                {/* Tier Plans Indicator */}
                <div className="flex items-center gap-2 pt-2 border-t border-border">
                  <div className="flex gap-1">
                    {[1, 2, 3].map((tier) => (
                      <div
                        key={tier}
                        className={`w-2 h-2 rounded-full ${
                          plan.tierPlans?.[`tier${tier}`]?.objective
                            ? "bg-success"
                            : "bg-muted"
                        }`}
                        title={`Tier ${tier} ${plan.tierPlans?.[`tier${tier}`]?.objective ? "Available" : "Not Available"}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground flex-1">
                    Tier plans available
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Stats */}
      {lessonPlans.length > 0 && (
        <Card className="bg-muted/50">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Total Lesson Plans: <strong className="text-foreground">{lessonPlans.length}</strong>
            </span>
            {searchQuery && (
              <span className="text-muted-foreground">
                Showing: <strong className="text-foreground">{filteredPlans.length}</strong> results
              </span>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default LessonPlansPage;

