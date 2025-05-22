import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { RefreshCw } from "lucide-react";

interface BarcodeInputProps {
    name?: string;
    onGenerateBarcode: () => Promise<string | null>;
}

export default function BarcodeInput({
    name = "barcode",
    onGenerateBarcode,
}: BarcodeInputProps) {
    const methods = useFormContext();
     const { t: messages } = useTranslation();


    const handleGenerate = async () => {
        const generated = await onGenerateBarcode();
        if (generated) {
            methods.setValue(name, generated);
        }
    };

    return (
        <FormField
            control={methods.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{messages("Public.barcode")}</FormLabel>
                    <div className="relative">
                        <FormControl>
                            <Input {...field} className="pr-24" />
                        </FormControl>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleGenerate}
                            className="absolute top-1/2 right-0 transform -translate-y-1/2"
                        >
                            <RefreshCw className="w-4  mr-1" />
                            {messages("Public.generate")}
                        </Button>
                    </div>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
