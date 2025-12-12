import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const TierDistributionChart = ({ data }) => {
  // Get computed colors from CSS variables
  const getColor = (cssVar) => {
    if (typeof window !== "undefined") {
      const style = getComputedStyle(document.documentElement);
      return style.getPropertyValue(cssVar).trim();
    }
    return cssVar;
  };

  const chartData = [
    {
      name: "Tier 1 (≥70)",
      value: data.tier1,
      color: "#22c55e", // success green
      gradientId: "tier1-gradient",
    },
    {
      name: "Tier 2 (55-69)",
      value: data.tier2,
      color: "#f59e0b", // warning amber
      gradientId: "tier2-gradient",
    },
    {
      name: "Tier 3 (<55)",
      value: data.tier3,
      color: "#ef4444", // danger red
      gradientId: "tier3-gradient",
    },
  ];

  const total = data.tier1 + data.tier2 + data.tier3;

  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <p>No student data available</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <defs>
          <linearGradient id="tier1-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22c55e" stopOpacity={1} />
            <stop offset="100%" stopColor="#16a34a" stopOpacity={0.8} />
          </linearGradient>
          <linearGradient id="tier2-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity={1} />
            <stop offset="100%" stopColor="#d97706" stopOpacity={0.8} />
          </linearGradient>
          <linearGradient id="tier3-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ef4444" stopOpacity={1} />
            <stop offset="100%" stopColor="#dc2626" stopOpacity={0.8} />
          </linearGradient>
        </defs>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent, value }) =>
            value > 0 ? `${name}\n${value} (${(percent * 100).toFixed(0)}%)` : ""
          }
          outerRadius={90}
          innerRadius={40}
          fill="#8884d8"
          dataKey="value"
          stroke="hsl(var(--card))"
          strokeWidth={2}
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
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "0.5rem",
            color: "hsl(var(--card-foreground))",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
          formatter={(value, name) => [value, name]}
        />
        <Legend
          wrapperStyle={{ fontSize: "0.875rem", color: "hsl(var(--foreground))" }}
          iconType="circle"
          formatter={(value, entry) => (
            <span style={{ color: "hsl(var(--foreground))" }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default TierDistributionChart;

