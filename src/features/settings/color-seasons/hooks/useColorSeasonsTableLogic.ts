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
import { updateColorSeason, createColorSeason, deleteColorSeason } from "@/lib/services/color-season-service";
import { toast } from "sonner";
import { ColorSeason } from "@/types/api.interfaces";
import { useColorSeasons } from "./useColorSeasons";
import type { SortingState } from "@tanstack/react-table";
import { useColorSeasonColumns } from "./useColorSeasonColumns";

export function useColorSeasonsTableLogic() {
    const { t: messages } = useTranslation();
    const dispatch = useDispatch<AppDispatch>();


    const [isColorSeasonFormOpen, setIsColorSeasonFormOpen] = useState(false);
    const [editingColorSeason, setEditingColorSeason] = useState<ColorSeason | null>(null);
    const [selectedColorSeason, setSelectedColorSeason] = useState<ColorSeason | null>(null);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [isDeletingColorSeason, setIsDeletingColorSeason] = useState(false);

    const [searchInput, setSearchInput] = useState("");
    const [appliedSearch, setAppliedSearch] = useState("");
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
    const [sorting, setSorting] = useState<SortingState>([]);


    const handleEditColorSeason = (colorSeason: ColorSeason) => {
        setEditingColorSeason(colorSeason);
        setIsColorSeasonFormOpen(true);
    };

    const handledeleteColorSeasonClick = (colorSeason: ColorSeason) => {
        setSelectedColorSeason(colorSeason);
        setDeleteDialogOpen(true);
    };

    const handleConfirmdeleteColorSeason = async () => {
        if (!selectedColorSeason) return;
        setIsDeletingColorSeason(true);
        try {
            const response = await deleteColorSeason(selectedColorSeason.id);
            response.result
                ? toast.success(response.message)
                : toast.error(response.message);
        } catch {
            toast.error(messages("ColorSeasons.DeleteFailed"));
        } finally {
            setIsDeletingColorSeason(false);
            setDeleteDialogOpen(false);
            refetch();
        }
    };



    const handleSubmitColorSeasonForm = async (data: any) => {
        try {
            const formData = new FormData();
            formData.append('name[en]', data.name.en);
            formData.append('name[ar]', data.name.ar);
           
            const response = editingColorSeason
                ? await updateColorSeason(editingColorSeason.id, formData)
                : await createColorSeason(formData);

            response.result
                ? toast.success(response.message)
                : toast.error(response.message);

            setEditingColorSeason(null);
            setIsColorSeasonFormOpen(false);
            refetch();
        dispatch(fetchSettings());

        } catch (error) {
            console.error("ColorSeason submission failed:", error);
            toast.error(messages("Public.UnexpectedError"));
        }
    };

    const columns = useColorSeasonColumns({
        handleEdit: handleEditColorSeason,
        handleDelete: handledeleteColorSeasonClick,
    });

    const { data, isLoading, isError, refetch } = useColorSeasons({
        page: pagination.pageIndex + 1,
        per_page: pagination.pageSize,
        sort: sorting.length ? sorting[0].id : undefined,
        order: sorting.length ? (sorting[0].desc ? "desc" : "asc") : undefined,
        search: appliedSearch,
    });

    const table = useReactTable({
        data: data?.color_seasons || [],
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
        setIsColorSeasonFormOpen,
        isColorSeasonFormOpen,
        editingColorSeason,
        setEditingColorSeason,
        handleSubmitColorSeasonForm,

        deleteDialogProps: {
            open: deleteDialogOpen,
            onClose: () => setDeleteDialogOpen(false),
            onConfirm: handleConfirmdeleteColorSeason,
            loading: isDeletingColorSeason,
            title: messages("ColorSeasons.Delete ColorSeason"),
            description: messages("ColorSeasons.Delete confirm"),
        },
    };
}
