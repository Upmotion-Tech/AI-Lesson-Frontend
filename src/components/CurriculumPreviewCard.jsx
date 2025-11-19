import { useState } from "react";
import Card from "./common/Card.jsx";
import Button from "./common/Button.jsx";
import { formatDate } from "../utils/formatters.js";
import {
  ChevronDown,
  ChevronUp,
  FileText,
  Sparkles,
  ClipboardList,
  Clock,
} from "lucide-react";

const CurriculumPreviewCard = ({ curriculum }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showFullText, setShowFullText] = useState(false);

  if (!curriculum) return null;

  const textPreview = curriculum.rawText || "No text content available";
  const shouldTruncate = textPreview.length > 1000;
  const displayText =
    showFullText || !shouldTruncate
      ? textPreview
      : `${textPreview.substring(0, 1000)}...`;

  const objectiveCount = curriculum.extractedObjectives
    ? curriculum.extractedObjectives.length
    : 0;
  const charCount = textPreview.length;
  const estimatedLessons = Math.max(1, Math.round(charCount / 1200));
  const readingMinutes = Math.max(1, Math.round(charCount / 950));

  const stats = [
    {
      label: "Characters",
      value: charCount.toLocaleString(),
      icon: FileText,
    },
    {
      label: "Objectives",
      value: objectiveCount,
      icon: ClipboardList,
    },
    {
      label: "Reading time",
      value: `${readingMinutes} min`,
      icon: Clock,
    },
    {
      label: "Lesson estimate",
      value: `${estimatedLessons}+`,
      icon: Sparkles,
    },
  ];

  return (
    <Card
      title="Latest Curriculum"
      description="Review extracted content before generating lessons."
      className="h-full border border-border/80 bg-card/90"
    >
      <div className="space-y-5">
        <div className="rounded-2xl border border-primary/20 bg-linear-to-br from-primary/10 to-background px-4 py-3 flex items-center gap-4">
          <div className="rounded-2xl bg-background/80 p-3 text-primary">
            <FileText className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Uploaded
            </p>
            <p className="text-sm font-semibold text-card-foreground">
              {formatDate(curriculum.createdAt)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map(({ label, value, icon }) => {
            const Icon = icon;
            return (
              <div
                key={label}
                className="rounded-2xl border border-border/70 bg-background/70 px-3 py-2"
              >
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Icon className="h-3.5 w-3.5 text-primary" />
                  {label}
                </div>
                <p className="mt-1 text-base font-semibold text-card-foreground">
                  {value}
                </p>
              </div>
            );
          })}
        </div>

        <div className="rounded-2xl border border-border/70 bg-muted/40">
          <div className="flex items-center justify-between px-4 py-3">
            <p className="text-sm font-semibold text-card-foreground">
              Text Content
            </p>
            {textPreview && (
              <span className="text-xs text-muted-foreground">
                {textPreview.length.toLocaleString()} characters
              </span>
            )}
          </div>
          <div className="border-t border-border/70 bg-card/60 p-4 rounded-b-2xl">
            <div
              className={`text-sm text-card-foreground whitespace-pre-wrap ${
                isExpanded ? "max-h-none" : "max-h-96"
              } overflow-y-auto`}
            >
              {displayText}
            </div>
            {shouldTruncate && (
              <div className="mt-3 pt-3 border-t border-border/70">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowFullText(!showFullText);
                    setIsExpanded(!isExpanded);
                  }}
                  className="w-full"
                >
                  {showFullText ? (
                    <>
                      <ChevronUp className="h-4 w-4 mr-2" />
                      Show less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-2" />
                      Show full text
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>

        {curriculum.extractedObjectives && objectiveCount > 0 && (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-card-foreground">
              Extracted Objectives
            </p>
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
              <ul className="space-y-2">
                {curriculum.extractedObjectives.map((obj, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 rounded-xl bg-background/80 px-3 py-2 text-sm text-card-foreground"
                  >
                    <span className="text-primary font-bold shrink-0 mt-1">
                      •
                    </span>
                    <span className="flex-1 leading-relaxed">{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default CurriculumPreviewCard;
