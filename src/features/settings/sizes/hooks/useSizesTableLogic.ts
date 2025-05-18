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
import { updateSize, createSize, deleteSize } from "@/lib/services/size-service";
import { toast } from "sonner";
import { Size } from "@/types/api.interfaces";
import type { SortingState } from "@tanstack/react-table";
import { useSizeColumns } from "./useSizeColumns";
import { useSizes } from "./useSizes";

export function useSizesTableLogic() {
    const { t: messages } = useTranslation();
    const dispatch = useDispatch<AppDispatch>();


    const [isSizeFormOpen, setIsSizeFormOpen] = useState(false);
    const [editingSize, setEditingSize] = useState<Size | null>(null);
    const [selectedSize, setSelectedSize] = useState<Size | null>(null);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [isDeletingSize, setIsDeletingSize] = useState(false);

    const [searchInput, setSearchInput] = useState("");
    const [appliedSearch, setAppliedSearch] = useState("");
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
    const [sorting, setSorting] = useState<SortingState>([]);

   

    const handleEditSize = (size: Size) => {
        setEditingSize(size);
        setIsSizeFormOpen(true);
    };

    const handledeleteSizeClick = (size: Size) => {
        setSelectedSize(size);
        setDeleteDialogOpen(true);
    };


    const handleConfirmdeleteSize = async () => {
        if (!selectedSize) return;
        setIsDeletingSize(true);
        try {
            const response = await deleteSize(selectedSize.id);
            response.result
                ? toast.success(response.message)
                : toast.error(response.message);
        } catch {
            toast.error(messages("Sizes.DeleteFailed"));
        } finally {
            setIsDeletingSize(false);
            setDeleteDialogOpen(false);
            refetch();
        }
    };

    const handleSubmitSizeForm = async (data: any) => {
        try {
            const formData = new FormData();
             formData.append('name[en]', data.name.en);
            formData.append('name[ar]', data.name.ar);
        
            const response = editingSize
                ? await updateSize(editingSize.id, formData)
                : await createSize(formData);

            response.result
                ? toast.success(response.message)
                : toast.error(response.message);

            setEditingSize(null);
            setIsSizeFormOpen(false);
            refetch();
            dispatch(fetchSettings());

        } catch (error) {
            console.error("Size submission failed:", error);
            toast.error(messages("Public.UnexpectedError"));
        }
    };

    const columns = useSizeColumns({
        handleEdit: handleEditSize,
        handleDelete: handledeleteSizeClick,
       
    });

    const { data, isLoading, isError, refetch } = useSizes({
        page: pagination.pageIndex + 1,
        per_page: pagination.pageSize,
        sort: sorting.length ? sorting[0].id : undefined,
        order: sorting.length ? (sorting[0].desc ? "desc" : "asc") : undefined,
        search: appliedSearch,
    });



    const table = useReactTable({
        data: data?.sizes || [],
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
        setIsSizeFormOpen,
        isSizeFormOpen,
        editingSize,
        setEditingSize,
        handleSubmitSizeForm,

        deleteDialogProps: {
            open: deleteDialogOpen,
            onClose: () => setDeleteDialogOpen(false),
            onConfirm: handleConfirmdeleteSize,
            loading: isDeletingSize,
            title: messages("Sizes.Delete Size"),
            description: messages("Sizes.Delete confirm"),
        },
    };
}
