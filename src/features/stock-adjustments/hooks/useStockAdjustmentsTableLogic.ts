import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel, getPaginationRowModel, SortingState } from "@tanstack/react-table";

import { useStockAdjustments } from "./useStockAdjustments";
import { useStockAdjustmentColumns } from "./useStockAdjustmentColumns";
import { StockAdjustment } from "@/types/api.interfaces";
import { toast } from "sonner";
import { createStockManualAdjustment, deleteStockAdjustment } from "@/lib/services/stockAdjustmentService";
import { useAllProductsVariants, useSettings } from "@/hooks/usePublicData";


export function useStockAdjustmentsTableLogic() {
  const { t: messages } = useTranslation();
  const [isStockAdjustmentFormOpen, setIsStockAdjustmentFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeletingStockAdjustment, setIsDeletingStockAdjustment] = useState(false);
  const [selectedStockAdjustment, setSelectedStockAdjustment] = useState<StockAdjustment | null>(null);

  const [sorting, setSorting] = useState<SortingState>([]);

  const [searchInput, setSearchInput] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const { data: SettingsData } = useSettings();
  const shelves = SettingsData?.shelves || [];
  const warehouses = SettingsData?.warehouses || [];

  const { data: AllProductsVariantsData } = useAllProductsVariants();
  const products = AllProductsVariantsData?.productVariants || [];

  const missingItems: string[] = [];
  if (!shelves.length) missingItems.push(messages("Shelves.noResults"));
  if (!warehouses.length) missingItems.push(messages("Warehouses.noResults"));
  if (!products.length) missingItems.push(messages("Products.noResults"));


  const handledeleteStockAdjustmentClick = (StockAdjustment: StockAdjustment) => {
    setSelectedStockAdjustment(StockAdjustment);
    setDeleteDialogOpen(true);
  };

  const handleConfirmdeleteStockAdjustment = async () => {
    if (!selectedStockAdjustment) return;
    setIsDeletingStockAdjustment(true);
    try {
      const response = await deleteStockAdjustment(selectedStockAdjustment.id);
      response.result
        ? toast.success(response.message)
        : toast.error(response.message);
    } catch {
      toast.error(messages("StockAdjustments.DeleteFailed"));
    } finally {
      setIsDeletingStockAdjustment(false);
      setDeleteDialogOpen(false);
      refetch();
    }
  };

  const { data, isLoading, isError, refetch } = useStockAdjustments({
    page: pagination.pageIndex + 1,
    per_page: pagination.pageSize,
    sort: sorting.length ? sorting[0].id : undefined,
    order: sorting.length ? (sorting[0].desc ? "desc" : "asc") : undefined,
    search: appliedSearch,
  });
  const columns = useStockAdjustmentColumns({ handleDelete: handledeleteStockAdjustmentClick, });

  const table = useReactTable({
    data: data?.adjustments || [],
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
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  };

  const handleRefresh = () => refetch();

  const handleSubmitStockAdjustmentForm = async (data: any) => {
    try {
      const formData = new FormData();

      formData.append("variant_id", data.variant_id.toString());
      formData.append("warehouse_id", data.warehouse_id.toString());
      // shelf_id is optional
      if (data.shelf_id !== undefined) {
        formData.append("shelf_id", data.shelf_id.toString());
      }
      formData.append("type", data.type);
      formData.append("direction", data.direction);
      formData.append("quantity", data.quantity.toString());
      formData.append("cost_per_item", data.cost_per_item.toString());
      // reason is optional
      if (data.reason) {
        formData.append("reason", data.reason);
      }

      const response = await createStockManualAdjustment(formData);

      response.result
        ? toast.success(response.message)
        : toast.error(response.message);

      setIsStockAdjustmentFormOpen(false);
      refetch();

    } catch (error) {
      toast.error(messages("Public.UnexpectedError"));
    }
  };
  return {
    messages,
    table,
    columns,
    data,
    isLoading,
    isError,
    searchInput,
    setSearchInput,
    appliedSearch,
    handleSearch,
    handleRefresh,
    setIsStockAdjustmentFormOpen,
    isStockAdjustmentFormOpen,
    handleSubmitStockAdjustmentForm,

    deleteDialogProps: {
      open: deleteDialogOpen,
      onClose: () => setDeleteDialogOpen(false),
      onConfirm: handleConfirmdeleteStockAdjustment,
      loading: isDeletingStockAdjustment,
      title: messages("StockAdjustments.Delete StockAdjustment"),
      description: messages("StockAdjustments.Delete confirm"),
    },
    missingItems,
    warehouses,
    shelves,
    products
  };
}
