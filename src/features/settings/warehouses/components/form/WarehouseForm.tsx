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

type WarehouseFormValues = {
  name: string;
  location: string;

};

// Define the schema outside the component
const createFormSchema = (messages: (key: string) => string) => {

  return z.object({
    name: z.string().min(1, messages("Public.name_required")),
    location: z.string().nullable(),
  });
};

interface WarehouseFormProps {
  onSubmit: (data: z.infer<ReturnType<typeof createFormSchema>>) => void;
  onCancel: () => void;
  isEdit?: boolean;
  initialData?: Partial<WarehouseFormValues>;
}

export const WarehouseForm = ({
  onSubmit,
  onCancel,
  isEdit = false,
  initialData,
}: WarehouseFormProps) => {
  const { t: messages } = useTranslation();
  const formSchema = createFormSchema(messages);
  type FormValues = z.infer<typeof formSchema>;

  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name,
      location: initialData?.location

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
          <FormField
            control={methods.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{messages("Public.Location")}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                  />
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
