import { Table } from "@/components/ui/table";
import { TablePagination } from "@/components/datatable/table-pagination";
import { useShelvesTableLogic } from "../../hooks/useShelvesTableLogic";
import { ShelvesTableBody } from "./ShelvesTableBody";
import { ShelvesTableDialogs } from "./ShelvesTableDialogs";
import { ShelvesTableHeader } from "./ShelvesTableHeader";


export default  function ShelvesTable() {
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
    setIsShelfFormOpen,
    isShelfFormOpen,
    editingShelf,
    setEditingShelf,
    handleSubmitShelfForm,
    deleteDialogProps,
    warehouses,
  } = useShelvesTableLogic();

  if (isError) {
    return <div className="text-center py-10">{messages("Shelves.errorLoading")}</div>;
  }

  return (
    <div className="w-full">
      <ShelvesTableHeader
        messages={messages}
        searchInput={searchInput}
        onSearchInputChange={setSearchInput}
        onSearch={handleSearch}
        onRefresh={handleRefresh}
        onAddShelf={() => setIsShelfFormOpen(true)}
        isLoading={isLoading}

      />
      <div className="rounded-md border">
        <Table>
          <ShelvesTableBody
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
      <ShelvesTableDialogs
        open={isShelfFormOpen}
        setOpen={setIsShelfFormOpen}
        editingShelf={editingShelf}
        setEditingShelf={setEditingShelf}
        messages={messages}
        onSubmit={handleSubmitShelfForm}
        deleteDialogProps={deleteDialogProps}
        warehouses={warehouses || []}
      />
    </div>
  );
}
