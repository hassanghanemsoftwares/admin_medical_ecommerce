import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
} from "@tanstack/react-table";
import { deleteProduct } from "@/lib/services/products-service";
import { toast } from "sonner";
import { Product } from "@/types/api.interfaces";
import { useProducts } from "./useProducts";
import type { SortingState } from "@tanstack/react-table";
import { useProductColumns } from "./useProductColumns";

export function useProductsTableLogic() {
    const { t: messages } = useTranslation();

    const [isDeletingProduct, setIsDeletingProduct] = useState(false);

    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const [searchInput, setSearchInput] = useState("");
    const [appliedSearch, setAppliedSearch] = useState("");
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
    const [sorting, setSorting] = useState<SortingState>([]);


    const handleDeleteProductClick = (product: Product) => {
        setSelectedProduct(product);
        setDeleteDialogOpen(true);
    };
    const handleConfirmDeleteProduct = async () => {
        if (!selectedProduct) return;
        setIsDeletingProduct(true);
        try {
            const response = await deleteProduct(selectedProduct.id);
            response.result
                ? toast.success(response.message)
                : toast.error(response.message);
        } catch {
            toast.error(messages("Categories.DeleteFailed"));
        } finally {
            setIsDeletingProduct(false);
            setDeleteDialogOpen(false);
            refetch();
        }
    };
    const columns = useProductColumns({
        handleDelete: handleDeleteProductClick,
    });

    const { data, isLoading, isError, refetch } = useProducts({
        page: pagination.pageIndex + 1,
        per_page: pagination.pageSize,
        sort: sorting.length ? sorting[0].id : undefined,
        order: sorting.length ? (sorting[0].desc ? "desc" : "asc") : undefined,
        search: appliedSearch,
    });

    const table = useReactTable({
        data: data?.products || [],
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

        deleteDialogProps: {
            open: deleteDialogOpen,
            onClose: () => setDeleteDialogOpen(false),
            onConfirm: handleConfirmDeleteProduct,
            loading: isDeletingProduct,
            title: messages("Categories.Delete Product"),
            description: messages("Categories.Delete confirm"),
        },



    };
}
