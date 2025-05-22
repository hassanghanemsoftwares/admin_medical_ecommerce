import { Table } from "@/components/ui/table";
import { TablePagination } from "@/components/datatable/table-pagination";
import { OccupationsTableBody } from "./OccupationsTableBody";
import { OccupationsTableHeader } from "./OccupationsTableHeader";
import { useOccupationsTableLogic } from "../../hooks/useOccupationsTableLogic";
import { OccupationsTableDialogs } from "./OccupationsTableDialogs";


export default  function OccupationsTable() {
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
    setIsOccupationFormOpen,
    isOccupationFormOpen,
    editingOccupation,
    setEditingOccupation,
    handleSubmitOccupationForm,
    deleteDialogProps,
  } = useOccupationsTableLogic();

  if (isError) {
    return <div className="text-center py-10">{messages("Occupations.errorLoading")}</div>;
  }

  return (
    <div className="w-full">
      <OccupationsTableHeader
        messages={messages}
        searchInput={searchInput}
        onSearchInputChange={setSearchInput}
        onSearch={handleSearch}
        onRefresh={handleRefresh}
        onAddOccupation={() => setIsOccupationFormOpen(true)}
        isLoading={isLoading}

      />
      <div className="rounded-md border">
        <Table>
          <OccupationsTableBody
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
      <OccupationsTableDialogs
        open={isOccupationFormOpen}
        setOpen={setIsOccupationFormOpen}
        editingOccupation={editingOccupation}
        setEditingOccupation={setEditingOccupation}
        messages={messages}
        onSubmit={handleSubmitOccupationForm}
        deleteDialogProps={deleteDialogProps}
      />
    </div>
  );
}
