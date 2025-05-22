import { Table } from "@/components/ui/table";
import { TablePagination } from "@/components/datatable/table-pagination";
import { useTagsTableLogic } from "../../hooks/useTagsTableLogic";
import { TagsTableBody } from "./TagsTableBody";
import { TagsTableDialogs } from "./TagsTableDialogs";
import { TagsTableHeader } from "./TagsTableHeader";

export default function TagsTable() {
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
    setIsTagFormOpen,
    isTagFormOpen,
    editingTag,
    setEditingTag,
    handleSubmitTagForm,
    deleteDialogProps
    
    
  } = useTagsTableLogic();

  if (isError) {
    return <div className="text-center py-10">{messages("Tags.errorLoading")}</div>;
  }

  return (
    <div className="w-full">
      <TagsTableHeader
        messages={messages}
        searchInput={searchInput}
        onSearchInputChange={setSearchInput}
        onSearch={handleSearch}
        onRefresh={handleRefresh}
        onAddTag={() => setIsTagFormOpen(true)}
        isLoading={isLoading}
        
      />
      <div className="rounded-md border">
        <Table>
          <TagsTableBody
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
        onPageSizeChange={(Tag) => table.setPageSize(Tag)}
        onPreviousPage={table.previousPage}
        onNextPage={table.nextPage}
        canPreviousPage={table.getCanPreviousPage()}
        canNextPage={table.getCanNextPage()}
      />
      <TagsTableDialogs
        open={isTagFormOpen}
        setOpen={setIsTagFormOpen}
        editingTag={editingTag}
        setEditingTag={setEditingTag}
        messages={messages}
        onSubmit={handleSubmitTagForm}
        deleteDialogProps={deleteDialogProps}
       
       
      />
    </div>
  );
}
