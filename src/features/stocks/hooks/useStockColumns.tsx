import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Stock } from "@/types/api.interfaces";
import { useTranslation } from "react-i18next";
import { TableHeaderText } from "@/components/datatable/table-header-text";

export function useStockColumns(): ColumnDef<Stock>[] {
  const { t: messages } = useTranslation();

  return useMemo<ColumnDef<Stock>[]>(() => [
    {
      accessorKey: "product_info",
      header: () => (
        <TableHeaderText title={messages("Stocks.product_info")} />
      ),
      enableSorting: false,
      cell: ({ row }) => <p>{row.original.product_info}</p>,
    },
    {
      accessorKey: "warehouse",
      header: () => (
        <TableHeaderText title={messages("Stocks.warehouse")} />
      ),
      enableSorting: false,
      cell: ({ row }) => <p>{row.original.warehouse.name}</p>,
    },
    {
      accessorKey: "shelf",
      header: () => (
        <TableHeaderText title={messages("Stocks.shelf")} />
      ),
      enableSorting: false,
      cell: ({ row }) => <p>{row.original.shelf?.name}</p>,
    }, {
      accessorKey: "quantity",
      header: () => (
        <TableHeaderText title={messages("Stocks.quantity")} />
      ),
      enableSorting: false,
      cell: ({ row }) => <p>{row.original.quantity}</p>,
    },
  ], [messages]);
}
