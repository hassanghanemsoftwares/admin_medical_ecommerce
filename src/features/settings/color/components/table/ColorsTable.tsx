import { Table } from "@/components/ui/table";
import { TablePagination } from "@/components/datatable/table-pagination";
import { useColorsTableLogic } from "../../hooks/useColorsTableLogic";
import { ColorsTableBody } from "./ColorsTableBody";
import { ColorsTableDialogs } from "./ColorsTableDialogs";
import { ColorsTableHeader } from "./ColorsTableHeader";


export default  function ColorsTable() {
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
    setIsColorFormOpen,
    isColorFormOpen,
    editingColor,
    setEditingColor,
    handleSubmitColorForm,
    deleteDialogProps,
    colorSeasons,
  } = useColorsTableLogic();

  if (isError) {
    return <div className="text-center py-10">{messages("Colors.errorLoading")}</div>;
  }

  return (
    <div className="w-full">
      <ColorsTableHeader
        messages={messages}
        searchInput={searchInput}
        onSearchInputChange={setSearchInput}
        onSearch={handleSearch}
        onRefresh={handleRefresh}
        onAddColor={() => setIsColorFormOpen(true)}
        isLoading={isLoading}

      />
      <div className="rounded-md border">
        <Table>
          <ColorsTableBody
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
      <ColorsTableDialogs
        open={isColorFormOpen}
        setOpen={setIsColorFormOpen}
        editingColor={editingColor}
        setEditingColor={setEditingColor}
        messages={messages}
        onSubmit={handleSubmitColorForm}
        deleteDialogProps={deleteDialogProps}
        colorSeasons={colorSeasons || []}
      />
    </div>
  );
}
