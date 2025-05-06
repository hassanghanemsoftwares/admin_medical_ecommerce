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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ColorSeason } from "@/types/api.interfaces";

type ColorFormValues = {
  name: Record<string, string>;
  code: string;
  color_season_id: number;
};

const createFormSchema = (messages: (key: string) => string) => {
  return z.object({
    name: z.object({
      en: z.string().min(1, messages("Public.name_en_required")).max(255),
      ar: z.string().min(1, messages("Public.name_ar_required")).max(255),
    }),
    code: z
      .string()
      .min(1, messages("Public.code_required"))
      .max(20, messages("Public.code_max")),
    color_season_id: z
      .number({
        required_error: messages("Public.color_season_required"),
        invalid_type_error: messages("Public.color_season_invalid"),
      })
      .int()
      .positive(),
  });
};

interface ColorFormProps {
  onSubmit: (data: z.infer<ReturnType<typeof createFormSchema>>) => void;
  onCancel: () => void;
  colorSeasons: ColorSeason[]
  isEdit?: boolean;
  initialData?: Partial<ColorFormValues>;
}

export const ColorForm = ({
  onSubmit,
  onCancel,
  colorSeasons,
  isEdit = false,
  initialData,
}: ColorFormProps) => {
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
      code: initialData?.code || "",
      color_season_id: initialData?.color_season_id || undefined,
    },
  });
  const { watch, setValue } = methods;

  const selectedColorSeason = watch("color_season_id");

  console.log(colorSeasons)
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
          <FormField
            control={methods.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{messages("Public.Code_label")}</FormLabel>
                <FormControl>
                  <Input type="color" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={methods.control}
            name="color_season_id"
            render={() => (
              <FormItem>
                <FormLabel>{messages("Public.ColorSeason_label")}</FormLabel>
                <FormControl className="w-full">
                  <Select
                    value={selectedColorSeason?.toString() || ""}
                    onValueChange={(val) => setValue("color_season_id", Number(val))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={messages("Public.SelectColorSeason")} />
                    </SelectTrigger>
                    <SelectContent>
                      {colorSeasons.map((colorSeason) => (
                        <SelectItem key={colorSeason.id} value={colorSeason.id.toString()}>
                          {colorSeason.name.en}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
