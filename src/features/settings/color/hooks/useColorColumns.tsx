import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { TableHeaderSort } from "@/components/datatable/table-header-sort";
import { useTranslation } from "react-i18next";
import { Color } from "@/types/api.interfaces";

type UseColorColumnsProps = {
  handleEdit: (color: Color) => void;
  handleDelete: (color: Color) => void;
};

export function useColorColumns({
  handleEdit,
  handleDelete,
}: UseColorColumnsProps): ColumnDef<Color>[] {
  const { t: messages } = useTranslation();

  return useMemo(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <TableHeaderSort column={column} title={messages("Public.Name")} />
        ),
        enableSorting: true,
        cell: ({ row }) => (
          <div className="flex flex-col space-y-1">
            <div>
              EN: <span>{row.original.name.en}</span>
            </div>
            <div>
              AR: <span>{row.original.name.ar}</span>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "code",
        header: ({ column }) => (
          <TableHeaderSort column={column} title={messages("Public.Code")} />
        ),
        enableSorting: true,
        cell: ({ row }) => (
          <div>
            <span className="px-2 py-1 rounded text-sm"
              style={{ backgroundColor: row.original.code }}>
              {row.original.code}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "color_season",
        header: ({ column }) => (
          <TableHeaderSort
            column={column}
            title={messages("Public.ColorSeason")}
          />
        ),
        enableSorting: false,
        cell: ({ row }) => (
          <div>{row.original.color_season?.name?.en || "-"}</div>
        ),
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{messages("Public.Actions")}</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleEdit(row.original)}>
                {messages("Public.Edit")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDelete(row.original)}
                className="text-red-600 focus:text-red-600"
              >
                {messages("Public.Delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [handleEdit, handleDelete, messages]
  );
}
