import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { StockAdjustment } from "@/types/api.interfaces";
import { useTranslation } from "react-i18next";
import { TableHeaderText } from "@/components/datatable/table-header-text";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

type UseStockAdjustmentColumnsProps = {

  handleDelete: (stockAdjustment: StockAdjustment) => void;

};

export function useStockAdjustmentColumns({ handleDelete }: UseStockAdjustmentColumnsProps): ColumnDef<StockAdjustment>[] {
  const { t: messages } = useTranslation();

  return useMemo<ColumnDef<StockAdjustment>[]>(() => [
    {
      accessorKey: "product_info",
      header: () => (
        <TableHeaderText title={messages("Public.product_info")} />
      ),
      enableSorting: false,
      cell: ({ row }) => <p>{row.original.product_info}</p>,
    },
    {
      accessorKey: "type",
      header: () => (
        <TableHeaderText title={messages("Public.type")} />
      ),
      cell: ({ row }) => <p>{row.original.type}</p>,
    },
    {
      accessorKey: "quantity",
      header: () => (
        <TableHeaderText title={messages("Public.quantity")} />
      ),
      cell: ({ row }) => <p>{row.original.quantity}</p>,
    },
    {
      accessorKey: "cost_per_item",
      header: () => (
        <TableHeaderText title={messages("Public.cost_per_item")} />
      ),
      cell: ({ row }) => <p>{row.original.cost_per_item}</p>,
    },
    {
      accessorKey: "warehouse",
      header: () => (
        <TableHeaderText title={messages("Public.warehouse")} />
      ),
      cell: ({ row }) => <p>{row.original.warehouse?.name}</p>,
    },
    {
      accessorKey: "shelf",
      header: () => (
        <TableHeaderText title={messages("Public.shelf")} />
      ),
      cell: ({ row }) => <p>{row.original.shelf?.name || "-"}</p>,
    },
    {
      accessorKey: "reason",
      header: () => (
        <TableHeaderText title={messages("Public.reason")} />
      ),
      cell: ({ row }) => <p>{row.original.reason || "-"}</p>,
    },
  

    {
      accessorKey: "adjusted_by",
      header: () => (
        <TableHeaderText title={messages("Public.adjusted_by")} />
      ),
      cell: ({ row }) => <p>{row.original.adjusted_by?.name || "-"}</p>,
    },
    {
      accessorKey: "created_at",
      header: () => (
        <TableHeaderText title={messages("Public.created_at")} />
      ),
      cell: ({ row }) => (
        <p>{new Date(row.original.created_at).toLocaleString()}</p>
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

            <DropdownMenuItem onClick={() => handleDelete(row.original)} className="text-red-600 focus:text-red-600">
              {messages("Public.Delete")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ], [handleDelete, messages]);
}
