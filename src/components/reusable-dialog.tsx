import { ReactNode } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";

interface ReusableDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
}

export const ReusableDialog = ({ open, onClose, title,description, children, className }: ReusableDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className={className || "sm:max-w-xl"}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};
