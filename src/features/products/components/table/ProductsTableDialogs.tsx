import { DeleteDialog } from "@/components/DeleteDialog";
export function ProductsTableDialogs({
  deleteDialogProps,
}: {
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
      <DeleteDialog {...deleteDialogProps} />
    </>
  );
}
