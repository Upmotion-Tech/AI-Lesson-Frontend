import Card from "./common/Card.jsx";
import Table from "./common/Table.jsx";
import Badge from "./common/Badge.jsx";
import EmptyState from "./common/EmptyState.jsx";
import { Users } from "lucide-react";

const StudentPreviewTable = ({ students }) => {
  if (!students || students.length === 0) {
    return (
      <Card className="border-l-4 border-l-muted">
        <EmptyState message="No student data available" icon={Users} />
      </Card>
    );
  }

  const getInitials = (name) => {
    if (!name || typeof name !== "string") return "S";
    const parts = name
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (parts.length === 0) return "S";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

    return `${parts[0][0] || ""}${parts[parts.length - 1][0] || ""}`.toUpperCase();
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

  return (
    <Card title="Student Data" className="border-l-4 border-l-success">
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head className="text-xs sm:text-sm">Name</Table.Head>
                <Table.Head className="text-xs sm:text-sm">Score</Table.Head>
                <Table.Head className="text-xs sm:text-sm">Scaled Score</Table.Head>
                <Table.Head className="text-xs sm:text-sm">Percentile</Table.Head>
                <Table.Head className="text-xs sm:text-sm">Tier</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {students.map((student, idx) => (
                <Table.Row key={idx} className="hover:bg-muted/50">
                  <Table.Cell className="font-medium text-sm sm:text-base">
                    {getInitials(student.name)}
                  </Table.Cell>
                  <Table.Cell className="text-sm sm:text-base">
                    {student.score ?? "-"}
                  </Table.Cell>
                  <Table.Cell className="text-sm sm:text-base">
                    {student.scaledScore ?? "-"}
                  </Table.Cell>
                  <Table.Cell className="text-sm sm:text-base">
                    {student.percentileRank ? `${student.percentileRank}%` : "-"}
                  </Table.Cell>
                  <Table.Cell>
                    <Badge
                      variant={getTierVariant(student.tier)}
                      className="text-xs"
                    >
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
  );
};

export default StudentPreviewTable;
