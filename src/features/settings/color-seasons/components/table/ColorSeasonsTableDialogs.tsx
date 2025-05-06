import { ReusableDialog } from "@/components/reusable-dialog";
import { DeleteDialog } from "@/components/DeleteDialog";
import { ColorSeason } from "@/types/api.interfaces";
import { ColorSeasonForm } from "../form/ColorSeasonForm";

export function ColorSeasonsTableDialogs({
  open,
  setOpen,
  editingColorSeason,
  setEditingColorSeason,
  messages,
  onSubmit,
  deleteDialogProps,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editingColorSeason: ColorSeason | null;
  setEditingColorSeason: React.Dispatch<React.SetStateAction<ColorSeason | null>>;
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
          setEditingColorSeason(null);
        }}
        title={
          editingColorSeason
            ? messages("ColorSeasons.updateColorSeason")
            : messages("ColorSeasons.addColorSeason")
        }
        description={
          editingColorSeason
            ? messages("ColorSeasons.updateColorSeasonDescription")
            : messages("ColorSeasons.addColorSeasonDescription")
        }
      >
        <ColorSeasonForm
          onSubmit={onSubmit}
          onCancel={() => setOpen(false)}
          isEdit={!!editingColorSeason}
          initialData={editingColorSeason|| undefined }
         
        />
      </ReusableDialog>

      <DeleteDialog {...deleteDialogProps} />

    
    </>
  );
}
