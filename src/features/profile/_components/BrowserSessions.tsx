import { Card, CardContent } from "@/components/ui/card";
import { FC } from "react";
import { Session } from "@/types/api.interfaces";
import SessionItem from "./SessionItem";
import { toast } from "sonner";
import ConfirmPasswordDialog from "./ConfirmPasswordDialog";
import { destroySession, logoutOtherSessions } from "@/lib/services/sessions-service";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

interface BrowserSessionsProps {
    sessions?: Session[] | null;
}

const BrowserSessions: FC<BrowserSessionsProps> = ({ sessions = [] }) => {
    const queryClient = useQueryClient();
    const { t: messages } = useTranslation();

    const handleLogoutOtherSessions = async (password: string) => {
        const response = await logoutOtherSessions(password);
        if (response.result) {
            toast.success(response.message);
            await queryClient.invalidateQueries({ queryKey: ['user'] });
        } else {
            toast.error(response.message);
        }
    };

    const handleLogoutSession = async (password: string, sessionId: string) => {
        const response = await destroySession(password, sessionId);
        if (response.result) {
            toast.success(response.message);
            await queryClient.invalidateQueries({ queryKey: ['user'] });
        } else {
            toast.error(response.message);
        }
    };

    return (
        <Card>
            <CardContent className="space-y-4">
                <div className="p-6 space-y-4">
                    <h3 className="font-medium">{messages("Profile.Active Sessions")}</h3>
                    <p className="text-sm text-gray-500">
                        {messages("Profile.These are devices that have logged into your account.")}
                    </p>
                    <div className="space-y-1">
                        {sessions?.map((session) => (
                            <SessionItem key={session.id} session={session} onRemove={handleLogoutSession} />
                        ))}
                    </div>
                </div>

                <ConfirmPasswordDialog
                    onConfirm={handleLogoutOtherSessions}
                    buttonTitle={messages("Profile.Logout Other Sessions")}
                />
            </CardContent>
        </Card>
    );
};

export default BrowserSessions;
