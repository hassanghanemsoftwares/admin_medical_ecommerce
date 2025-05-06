import { ReusableDialog } from "@/components/reusable-dialog";
import { DeleteDialog } from "@/components/DeleteDialog";
import { Color, ColorSeason } from "@/types/api.interfaces";
import { ColorForm } from "../form/ColorForm";

export function ColorsTableDialogs({
  open,
  setOpen,
  editingColor,
  setEditingColor, colorSeasons,
  messages,
  onSubmit,
  deleteDialogProps,

}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editingColor: Color | null;
  setEditingColor: React.Dispatch<React.SetStateAction<Color | null>>;
  messages: any;
  onSubmit: (data: any) => void;
  colorSeasons: ColorSeason[] ,
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
          setEditingColor(null);
        }}
        title={
          editingColor
            ? messages("Colors.updateColor")
            : messages("Colors.addColor")
        }
        description={
          editingColor
            ? messages("Colors.updateColorDescription")
            : messages("Colors.addColorDescription")
        }
      >
        <ColorForm
          onSubmit={onSubmit}
          onCancel={() => setOpen(false)}
          isEdit={!!editingColor}
          initialData={editingColor || undefined}
          colorSeasons={colorSeasons}
        />
      </ReusableDialog>

      <DeleteDialog {...deleteDialogProps} />


    </>
  );
}
