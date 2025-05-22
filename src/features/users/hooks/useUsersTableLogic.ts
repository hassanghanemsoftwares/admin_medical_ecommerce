import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
} from "@tanstack/react-table";
import { RootState, AppDispatch } from "@/lib/store/store";
import { fetchSettings } from "@/lib/store/slices/settingsSlice";
import { updateUser, createUser, deleteUser } from "@/lib/services/users-service";
import { toast } from "sonner";
import { User } from "@/types/api.interfaces";
import { useUsers } from "./useUsers";
import type { SortingState } from "@tanstack/react-table";
import { useUserColumns } from "./useUserColumns";

export function useUsersTableLogic() {
    const { t: messages } = useTranslation();
    const dispatch = useDispatch<AppDispatch>();
    const { roles, permissions } = useSelector((state: RootState) => state.settings);

    const [isUserFormOpen, setIsUserFormOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [isDeletingUser, setIsDeletingUser] = useState(false);

    const [toggleStatusDialogOpen, setToggleStatusDialogOpen] = useState(false);
    const [isTogglingStatus, setIsTogglingStatus] = useState(false);

    const [searchInput, setSearchInput] = useState("");
    const [appliedSearch, setAppliedSearch] = useState("");
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
    const [sorting, setSorting] = useState<SortingState>([]);

    useEffect(() => {
        dispatch(fetchSettings());
    }, [dispatch]);

    const handleEditUser = (user: User) => {
        setEditingUser(user);
        setIsUserFormOpen(true);
    };

    const handleDeleteUserClick = (user: User) => {
        setSelectedUser(user);
        setDeleteDialogOpen(true);
    };

    const handleToggleStatusClick = (user: User) => {
        setSelectedUser(user);
        setToggleStatusDialogOpen(true);
    };

    const handleConfirmDeleteUser = async () => {
        if (!selectedUser) return;
        setIsDeletingUser(true);
        try {
            const response = await deleteUser(selectedUser.id);
            response.result
                ? toast.success(response.message)
                : toast.error(response.message);
        } catch {
            toast.error(messages("Users.DeleteFailed"));
        } finally {
            setIsDeletingUser(false);
            setDeleteDialogOpen(false);
            refetch();
        }
    };

    const handleConfirmToggleStatus = async () => {
        if (!selectedUser) return;
        setIsTogglingStatus(true);
        try {
            const response = await updateUser(selectedUser.id, {
                is_active: !selectedUser.is_active,
            });
         
            response.result
                ? toast.success(response.message)
                : toast.error(response.message);
        } catch {
            toast.error(messages("Users.StatusUpdateFailed"));
        } finally {
            setIsTogglingStatus(false);
            setToggleStatusDialogOpen(false);
            refetch();
        }
    };

    const handleSubmitUserForm = async (data: any) => {
        try {
            const response = editingUser
                ? await updateUser(editingUser.id, data)
                : await createUser(data);

            response.result
                ? toast.success(response.message)
                : toast.error(response.message);

            setEditingUser(null);
            setIsUserFormOpen(false);
            refetch();
        } catch (error) {
            toast.error(messages("Users.UnexpectedError"));
        }
    };

    const columns = useUserColumns({
        handleEdit: handleEditUser,
        handleDelete: handleDeleteUserClick,
        handleToggleActive: handleToggleStatusClick,
    });

    const { data, isLoading, isError, refetch } = useUsers({
        page: pagination.pageIndex + 1,
        per_page: pagination.pageSize,
        sort: sorting.length ? sorting[0].id : undefined,
        order: sorting.length ? (sorting[0].desc ? "desc" : "asc") : undefined,
        search: appliedSearch,
    });

    const table = useReactTable({
        data: data?.users || [],
        columns,
        pageCount: data?.pagination?.last_page || -1,
        state: { sorting, pagination, globalFilter: appliedSearch },
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: true,
        manualFiltering: true,
        manualSorting: true,
    });

    const handleSearch = () => {
        setAppliedSearch(searchInput);
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    };

    const handleRefresh = () => refetch();

    return {
        messages,
        table,
        columns,
        data,
        isLoading,
        isError,
        appliedSearch,
        pagination,
        handleSearch,
        handleRefresh,
        setSearchInput,
        searchInput,
        setIsUserFormOpen,
        isUserFormOpen,
        editingUser,
        setEditingUser,
        handleSubmitUserForm,

        deleteDialogProps: {
            open: deleteDialogOpen,
            onClose: () => setDeleteDialogOpen(false),
            onConfirm: handleConfirmDeleteUser,
            loading: isDeletingUser,
            title: messages("Users.Delete user"),
            description: messages("Users.Delete confirm", {
                name: selectedUser?.name || "",
            }),
        },

        toggleStatusDialogProps: {
            open: toggleStatusDialogOpen,
            onOpenChange: () => setToggleStatusDialogOpen(false),
            handleConfirm: handleConfirmToggleStatus,
            isLoading: isTogglingStatus,
            title: messages("Users.Toggle Status"),
            desc: selectedUser?.is_active
                ? messages("Users.Confirm Deactivate")
                : messages("Users.Confirm Activate"),
        },

        userFormProps: {
            roles,
            permissions,
        },
    };
}
