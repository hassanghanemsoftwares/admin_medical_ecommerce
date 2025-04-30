import SubmitButton from "@/components/SubmitButton";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { forgetPassword } from "@/lib/services/auth-service";
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import AuthCardComponent from "../../components/AuthCardComponent";

function ForgetPasswordFormComponent() {
  const { t: messages } = useTranslation();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const formSchema = z.object({
    email: z
      .string()
      .min(1, { message: messages("auth.emailRequired") })
      .email({ message: messages("auth.validEmailMessage") }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {

    if (!executeRecaptcha) {
      toast.error("Recaptcha not ready");
      return;
    }

    const recaptchaToken = await executeRecaptcha('login');
    const response = await forgetPassword(data.email, recaptchaToken);
    if (response.result) {
      toast.success(response.message);
    } else {

      toast.error(response.message);
    }
  };

  return (
    <AuthCardComponent
      title={messages("auth.forgetPasswordTitle")}
      description={messages("auth.forgetPasswordDescription")}
    >

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{messages("auth.emailLabel")}</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder={messages("auth.emailPlaceholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <SubmitButton pendingLabel={messages("auth.sending")} disabled={form.formState.isSubmitting}>
            {messages("auth.sendResetLink")}
          </SubmitButton>
        </form>
      </FormProvider>
    </AuthCardComponent>
  );
}

export default ForgetPasswordFormComponent;
