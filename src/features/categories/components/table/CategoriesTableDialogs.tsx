import { ReusableDialog } from "@/components/reusable-dialog";
import { DeleteDialog } from "@/components/DeleteDialog";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Category } from "@/types/api.interfaces";
import { CategoryForm } from "../form/CategoryForm";

export function CategoriesTableDialogs({
  open,
  setOpen,
  editingCategory,
  setEditingCategory,
  messages,
  arrangements,
  onSubmit,
  deleteDialogProps,
  activeDialogProps,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editingCategory: Category | null;
  setEditingCategory: React.Dispatch<React.SetStateAction<Category | null>>;
  messages: any;
  onSubmit: (data: any) => void;
  arrangements: string[];
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
          setEditingCategory(null);
        }}
        title={
          editingCategory
            ? messages("Categories.updateCategory")
            : messages("Categories.addCategory")
        }
        description={
          editingCategory
            ? messages("Categories.updateCategoryDescription")
            : messages("Categories.addCategoryDescription")
        }
      >
        <CategoryForm
          onSubmit={onSubmit}
          onCancel={() => setOpen(false)}
          isEdit={!!editingCategory}
          initialData={editingCategory|| undefined }
          arrangements={arrangements}
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
