import { ReusableDialog } from "@/components/reusable-dialog";
import { DeleteDialog } from "@/components/DeleteDialog";
import { Warehouse } from "@/types/api.interfaces";
import { WarehouseForm } from "../form/WarehouseForm";

export function WarehousesTableDialogs({
  open,
  setOpen,
  editingWarehouse,
  setEditingWarehouse,
  messages,
  onSubmit,
  deleteDialogProps,
  
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editingWarehouse: Warehouse | null;
  setEditingWarehouse: React.Dispatch<React.SetStateAction<Warehouse | null>>;
  messages: any;
  onSubmit: (data: any) => void;

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
          setEditingWarehouse(null);
        }}
        title={
          editingWarehouse
            ? messages("Warehouses.updateWarehouse")
            : messages("Warehouses.addWarehouse")
        }
        description={
          editingWarehouse
            ? messages("Warehouses.updateWarehouseDescription")
            : messages("Warehouses.addWarehouseDescription")
        }
      >
        <WarehouseForm
          onSubmit={onSubmit}
          onCancel={() => setOpen(false)}
          isEdit={!!editingWarehouse}
          initialData={editingWarehouse || undefined}

        />
      </ReusableDialog>

      <DeleteDialog {...deleteDialogProps} />

  
    </>
  );
}
