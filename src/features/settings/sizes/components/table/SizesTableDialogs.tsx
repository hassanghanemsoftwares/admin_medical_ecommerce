import { ReusableDialog } from "@/components/reusable-dialog";
import { DeleteDialog } from "@/components/DeleteDialog";
import { Size } from "@/types/api.interfaces";
import { SizeForm } from "../form/SizeForm";

export function SizesTableDialogs({
  open,
  setOpen,
  editingSize,
  setEditingSize,
  messages,
  onSubmit,
  deleteDialogProps,
  
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editingSize: Size | null;
  setEditingSize: React.Dispatch<React.SetStateAction<Size | null>>;
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
          setEditingSize(null);
        }}
        title={
          editingSize
            ? messages("Sizes.updateSize")
            : messages("Sizes.addSize")
        }
        description={
          editingSize
            ? messages("Sizes.updateSizeDescription")
            : messages("Sizes.addSizeDescription")
        }
      >
        <SizeForm
          onSubmit={onSubmit}
          onCancel={() => setOpen(false)}
          isEdit={!!editingSize}
          initialData={editingSize || undefined}

        />
      </ReusableDialog>

      <DeleteDialog {...deleteDialogProps} />

  
    </>
  );
}
