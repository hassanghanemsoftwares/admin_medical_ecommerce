import { Table } from "@/components/ui/table";
import { TablePagination } from "@/components/datatable/table-pagination";
import { useWarehousesTableLogic } from "../../hooks/useWarehousesTableLogic";
import { WarehousesTableBody } from "./WarehousesTableBody";
import { WarehousesTableDialogs } from "./WarehousesTableDialogs";
import { WarehousesTableHeader } from "./WarehousesTableHeader";

export default  function WarehousesTable() {
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
    setIsWarehouseFormOpen,
    isWarehouseFormOpen,
    editingWarehouse,
    setEditingWarehouse,
    handleSubmitWarehouseForm,
    deleteDialogProps


  } = useWarehousesTableLogic();

  if (isError) {
    return <div className="text-center py-10">{messages("Warehouses.errorLoading")}</div>;
  }

  return (
    <div className="w-full">
      <WarehousesTableHeader
        messages={messages}
        searchInput={searchInput}
        onSearchInputChange={setSearchInput}
        onSearch={handleSearch}
        onRefresh={handleRefresh}
        onAddWarehouse={() => setIsWarehouseFormOpen(true)}
        isLoading={isLoading}

      />
      <div className="rounded-md border">
        <Table>
          <WarehousesTableBody
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
        onPageSizeChange={(Warehouse) => table.setPageSize(Warehouse)}
        onPreviousPage={table.previousPage}
        onNextPage={table.nextPage}
        canPreviousPage={table.getCanPreviousPage()}
        canNextPage={table.getCanNextPage()}
      />
      <WarehousesTableDialogs
        open={isWarehouseFormOpen}
        setOpen={setIsWarehouseFormOpen}
        editingWarehouse={editingWarehouse}
        setEditingWarehouse={setEditingWarehouse}
        messages={messages}
        onSubmit={handleSubmitWarehouseForm}
        deleteDialogProps={deleteDialogProps}


      />
    </div>
  );
}
