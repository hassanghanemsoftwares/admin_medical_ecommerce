import { Button } from "@/components/ui/button";
import { ReusableDialog } from "./reusable-dialog";
import { useTranslation } from "react-i18next";

interface DeleteDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
    loading?: boolean;
}

export const DeleteDialog = ({
    open,
    onClose,
    onConfirm,
    title = "Delete Confirmation",
    description = "Are you sure you want to delete this item? This action cannot be undone.",
    loading = false,
}: DeleteDialogProps) => {
    const { t: messages } = useTranslation();
    return (
        <ReusableDialog
            open={open}
            onClose={onClose}
            title={title}
            description={description}
        >
            <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={onClose}>
                    {messages("actions.cancel")}
                </Button>
                <Button variant="destructive" onClick={onConfirm} disabled={loading}>
                    {loading ?  messages("actions.deleting"): messages("actions.delete")}
                </Button>
            </div>
        </ReusableDialog>
    );
};
