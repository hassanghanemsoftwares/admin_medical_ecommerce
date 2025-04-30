import { TableRow, TableCell } from "@/components/ui/table";
import { useTranslation } from "react-i18next";

interface TableNoResultsProps {
  colSpan: number;
  message?: string;
}

export function TableNoResults({ 
  colSpan, 
  message 
}: TableNoResultsProps) {
  const { t: messages } = useTranslation();

  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="h-24 text-center">
        {message || messages("Table.noResults")}
      </TableCell>
    </TableRow>
  );
}
