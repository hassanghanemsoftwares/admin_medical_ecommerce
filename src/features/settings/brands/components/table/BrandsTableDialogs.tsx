import { ReusableDialog } from "@/components/reusable-dialog";
import { DeleteDialog } from "@/components/DeleteDialog";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Brand } from "@/types/api.interfaces";
import { BrandForm } from "../form/BrandForm";

export function BrandsTableDialogs({
  open,
  setOpen,
  editingBrand,
  setEditingBrand,
  messages,
  onSubmit,
  deleteDialogProps,
  activeDialogProps,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editingBrand: Brand | null;
  setEditingBrand: React.Dispatch<React.SetStateAction<Brand | null>>;
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
  activeDialogProps: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    handleConfirm: () => void;
    isLoading?: boolean;
    title: React.ReactNode;
    desc: React.JSX.Element | string;
    cancelBtnText?: string;
    confirmText?: React.ReactNode;
    destructive?: boolean;
  };
}) {
  return (
    <>
      <ReusableDialog
        open={open}
        onClose={() => {
          setOpen(false);
          setEditingBrand(null);
        }}
        title={
          editingBrand
            ? messages("Brands.updateBrand")
            : messages("Brands.addBrand")
        }
        description={
          editingBrand
            ? messages("Brands.updateBrandDescription")
            : messages("Brands.addBrandDescription")
        }
      >
        <BrandForm
          onSubmit={onSubmit}
          onCancel={() => setOpen(false)}
          isEdit={!!editingBrand}
          initialData={editingBrand || undefined}

        />
      </ReusableDialog>

      <DeleteDialog {...deleteDialogProps} />

      <ConfirmDialog
        open={activeDialogProps.open}
        onOpenChange={activeDialogProps.onOpenChange}
        handleConfirm={activeDialogProps.handleConfirm}
        isLoading={activeDialogProps.isLoading}
        title={activeDialogProps.title}
        desc={activeDialogProps.desc}
        cancelBtnText={activeDialogProps.cancelBtnText}
        confirmText={activeDialogProps.confirmText}
        destructive={activeDialogProps.destructive}
      />
    </>
  );
}
