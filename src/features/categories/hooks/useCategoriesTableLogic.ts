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
import { updateCategory, createCategory, deleteCategory } from "@/lib/services/categories-service";
import { toast } from "sonner";
import { Category } from "@/types/api.interfaces";
import { useCategories } from "./useCategories";
import type { SortingState } from "@tanstack/react-table";
import { useCategoryColumns } from "./useCategoryColumns";

export function useCategoriesTableLogic() {
    const { t: messages } = useTranslation();
    const dispatch = useDispatch<AppDispatch>();


    const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [isDeletingCategory, setIsDeletingCategory] = useState(false);

    const [toggleStatusDialogOpen, setToggleStatusDialogOpen] = useState(false);
    const [isTogglingStatus, setIsTogglingStatus] = useState(false);

    const [searchInput, setSearchInput] = useState("");
    const [appliedSearch, setAppliedSearch] = useState("");
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
    const [sorting, setSorting] = useState<SortingState>([]);

    useEffect(() => {
        dispatch(fetchSettings());
    }, [dispatch]);

    const handleEditCategory = (category: Category) => {
        setEditingCategory(category);
        setIsCategoryFormOpen(true);
    };

    const handleDeleteCategoryClick = (category: Category) => {
        setSelectedCategory(category);
        setDeleteDialogOpen(true);
    };

    const handleToggleStatusClick = (category: Category) => {
        setSelectedCategory(category);
        setToggleStatusDialogOpen(true);
    };

    const handleConfirmDeleteCategory = async () => {
        if (!selectedCategory) return;
        setIsDeletingCategory(true);
        try {
            const response = await deleteCategory(selectedCategory.id);
            response.result
                ? toast.success(response.message)
                : toast.error(response.message);
        } catch {
            toast.error(messages("Categories.DeleteFailed"));
        } finally {
            setIsDeletingCategory(false);
            setDeleteDialogOpen(false);
            refetch();
        }
    };

    const handleConfirmToggleStatus = async () => {
        if (!selectedCategory) {
            console.error("No category selected for status toggle");
            return;
        }
    
        setIsTogglingStatus(true);
    
        try {
            const newStatus = !selectedCategory.is_active;
            console.log(`Updating category ${selectedCategory.id} status to: ${newStatus}`);
            
            // Create a new FormData object to send only the is_active field as a boolean
            const formData = new FormData();
            formData.append('is_active', newStatus ? '1' : '0');  // Send 1 or 0 instead of true/false
    
            // Optionally, append the existing category data (if necessary)
            formData.append('name[en]', selectedCategory.name.en);
            formData.append('name[ar]', selectedCategory.name.ar);
            formData.append('arrangement', selectedCategory.arrangement.toString());
    
            // Send the updated category status
            const response = await updateCategory(selectedCategory.id, formData);
    
            if (!response) {
                throw new Error("Empty response received");
            }
    
            console.log("Status toggle response:", response);
    
            if (response.result) {
                toast.success(response.message || messages("Categories.StatusUpdateSuccess"));
            } else {
                toast.error(response.message || messages("Categories.StatusUpdateFailed"));
            }
        } catch (error) {
            console.error("Error toggling category status:", error);
            toast.error(messages("Categories.StatusUpdateFailed"));
        } finally {
            setIsTogglingStatus(false);
            setToggleStatusDialogOpen(false);
            refetch();
        }
    };
    
    

    const handleSubmitCategoryForm = async (data: any) => {
        try {
            const formData = new FormData();
            formData.append('name[en]', data.name.en);
            formData.append('name[ar]', data.name.ar);
            if (data.arrangement) {
                formData.append('arrangement', data.arrangement);
            }

            if (!editingCategory) {
                if (data.image instanceof File) {
                    formData.append('image', data.image);
                } else {
                    throw new Error(messages("category.image_required"));
                }
            } else {
                if (data.image instanceof File) {
                    formData.append('image', data.image);
                }
            }

            const response = editingCategory
                ? await updateCategory(editingCategory.id, formData)
                : await createCategory(formData);

            response.result
                ? toast.success(response.message)
                : toast.error(response.message);

            setEditingCategory(null);
            setIsCategoryFormOpen(false);
            refetch();
        } catch (error) {
            console.error("Category submission failed:", error);
            toast.error(messages("Categories.UnexpectedError"));
        }
    };

    const columns = useCategoryColumns({
        handleEdit: handleEditCategory,
        handleDelete: handleDeleteCategoryClick,
        handleToggleActive: handleToggleStatusClick,
    });

    const { data, isLoading, isError, refetch } = useCategories({
        page: pagination.pageIndex + 1,
        per_page: pagination.pageSize,
        sort: sorting.length ? sorting[0].id : undefined,
        order: sorting.length ? (sorting[0].desc ? "desc" : "asc") : undefined,
        search: appliedSearch,
    });
    const arrangements = Array.isArray(data?.categories)
        ? data.categories.map((category: Category) => category.arrangement)
        : [];


    const table = useReactTable({
        data: data?.categories || [],
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
        setIsCategoryFormOpen,
        isCategoryFormOpen,
        editingCategory,
        setEditingCategory,
        handleSubmitCategoryForm,

        deleteDialogProps: {
            open: deleteDialogOpen,
            onClose: () => setDeleteDialogOpen(false),
            onConfirm: handleConfirmDeleteCategory,
            loading: isDeletingCategory,
            title: messages("Categories.Delete Category"),
            description: messages("Categories.Delete confirm"),
        },

        toggleStatusDialogProps: {
            open: toggleStatusDialogOpen,
            onOpenChange: () => setToggleStatusDialogOpen(false),
            handleConfirm: handleConfirmToggleStatus,
            isLoading: isTogglingStatus,
            title: messages("Categories.Toggle Status"),
            desc: selectedCategory?.is_active
                ? messages("Categories.Confirm Deactivate")
                : messages("Categories.Confirm Activate"),
        },
        arrangements

    };
}
