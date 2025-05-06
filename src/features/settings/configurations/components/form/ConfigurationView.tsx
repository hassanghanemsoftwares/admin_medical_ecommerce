
import { ConfigurationForm } from "./ConfigurationForm";
import { useConfigurationsLogic } from "../../hooks/useConfigurationsFormLogic";
import { useTranslation } from "react-i18next";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";


const ConfigurationView = () => {
    const {
        handleSubmitConfigForm,
        initialConfigData,
    } = useConfigurationsLogic();

    const { t: messages } = useTranslation();

    return (
        <div className="h-full w-full flex items-center justify-center mb-5">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="text-2xl">{messages("Public.configure_settings")}</CardTitle>
                </CardHeader>
                <CardContent>
                    <ConfigurationForm
                        onSubmit={handleSubmitConfigForm}

                        initialData={initialConfigData}
                    />
                </CardContent>
            </Card>
        </div>

    );
};

export default ConfigurationView;
