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
import { updateTag, createTag, deleteTag } from "@/lib/services/tag-service";
import { toast } from "sonner";
import { Tag } from "@/types/api.interfaces";
import type { SortingState } from "@tanstack/react-table";
import { useTagColumns } from "./useTagColumns";
import { useTags } from "./useTags";

export function useTagsTableLogic() {
    const { t: messages } = useTranslation();
    const dispatch = useDispatch<AppDispatch>();


    const [isTagFormOpen, setIsTagFormOpen] = useState(false);
    const [editingTag, setEditingTag] = useState<Tag | null>(null);
    const [selectedTag, setSelectedTag] = useState<Tag | null>(null);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [isDeletingTag, setIsDeletingTag] = useState(false);

    const [searchInput, setSearchInput] = useState("");
    const [appliedSearch, setAppliedSearch] = useState("");
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
    const [sorting, setSorting] = useState<SortingState>([]);



    const handleEditTag = (tag: Tag) => {
        setEditingTag(tag);
        setIsTagFormOpen(true);
    };

    const handledeleteTagClick = (tag: Tag) => {
        setSelectedTag(tag);
        setDeleteDialogOpen(true);
    };


    const handleConfirmdeleteTag = async () => {
        if (!selectedTag) return;
        setIsDeletingTag(true);
        try {
            const response = await deleteTag(selectedTag.id);
            response.result
                ? toast.success(response.message)
                : toast.error(response.message);
        } catch {
            toast.error(messages("Tags.DeleteFailed"));
        } finally {
            setIsDeletingTag(false);
            setDeleteDialogOpen(false);
            refetch();
        }
    };

    const handleSubmitTagForm = async (data: any) => {
        try {
            const formData = new FormData();
            formData.append('name', data.name);

            const response = editingTag
                ? await updateTag(editingTag.id, formData)
                : await createTag(formData);

            response.result
                ? toast.success(response.message)
                : toast.error(response.message);

            setEditingTag(null);
            setIsTagFormOpen(false);
            refetch();
            dispatch(fetchSettings());

        } catch (error) {
            toast.error(messages("Public.UnexpectedError"));
        }
    };

    const columns = useTagColumns({
        handleEdit: handleEditTag,
        handleDelete: handledeleteTagClick,

    });

    const { data, isLoading, isError, refetch } = useTags({
        page: pagination.pageIndex + 1,
        per_page: pagination.pageSize,
        sort: sorting.length ? sorting[0].id : undefined,
        order: sorting.length ? (sorting[0].desc ? "desc" : "asc") : undefined,
        search: appliedSearch,
    });



    const table = useReactTable({
        data: data?.tags || [],
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
        setIsTagFormOpen,
        isTagFormOpen,
        editingTag,
        setEditingTag,
        handleSubmitTagForm,

        deleteDialogProps: {
            open: deleteDialogOpen,
            onClose: () => setDeleteDialogOpen(false),
            onConfirm: handleConfirmdeleteTag,
            loading: isDeletingTag,
            title: messages("Tags.Delete Tag"),
            description: messages("Tags.Delete confirm"),
        },
    };
}
