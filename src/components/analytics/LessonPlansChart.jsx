import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

const LessonPlansChart = ({ lessons }) => {
  // Group lessons by date
  const lessonsByDate = lessons.reduce((acc, lesson) => {
    const date = new Date(lesson.createdAt);
    const dateKey = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    if (!acc[dateKey]) {
      acc[dateKey] = { date: dateKey, count: 0, timestamp: date.getTime() };
    }
    acc[dateKey].count += 1;
    return acc;
  }, {});

  // Convert to array and sort by timestamp
  const chartData = Object.values(lessonsByDate)
    .sort((a, b) => a.timestamp - b.timestamp)
    .slice(-7) // Last 7 days
    .map(({ date, count }) => ({ date, count }));

  if (lessons.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <p>No lesson plans generated yet</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart
        data={chartData}
        margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
      >
        <defs>
          <linearGradient id="lessonGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#4e6ef2" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#4e6ef2" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="hsl(var(--border))"
          opacity={0.3}
        />
        <XAxis
          dataKey="date"
          stroke="hsl(var(--muted-foreground))"
          style={{ fontSize: "0.75rem", fontWeight: 500 }}
          tick={{ fill: "hsl(var(--foreground))" }}
        />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          style={{ fontSize: "0.75rem" }}
          tick={{ fill: "hsl(var(--foreground))" }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "0.5rem",
            color: "hsl(var(--card-foreground))",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
          labelStyle={{
            color: "hsl(var(--card-foreground))",
            fontWeight: 600,
          }}
          itemStyle={{
            color: "hsl(var(--card-foreground))",
          }}
          formatter={(value) => [value, "Lesson Plans"]}
        />
        <Legend
          wrapperStyle={{
            fontSize: "0.875rem",
            color: "hsl(var(--foreground))",
          }}
          formatter={(value) => (
            <span style={{ color: "hsl(var(--foreground))" }}>{value}</span>
          )}
        />
        <Area
          type="monotone"
          dataKey="count"
          stroke="#4e6ef2"
          strokeWidth={3}
          fill="url(#lessonGradient)"
          name="Lesson Plans"
        />
        <Line
          type="monotone"
          dataKey="count"
          stroke="#4e6ef2"
          strokeWidth={3}
          dot={{
            fill: "#4e6ef2",
            r: 6,
            strokeWidth: 2,
            stroke: "hsl(var(--card))",
          }}
          activeDot={{
            r: 8,
            stroke: "#4e6ef2",
            strokeWidth: 2,
            fill: "hsl(var(--card))",
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default LessonPlansChart;

