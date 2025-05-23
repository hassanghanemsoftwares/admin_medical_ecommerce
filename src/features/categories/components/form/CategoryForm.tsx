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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import { ImageUploadInput } from "@/components/ImageUploadInput";

type CategoryFormValues = {
  name: Record<string, string>;
  arrangement?: string;
  image: File | string | null;
};

// Define the schema outside the component
const createFormSchema = (messages: (key: string) => string, isEdit: boolean) => {
  const baseImageSchema = z
    .any()
    .refine(
      (val) => val !== undefined && (val === null || val instanceof File),
      { message: messages("Public.image_mimes") }
    )
    .refine(
      (val) =>
        val === null ||
        (val instanceof File &&
          ["image/jpeg", "image/png", "image/jpg", "image/gif"].includes(val.type)),
      { message: messages("Public.image_mimes") }
    )
    .refine(
      (val) => val === null || (val instanceof File && val.size <= 2 * 1024 * 1024),
      { message: messages("Public.image_max_size") }
    );

  const imageSchema = isEdit
    ? z.union([baseImageSchema, z.string().url()]).optional()
    : baseImageSchema.nullable().refine(val => val !== null && val !== undefined, {
        message: messages("Public.image_required")
      });

  return z.object({
    name: z.object({
      en: z.string().min(1, messages("Public.name_en_required")),
      ar: z.string().min(1, messages("Public.name_ar_required")),
    }),
    arrangement: z.string().optional(),
    image: imageSchema,
  });
};

interface CategoryFormProps {
  onSubmit: (data: z.infer<ReturnType<typeof createFormSchema>>) => void;
  onCancel: () => void;
  isEdit?: boolean;
  initialData?: Partial<CategoryFormValues>;
  arrangements: string[];
}

export const CategoryForm = ({
  onSubmit,
  onCancel,
  isEdit = false,
  initialData,
  arrangements,
}: CategoryFormProps) => {
  const { t: messages } = useTranslation();
  const formSchema = createFormSchema(messages, isEdit);
  type FormValues = z.infer<typeof formSchema>;

  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: {
        en: initialData?.name?.en || "",
        ar: initialData?.name?.ar || "",
      },
      arrangement: initialData?.arrangement ? String(initialData.arrangement) : "",
      image: initialData?.image || null,
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

        {isEdit && (
          <FormField
            control={methods.control}
            name="arrangement"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{messages("Public.arrangementLabel")}</FormLabel>
                <FormControl>
                  <Select
                    value={String(field.value)} 
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={messages("Public.selectarrangement")} />
                    </SelectTrigger>
                    <SelectContent>
                      {arrangements.map((arrangement) => (
                        <SelectItem key={arrangement} value={String(arrangement)}>
                          {arrangement}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <ImageUploadInput
          form={methods}
          name="image"
          label={messages("Public.image_label")}
          existingImageUrl={typeof initialData?.image === "string" ? initialData.image : undefined}
        />

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
