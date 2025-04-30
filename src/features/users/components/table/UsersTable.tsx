import { Table } from "@/components/ui/table";
import { TablePagination } from "@/components/datatable/table-pagination";
import { useUsersTableLogic } from "../../hooks/useUsersTableLogic";
import { UsersTableHeader } from "./UsersTableHeader";
import { UsersTableBody } from "./UsersTableBody";
import { UsersTableDialogs } from "./UsersTableDialogs";

export function UsersTable() {
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
    setIsUserFormOpen,
    isUserFormOpen,
    editingUser,
    setEditingUser,
    handleSubmitUserForm,
    deleteDialogProps,
    toggleStatusDialogProps,
    userFormProps,
  } = useUsersTableLogic();

  if (isError) {
    return <div className="text-center py-10">{messages("Users.errorLoading")}</div>;
  }

  return (
    <div className="w-full">
      <UsersTableHeader
        messages={messages}
        searchInput={searchInput}
        onSearchInputChange={setSearchInput}
        onSearch={handleSearch}
        onRefresh={handleRefresh}
        onAddUser={() => setIsUserFormOpen(true)}
        isLoading={isLoading}
      />
      <div className="rounded-md border">
        <Table>
          <UsersTableBody
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
      <UsersTableDialogs
        open={isUserFormOpen}
        setOpen={setIsUserFormOpen}
        editingUser={editingUser}
        setEditingUser={setEditingUser}
        messages={messages}
        onSubmit={handleSubmitUserForm}
        roles={userFormProps.roles}
        permissions={userFormProps.permissions}
        deleteDialogProps={deleteDialogProps}
        activeDialogProps={toggleStatusDialogProps}
      />
    </div>
  );
}
