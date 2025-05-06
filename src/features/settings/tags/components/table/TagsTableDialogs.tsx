import { ReusableDialog } from "@/components/reusable-dialog";
import { DeleteDialog } from "@/components/DeleteDialog";
import { Tag } from "@/types/api.interfaces";
import { TagForm } from "../form/TagForm";

export function TagsTableDialogs({
  open,
  setOpen,
  editingTag,
  setEditingTag,
  messages,
  onSubmit,
  deleteDialogProps,
  
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editingTag: Tag | null;
  setEditingTag: React.Dispatch<React.SetStateAction<Tag | null>>;
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
          setEditingTag(null);
        }}
        title={
          editingTag
            ? messages("Tags.updateTag")
            : messages("Tags.addTag")
        }
        description={
          editingTag
            ? messages("Tags.updateTagDescription")
            : messages("Tags.addTagDescription")
        }
      >
        <TagForm
          onSubmit={onSubmit}
          onCancel={() => setOpen(false)}
          isEdit={!!editingTag}
          initialData={editingTag || undefined}

        />
      </ReusableDialog>

      <DeleteDialog {...deleteDialogProps} />

  
    </>
  );
}
