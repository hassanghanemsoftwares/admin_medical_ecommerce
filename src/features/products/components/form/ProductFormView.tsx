import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ProductForm, ProductFormValues } from "./ProductForm";
import { useProductById } from "../../hooks/useProducts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { createProduct, deleteProductImage, deleteProductVariant, updateProduct, updateProductImage } from "@/lib/services/products-service";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useSettings } from "@/hooks/useSettings";


export const ProductFormView = () => {
    const { t: messages } = useTranslation();
    const navigate = useNavigate();
    const { id } = useParams<{ id?: string }>();
    const isEdit = !!id;

    const { data: SettingsData } = useSettings();
    const tags = SettingsData?.tags || [];
    const categories = SettingsData?.categories || [];
    const brands = SettingsData?.brands || [];
    const colors = SettingsData?.colors || [];
    const sizes = SettingsData?.sizes || [];

    const missingItems: string[] = [];

    if (colors.length === 0) missingItems.push(messages("Colors.noResults"));
    if (sizes.length === 0) missingItems.push(messages("Sizes.noResults"));
    if (tags.length === 0) missingItems.push(messages("Tags.noResults"));
    if (categories.length === 0) missingItems.push(messages("Categories.noResults"));
    if (brands.length === 0) missingItems.push(messages("Brands.noResults"));

    const [confirmDialogProps, setConfirmDialogProps] = useState<{
        open: boolean;
        onOpenChange: (open: boolean) => void;
        handleConfirm: () => Promise<void>;
        isLoading: boolean;
        title?: string;
        desc?: string;
        cancelBtnText?: string;
        confirmText?: string;
        destructive?: boolean;
    }>({
        open: false,
        onOpenChange: () => setConfirmDialogProps((prev) => ({ ...prev, open: false })),
        handleConfirm: async () => { },
        isLoading: false,
    });
    const openConfirmDialog = (
        options: {
            title?: string;
            desc?: string;
            confirmText?: string;
            cancelBtnText?: string;
            destructive?: boolean;
            onConfirm: () => Promise<void>;
        }
    ) => {
        setConfirmDialogProps({
            open: true,
            onOpenChange: (open) =>
                setConfirmDialogProps((prev) => ({ ...prev, open })),
            handleConfirm: async () => {
                setConfirmDialogProps((prev) => ({ ...prev, isLoading: true }));
                await options.onConfirm();
                setConfirmDialogProps((prev) => ({ ...prev, isLoading: false, open: false }));
            },
            isLoading: false,
            title: options.title,
            desc: options.desc,
            confirmText: options.confirmText || messages("Public.confirm"),
            cancelBtnText: options.cancelBtnText || messages("Public.cancel"),
            destructive: options.destructive ?? true,
        });
    };

    const { data: productData } = useProductById(Number(id));
    const [initialData, setInitialData] = useState<Partial<ProductFormValues>>();

    useEffect(() => {
        if (isEdit && productData?.product) {
            const product = productData.product;
            const transformed: Partial<ProductFormValues> = {
                name: product.name,
                short_description: product.short_description,
                description: product.description,
                barcode: product.barcode,
                category_id: product.category?.id,
                brand_id: product.brand?.id,
                availability_status: product.availability_status as ProductFormValues["availability_status"],
                price: product.price,
                discount: product.discount,
                min_order_quantity: product.min_order_quantity,
                max_order_quantity: product.max_order_quantity,
                images: product.images,
                tags: product.tags,
                variants: product.variants?.map(variant => ({
                    id: variant.id,
                    size_id: variant.size?.id,
                    color_id: variant.color?.id,
                })),
            };

            setInitialData(transformed);
        }
    }, [productData, isEdit]);

    const handleSubmit = async (data: any) => {
        try {
            const formData = new FormData();
            formData.append('name[en]', data.name.en);
            formData.append('name[ar]', data.name.ar);
            formData.append('description[en]', data.description.en);
            formData.append('description[ar]', data.description.ar);
            formData.append('short_description[en]', data.short_description.en);
            formData.append('short_description[ar]', data.short_description.ar);
            formData.append('barcode', data.barcode);
            formData.append('category_id', data.category_id);
            formData.append('brand_id', data.brand_id);
            formData.append('availability_status', data.availability_status);
            formData.append('price', data.price);
            formData.append('discount', data.discount);
            formData.append('min_order_quantity', data.min_order_quantity);
            formData.append('max_order_quantity', data.max_order_quantity);

            data.images.forEach((img: any, index: number) => {
                if (img.image instanceof File) {
                    formData.append(`images[${index}][image]`, img.image);
                }
                formData.append(`images[${index}][is_active]`, img.is_active ? '1' : '0');
                formData.append(`images[${index}][arrangement]`, String(img.arrangement));
            });


            data.tags?.forEach((tagId: any, index: number) => {
                formData.append(`tags[${index}]`, String(tagId));
            });

            data.variants?.forEach((variant: any, index: number) => {
                formData.append(`variants[${index}][size_id]`, String(variant.size_id));
                formData.append(`variants[${index}][color_id]`, String(variant.color_id));
            });

            const response = isEdit
                ? await updateProduct(Number(id), formData)
                : await createProduct(formData);

            response.result
                ? toast.success(response.message)
                : toast.error(response.message);

            navigate("/products");
        } catch (error: any) {

            toast.error(error?.response?.data?.message || "Create failed.");

        }
    };
    const onExistingImageUpdate = async (
        productImageId: number,
        data: { arrangement: number; is_active?: boolean }
    ): Promise<{ result: boolean; message?: string }> => {
        return new Promise((resolve) => {
            openConfirmDialog({
                title: messages("Product.update_image_title") || "",
                desc: messages("Product.update_image_desc") || "",
                destructive: false,
                onConfirm: async () => {
                    try {
                        const formData = new FormData();
                        formData.append("arrangement", String(data.arrangement));
                        if (typeof data.is_active !== "undefined") {
                            formData.append("is_active", data.is_active ? "1" : "0");
                        }
                        const response = await updateProductImage(productImageId, formData);
                        response.result
                            ? toast.success(response.message)
                            : toast.error(response.message);
                        resolve({ result: response.result, message: response.message });
                    } catch (error: any) {
                        toast.error(error?.response?.data?.message || "Update failed.");
                        resolve({ result: false, message: "Update failed." });
                    }
                },
            });
        });
    };

    const onExistingImageDelete = async (
        productImageId: number
    ): Promise<{ result: boolean; message?: string }> => {
        return new Promise((resolve) => {
            openConfirmDialog({
                title: messages("Product.delete_image_title") || "",
                desc: messages("Product.delete_image_desc") || "",
                onConfirm: async () => {
                    try {
                        const response = await deleteProductImage(productImageId);
                        response.result
                            ? toast.success(response.message)
                            : toast.error(response.message);

                        resolve({ result: response.result, message: response.message });
                    } catch (error: any) {
                        toast.error(error?.response?.data?.message || "Delete failed.");
                        resolve({ result: false, message: "Delete failed." });
                    }
                },
            });
        });
    };
    const onExistingVariantDelete = async (
        productVariantId: number
    ): Promise<{ result: boolean; message?: string }> => {
        return new Promise((resolve) => {
            openConfirmDialog({
                title: messages("Product.delete_variant_title") || "",
                desc: messages("Product.delete_variant_desc") || "",
                onConfirm: async () => {
                    try {
                        const response = await deleteProductVariant(productVariantId);
                        response.result
                            ? toast.success(response.message)
                            : toast.error(response.message);

                        resolve({ result: response.result, message: response.message });
                    } catch (error: any) {
                        toast.error(error?.response?.data?.message || "Delete failed.");
                        resolve({ result: false, message: "Delete failed." });
                    }
                },
            });
        });
    };
    const handleCancel = () => {
        navigate("/products");
    };
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
                    </div> : <ProductForm
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                        onExistingImageUpdate={onExistingImageUpdate}
                        onExistingImageDelete={onExistingImageDelete}


                        onExistingVariantDelete={onExistingVariantDelete}
                        isEdit={isEdit}
                        initialData={initialData || undefined}
                        colors={colors}
                        sizes={sizes}
                        tags={tags}
                        categories={categories}
                        brands={brands}
                    />}
                </CardContent>
            </Card>
            <ConfirmDialog
                open={confirmDialogProps.open}
                onOpenChange={confirmDialogProps.onOpenChange}
                handleConfirm={confirmDialogProps.handleConfirm}
                isLoading={confirmDialogProps.isLoading}
                title={confirmDialogProps.title || ""}
                desc={confirmDialogProps.desc || ""}
                cancelBtnText={confirmDialogProps.cancelBtnText}
                confirmText={confirmDialogProps.confirmText}
                destructive={confirmDialogProps.destructive}
            />
        </div>

    );
};