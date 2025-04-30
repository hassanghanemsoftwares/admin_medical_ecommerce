import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FC } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/types/apiTypes";
import { useTranslation } from "react-i18next";

interface ProfileInfoProps {
  user?: User | null;
}

const ProfileInfo: FC<ProfileInfoProps> = ({ user }) => {
  const { t: messages } = useTranslation();

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg">{messages("Profile.Profile Details")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={user?.image} />
            <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>

        <div className="space-y-4">
          <div className="space-y-6">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                {messages("Profile.Full Name")}
              </p>
              <p className="font-semibold">{user?.name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                {messages("Profile.Email")}
              </p>
              <p className="font-semibold">{user?.email}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileInfo;
