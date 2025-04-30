import API_ENDPOINTS, { } from "../api-endpoints";
import axiosInstance from "../axiosInstance";



export const login = async (email: string, password: string, recaptchaToken: string) => {
    if (!email || !password || !recaptchaToken) {
        return { message: "emailPasswordRequired", result: false };
    }

    try {
        const { data } = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, {
            email,
            password,
            recaptcha_token: recaptchaToken,
        });

        return data || { result: false, message: "noDataReceived" };
    } catch (error) {
        return { result: false, message: "loginError" };
    }
};


export const verifyOtp = async (email: string, password: string, otp: string, recaptchaToken: string) => {

    if (!email || !otp || !password) {
        return { message: "emailPasswordRequired", result: false };
    }
    try {
        const { data } = await axiosInstance.post(API_ENDPOINTS.AUTH.VERIFY_OTP, {
            email, password, otp,
            recaptcha_token: recaptchaToken,
        });
        return data || { result: false, message: "noDataReceived" };
    } catch (error) {
        return { result: false, message: "verifyOtpError" };
    }
};

export const forgetPassword = async (email: string, recaptchaToken: string) => {
    if (!email) {
        return { message: "emailRequired", result: false };
    }
    try {
        const { data } = await axiosInstance.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
            email,
            recaptcha_token: recaptchaToken,
        });
        return data || { result: false, message: "noDataReceived" };
    } catch (error) {
        return { result: false, message: "forgetPasswordError" };
    }
};

export const resetPassword = async (token: string, email: string, password: string, password_confirmation: string, recaptchaToken: string) => {
    if (!email || !password || !password_confirmation || !token) {
        return { message: "passwordsAndTokenRequired", result: false };
    }

    try {
        const { data } = await axiosInstance.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
            email, password, password_confirmation, token,
            recaptcha_token: recaptchaToken,
        });
        return data || { result: false, message: "noDataReceived" };
    } catch (error) {
        return { result: false, message: "resetPasswordError" };
    }
};

