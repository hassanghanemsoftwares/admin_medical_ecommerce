import {
  FormProvider,
  useForm,
} from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

type OccupationFormValues = {
  name: Record<string, string>;

};


const createFormSchema = (messages: (key: string) => string) => {

  return z.object({
    name: z.object({
      en: z.string().min(1, messages("Public.name_en_required")),
      ar: z.string().min(1, messages("Public.name_ar_required")),
    }),

  });
};

interface OccupationFormProps {
  onSubmit: (data: z.infer<ReturnType<typeof createFormSchema>>) => void;
  onCancel: () => void;
  isEdit?: boolean;
  initialData?: Partial<OccupationFormValues>;

}

export const OccupationForm = ({
  onSubmit,
  onCancel,
  isEdit = false,
  initialData,

}: OccupationFormProps) => {
  const { t: messages } = useTranslation();
  const formSchema = createFormSchema(messages);
  type FormValues = z.infer<typeof formSchema>;

  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: {
        en: initialData?.name?.en || "",
        ar: initialData?.name?.ar || "",
      },
    },
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={methods.control}
            name="name.en"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{messages("Public.name_en_label")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={methods.control}
            name="name.ar"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{messages("Public.name_ar_label")}</FormLabel>
                <FormControl>
                  <Input {...field} dir="rtl" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>



        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            {messages("actions.cancel")}
          </Button>
          <Button type="submit">
            {isEdit ? messages("actions.update") : messages("actions.create")}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};
