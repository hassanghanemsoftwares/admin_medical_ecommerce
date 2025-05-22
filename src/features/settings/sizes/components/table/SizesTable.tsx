import { Table } from "@/components/ui/table";
import { TablePagination } from "@/components/datatable/table-pagination";
import { useSizesTableLogic } from "../../hooks/useSizesTableLogic";
import { SizesTableBody } from "./SizesTableBody";
import { SizesTableDialogs } from "./SizesTableDialogs";
import { SizesTableHeader } from "./SizesTableHeader";

export default  function SizesTable() {
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
    setIsSizeFormOpen,
    isSizeFormOpen,
    editingSize,
    setEditingSize,
    handleSubmitSizeForm,
    deleteDialogProps
    
    
  } = useSizesTableLogic();

  if (isError) {
    return <div className="text-center py-10">{messages("Sizes.errorLoading")}</div>;
  }

  return (
    <div className="w-full">
      <SizesTableHeader
        messages={messages}
        searchInput={searchInput}
        onSearchInputChange={setSearchInput}
        onSearch={handleSearch}
        onRefresh={handleRefresh}
        onAddSize={() => setIsSizeFormOpen(true)}
        isLoading={isLoading}
        
      />
      <div className="rounded-md border">
        <Table>
          <SizesTableBody
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
      <SizesTableDialogs
        open={isSizeFormOpen}
        setOpen={setIsSizeFormOpen}
        editingSize={editingSize}
        setEditingSize={setEditingSize}
        messages={messages}
        onSubmit={handleSubmitSizeForm}
        deleteDialogProps={deleteDialogProps}
       
       
      />
    </div>
  );
}
