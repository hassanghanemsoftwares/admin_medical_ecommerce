import { TableRow, TableCell } from "@/components/ui/table";
import Spinner from "../spinner";
import { useTranslation } from "react-i18next";

interface TableLoadingProps {
  colSpan: number;
  message?: string;
}

export function TableLoading({
  colSpan,
  message
}: TableLoadingProps) {
  const { t: messages } = useTranslation();

  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="h-24 text-center">
        <div className="flex flex-col items-center justify-center gap-2">
          <Spinner />
          <span className="text-sm text-muted-foreground">
            {message || messages("Table.loading")}
          </span>
        </div>
      </TableCell>
    </TableRow>
  );
}
