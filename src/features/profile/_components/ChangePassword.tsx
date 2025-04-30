import { FC } from "react";
import { useForm, FormProvider } from "react-hook-form";  // Import FormProvider
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import SubmitButton from "@/components/SubmitButton";
import PasswordInput from "@/components/password-input";

import { useTranslation } from "react-i18next";
import { changePassword } from "@/lib/services/profile-service";

const ChangePassword: FC = () => {
   const { t: messages } = useTranslation();

  const formSchema = z
    .object({
      current_password: z.string().min(8, { message: messages("auth.passwordMinLength") }),
      new_password: z
        .string()
        .min(8, { message: messages("auth.passwordMinLength") })
        .regex(/[A-Z]/, { message: messages("auth.passwordUppercase") })
        .regex(/[a-z]/, { message: messages("auth.passwordLowercase") })
        .regex(/[0-9]/, { message: messages("auth.passwordNumber") })
        .regex(/[^A-Za-z0-9]/, { message: messages("auth.passwordSpecialCharacter") }),
      new_password_confirmation: z.string(),
    })
    .refine((data) => data.new_password === data.new_password_confirmation, {
      message: messages("auth.passwordMatch"),
      path: ["new_password_confirmation"],
    });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { current_password: "", new_password: "", new_password_confirmation: "" },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const response = await changePassword(data.current_password, data.new_password, data.new_password_confirmation);
    if (response.result) {
      toast.success(response.message);
      form.reset();
    } else {
      toast.error(response.message);
    }
  };

  return (
    <FormProvider {...form}>
      <Card>
        <CardHeader>
          <CardTitle>{messages("auth.changePasswordTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <PasswordInput id="current_password" name="current_password" label={messages("auth.currentPasswordLabel")} />
            <PasswordInput id="new_password" name="new_password" label={messages("auth.newPasswordLabel")} />
            <PasswordInput id="new_password_confirmation" name="new_password_confirmation" label={messages("auth.confirmPasswordLabel")} />

            <SubmitButton pendingLabel={messages("auth.updating")} disabled={form.formState.isSubmitting}>
              {messages("auth.updatePasswordButton")}
            </SubmitButton>
          </form>
        </CardContent>
      </Card>
    </FormProvider>
  );
};

export default ChangePassword;
