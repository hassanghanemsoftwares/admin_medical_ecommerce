import SubmitButton from "@/components/SubmitButton";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FormProvider, useForm } from "react-hook-form";
import PasswordInput from "@/components/password-input";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { resetPassword } from "@/lib/services/auth-service";
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import AuthCardComponent from "../../components/AuthCardComponent";

function ResetPasswordFormComponent({ token, email }: { token: string, email: string }) {
  const navigate = useNavigate()
  const { t: messages } = useTranslation();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const formSchema = z
    .object({
      password: z
        .string()
        .min(8, { message: messages("auth.passwordMinLength") })
        .regex(/[A-Z]/, { message: messages("auth.passwordUppercase") })
        .regex(/[a-z]/, { message: messages("auth.passwordLowercase") })
        .regex(/[0-9]/, { message: messages("auth.passwordNumber") })
        .regex(/[^A-Za-z0-9]/, { message: messages("auth.passwordSpecialCharacter") }),
      password_confirmation: z.string(),
    })
    .refine((data) => data.password === data.password_confirmation, {
      message: messages("auth.passwordMatch"),
      path: ["password_confirmation"],
    });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { password: "", password_confirmation: "" },
  });

  if (!token || !email) {
    navigate("/");
  }

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!token || !email) {
      toast.error("Invalid or missing token and email.");
      return;
    }
    if (!executeRecaptcha) {
      toast.error("Recaptcha not ready");
      return;
    }

    const recaptchaToken = await executeRecaptcha('login');
    const response = await resetPassword(token, email, data.password, data.password_confirmation, recaptchaToken);
    if (response.result) {
      toast.success(response.message);
      navigate("/");
    } else {
      toast.error(response.message);
    }
  };

  return (
    <AuthCardComponent
      title={messages("auth.resetPasswordTitle")}
      description={messages("auth.resetPasswordDescription")}
    >
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <PasswordInput id="password" name="password" label={messages("auth.newPasswordLabel")} />
          <PasswordInput id="password_confirmation" name="password_confirmation" label={messages("auth.confirmPasswordLabel")} />
          <SubmitButton pendingLabel={messages("auth.resetting")} disabled={form.formState.isSubmitting}>
            {messages("auth.resetPasswordButton")}
          </SubmitButton>
        </form>
      </FormProvider>
    </AuthCardComponent>
  );
}

export default ResetPasswordFormComponent;
