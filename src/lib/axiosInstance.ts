import axios, { AxiosHeaders, InternalAxiosRequestConfig } from 'axios';
import API_ENDPOINTS from './api-endpoints';
import i18n from 'i18next';
import Cookies from 'js-cookie';

export const axiosInstance = axios.create({
    baseURL: API_ENDPOINTS.BASE_URL,
    withCredentials: true,
    withXSRFToken: true
});

const onRequest = async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    const APP_KEY = import.meta.env.VITE_APP_KEY;
    const userAgent = window.navigator.userAgent;
    const token = Cookies.get("Authorization") || "";
    const team = Cookies.get("X-Team-ID") || "";
    const language = i18n.language || "en";
    config.headers = new AxiosHeaders({
        Authorization: token ? `Bearer ${token}` : "",
        "X-Team-ID": team,
        "Accept-Language": language,
     
        'App-key':APP_KEY ,
        'agent': userAgent,
        ...config.headers,
    });

    return config;
};

axiosInstance.interceptors.request.use(onRequest);
export default axiosInstance;