import { Table } from "@/components/ui/table";
import { TablePagination } from "@/components/datatable/table-pagination";
import { useCategoriesTableLogic } from "../../hooks/useCategoriesTableLogic";
import { CategoriesTableBody } from "./CategoriesTableBody";
import { CategoriesTableDialogs } from "./CategoriesTableDialogs";
import { CategoriesTableHeader } from "./CategoriesTableHeader";


export function CategoriesTable() {
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
    setIsCategoryFormOpen,
    isCategoryFormOpen,
    editingCategory,
    setEditingCategory,
    handleSubmitCategoryForm,
    deleteDialogProps,
    toggleStatusDialogProps,
    arrangements
  } = useCategoriesTableLogic();

  if (isError) {
    return <div className="text-center py-10">{messages("Categories.errorLoading")}</div>;
  }

  return (
    <div className="w-full">
      <CategoriesTableHeader
        messages={messages}
        searchInput={searchInput}
        onSearchInputChange={setSearchInput}
        onSearch={handleSearch}
        onRefresh={handleRefresh}
        onAddCategory={() => setIsCategoryFormOpen(true)}
        isLoading={isLoading}
        
      />
      <div className="rounded-md border">
        <Table>
          <CategoriesTableBody
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
      <CategoriesTableDialogs
        open={isCategoryFormOpen}
        setOpen={setIsCategoryFormOpen}
        editingCategory={editingCategory}
        setEditingCategory={setEditingCategory}
        messages={messages}
        onSubmit={handleSubmitCategoryForm}
        deleteDialogProps={deleteDialogProps}
        activeDialogProps={toggleStatusDialogProps}
        arrangements={arrangements}
      />
    </div>
  );
}
