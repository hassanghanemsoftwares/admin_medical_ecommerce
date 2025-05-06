import { Table } from "@/components/ui/table";
import { TablePagination } from "@/components/datatable/table-pagination";
import { useBrandsTableLogic } from "../../hooks/useBrandsTableLogic";
import { BrandsTableBody } from "./BrandsTableBody";
import { BrandsTableDialogs } from "./BrandsTableDialogs";
import { BrandsTableHeader } from "./BrandsTableHeader";

export function BrandsTable() {
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
    setIsBrandFormOpen,
    isBrandFormOpen,
    editingBrand,
    setEditingBrand,
    handleSubmitBrandForm,
    deleteDialogProps,
    toggleStatusDialogProps
    
  } = useBrandsTableLogic();

  if (isError) {
    return <div className="text-center py-10">{messages("Brands.errorLoading")}</div>;
  }

  return (
    <div className="w-full">
      <BrandsTableHeader
        messages={messages}
        searchInput={searchInput}
        onSearchInputChange={setSearchInput}
        onSearch={handleSearch}
        onRefresh={handleRefresh}
        onAddBrand={() => setIsBrandFormOpen(true)}
        isLoading={isLoading}
      />
      <div className="rounded-md border">
        <Table>
          <BrandsTableBody
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
      <BrandsTableDialogs
        open={isBrandFormOpen}
        setOpen={setIsBrandFormOpen}
        editingBrand={editingBrand}
        setEditingBrand={setEditingBrand}
        messages={messages}
        onSubmit={handleSubmitBrandForm}
        deleteDialogProps={deleteDialogProps}
        activeDialogProps={toggleStatusDialogProps}
       
      />
    </div>
  );
}
