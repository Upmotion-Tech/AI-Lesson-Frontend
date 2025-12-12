import { useState } from "react";
import Card from "./common/Card.jsx";
import Button from "./common/Button.jsx";
import { formatDate } from "../utils/formatters.js";
import { ChevronDown, ChevronUp, FileText } from "lucide-react";

const CurriculumPreviewCard = ({ curriculum }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showFullText, setShowFullText] = useState(false);

  if (!curriculum) return null;

  const textPreview = curriculum.rawText || "No text content available";
  const shouldTruncate = textPreview.length > 1000;
  const displayText =
    showFullText || !shouldTruncate
      ? textPreview
      : textPreview.substring(0, 1000) + "...";

  return (
    <Card title="Latest Curriculum" className="h-full">
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-3 bg-primary/10 rounded-lg border border-primary/20">
          <FileText className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground mb-1">Uploaded on</p>
            <p className="text-sm font-medium text-card-foreground">
              {formatDate(curriculum.createdAt)}
            </p>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-card-foreground">
              Text Content
            </p>
            {textPreview && (
              <span className="text-xs text-muted-foreground">
                {textPreview.length.toLocaleString()} characters
              </span>
            )}
          </div>
          <div className="bg-muted p-4 rounded-lg border border-border">
            <div
              className={`text-sm text-card-foreground whitespace-pre-wrap ${
                isExpanded ? "max-h-none" : "max-h-96"
              } overflow-y-auto`}
            >
              {displayText}
            </div>
            {shouldTruncate && (
              <div className="mt-3 pt-3 border-t border-border">
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
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-2" />
                      Show Full Text
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>

        {curriculum.extractedObjectives &&
          curriculum.extractedObjectives.length > 0 && (
            <div>
              <p className="text-sm font-medium text-card-foreground mb-2">
                Extracted Objectives
              </p>
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                <ul className="space-y-2">
                  {curriculum.extractedObjectives.map((obj, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-card-foreground flex items-start gap-2"
                    >
                      <span className="text-primary font-bold shrink-0">•</span>
                      <span className="flex-1">{obj}</span>
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
