import { useState, useEffect, } from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { Switch } from "@/components/ui/switch";

interface ProductImagesInputProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  existingImages?: {
    id: number;
    url: string;
    arrangement: number;
    is_active?: boolean;
  }[];
  onExistingImageUpdate: (
    productImageId: number,
    data: { arrangement: number; is_active?: boolean }
  ) => Promise<{ result: boolean; message?: string }>;
  onExistingImageDelete: (
    productImageId: number
  ) => Promise<{ result: boolean; message?: string }>;
}

type ImageWithMeta =
  | {
    id: number;
    url: string;
    arrangement: number;
    isNew: false;
    is_active: boolean;
  }
  | {
    file: File;
    url: string;
    arrangement: number;
    isNew: true;
    is_active: boolean;
  };

export const ProductImagesInput = ({
  form,
  name,
  label,
  existingImages = [],
  onExistingImageUpdate,
  onExistingImageDelete,
}: ProductImagesInputProps) => {
  const { t: messages } = useTranslation();

  const [images, setImages] = useState<ImageWithMeta[]>([]);

  useEffect(() => {
    const syncedImages: ImageWithMeta[] = existingImages.map((img) => ({
      id: img.id,
      url: img.url,
      arrangement: img.arrangement,
      isNew: false,
      is_active: img.is_active ?? true,
    }));

    setImages(syncedImages);
    updateFormImages(syncedImages);
  }, [JSON.stringify(existingImages)]);


  const updateFormImages = (updated: ImageWithMeta[]) => {
    const sorted = [...updated].sort((a, b) => a.arrangement - b.arrangement);
    const hasNewImages = sorted.some((img) => img.isNew);

    if (hasNewImages) {
      form.setValue(
        name,
        sorted.map((img) => ({
          image: img.isNew ? img.file : img.url,
          is_active: img.is_active,
          arrangement: img.arrangement,
        })),
        { shouldValidate: true }
      );
    }


  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages: ImageWithMeta[] = files.map((file, i) => ({
      file,
      url: URL.createObjectURL(file),
      arrangement: images.length + i + 1,
      isNew: true,
      is_active: true,
    }));

    const updated = [...images, ...newImages];
    setImages(updated);
    updateFormImages(updated);
  };

  const handleDelete = async (index: number) => {
    const target = images[index];

    if (!target.isNew && onExistingImageDelete) {
      try {
        const response = await onExistingImageDelete(target.id);

        if (!response?.result) {
          return;
        }
      } catch (error) {
        return;
      }
    }

    const updated = [...images];
    updated.splice(index, 1);

    updated.forEach((img, i) => {
      img.arrangement = i + 1;
    });

    setImages(updated);
    updateFormImages(updated);
  };

  const handleArrangementChange = async (index: number, newArrangement: number) => {
    const updated = [...images];
    const current = updated[index];
    const currentArrangement = current.arrangement;

    const swapIndex = updated.findIndex(
      (img, i) => img.arrangement === newArrangement && i !== index
    );

    if (swapIndex !== -1) {
      updated[swapIndex].arrangement = currentArrangement;
    }

    updated[index].arrangement = newArrangement;

    if (!current.isNew && onExistingImageUpdate) {
      try {
        const response = await onExistingImageUpdate(current.id, {
          arrangement: newArrangement,
          is_active: current.is_active,
        });

        if (!response?.result) {
          return;
        }

        setImages(updated);
        updateFormImages(updated);
      } catch (error) {
      }
    } else {
      setImages(updated);
      updateFormImages(updated);
    }
  };

  const handleIsActiveChange = async (index: number, value: boolean) => {
    const current = images[index];
    if (!current.isNew && onExistingImageUpdate) {
      try {
        const response = await onExistingImageUpdate(current.id, {
          arrangement: current.arrangement,
          is_active: value,
        });
        if (!response?.result) {
          return;
        }
        const updated = [...images];
        updated[index].is_active = value;
        setImages(updated);
        updateFormImages(updated);
      } catch (error) {
      }
    } else {
      const updated = [...images];
      updated[index].is_active = value;
      setImages(updated);
      updateFormImages(updated);
    }
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={() => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="space-y-2">
              <Input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
              />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-2">
                {images.map((img, index) => (
                  <div
                    key={img.url + "-" + index}
                    className="relative border rounded p-2 flex flex-col items-center gap-2"
                  >
                    <img
                      src={img.url}
                      alt={`Image ${index + 1}`}
                      className="h-32 object-contain rounded"
                    />
                    {img.isNew && (
                      <Badge className="absolute top-1 left-1 bg-blue-500 text-white text-xs">
                        New
                      </Badge>
                    )}

                    <div className="flex items-center gap-2 w-full">
                      <Select
                        value={String(img.arrangement)}
                        onValueChange={(value) =>
                          handleArrangementChange(index, Number(value))
                        }
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="Arrangement" />
                        </SelectTrigger>
                        <SelectContent>
                          {images.map((_, i) => (
                            <SelectItem key={i} value={String(i + 1)}>
                              {i + 1}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <div className="flex items-center gap-2 ml-auto">
                       
                        <FormItem>
                          <FormLabel>{messages("Public.status")}</FormLabel>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={img.is_active}
                              onCheckedChange={(checked) =>
                                handleIsActiveChange(index, Boolean(checked))
                              }
                            />
                            <span className="text-sm">
                              {img.is_active
                                ? messages("Public.active")
                                : messages("Public.inactive")}
                            </span>
                          </div>
                        </FormItem>
                      </div>
                    </div>

                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(index)}
                      className="absolute top-1 right-1"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
