import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TableLoading } from "@/components/datatable/table-loading";
import { TableNoResults } from "@/components/datatable/table-no-results";
import { flexRender } from "@tanstack/react-table";
import { Key } from "react";

export function StocksTableBody({ table, columns, isLoading, search, messages }: any) {
  return (
    <>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup: { id: Key | null | undefined; headers: any[]; }) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <TableHead key={header.id}>
                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableLoading colSpan={columns.length} />
        ) : table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row: { id: Key | null | undefined; getVisibleCells: () => any[]; }) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map(cell => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableNoResults
            colSpan={columns.length}
            message={
              search
                ? messages("Stocks.No search results")
                : messages("Stocks.No logs found")
            }
          />
        )}
      </TableBody>
    </>
  );
}
