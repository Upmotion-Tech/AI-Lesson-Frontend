import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

const ResourceCountChart = ({ curricula, studentData, lessons }) => {
  const chartData = [
    {
      name: "Curricula",
      count: curricula.length,
      color: "#4e6ef2", // primary blue
      gradientId: "curricula-gradient",
    },
    {
      name: "Student Data",
      count: studentData.length,
      color: "#22c55e", // success green
      gradientId: "student-gradient",
    },
    {
      name: "Lesson Plans",
      count: lessons.length,
      color: "#f59e0b", // warning amber
      gradientId: "lesson-gradient",
    },
  ];

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="curricula-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4e6ef2" stopOpacity={1} />
            <stop offset="100%" stopColor="#6366f1" stopOpacity={0.8} />
          </linearGradient>
          <linearGradient id="student-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22c55e" stopOpacity={1} />
            <stop offset="100%" stopColor="#16a34a" stopOpacity={0.8} />
          </linearGradient>
          <linearGradient id="lesson-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity={1} />
            <stop offset="100%" stopColor="#d97706" stopOpacity={0.8} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="hsl(var(--border))"
          opacity={0.3}
        />
        <XAxis
          dataKey="name"
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
          cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
          formatter={(value) => [value, "Count"]}
        />
        <Legend
          wrapperStyle={{ fontSize: "0.875rem", color: "hsl(var(--foreground))" }}
        />
        <Bar
          dataKey="count"
          name="Count"
          radius={[12, 12, 0, 0]}
          stroke="hsl(var(--card))"
          strokeWidth={1}
        >
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={`url(#${entry.gradientId})`}
              style={{
                filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))",
              }}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ResourceCountChart;

