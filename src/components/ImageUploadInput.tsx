
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";


interface ImageUploadInputProps {
  form: UseFormReturn<any>;
  name: string;
  label: string; existingImageUrl?: string;
}

export const ImageUploadInput = ({ form, name, label, existingImageUrl }: ImageUploadInputProps) => {
  const [preview, setPreview] = useState<string | null>(existingImageUrl || null);



  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field: { onChange } }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="space-y-2">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setPreview(URL.createObjectURL(file));
                    onChange(file);
                  }
                }}
              />
              {preview && (
                <div className="mt-2">
                  <img src={preview} alt="Preview" className="h-32 object-contain border rounded" />
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
