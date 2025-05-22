import { Table } from "@/components/ui/table";
import { TablePagination } from "@/components/datatable/table-pagination";
import { StocksTableHeader } from "./StocksTableHeader";
import { StocksTableBody } from "./StocksTableBody";
import { useStocksTableLogic } from "../../hooks/useStocksTableLogic";

export function StocksTable() {
  const {
    table,
    columns,
    data,
    isLoading,
    isError,
    searchInput,
    setSearchInput,
    handleSearch,
    handleRefresh,
    appliedSearch,
    messages,
  } = useStocksTableLogic();

  if (isError) {
    return <div className="text-center py-10">{messages("Error.heading")}</div>;
  }

  return (
    <div className="w-full">
      <StocksTableHeader
        searchInput={searchInput}
        onSearchInputChange={setSearchInput}
        onSearch={handleSearch}
        onRefresh={handleRefresh}

        messages={messages}
      />
      <div className="rounded-md border">
        <Table>
          <StocksTableBody
            table={table}
            columns={columns}
            isLoading={isLoading}
            search={appliedSearch}
            messages={messages}
          />
        </Table>
      </div>
      <TablePagination
        currentPageSize={table.getState().pagination.pageSize}
        totalItems={data?.pagination?.total || 0}
        visibleItems={table.getRowModel().rows.length}
        onPageSizeChange={size => table.setPageSize(size)}
        onPreviousPage={table.previousPage}
        onNextPage={table.nextPage}
        canPreviousPage={table.getCanPreviousPage()}
        canNextPage={table.getCanNextPage()}
      />
    </div>
  );
}
