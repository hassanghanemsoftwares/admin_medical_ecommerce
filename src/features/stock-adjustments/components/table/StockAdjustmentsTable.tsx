import { Table } from "@/components/ui/table";
import { TablePagination } from "@/components/datatable/table-pagination";
import { StockAdjustmentsTableHeader } from "./StockAdjustmentsTableHeader";
import { StockAdjustmentsTableBody } from "./StockAdjustmentsTableBody";
import { useStockAdjustmentsTableLogic } from "../../hooks/useStockAdjustmentsTableLogic";
import { StockAdjustmentsTableDialogs } from "./StockAdjustmentsTableDialogs";

export function StockAdjustmentsTable() {
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
    setIsStockAdjustmentFormOpen,
    isStockAdjustmentFormOpen,
    handleSubmitStockAdjustmentForm,
    deleteDialogProps,
    warehouses,
    shelves,
    products,
    missingItems,
  } = useStockAdjustmentsTableLogic();

  if (isError) {
    return <div className="text-center py-10">{messages("Error.heading")}</div>;
  }

  return (
    <div className="w-full space-y-4">
      {missingItems.length > 0 ? (
        <div className="text-red-500 space-y-1 bg-red-50 border border-red-300 p-4 rounded-md">
          <p className="font-semibold">{messages("Public.missing_required_data")}</p>
          <ul className="list-disc list-inside">
            {missingItems.map((msg, i) => (
              <li key={i}>{msg}</li>
            ))}
          </ul>
        </div>
      ) : (
        <>
          <StockAdjustmentsTableHeader
            searchInput={searchInput}
            onSearchInputChange={setSearchInput}
            onSearch={handleSearch}
            onRefresh={handleRefresh}
            onAddStockAdjustment={() => setIsStockAdjustmentFormOpen(true)}
            messages={messages}
          />

          <div className="rounded-md border">
            <Table>
              <StockAdjustmentsTableBody
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
            onPageSizeChange={(size) => table.setPageSize(size)}
            onPreviousPage={table.previousPage}
            onNextPage={table.nextPage}
            canPreviousPage={table.getCanPreviousPage()}
            canNextPage={table.getCanNextPage()}
          />

          <StockAdjustmentsTableDialogs
            open={isStockAdjustmentFormOpen}
            setOpen={setIsStockAdjustmentFormOpen}
            messages={messages}
            onSubmit={handleSubmitStockAdjustmentForm}
            deleteDialogProps={deleteDialogProps}
            warehouses={warehouses || []}
            shelves={shelves || []}
            products={products || []}
          />
        </>
      )}
    </div>
  );
}
