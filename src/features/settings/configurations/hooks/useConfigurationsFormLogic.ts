import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store/store";
import { fetchSettings } from "@/lib/store/slices/settingsSlice";
import { updateConfiguration } from "@/lib/services/configuration-service";
import { toast } from "sonner";
import { useConfigurations } from "./useConfigurations";
import { GetConfigurationsResponse } from "@/types/response.interfaces";
import { ConfigurationsFormValues } from "../components/form/ConfigurationForm";
import { Configuration } from "@/types/api.interfaces";

export function mapConfigurationsToFormValues(response: GetConfigurationsResponse): Partial<ConfigurationsFormValues> {
    const mapped: Partial<ConfigurationsFormValues> = {};

    if (!response || !Array.isArray(response.configurations)) {
        return mapped;
    }

    const stringKeys: (keyof ConfigurationsFormValues)[] = [
        "theme_color1",
        "theme_color2",
        "theme_color3",
        "theme_color4",
        "store_name",
        "contact_email",
        "contact_phone",
        "store_address",
    ];

    const numberKeys: (keyof ConfigurationsFormValues)[] = [
        "delivery_charge",
        "min_stock_alert",
    ];

    response.configurations.forEach((config: Configuration) => {
        const key = config.key as keyof ConfigurationsFormValues;

        if (numberKeys.includes(key)) {
            const numValue = Number(config.value);
            if (!isNaN(numValue)) {
                mapped[key] = numValue as any;
            }
        } else if (stringKeys.includes(key)) {
            mapped[key] = config.value as any;
        }
    });

    return mapped;
}


export function useConfigurationsLogic() {
    const { t: messages } = useTranslation();
    const dispatch = useDispatch<AppDispatch>();
    const [isConfigFormOpen, setIsConfigFormOpen] = useState(false);
    const [searchInput, setSearchInput] = useState("");

    useEffect(() => {
        dispatch(fetchSettings());
    }, [dispatch]);

    const { data: rawConfigData, isLoading, isError, refetch } = useConfigurations({});

    const initialConfigData = rawConfigData?.configurations
    ? mapConfigurationsToFormValues(rawConfigData)
    : undefined;

    const handleSubmitConfigForm = async (formDataValues: Record<string, any>) => {
        try {
            const formData = new FormData();
            Object.entries(formDataValues).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    formData.append(key, value);
                }
            });
            formData.append('_method', 'PUT');

            const response = await updateConfiguration(formData);

            if (response.result) {
                toast.success(response.message);
                setIsConfigFormOpen(false);
                refetch();
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            console.error("Configuration submission failed:", error);
            toast.error(messages("Public.UnexpectedError"));
        }
    };

    const handleRefresh = () => refetch();

    return {
        messages,
        initialConfigData,
        isLoading,
        isError,
        handleRefresh,
        setSearchInput,
        searchInput,
        setIsConfigFormOpen,
        isConfigFormOpen,
        handleSubmitConfigForm,
    };
}
