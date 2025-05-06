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
import { Shelf } from "@/types/api.interfaces";

type UseShelfColumnsProps = {
  handleEdit: (shelf: Shelf) => void;
  handleDelete: (shelf: Shelf) => void;
};

export function useShelfColumns({
  handleEdit,
  handleDelete,
}: UseShelfColumnsProps): ColumnDef<Shelf>[] {
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
              <span>{row.original.name}</span>
            </div>

          </div>
        ),
      },
      {
        accessorKey: "location",
        header: ({ column }) => <TableHeaderSort column={column} title={messages("Public.Location")} />,
        enableSorting: true,
        cell: ({ row }) => (
          <div className="flex flex-col space-y-1">
            <div className="">
              <span className="">{row.original.location}</span>
            </div>
          </div>
        ),
      },

      {
        accessorKey: "warehouse",
        header: ({ column }) => <TableHeaderSort column={column} title={messages("Public.Warehouses")} />,
        enableSorting: true,
        cell: ({ row }) => (
          <div className="flex flex-col space-y-1">
            <div className="">
              <span className="">{row.original.warehouse?.name}</span>
            </div>
          </div>
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
