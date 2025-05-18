import { ReusableDialog } from "@/components/reusable-dialog";
import { DeleteDialog } from "@/components/DeleteDialog";
import { Occupation } from "@/types/api.interfaces";
import { OccupationForm } from "../form/OccupationForm";

export function OccupationsTableDialogs({
  open,
  setOpen,
  editingOccupation,
  setEditingOccupation,
  messages,
  onSubmit,
  deleteDialogProps,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editingOccupation: Occupation | null;
  setEditingOccupation: React.Dispatch<React.SetStateAction<Occupation | null>>;
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
          setEditingOccupation(null);
        }}
        title={
          editingOccupation
            ? messages("Occupations.updateOccupation")
            : messages("Occupations.addOccupation")
        }
        description={
          editingOccupation
            ? messages("Occupations.updateOccupationDescription")
            : messages("Occupations.addOccupationDescription")
        }
      >
        <OccupationForm
          onSubmit={onSubmit}
          onCancel={() => setOpen(false)}
          isEdit={!!editingOccupation}
          initialData={editingOccupation|| undefined }
         
        />
      </ReusableDialog>

      <DeleteDialog {...deleteDialogProps} />

    
    </>
  );
}
