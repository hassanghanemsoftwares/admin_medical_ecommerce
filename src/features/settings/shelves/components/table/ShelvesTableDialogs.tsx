import { ReusableDialog } from "@/components/reusable-dialog";
import { DeleteDialog } from "@/components/DeleteDialog";
import { Shelf, Warehouse } from "@/types/api.interfaces";
import { ShelfForm } from "../form/ShelfForm";

export function ShelvesTableDialogs({
  open,
  setOpen,
  editingShelf,
  setEditingShelf, warehouses,
  messages,
  onSubmit,
  deleteDialogProps,

}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editingShelf: Shelf | null;
  setEditingShelf: React.Dispatch<React.SetStateAction<Shelf | null>>;
  messages: any;
  onSubmit: (data: any) => void;
  warehouses: Warehouse[] ,
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
          setEditingShelf(null);
        }}
        title={
          editingShelf
            ? messages("Shelves.updateShelf")
            : messages("Shelves.addShelf")
        }
        description={
          editingShelf
            ? messages("Shelves.updateShelfDescription")
            : messages("Shelves.addShelfDescription")
        }
      >
        <ShelfForm
          onSubmit={onSubmit}
          onCancel={() => setOpen(false)}
          isEdit={!!editingShelf}
          initialData={editingShelf || undefined}
          warehouses={warehouses}
        />
      </ReusableDialog>

      <DeleteDialog {...deleteDialogProps} />


    </>
  );
}
