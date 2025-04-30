
import { useTranslation } from "react-i18next";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { useFullPageLoading } from "@/context/FullPageLoadingContext";
import { logout } from "@/lib/store/slices/authSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store/store";

function SignOut() {
   const { t: messages } = useTranslation();
   const dispatch = useDispatch<AppDispatch>();
  const { setFullPageLoading } = useFullPageLoading();
  const handleSignOut = async () => {
    setFullPageLoading(true)
    dispatch(logout());
    setFullPageLoading(false)
  };

  return (

    <DropdownMenuItem onClick={() => handleSignOut()}>
      {messages("auth.Logout")}

    </DropdownMenuItem>

  );
}

export default SignOut;
