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
import { updateOccupation, createOccupation, deleteOccupation } from "@/lib/services/occupations-service";
import { toast } from "sonner";
import { Occupation } from "@/types/api.interfaces";
import { useOccupations } from "./useOccupations";
import type { SortingState } from "@tanstack/react-table";
import { useOccupationColumns } from "./useOccupationColumns";

export function useOccupationsTableLogic() {
    const { t: messages } = useTranslation();
    const dispatch = useDispatch<AppDispatch>();


    const [isOccupationFormOpen, setIsOccupationFormOpen] = useState(false);
    const [editingOccupation, setEditingOccupation] = useState<Occupation | null>(null);
    const [selectedOccupation, setSelectedOccupation] = useState<Occupation | null>(null);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [isDeletingOccupation, setIsDeletingOccupation] = useState(false);

    const [searchInput, setSearchInput] = useState("");
    const [appliedSearch, setAppliedSearch] = useState("");
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
    const [sorting, setSorting] = useState<SortingState>([]);



    const handleEditOccupation = (occupation: Occupation) => {
        setEditingOccupation(occupation);
        setIsOccupationFormOpen(true);
    };

    const handledeleteOccupationClick = (occupation: Occupation) => {
        setSelectedOccupation(occupation);
        setDeleteDialogOpen(true);
    };

    const handleConfirmdeleteOccupation = async () => {
        if (!selectedOccupation) return;
        setIsDeletingOccupation(true);
        try {
            const response = await deleteOccupation(selectedOccupation.id);
            response.result
                ? toast.success(response.message)
                : toast.error(response.message);
        } catch {
            toast.error(messages("Occupations.DeleteFailed"));
        } finally {
            setIsDeletingOccupation(false);
            setDeleteDialogOpen(false);
            refetch();
        }
    };



    const handleSubmitOccupationForm = async (data: any) => {
        try {
            const formData = new FormData();
            formData.append('name[en]', data.name.en);
            formData.append('name[ar]', data.name.ar);

            const response = editingOccupation
                ? await updateOccupation(editingOccupation.id, formData)
                : await createOccupation(formData);

            response.result
                ? toast.success(response.message)
                : toast.error(response.message);

            setEditingOccupation(null);
            setIsOccupationFormOpen(false);
            refetch();
            dispatch(fetchSettings());

        } catch (error) {
            toast.error(messages("Public.UnexpectedError"));
        }
    };

    const columns = useOccupationColumns({
        handleEdit: handleEditOccupation,
        handleDelete: handledeleteOccupationClick,
    });

    const { data, isLoading, isError, refetch } = useOccupations({
        page: pagination.pageIndex + 1,
        per_page: pagination.pageSize,
        sort: sorting.length ? sorting[0].id : undefined,
        order: sorting.length ? (sorting[0].desc ? "desc" : "asc") : undefined,
        search: appliedSearch,
    });

    const table = useReactTable({
        data: data?.occupations || [],
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
        setIsOccupationFormOpen,
        isOccupationFormOpen,
        editingOccupation,
        setEditingOccupation,
        handleSubmitOccupationForm,

        deleteDialogProps: {
            open: deleteDialogOpen,
            onClose: () => setDeleteDialogOpen(false),
            onConfirm: handleConfirmdeleteOccupation,
            loading: isDeletingOccupation,
            title: messages("Occupations.Delete Occupation"),
            description: messages("Occupations.Delete confirm"),
        },
    };
}
