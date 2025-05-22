import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Color, Size } from "@/types/api.interfaces";
import { Trash2Icon } from "lucide-react";

interface ProductVariantsProps {
  colors: Color[];
  sizes: Size[];
  existingVariants?: {
    id: number;
    size_id: number;
    color_id: number;

  }[];

  onExistingVariantDelete: (
    variantId: number
  ) => Promise<{ result: boolean; message?: string }>;
}

export const ProductVariants = ({
  colors,
  sizes,
  existingVariants = [],
  onExistingVariantDelete,
}: ProductVariantsProps) => {
  const { t: messages } = useTranslation();
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  const handleDelete = async (index: number) => {

    try {
      const response = await onExistingVariantDelete(index);

      if (!response?.result) {
        return;
      }
    } catch (error) {
      return;
    }
  };
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{messages("Public.variants")}</h3>

      {/* Existing Variants */}
      {existingVariants.length > 0 && (
        <div className="space-y-2">
          {existingVariants.map((variant) => (
            <div
              key={variant.id}
              className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 bg-muted p-4 rounded-lg"
            >
              <div>
                <FormLabel>{messages("Public.size")}</FormLabel>
                <Select disabled value={variant.size_id ? variant.size_id.toString() : ""}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sizes.map((s) => (
                      <SelectItem key={s.id} value={s.id.toString()}>
                        {s.name.en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <FormLabel>{messages("Public.color")}</FormLabel>
                <Select disabled value={variant.color_id ? variant.color_id.toString() : ""}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {colors.map((c) => (
                      <SelectItem key={c.id} value={c.id.toString()}>
                        {c.name.en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end pt-6">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={async () => {

                    await handleDelete(variant.id);

                  }}
                >
                  <Trash2Icon className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Variants */}
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="grid grid-cols-1 md:grid-cols-4 items-end gap-4"
        >
          <FormField
            control={control}
            name={`variants.${index}.size_id`}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>{messages("Public.size")}</FormLabel>
                <Select
                  onValueChange={(val) => field.onChange(val ? Number(val) : null)}
                  value={field.value !== null ? field.value?.toString() : ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={messages("Public.select_size")} />
                  </SelectTrigger>
                  <SelectContent>
                    {sizes.map((s) => (
                      <SelectItem key={s.id} value={s.id.toString()}>
                        {s.name.en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`variants.${index}.color_id`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{messages("Public.color")}</FormLabel>
                <Select
                  onValueChange={(val) => field.onChange(val ? Number(val) : null)}
                  value={field.value !== null ? field.value?.toString() : ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={messages("Public.select_color")} />
                  </SelectTrigger>
                  <SelectContent>
                    {colors.map((c) => (
                      <SelectItem key={c.id} value={c.id.toString()}>
                        {c.name.en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button
              type="button"
              variant="destructive"
              onClick={() => remove(index)}
            >
              {messages("actions.remove")}
            </Button>
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={() =>
          append({
            size_id: null,
            color_id: null,

          })
        }
      >
        {messages("Product.add_variant")}
      </Button>
    </div>
  );
};
