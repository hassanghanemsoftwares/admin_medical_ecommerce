import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
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
import { Link, useNavigate } from "react-router-dom";
import { setAuthData } from "@/lib/store/slices/authSlice";
import { useDispatch } from "react-redux";
import { login } from "@/lib/services/auth-service";
import AuthCardComponent from '../../components/AuthCardComponent';

const LoginFormComponent = () => {
  const navigate = useNavigate();
  const { t: messages } = useTranslation();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const formSchema = z.object({
    email: z.string().email({ message: messages("auth.validEmailMessage") }),
    password: z.string().min(1, { message: messages("auth.passwordRequired") }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  const dispatch = useDispatch();

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!executeRecaptcha) {
      toast.error("Recaptcha not ready");
      return;
    }

    try {
      const recaptchaToken = await executeRecaptcha('login');
      const response = await login(data.email, data.password, recaptchaToken);

      if (response.result) {
        const authData = {
          email: data.email,
          password: data.password,
          expiryAt: response.expiresAt,
        };
        dispatch(setAuthData(authData));
        toast.success(response.message);
        navigate("otp");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <AuthCardComponent
      title={messages("auth.loginTitle")}
      description={messages("auth.loginDescription")}
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
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>{messages("auth.passwordLabel")}</FormLabel>
                  <Link
                    to="/forgotPassword"
                    className="inline-block text-sm underline-offset-4 hover:underline"
                  >
                    {messages("auth.forgotPassword")}
                  </Link>
                </div>
                <FormControl>
                  <Input
                    type="password"
                    placeholder={messages("auth.passwordPlaceholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <SubmitButton
            pendingLabel={messages("auth.loggingIn")}
            disabled={form.formState.isSubmitting}
          >
            {messages("auth.loginButton")}
          </SubmitButton>
        </form>
      </FormProvider>
    </AuthCardComponent>
  );
};

export default LoginFormComponent;
