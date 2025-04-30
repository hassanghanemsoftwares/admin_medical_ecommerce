import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function ConfirmPasswordDialog({
  onConfirm,
  buttonTitle,
}: {
  onConfirm: (password: string) => void;
  buttonTitle: string;
}) {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const { t: messages } = useTranslation();

  const handleConfirm = () => {
    if (password.trim()) {
      onConfirm(password);
      setOpen(false);
      setPassword("");
    }
  };

  return (
    <div>
      <Button onClick={() => setOpen(true)}>{buttonTitle}</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{messages("auth.Confirm Your Password")}</DialogTitle>
          </DialogHeader>
          <Input
            type="password"
            placeholder={messages("auth.Enter your password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              {messages("auth.Cancel")}
            </Button>
            <Button onClick={handleConfirm}>{messages("auth.Confirm")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
