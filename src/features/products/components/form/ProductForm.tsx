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
import { Brand, Category, Color, ProductImage, Size, Tag } from "@/types/api.interfaces";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MultiSelect } from "@/components/MultiSelect";
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";
import { ProductImagesInput } from "../ProductImagesInput";
import { ProductVariants } from "../ProductVariants";
import BarcodeInput from "@/components/BarcodeInput";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type ProductFormValues = {
  name: Record<string, string>;
  short_description: Record<string, string>;
  description: Record<string, string>;
  barcode: string;
  category_id: number;
  brand_id: number;
  availability_status: "available" | "coming_soon" | "discontinued" | "pre_order";
  price: number;
  discount: number;
  min_order_quantity: number;
  max_order_quantity: number;
  images: (File | ProductImage | null)[];
  tags: Tag[];
  variants?: {
    id: number;
    size_id: number;
    color_id: number;
  }[];
};

const createFormSchema = (messages: (key: string) => string, isEdit: boolean) => {
  const MAX_FILE_SIZE = 2 * 1024 * 1024;
  const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

  const imageItemSchema = z.object({
    image: z.union([
      z.instanceof(File)
        .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
          message: messages("Public.image_mimes"),
        })
        .refine((file) => file.size <= MAX_FILE_SIZE, {
          message: messages("Public.image_max_size"),
        }),
      z.string()
        .url({ message: messages("Public.image_required") })
        .min(1, { message: messages("Public.image_required") }),
    ]),
    is_active: z.boolean({ required_error: messages("Public.image_required") }),
    arrangement: z.number({ required_error: messages("Public.image_required") }),
  });

  const imageSchema = isEdit
    ? z.array(imageItemSchema).optional()
    : z.array(imageItemSchema).min(1, { message: messages("Public.image_required") });

const variantsSchema = z
  .array(
    z.object({
      size_id: z.number().nullable().optional(),
      color_id: z.number().nullable().optional(),
    })
  )
  .optional()
  .refine(
    (variants) => {
      if (!variants) return true;
      const seen = new Set();
      for (const v of variants) {
        const key = `${v.size_id ?? "null"}-${v.color_id ?? "null"}`;
        if (seen.has(key)) return false;
        seen.add(key);
      }
      return true;
    },
    {
      message: messages("Public.duplicate_variant"),
    }
  );

  return z.object({
    name: z.object({
      en: z.string().min(1, messages("Public.name_en_required")),
      ar: z.string().min(1, messages("Public.name_ar_required")),
    }),
    short_description: z.object({
      en: z.string().min(1, messages("Public.short_description_en_required")),
      ar: z.string().min(1, messages("Public.short_description_ar_required")),
    }),
    description: z.object({
      en: z.string().min(1, messages("Public.description_en_required")),
      ar: z.string().min(1, messages("Public.description_ar_required")),
    }),
    barcode: z.string().min(1, messages("Public.barcode_required")),
    category_id: z.number().min(1, { message: messages("Public.category_required") }),
    brand_id: z.number().min(1, { message: messages("Public.brand_required") }),

    availability_status: z.enum(
      ["available", "coming_soon", "discontinued", "pre_order"],
      {
        required_error: messages("Public.availability_required"),
      }
    ),
    price: z.number({ required_error: messages("Public.price_required") }).min(0),
    discount: z.number().min(0).max(100),
    min_order_quantity: z
      .number({ required_error: messages("Public.min_order_required") })
      .min(1),
    max_order_quantity: z.number().min(0),
    images: imageSchema,
    tags: z
      .array(z.number({ required_error: messages("Public.tag_required") })).optional(),
    variants: variantsSchema,
  });
};

interface ProductFormProps {
  onSubmit: (data: z.infer<ReturnType<typeof createFormSchema>>) => void;
  onCancel: () => void;
  onExistingImageUpdate: (productImageId: number, data: { arrangement: number; is_active?: boolean }) => Promise<{ result: boolean; message?: string }>;
  onExistingImageDelete: (productImageId: number) => Promise<{ result: boolean; message?: string }>;
  onExistingVariantDelete: (productVariantId: number) => Promise<{ result: boolean; message?: string }>;
  onGenerateBarcode: () => Promise<string | null>;
  isEdit?: boolean;
  initialData?: Partial<ProductFormValues>;
  colors: Color[];
  sizes: Size[];
  tags: Tag[];
  categories: Category[];
  brands: Brand[];
  missingItems: String[];
}

export const ProductForm = ({
  onSubmit,
  onCancel,
  onExistingImageUpdate,
  onExistingImageDelete,
  onExistingVariantDelete,
  onGenerateBarcode,
  isEdit = false,
  initialData,
  colors,
  sizes,
  tags,
  categories,
  brands, missingItems
}: ProductFormProps) => {
  const { t: messages } = useTranslation();
  const formSchema = createFormSchema(messages, isEdit);
  type FormValues = z.infer<typeof formSchema>;

  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || { en: "", ar: "" },
      short_description: initialData?.short_description || { en: "", ar: "" },
      description: initialData?.description || { en: "", ar: "" },
      barcode: initialData?.barcode || "",
      category_id: initialData?.category_id || undefined,
      brand_id: initialData?.brand_id || undefined,
      availability_status: initialData?.availability_status || "available",
      price: initialData?.price ? Number(initialData.price) : 0,
      discount: initialData?.discount ? Number(initialData.discount) : 0,
      min_order_quantity: initialData?.min_order_quantity ? Number(initialData.min_order_quantity) : 1,
      max_order_quantity: initialData?.max_order_quantity ? Number(initialData.max_order_quantity) : 0,
      images: [],
      tags: initialData?.tags?.map(tag => tag.id) || [], variants: [],

    },
  });

  useEffect(() => {
    if (initialData) {
      methods.reset({
        ...initialData,
        name: initialData.name || { en: "", ar: "" },
        short_description: initialData.short_description || { en: "", ar: "" },
        description: initialData.description || { en: "", ar: "" },
        barcode: initialData.barcode || "",
        category_id: initialData.category_id || undefined,
        brand_id: initialData.brand_id || undefined,
        availability_status: initialData.availability_status || "available",
        price: initialData.price ? Number(initialData.price) : 0,
        discount: initialData.discount ? Number(initialData.discount) : 0,
        min_order_quantity: initialData.min_order_quantity ? Number(initialData.min_order_quantity) : 1,
        max_order_quantity: initialData.max_order_quantity ? Number(initialData.max_order_quantity) : 0,
        tags: initialData.tags?.map(tag => tag.id) || [],
        images: [], variants: [],

      });
    }
  }, [initialData, methods]);


  return (
    <div className="h-full w-full flex items-center justify-center mb-5 p-7">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl">  {isEdit ? messages("Product.edit_title") : messages("Product.create_title")}</CardTitle>
        </CardHeader>
        <CardContent>
          {(missingItems.length > 0) ? <div className="text-red-500 space-y-1 bg-red-50 border border-red-300 p-4 rounded-md">
            <p className="font-semibold">{messages("Public.missing_required_data")}</p>
            <ul className="list-disc list-inside">
              {missingItems.map((msg, i) => (
                <li key={i}>{msg}</li>
              ))}
            </ul>
          </div> : (
            <FormProvider {...methods}>
              <form
                onSubmit={methods.handleSubmit(
                  onSubmit,

                )}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(["en", "ar"] as const).map((lang) => (
                    <FormField
                      key={lang}
                      control={methods.control}
                      name={`name.${lang}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{messages(`Public.name_${lang}_label`)}</FormLabel>
                          <FormControl>
                            <Input {...field} dir={lang === "ar" ? "rtl" : "ltr"} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(["en", "ar"] as const).map((lang) => (
                    <FormField
                      key={lang}
                      control={methods.control}
                      name={`short_description.${lang}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{messages(`Public.short_description_${lang}_label`)}</FormLabel>
                          <FormControl>
                            <Input {...field} dir={lang === "ar" ? "rtl" : "ltr"} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(["en", "ar"] as const).map((lang) => (
                    <FormField
                      key={lang}
                      control={methods.control}
                      name={`description.${lang}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{messages(`Public.description_${lang}_label`)}</FormLabel>
                          <FormControl>
                            <Textarea {...field} dir={lang === "ar" ? "rtl" : "ltr"} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <BarcodeInput onGenerateBarcode={onGenerateBarcode} />

                  <FormField
                    control={methods.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{messages("Public.price")}</FormLabel>
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
                    name="discount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{messages("Public.discount")}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
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
                    name="min_order_quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{messages("Public.min_order_quantity")}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
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
                    name="max_order_quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{messages("Public.max_order_quantity")}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
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
                    name="availability_status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{messages("Public.availability_status")}</FormLabel>
                        <FormControl className="w-full">
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            defaultValue={initialData?.availability_status?.toString()}

                          >
                            <SelectTrigger>
                              <SelectValue placeholder={messages("Public.select_status")} />
                            </SelectTrigger>
                            <SelectContent>
                              {["available", "coming_soon", "discontinued", "pre_order"].map(status => (
                                <SelectItem key={status} value={status}>
                                  {messages(`Product.status.${status}`)}
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={methods.control}
                    name="category_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{messages("Public.category")}</FormLabel>
                        <FormControl className="w-full">
                          <Select
                            onValueChange={(val) => field.onChange(Number(val))}
                            value={field.value?.toString()}
                            defaultValue={initialData?.category_id?.toString()}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder={messages("Public.select_category")} />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category.id} value={category.id.toString()}>
                                  {category.name.en}
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
                    name="brand_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{messages("Public.brand")}</FormLabel>
                        <FormControl className="w-full">
                          <Select
                            onValueChange={(val) => field.onChange(Number(val))}
                            value={field.value?.toString()}
                            defaultValue={initialData?.brand_id?.toString()}

                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder={messages("Public.select_brand")} />
                            </SelectTrigger>
                            <SelectContent>
                              {brands.map((brand) => (
                                <SelectItem key={brand.id} value={brand.id.toString()}>
                                  {brand.name}
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
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{messages("Public.tags")}</FormLabel>
                        <FormControl>
                          <MultiSelect
                            options={tags.map(tag => ({ label: tag.name, value: tag.id }))}
                            value={field.value ?? []}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <ProductImagesInput
                  key={JSON.stringify(initialData?.images)}
                  form={methods}
                  name="images"
                  label={messages("Public.images")}
                  onExistingImageDelete={onExistingImageDelete}
                  onExistingImageUpdate={onExistingImageUpdate}
                  existingImages={
                    Array.isArray(initialData?.images)
                      ? initialData.images
                        .filter((img): img is ProductImage =>
                          img !== null &&
                          typeof img === "object" &&
                          "id" in img &&
                          "image" in img
                        )
                        .map((img) => ({
                          id: img.id,
                          url: img.image,
                          is_active: img.is_active,
                          arrangement: Number(img.arrangement) || 1,
                        }))
                      : []
                  }
                />

                <ProductVariants
                  colors={colors}
                  sizes={sizes}
                  existingVariants={initialData?.variants}
                  onExistingVariantDelete={onExistingVariantDelete}
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
            </FormProvider>)}

        </CardContent>
      </Card>
    </div>
  );
};



