import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
} from "@tanstack/react-table";
import { AppDispatch } from "@/lib/store/store";
import { fetchSettings } from "@/lib/store/slices/settingsSlice";
import { updateShelf, createShelf, deleteShelf } from "@/lib/services/shelf-service";
import { toast } from "sonner";
import { Shelf } from "@/types/api.interfaces";
import { useShelves } from "./useShelves";
import type { SortingState } from "@tanstack/react-table";
import { useShelfColumns } from "./useShelfColumns";
import { useWarehouses } from "../../warehouses/hooks/useWarehouses";


export function useShelvesTableLogic() {
    const { t: messages } = useTranslation();
    const dispatch = useDispatch<AppDispatch>();


    const [isShelfFormOpen, setIsShelfFormOpen] = useState(false);
    const [editingShelf, setEditingShelf] = useState<Shelf | null>(null);
    const [selectedShelf, setSelectedShelf] = useState<Shelf | null>(null);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [isDeletingShelf, setIsDeletingShelf] = useState(false);

    const [searchInput, setSearchInput] = useState("");
    const [appliedSearch, setAppliedSearch] = useState("");
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
    const [sorting, setSorting] = useState<SortingState>([]);


    const handleEditShelf = (shelf: Shelf) => {
        setEditingShelf(shelf);
        setIsShelfFormOpen(true);
    };

    const handledeleteShelfClick = (shelf: Shelf) => {
        setSelectedShelf(shelf);
        setDeleteDialogOpen(true);
    };

    const handleConfirmdeleteShelf = async () => {
        if (!selectedShelf) return;
        setIsDeletingShelf(true);
        try {
            const response = await deleteShelf(selectedShelf.id);
            response.result
                ? toast.success(response.message)
                : toast.error(response.message);
        } catch {
            toast.error(messages("Shelves.DeleteFailed"));
        } finally {
            setIsDeletingShelf(false);
            setDeleteDialogOpen(false);
            refetch();
        }
    };



    const handleSubmitShelfForm = async (data: any) => {
        try {
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('location', data.location);
            formData.append('warehouse_id', data.warehouse_id);

            const response = editingShelf
                ? await updateShelf(editingShelf.id, formData)
                : await createShelf(formData);

            response.result
                ? toast.success(response.message)
                : toast.error(response.message);

            setEditingShelf(null);
            setIsShelfFormOpen(false);
            refetch();
            dispatch(fetchSettings());

        } catch (error) {
            console.error("Shelf submission failed:", error);
            toast.error(messages("Public.UnexpectedError"));
        }
    };

    const columns = useShelfColumns({
        handleEdit: handleEditShelf,
        handleDelete: handledeleteShelfClick,
    });

    const { data, isLoading, isError, refetch } = useShelves({
        page: pagination.pageIndex + 1,
        per_page: pagination.pageSize,
        sort: sorting.length ? sorting[0].id : undefined,
        order: sorting.length ? (sorting[0].desc ? "desc" : "asc") : undefined,
        search: appliedSearch,
    });
    const { data: warehousesData, } = useWarehouses({
        page: pagination.pageIndex + 1,
        per_page: pagination.pageSize,
        sort: sorting.length ? sorting[0].id : undefined,
        order: sorting.length ? (sorting[0].desc ? "desc" : "asc") : undefined,
        search: appliedSearch,
    });

    const warehouses = warehousesData?.warehouses;
    const table = useReactTable({
        data: data?.shelves || [],
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
        setIsShelfFormOpen,
        isShelfFormOpen,
        editingShelf,
        setEditingShelf,
        handleSubmitShelfForm,
        warehouses,
        deleteDialogProps: {
            open: deleteDialogOpen,
            onClose: () => setDeleteDialogOpen(false),
            onConfirm: handleConfirmdeleteShelf,
            loading: isDeletingShelf,
            title: messages("Shelves.Delete Shelf"),
            description: messages("Shelves.Delete confirm"),
        },
    };
}
