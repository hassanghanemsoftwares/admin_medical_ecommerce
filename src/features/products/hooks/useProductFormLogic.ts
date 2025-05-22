import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
    createProduct,
    deleteProductImage,
    deleteProductVariant,
    generateBarcode,
    updateProduct,
    updateProductImage,
} from "@/lib/services/products-service";
import { useSettings } from "@/hooks/usePublicData";
import { ProductFormValues } from "../components/form/ProductForm";
import { useProductById } from "./useProducts";

export function useProductFormLogic() {
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
    if (!colors.length) missingItems.push(messages("Colors.noResults"));
    if (!sizes.length) missingItems.push(messages("Sizes.noResults"));
    if (!tags.length) missingItems.push(messages("Tags.noResults"));
    if (!categories.length) missingItems.push(messages("Categories.noResults"));
    if (!brands.length) missingItems.push(messages("Brands.noResults"));

    const [confirmDialogProps, setConfirmDialogProps] = useState({
        open: false,
        onOpenChange: (open: boolean) =>
            setConfirmDialogProps((prev) => ({ ...prev, open })),
        handleConfirm: async () => { },
        isLoading: false,
        title: "",
        desc: "",
        cancelBtnText: messages("Public.cancel"),
        confirmText: messages("Public.confirm"),
        destructive: true,
    });

    const openConfirmDialog = ({
        title,
        desc,
        confirmText,
        cancelBtnText,
        destructive = true,
        onConfirm,
    }: {
        title?: string;
        desc?: string;
        confirmText?: string;
        cancelBtnText?: string;
        destructive?: boolean;
        onConfirm: () => Promise<void>;
    }) => {
        setConfirmDialogProps({
            open: true,
            onOpenChange: (open) => setConfirmDialogProps((prev) => ({ ...prev, open })),
            handleConfirm: async () => {
                setConfirmDialogProps((prev) => ({ ...prev, isLoading: true }));
                await onConfirm();
                setConfirmDialogProps((prev) => ({ ...prev, isLoading: false, open: false }));
            },
            isLoading: false,
            title: title || "",
            desc: desc || "",
            confirmText: confirmText || messages("Public.confirm"),
            cancelBtnText: cancelBtnText || messages("Public.cancel"),
            destructive,
        });
    };

    const { data: productData, refetch } = useProductById(Number(id));
    const [initialData, setInitialData] = useState<Partial<ProductFormValues>>();

    useEffect(() => {
        if (isEdit && productData?.product) {
            const product = productData.product;
            setInitialData({
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
                variants: product.variants?.map((variant) => ({
                    id: variant.id,
                    size_id: variant.size?.id,
                    color_id: variant.color?.id,
                })),
            });
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
            if (!isEdit) {
                if (!data.variants || data.variants.length === 0) {
                    data.variants = [{ size_id: null, color_id: null }];
                }
            }

            data.variants?.forEach((variant: any, index: number) => {
                const sizeId = variant.size_id === null ? "" : String(variant.size_id);
                const colorId = variant.color_id === null ? "" : String(variant.color_id);

                formData.append(`variants[${index}][size_id]`, sizeId);
                formData.append(`variants[${index}][color_id]`, colorId);
            });


            const response = isEdit
                ? await updateProduct(Number(id), formData)
                : await createProduct(formData);

            response.result
                ? toast.success(response.message)
                : toast.error(response.message);

            response.result && navigate("/products");
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
                title: messages("Product.update_image_title"),
                desc: messages("Product.update_image_desc"),
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

    const onExistingImageDelete = async (productImageId: number) => {
        return new Promise<{ result: boolean; message?: string }>((resolve) => {
            openConfirmDialog({
                title: messages("Product.delete_image_title"),
                desc: messages("Product.delete_image_desc"),
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

    const onExistingVariantDelete = async (variantId: number) => {
        return new Promise<{ result: boolean; message?: string }>((resolve) => {
            openConfirmDialog({
                title: messages("Product.delete_variant_title"),
                desc: messages("Product.delete_variant_desc"),
                onConfirm: async () => {
                    try {
                        const response = await deleteProductVariant(variantId);
                        response.result
                            ? toast.success(response.message)
                            : toast.error(response.message);
                        response.result && refetch()
                        resolve({ result: response.result, message: response.message });
                    } catch (error: any) {
                        toast.error(error?.response?.data?.message || "Delete failed.");
                        resolve({ result: false, message: "Delete failed." });
                    }
                },
            });
        });
    };

    const onGenerateBarcode = async (): Promise<string | null> => {
        try {
            const response = await generateBarcode();
            if (response.result && response.barcode) {
                return response.barcode;
            }
            toast.error(response.message || "Barcode generation failed.");
            return null;
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Unexpected error during barcode generation.");
            return null;
        }
    };

    const handleCancel = () => {
        navigate("/products");
    };

    return {
        messages,
        isEdit,
        initialData,
        colors,
        sizes,
        tags,
        categories,
        brands,
        missingItems,
        handleSubmit,
        handleCancel,
        onExistingImageUpdate,
        onExistingImageDelete,
        onExistingVariantDelete,
        onGenerateBarcode,
        confirmDialogProps,
    };
}
