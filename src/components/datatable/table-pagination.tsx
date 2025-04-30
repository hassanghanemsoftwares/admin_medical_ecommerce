import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation, Trans } from "react-i18next";

interface TablePaginationProps {
  currentPageSize: number;
  totalItems: number;
  visibleItems: number;
  onPageSizeChange: (size: number) => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
  canPreviousPage: boolean;
  canNextPage: boolean;
  pageSizeOptions?: number[];
}

export function TablePagination({
  currentPageSize,
  totalItems,
  visibleItems,
  onPageSizeChange,
  onPreviousPage,
  onNextPage,
  canPreviousPage,
  canNextPage,
  pageSizeOptions = [10, 20, 30, 40, 50],
}: TablePaginationProps) {
  const { t: messages } = useTranslation();

  return (
    <div className="flex items-center justify-between px-2 py-4">
      <div className="text-sm text-muted-foreground">
        <Trans i18nKey="Table.pagination.showing" values={{ visible: visibleItems, total: totalItems }} components={{ strong: <strong /> }} />
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">
            {messages("Table.pagination.rowsPerPage")}
          </p>
          <Select
            value={`${currentPageSize}`}
            onValueChange={(value) => {
              onPageSizeChange(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={currentPageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {pageSizeOptions.map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onPreviousPage}
            disabled={!canPreviousPage}
          >
            {messages("Table.pagination.previous")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onNextPage}
            disabled={!canNextPage}
          >
            {messages("Table.pagination.next")}
          </Button>
        </div>
      </div>
    </div>
  );
}
