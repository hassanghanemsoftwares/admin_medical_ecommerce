import { Table } from "@/components/ui/table";
import { TablePagination } from "@/components/datatable/table-pagination";
import { useColorSeasonsTableLogic } from "../../hooks/useColorSeasonsTableLogic";
import { ColorSeasonsTableBody } from "./ColorSeasonsTableBody";
import { ColorSeasonsTableDialogs } from "./ColorSeasonsTableDialogs";
import { ColorSeasonsTableHeader } from "./ColorSeasonsTableHeader";


export function ColorSeasonsTable() {
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
    setIsColorSeasonFormOpen,
    isColorSeasonFormOpen,
    editingColorSeason,
    setEditingColorSeason,
    handleSubmitColorSeasonForm,
    deleteDialogProps,
  } = useColorSeasonsTableLogic();

  if (isError) {
    return <div className="text-center py-10">{messages("ColorSeasons.errorLoading")}</div>;
  }

  return (
    <div className="w-full">
      <ColorSeasonsTableHeader
        messages={messages}
        searchInput={searchInput}
        onSearchInputChange={setSearchInput}
        onSearch={handleSearch}
        onRefresh={handleRefresh}
        onAddColorSeason={() => setIsColorSeasonFormOpen(true)}
        isLoading={isLoading}

      />
      <div className="rounded-md border">
        <Table>
          <ColorSeasonsTableBody
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
      <ColorSeasonsTableDialogs
        open={isColorSeasonFormOpen}
        setOpen={setIsColorSeasonFormOpen}
        editingColorSeason={editingColorSeason}
        setEditingColorSeason={setEditingColorSeason}
        messages={messages}
        onSubmit={handleSubmitColorSeasonForm}
        deleteDialogProps={deleteDialogProps}
      />
    </div>
  );
}
