import {
  FormProvider,
  useForm,
} from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import { ProductVariant, Shelf, Warehouse } from "@/types/api.interfaces";

interface StockAdjustmentFormProps {
  onSubmit: (data: StockAdjustmentFormValues) => void;
  onCancel: () => void;
  warehouses: Warehouse[];
  shelves: Shelf[];
  products: ProductVariant[];
}

const createFormSchema = (messages: (key: string) => string) =>
  z.object({
    variant_id: z
      .number({
        required_error: messages("Public.Shelf_season_required"),
        invalid_type_error: messages("Public.Shelf_season_invalid"),
      })
      .int()
      .positive(),
    warehouse_id: z
      .number({
        required_error: messages("Public.Shelf_season_required"),
        invalid_type_error: messages("Public.Shelf_season_invalid"),
      })
      .int()
      .positive(),
    shelf_id: z
      .number({
        required_error: messages("Public.Shelf_season_required"),
        invalid_type_error: messages("Public.Shelf_season_invalid"),
      })
      .int()
      .positive()
      .optional(),
    type: z.enum(["manual", "damage"], {
      required_error: messages("Public.type_required"),
    }),
    direction: z.enum(["increase", "decrease"], {
      required_error: messages("Public.direction_required"),
    }),
    quantity: z.coerce.number().int().min(1, messages("Public.quantity_required")),

    cost_per_item: z.number().min(0),

    reason: z.string().max(255).optional(),
  });

export type StockAdjustmentFormValues = z.infer<ReturnType<typeof createFormSchema>>;

export const StockAdjustmentForm = ({
  onSubmit,
  onCancel,
  warehouses,
  shelves,
  products,
}: StockAdjustmentFormProps) => {
  const { t: messages } = useTranslation();
  const schema = createFormSchema(messages);

  const methods = useForm<StockAdjustmentFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {

    },
  });

  const { watch, setValue } = methods;
  const selectedVariant = watch("variant_id");
  const selectedWarehouse = watch("warehouse_id");
  const selectedShelf = watch("shelf_id");

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <FormField
            control={methods.control}
            name="variant_id"
            render={() => (
              <FormItem>
                <FormLabel>{messages("Public.variant")}</FormLabel>
                <FormControl className="w-full">
                  <Select
                    value={selectedVariant?.toString() || ""}
                    onValueChange={(val) => setValue("variant_id", Number(val))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={messages("Public.select_variant")} />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((variant) => (
                        <SelectItem key={variant.id} value={variant.id.toString()}>
                          {variant.product_info}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                <FormLabel>{messages("Public.warehouse")}</FormLabel>
                <FormControl className="w-full">
                  <Select
                    value={selectedWarehouse?.toString() || ""}
                    onValueChange={(val) => setValue("warehouse_id", Number(val))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={messages("Public.select_warehouse")} />
                    </SelectTrigger>
                    <SelectContent>
                      {warehouses.map((warehouse) => (
                        <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
                          {warehouse.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={methods.control}
            name="shelf_id"
            render={() => (
              <FormItem>
                <FormLabel>{messages("Public.shelf")}</FormLabel>
                <FormControl className="w-full">
                  <Select
                    value={selectedShelf?.toString() || ""}
                    onValueChange={(val) => setValue("shelf_id", Number(val))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={messages("Public.select_shelf")} />
                    </SelectTrigger>
                    <SelectContent>
                      {shelves.map((shelf) => (
                        <SelectItem key={shelf.id} value={shelf.id.toString()}>
                          {shelf.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={methods.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{messages("Public.type")}</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder={messages("Public.type")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">{messages("Public.manual")}</SelectItem>
                      <SelectItem value="damage">{messages("Public.damage")}</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={methods.control}
            name="direction"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{messages("Public.direction")}</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder={messages("Public.direction")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="increase">{messages("Public.increase")}</SelectItem>
                      <SelectItem value="decrease">{messages("Public.decrease")}</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={methods.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{messages("Public.quantity")}</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={methods.control}
            name="cost_per_item"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{messages("Public.cost_per_item")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />


          <FormField
            control={methods.control}
            name="reason"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>{messages("Public.reason")}</FormLabel>
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
          <Button type="submit">{messages("actions.submit")}</Button>
        </div>
      </form>
    </FormProvider>
  );
};
