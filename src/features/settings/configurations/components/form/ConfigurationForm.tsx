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
import { useEffect } from "react";

const createFormSchema = (messages: (key: string) => string) =>
    z.object({
        theme_color1: z.string().max(7).optional(),
        theme_color2: z.string().max(7).optional(),
        theme_color3: z.string().max(7).optional(),
        theme_color4: z.string().max(7).optional(),
        delivery_charge: z
            .number()
            .min(0, messages("Public.delivery_charge_min"))
            .optional()
            .or(z.literal(NaN)),
        min_stock_alert: z
            .number()
            .int()
            .min(1, messages("Public.min_stock_alert_min"))
            .optional()
            .or(z.literal(NaN)),
        store_name: z.string().max(255).optional(),
        contact_email: z.string().email().max(255).optional(),
        contact_phone: z.string().max(20).optional(),
        store_address: z.string().max(255).optional(),
    });

// 👇 we define it outside so it’s reusable
export type ConfigurationsFormValues = {
    theme_color1?: string;
    theme_color2?: string;
    theme_color3?: string;
    theme_color4?: string;
    delivery_charge?: number;
    min_stock_alert?: number;
    store_name?: string;
    contact_email?: string;
    contact_phone?: string;
    store_address?: string;
};

interface ConfigurationFormProps {
    onSubmit: (data: ConfigurationsFormValues) => void;
    initialData?: Partial<ConfigurationsFormValues>;
}

export const ConfigurationForm = ({
    onSubmit,
    initialData,
}: ConfigurationFormProps) => {
    const { t: messages } = useTranslation();
    const formSchema = createFormSchema(messages);

    const methods = useForm<ConfigurationsFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            theme_color1: initialData?.theme_color1 || "#000000",
            theme_color2: initialData?.theme_color2 || "#000000",
            theme_color3: initialData?.theme_color3 || "#000000",
            theme_color4: initialData?.theme_color4 || "#000000",
            delivery_charge: initialData?.delivery_charge ?? 0,
            min_stock_alert: initialData?.min_stock_alert ?? 1,
            store_name: initialData?.store_name || "",
            contact_email: initialData?.contact_email || "",
            contact_phone: initialData?.contact_phone || "",
            store_address: initialData?.store_address || "",
        },
    });

    // Ensure form resets if initialData changes
    useEffect(() => {
        methods.reset(initialData);
    }, [initialData, methods]);

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {["theme_color1", "theme_color2", "theme_color3", "theme_color4"].map((field) => (
                        <FormField
                            key={field}
                            control={methods.control}
                            name={field as keyof ConfigurationsFormValues}
                            render={({ field: f }) => (
                                <FormItem>
                                    <FormLabel>{messages(`Public.${field}`)}</FormLabel>
                                    <FormControl>
                                        <Input type="color" {...f} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    ))}

                    <FormField
                        control={methods.control}
                        name="delivery_charge"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{messages("Public.delivery_charge")}</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        {...field}
                                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={methods.control}
                        name="min_stock_alert"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{messages("Public.min_stock_alert")}</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        {...field}
                                        onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={methods.control}
                        name="store_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{messages("Public.store_name")}</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={methods.control}
                        name="contact_email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{messages("Public.contact_email")}</FormLabel>
                                <FormControl>
                                    <Input type="email" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={methods.control}
                        name="contact_phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{messages("Public.contact_phone")}</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={methods.control}
                        name="store_address"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{messages("Public.store_address")}</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-end gap-2">
                    <Button type="submit">{messages("actions.save")}</Button>
                </div>
            </form>
        </FormProvider>
    );
};
