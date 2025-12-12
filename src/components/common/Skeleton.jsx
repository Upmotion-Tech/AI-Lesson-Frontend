import SkeletonLoader from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Skeleton = ({
  count = 1,
  width,
  height,
  circle = false,
  className = "",
  ...props
}) => {
  return (
    <SkeletonLoader
      count={count}
      width={width}
      height={height}
      circle={circle}
      baseColor="hsl(var(--muted))"
      highlightColor="hsl(var(--muted) / 0.5)"
      className={className}
      {...props}
    />
  );
};

// Pre-built skeleton components
export const CardSkeleton = ({ count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-card border border-border rounded-2xl p-4 sm:p-6 space-y-4"
        >
          <div className="flex items-center gap-3">
            <Skeleton circle width={40} height={40} />
            <Skeleton width={200} height={20} />
          </div>
          <Skeleton count={3} height={16} />
          <Skeleton width={150} height={32} />
        </div>
      ))}
    </>
  );
};

export const TableSkeleton = ({ rows = 5, cols = 4 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          {Array.from({ length: cols }).map((_, j) => (
            <Skeleton key={j} width="100%" height={20} />
          ))}
        </div>
      ))}
    </div>
  );
};

export const LessonPlanCardSkeleton = ({ count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-card border border-border rounded-2xl p-4 sm:p-6 space-y-4"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-2">
              <Skeleton width="80%" height={24} />
              <Skeleton width="60%" height={16} />
            </div>
            <Skeleton width={60} height={24} />
          </div>
          <Skeleton width="100%" height={60} />
          <div className="space-y-2">
            <Skeleton width="40%" height={16} />
            <Skeleton width="50%" height={16} />
            <Skeleton width="45%" height={16} />
          </div>
          <div className="flex items-center gap-2 pt-2 border-t border-border">
            <Skeleton circle width={8} height={8} count={3} />
            <Skeleton width={100} height={16} />
          </div>
        </div>
      ))}
    </>
  );
};

export default Skeleton;

