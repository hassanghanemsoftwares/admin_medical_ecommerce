import { useState } from "react";
import { toast } from "sonner";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ResendOtpButton from "./ResendOtpButton";
import { RootState } from "@/lib/store/store";
import { useDispatch, useSelector } from "react-redux";
import { verifyOtp } from "@/lib/services/auth-service";
import { setUserData } from "@/lib/store/slices/authSlice";
import Cookies from "js-cookie";
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import AuthCardComponent from "../../components/AuthCardComponent";

function VerifyOtpFormComponent() {
  const navigate = useNavigate()
  const { t: messages } = useTranslation();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const { email, password, expiryAt } = useSelector((state: RootState) => state.auth);

  if (!email || !password || !expiryAt) {
    navigate("/");
  }

  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();

  const onSubmit = async (otpValue: string) => {
    if (!executeRecaptcha) {
      toast.error("Recaptcha not ready");
      return;
    }

    setIsSubmitting(true);
    const recaptchaToken = await executeRecaptcha('login');
    const response = await verifyOtp(email, password, otpValue, recaptchaToken);
    if (response.result) {

      dispatch(setUserData(response.user));

      Cookies.set("Authorization", response.user.token)
      Cookies.set("X-Team-ID", response.user.teams[0].id)
      toast.success(messages("auth.otpVerified"));

      navigate("/dashboard");
    } else {
      toast.error(messages("auth.otpVerificationFailed"));
    }
    setOtp("");
    setIsSubmitting(false);
  };

  const handleOtpChange = (otpValue: string) => {
    setOtp(otpValue);
    if (otpValue.length === 6) {
      onSubmit(otpValue);
    }
  };

  return (
    <AuthCardComponent
      title={messages("auth.verifyOtpTitle")}
      description={messages("auth.verifyOtpDescription")}
    >

      <div className="flex flex-col items-center justify-center" dir="ltr">
        <InputOTP value={otp} onChange={handleOtpChange} maxLength={6} disabled={isSubmitting}>
          <InputOTPGroup>
            {[...Array(6)].map((_, index) => (
              <InputOTPSlot key={index} index={index} />
            ))}
          </InputOTPGroup>
        </InputOTP>
        <div className="text-center text-sm mt-2">{messages("auth.enterOtpText")}</div>

        <ResendOtpButton />
      </div>
    </AuthCardComponent>
  );
}

export default VerifyOtpFormComponent;
