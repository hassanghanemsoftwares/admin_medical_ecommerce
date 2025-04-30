import { ReusableDialog } from "@/components/reusable-dialog";
import { DeleteDialog } from "@/components/DeleteDialog";
import { User } from "@/types/apiTypes";
import { UserForm } from "../form/UserForm";
import { ConfirmDialog } from "@/components/confirm-dialog";

export function UsersTableDialogs({
  open,
  setOpen,
  editingUser,
  setEditingUser,
  messages,
  onSubmit,
  roles,
  permissions,
  deleteDialogProps,
  activeDialogProps,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editingUser: User | null;
  setEditingUser: React.Dispatch<React.SetStateAction<User | null>>;
  messages: any;
  onSubmit: (data: any) => void;
  roles: any[];
  permissions: any[];
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
          setEditingUser(null);
        }}
        title={editingUser ? messages("Users.updateUser") : messages("Users.addUser")}
        description={
          editingUser
            ? messages("Users.updateUserDescription")
            : messages("Users.addUserDescription")
        }
      >
        <UserForm
          onSubmit={onSubmit}
          onCancel={() => setOpen(false)}
          roles={roles}
          permissions={permissions}
          isEdit={!!editingUser}
          initialData={editingUser || undefined}
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
