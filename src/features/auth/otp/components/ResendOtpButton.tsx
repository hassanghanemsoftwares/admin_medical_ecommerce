import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/spinner";
import { useTranslation } from "react-i18next";
import { login } from "@/lib/services/auth-service";
import { setAuthData } from "@/lib/store/slices/authSlice";
import { RootState } from "@/lib/store/store";
import { useDispatch, useSelector } from "react-redux";
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

function ResendOtpButton() {
  const { t: messages } = useTranslation();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [isResending, setIsResending] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [countdown, setCountdown] = useState(1);
  const dispatch = useDispatch();
  const { email, password, expiryAt } = useSelector((state: RootState) => state.auth);
  const currentTime = new Date().getTime();
  const initializeCountdown = (expiryAt?: string) => {
    if (expiryAt) {
      const expiryTime = new Date(expiryAt).getTime();
      const remainingTime = Math.max(Math.floor((expiryTime - currentTime - 270000) / 1000), 0);
      setCountdown(remainingTime);
      setIsDisabled(remainingTime > 0);
    } else {

      setCountdown(30);
      setIsDisabled(true);
    }
  };
  useEffect(() => {
    initializeCountdown(expiryAt);
  
  }, [expiryAt]);


  const resendOtp = async () => {
    if (!executeRecaptcha) {
      toast.error("Recaptcha not ready");
      return;
    }

    setIsResending(true);
    setIsDisabled(true);
    const recaptchaToken = await executeRecaptcha('login');
    const response = await login(email, password, recaptchaToken);
  

    if (response.result) {
      const authData = {
        email: email,
        password: password,
        expiryAt: response.expiresAt,
      };
      dispatch(setAuthData(authData));
      toast.success(response.message);

      initializeCountdown();
    } else {
      toast.error(response.message);
    }

    setIsResending(false);
  };


  useEffect(() => {

    if (countdown === 0) {
      setIsDisabled(false);
      return;
    }

    const countdownInterval = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown === 1) {
          clearInterval(countdownInterval);
          setIsDisabled(false);
          return 0;
        }
        setIsDisabled(true);
        return prevCountdown - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [countdown]);

  return (
    <Button
      type="button"
      onClick={resendOtp}
      disabled={isDisabled || isResending}
      className={`w-full mt-4 ${isDisabled || isResending ? "cursor-not-allowed" : "cursor-pointer"}`}
    >
      {isResending ? (
        <>
          {messages("auth.resending")} <Spinner />
        </>
      ) : (
        isDisabled && countdown > 0 ? `${messages("auth.resendOtpCountdown")} (${countdown}s)` : messages("auth.resendOtp")
      )}
    </Button>
  );
}

export default ResendOtpButton;