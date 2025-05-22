import { ConfirmDialog } from "@/components/confirm-dialog";
import FullPageSpinner from "@/components/FullPageSpinner";
import { useProductFormLogic } from "../../hooks/useProductFormLogic";
import { ProductForm } from "./ProductForm";


export default function ProductFormView() {
    const {
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
    } = useProductFormLogic();

    const isLoading = isEdit && !initialData;

    if (isLoading) return <FullPageSpinner />;

    return (
        <>
            <ProductForm
                initialData={initialData}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                tags={tags}
                colors={colors}
                sizes={sizes}
                brands={brands}
                categories={categories}
                missingItems={missingItems}
                isEdit={isEdit}
                onExistingImageUpdate={onExistingImageUpdate}
                onExistingImageDelete={onExistingImageDelete}
                onExistingVariantDelete={onExistingVariantDelete}
                onGenerateBarcode={onGenerateBarcode}
            />
            <ConfirmDialog {...confirmDialogProps} />
        </>
    );
}
