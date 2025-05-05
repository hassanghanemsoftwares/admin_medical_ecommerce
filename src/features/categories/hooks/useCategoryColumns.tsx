import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { TableHeaderSort } from "@/components/datatable/table-header-sort";
import { useTranslation } from "react-i18next";
import { Category } from "@/types/api.interfaces";
import { Toggle } from "@/components/ui/toggle";

type UseCategoryColumnsProps = {
  handleEdit: (category: Category) => void;
  handleDelete: (category: Category) => void;
  handleToggleActive: (category: Category) => void;
};

export function useCategoryColumns({ handleEdit, handleDelete, handleToggleActive }: UseCategoryColumnsProps): ColumnDef<Category>[] {
  const { t: messages } = useTranslation();

  return useMemo(() => [
    {
      id: "image",
      header: messages("Categories.Image"),
      cell: ({ row }) => (
        <div className="flex justify-center items-center w-20 h-20 overflow-hidden rounded-lg border border-gray-200">
      <img
        src={row.original.image}
        alt={row.original.name.en}
        className="object-cover w-full h-full"
      />
    </div>
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => <TableHeaderSort column={column} title={messages("Categories.Name")} />,
      enableSorting: true,
      cell: ({ row }) => (
        <div className="flex flex-col space-y-1">
          <div className=" text-gray-800">
            EN: <span className="text-gray-600">{row.original.name.en}</span>
          </div>
          <div className="text-sm text-gray-800">
            AR: <span className="text-gray-600">{row.original.name.ar}</span>
          </div>
        </div>
      ),
    },    {
      accessorKey: "arrangement",
      header: ({ column }) => <TableHeaderSort column={column} title={messages("Categories.arrangementLabel")} />,
      enableSorting: true,
      cell: ({ row }) => (
        <div className="flex flex-col space-y-1">
          <div className=" text-gray-800">
             {row.original.arrangement}
          </div>
         
        </div>
      ),
    },
    {
      accessorKey: "is_active",
      header: ({ column }) => (
        <TableHeaderSort column={column} title={messages("Categories.Is Active")} />
      ),
      enableSorting: true,

      cell: ({ row }) => (
        <Toggle onClick={() => handleToggleActive(row.original)}>


          <Badge variant={row.original.is_active ? "default" : "destructive"}>
            {row.original.is_active
              ? messages("Categories.Active")
              : messages("Categories.Inactive")}
          </Badge>
        </Toggle>
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
            <DropdownMenuLabel>{messages("Categories.Actions")}</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => handleEdit(row.original)}>
              {messages("Categories.Edit")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDelete(row.original)} className="text-red-600 focus:text-red-600">
              {messages("Categories.Delete")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ], [handleEdit, handleDelete, handleToggleActive, messages]);
}
