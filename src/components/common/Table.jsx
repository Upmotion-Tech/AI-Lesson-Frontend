const Table = ({ children, className = "" }) => {
  return (
    <div className="overflow-x-auto">
      <table className={`min-w-full divide-y divide-border ${className}`}>
        {children}
      </table>
    </div>
  );
};

const TableHeader = ({ children, className = "" }) => {
  return (
    <thead className={`bg-muted ${className}`}>
      {children}
    </thead>
  );
};

const TableBody = ({ children, className = "" }) => {
  return <tbody className={`bg-card divide-y divide-border ${className}`}>{children}</tbody>;
};

const TableRow = ({ children, className = "", onClick }) => {
  return (
    <tr
      className={`${onClick ? "cursor-pointer hover:bg-muted/50" : ""} transition-colors ${className}`}
      onClick={onClick}
    >
      {children}
    </tr>
  );
};

const TableHead = ({ children, className = "" }) => {
  return (
    <th
      className={`px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider ${className}`}
    >
      {children}
    </th>
  );
};

const TableCell = ({ children, className = "" }) => {
  return (
    <td className={`px-6 py-4 whitespace-nowrap text-sm text-card-foreground ${className}`}>
      {children}
    </td>
  );
};

Table.Header = TableHeader;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Head = TableHead;
Table.Cell = TableCell;

export default Table;
