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
import { Warehouse } from "@/types/api.interfaces";

type ShelfFormValues = {
  name: string;
  location: string;
  warehouse_id: number;
};

const createFormSchema = (messages: (key: string) => string) => {
  return z.object({
    name: z.string().min(1, messages("Public.name_required")),
    location: z.string().nullable(),
    warehouse_id: z
      .number({
        required_error: messages("Public.Shelf_season_required"),
        invalid_type_error: messages("Public.Shelf_season_invalid"),
      })
      .int()
      .positive(),
  });
};

interface ShelfFormProps {
  onSubmit: (data: z.infer<ReturnType<typeof createFormSchema>>) => void;
  onCancel: () => void;
  warehouses: Warehouse[];
  isEdit?: boolean;
  initialData?: Partial<ShelfFormValues>;
}

export const ShelfForm = ({
  onSubmit,
  onCancel,
  warehouses,
  isEdit = false,
  initialData,
}: ShelfFormProps) => {
  const { t: messages } = useTranslation();
  const formSchema = createFormSchema(messages);
  type FormValues = z.infer<typeof formSchema>;

  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name,
      location: initialData?.location || "",
      warehouse_id: initialData?.warehouse_id || undefined,
    },
  });
  const { watch, setValue } = methods;

  const selectedWarehouse = watch("warehouse_id");

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={methods.control}
            name="name"
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
          <FormField
            control={methods.control}
            name="warehouse_id"
            render={() => (
              <FormItem>
                <FormLabel>{messages("Public.Warehouse_label")}</FormLabel>
                <FormControl className="w-full">
                  <Select
                    value={selectedWarehouse?.toString() || ""}
                    onValueChange={(val) => setValue("warehouse_id", Number(val))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={messages("Public.SelectWarehouse")} />
                    </SelectTrigger>
                    <SelectContent>
                      {warehouses.map((Warehouse) => (
                        <SelectItem key={Warehouse.id} value={Warehouse.id.toString()}>
                          {Warehouse.name}
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
