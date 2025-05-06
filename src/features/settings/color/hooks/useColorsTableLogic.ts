import { useEffect, useState } from "react";
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
import { updateColor, createColor, deleteColor } from "@/lib/services/color-service";
import { toast } from "sonner";
import { Color } from "@/types/api.interfaces";
import { useColors } from "./useColors";
import type { SortingState } from "@tanstack/react-table";
import { useColorColumns } from "./useColorColumns";
import { useColorSeasons } from "../../color-seasons/hooks/useColorSeasons";

export function useColorsTableLogic() {
    const { t: messages } = useTranslation();
    const dispatch = useDispatch<AppDispatch>();


    const [isColorFormOpen, setIsColorFormOpen] = useState(false);
    const [editingColor, setEditingColor] = useState<Color | null>(null);
    const [selectedColor, setSelectedColor] = useState<Color | null>(null);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [isDeletingColor, setIsDeletingColor] = useState(false);

    const [searchInput, setSearchInput] = useState("");
    const [appliedSearch, setAppliedSearch] = useState("");
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
    const [sorting, setSorting] = useState<SortingState>([]);

    useEffect(() => {
        dispatch(fetchSettings());
    }, [dispatch]);

    const handleEditColor = (color: Color) => {
        setEditingColor(color);
        setIsColorFormOpen(true);
    };

    const handledeleteColorClick = (color: Color) => {
        setSelectedColor(color);
        setDeleteDialogOpen(true);
    };

    const handleConfirmdeleteColor = async () => {
        if (!selectedColor) return;
        setIsDeletingColor(true);
        try {
            const response = await deleteColor(selectedColor.id);
            response.result
                ? toast.success(response.message)
                : toast.error(response.message);
        } catch {
            toast.error(messages("Colors.DeleteFailed"));
        } finally {
            setIsDeletingColor(false);
            setDeleteDialogOpen(false);
            refetch();
        }
    };



    const handleSubmitColorForm = async (data: any) => {
        try {
            const formData = new FormData();
            formData.append('name[en]', data.name.en);
            formData.append('name[ar]', data.name.ar);
            formData.append('code', data.code);
            formData.append('color_season_id', data.color_season_id);

            const response = editingColor
                ? await updateColor(editingColor.id, formData)
                : await createColor(formData);

            response.result
                ? toast.success(response.message)
                : toast.error(response.message);

            setEditingColor(null);
            setIsColorFormOpen(false);
            refetch();
        } catch (error) {
            console.error("Color submission failed:", error);
            toast.error(messages("Public.UnexpectedError"));
        }
    };

    const columns = useColorColumns({
        handleEdit: handleEditColor,
        handleDelete: handledeleteColorClick,
    });

    const { data, isLoading, isError, refetch } = useColors({
        page: pagination.pageIndex + 1,
        per_page: pagination.pageSize,
        sort: sorting.length ? sorting[0].id : undefined,
        order: sorting.length ? (sorting[0].desc ? "desc" : "asc") : undefined,
        search: appliedSearch,
    });
   const { data :colorSeasonsData,  } = useColorSeasons({
        page: pagination.pageIndex + 1,
        per_page: pagination.pageSize,
        sort: sorting.length ? sorting[0].id : undefined,
        order: sorting.length ? (sorting[0].desc ? "desc" : "asc") : undefined,
        search: appliedSearch,
    });
 
const colorSeasons = colorSeasonsData?.color_seasons;
    const table = useReactTable({
        data: data?.colors || [],
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
        setIsColorFormOpen,
        isColorFormOpen,
        editingColor,
        setEditingColor,
        handleSubmitColorForm,
        colorSeasons,
        deleteDialogProps: {
            open: deleteDialogOpen,
            onClose: () => setDeleteDialogOpen(false),
            onConfirm: handleConfirmdeleteColor,
            loading: isDeletingColor,
            title: messages("Colors.Delete Color"),
            description: messages("Colors.Delete confirm"),
        },
    };
}
