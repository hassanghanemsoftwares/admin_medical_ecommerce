import { ReusableDialog } from "@/components/reusable-dialog";
import { DeleteDialog } from "@/components/DeleteDialog";
import { ProductVariant, Shelf, Warehouse } from "@/types/api.interfaces";
import { StockAdjustmentForm } from "../form/StockAdjustmentForm";

export function StockAdjustmentsTableDialogs({
  open,
  setOpen,
  warehouses,
  shelves,
  products,
  messages,
  onSubmit,
  deleteDialogProps,

}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  messages: any;
  onSubmit: (data: any) => void;
  warehouses: Warehouse[];
  shelves: Shelf[];
  products: ProductVariant[];
  deleteDialogProps: {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading: boolean;
    title: string;
    description: string;
  };

}) {
  return (
    <>
      <ReusableDialog
        open={open}
        onClose={() => {
          setOpen(false);
  
        }}
        title={
          messages("StockAdjustments.addStockAdjustment")
        }
        description={
          messages("StockAdjustments.addStockAdjustmentDescription")
        }
      >
        <StockAdjustmentForm
          onSubmit={onSubmit}
          onCancel={() => setOpen(false)}
          warehouses={warehouses}
          shelves={shelves}
          products={products}
        />
      </ReusableDialog>

      <DeleteDialog {...deleteDialogProps} />


    </>
  );
}
