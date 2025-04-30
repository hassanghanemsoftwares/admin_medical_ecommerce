import { Dot } from "lucide-react";
import { Session } from "@/types/apiTypes";
import ConfirmPasswordDialog from "./ConfirmPasswordDialog";
import { useTranslation } from "react-i18next";
import { getDeviceIcon } from "@/components/getDeviceIcon";

interface SessionItemProps {
    session: Session;
    onRemove: (password: string, sessionId: string) => void;
}


const SessionItem: React.FC<SessionItemProps> = ({ session, onRemove }) => {
    const { t: messages } = useTranslation();

    return (
        <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-4">
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    {getDeviceIcon(session.device, session.is_mobile, session.is_tablet, session.is_desktop)}
                </div>
                <div>
                    <div className="flex items-center space-x-2">
                        <p className="font-medium">
                            {session.device} ({session.browser})
                        </p>
                        {session.is_current_device && <Dot color="green" size={40} />}
                    </div>
                    <p className="text-sm text-gray-500">
                        {session.platform} • {session.location} • {session.ip_address}
                    </p>
                    <p className="text-xs text-gray-400">
                        {messages("Profile.Last active")}:{" "}
                        {session.last_activity_human === "0 seconds ago"
                            ? messages("Profile.now")
                            : session.last_activity_human}
                    </p>
                </div>
            </div>
            {!session.is_current_device && (
                <ConfirmPasswordDialog
                    onConfirm={(password) => onRemove(password, session.id)}
                    buttonTitle={messages("Profile.Logout")}
                />
            )}
        </div>
    );
};

export default SessionItem;
