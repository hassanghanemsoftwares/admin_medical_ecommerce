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
import { updateBrand, createBrand, deleteBrand } from "@/lib/services/brands-service";
import { toast } from "sonner";
import { Brand } from "@/types/api.interfaces";
import type { SortingState } from "@tanstack/react-table";
import { useBrandColumns } from "./useBrandColumns";
import { useBrands } from "./useBrands";

export function useBrandsTableLogic() {
    const { t: messages } = useTranslation();
    const dispatch = useDispatch<AppDispatch>();


    const [isBrandFormOpen, setIsBrandFormOpen] = useState(false);
    const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
    const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [isDeletingBrand, setIsDeletingBrand] = useState(false);

    const [toggleStatusDialogOpen, setToggleStatusDialogOpen] = useState(false);
    const [isTogglingStatus, setIsTogglingStatus] = useState(false);

    const [searchInput, setSearchInput] = useState("");
    const [appliedSearch, setAppliedSearch] = useState("");
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
    const [sorting, setSorting] = useState<SortingState>([]);

    useEffect(() => {
        dispatch(fetchSettings());
    }, [dispatch]);

    const handleEditBrand = (brand: Brand) => {
        setEditingBrand(brand);
        setIsBrandFormOpen(true);
    };

    const handledeleteBrandClick = (brand: Brand) => {
        setSelectedBrand(brand);
        setDeleteDialogOpen(true);
    };

    const handleToggleStatusClick = (brand: Brand) => {
        setSelectedBrand(brand);
        setToggleStatusDialogOpen(true);
    };

    const handleConfirmdeleteBrand = async () => {
        if (!selectedBrand) return;
        setIsDeletingBrand(true);
        try {
            const response = await deleteBrand(selectedBrand.id);
            response.result
                ? toast.success(response.message)
                : toast.error(response.message);
        } catch {
            toast.error(messages("Brands.DeleteFailed"));
        } finally {
            setIsDeletingBrand(false);
            setDeleteDialogOpen(false);
            refetch();
        }
    };

    const handleConfirmToggleStatus = async () => {
        if (!selectedBrand) {
            console.error("No brand selected for status toggle");
            return;
        }

        setIsTogglingStatus(true);

        try {
            const newStatus = !selectedBrand.is_active;
            console.log(`Updating brand ${selectedBrand.id} status to: ${newStatus}`);

            const formData = new FormData();
            formData.append('is_active', newStatus ? '1' : '0');
            formData.append('name', selectedBrand.name);
            const response = await updateBrand(selectedBrand.id, formData);
            if (!response) {
                throw new Error("Empty response received");
            }

           

            if (response.result) {
                toast.success(response.message || messages("Brands.StatusUpdateSuccess"));
            } else {
                toast.error(response.message || messages("Brands.StatusUpdateFailed"));
            }
        } catch (error) {
            console.error("Error toggling brand status:", error);
            toast.error(messages("Brands.StatusUpdateFailed"));
        } finally {
            setIsTogglingStatus(false);
            setToggleStatusDialogOpen(false);
            refetch();
        }
    };



    const handleSubmitBrandForm = async (data: any) => {
        try {
            const formData = new FormData();
            formData.append('name', data.name);
        
            const response = editingBrand
                ? await updateBrand(editingBrand.id, formData)
                : await createBrand(formData);

            response.result
                ? toast.success(response.message)
                : toast.error(response.message);

            setEditingBrand(null);
            setIsBrandFormOpen(false);
            refetch();
        } catch (error) {
            console.error("Brand submission failed:", error);
            toast.error(messages("Public.UnexpectedError"));
        }
    };

    const columns = useBrandColumns({
        handleEdit: handleEditBrand,
        handleDelete: handledeleteBrandClick,
        handleToggleActive: handleToggleStatusClick,
    });

    const { data, isLoading, isError, refetch } = useBrands({
        page: pagination.pageIndex + 1,
        per_page: pagination.pageSize,
        sort: sorting.length ? sorting[0].id : undefined,
        order: sorting.length ? (sorting[0].desc ? "desc" : "asc") : undefined,
        search: appliedSearch,
    });



    const table = useReactTable({
        data: data?.brands || [],
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
        setIsBrandFormOpen,
        isBrandFormOpen,
        editingBrand,
        setEditingBrand,
        handleSubmitBrandForm,

        deleteDialogProps: {
            open: deleteDialogOpen,
            onClose: () => setDeleteDialogOpen(false),
            onConfirm: handleConfirmdeleteBrand,
            loading: isDeletingBrand,
            title: messages("Brands.Delete Brand"),
            description: messages("Brands.Delete confirm"),
        },

        toggleStatusDialogProps: {
            open: toggleStatusDialogOpen,
            onOpenChange: () => setToggleStatusDialogOpen(false),
            handleConfirm: handleConfirmToggleStatus,
            isLoading: isTogglingStatus,
            title: messages("Brands.Toggle Status"),
            desc: selectedBrand?.is_active
                ? messages("Brands.Confirm Deactivate")
                : messages("Brands.Confirm Activate"),
        },


    };
}
