import { Table } from "@/components/ui/table";
import { TablePagination } from "@/components/datatable/table-pagination";
import { ProductsTableHeader } from "./ProductsTableHeader";
import { useProductsTableLogic } from "../../hooks/useProductsTableLogic";
import { ProductsTableBody } from "./ProductsTableBody";
import { ProductsTableDialogs } from "./ProductsTableDialogs";


export function ProductsTable() {
  const {
    table,
    columns,
    data,
    isLoading,
    isError,
    messages,
    appliedSearch,
    handleSearch,
    handleRefresh,
    setSearchInput,
    searchInput,
    deleteDialogProps
  } = useProductsTableLogic();

  if (isError) {
    return <div className="text-center py-10">{messages("Product.errorLoading")}</div>;
  }

  return (
    <div className="w-full">
      <ProductsTableHeader
        messages={messages}
        searchInput={searchInput}
        onSearchInputChange={setSearchInput}
        onSearch={handleSearch}
        onRefresh={handleRefresh}
    
        isLoading={isLoading}
        
      />
      <div className="rounded-md border">
        <Table>
          <ProductsTableBody
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
           <ProductsTableDialogs
           
              deleteDialogProps={deleteDialogProps}
           
            />
    </div>
  );
}
