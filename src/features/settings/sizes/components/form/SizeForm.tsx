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

type SizeFormValues = {
  name: string;
};

// Define the schema outside the component
const createFormSchema = (messages: (key: string) => string) => {

  return z.object({
    name: z.string().min(1, messages("Public.name_required")),

  });
};

interface SizeFormProps {
  onSubmit: (data: z.infer<ReturnType<typeof createFormSchema>>) => void;
  onCancel: () => void;
  isEdit?: boolean;
  initialData?: Partial<SizeFormValues>;
}

export const SizeForm = ({
  onSubmit,
  onCancel,
  isEdit = false,
  initialData,
}: SizeFormProps) => {
  const { t: messages } = useTranslation();
  const formSchema = createFormSchema(messages);
  type FormValues = z.infer<typeof formSchema>;

  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name

    },
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={methods.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{messages("Public.Name")}</FormLabel>
                <FormControl>
                  <Input {...field} />
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
