const BASE_URL = import.meta.env.VITE_BASE_URL;
const VERSION = import.meta.env.VITE_API_VERSION;

// Helper to prefix version to API paths
const withVersion = (path: string) => `/api/${VERSION}/admin/${path}`;

// Define all API endpoints
const API_ENDPOINTS = {
    BASE_URL: BASE_URL,
    AUTH: {
        CSRF: "/sanctum/csrf-cookie",
        LOGIN: withVersion("login"),
        VERIFY_OTP: withVersion("verify-otp"),
        FORGOT_PASSWORD: withVersion("forgot-password"),
        RESET_PASSWORD: withVersion("reset-password"),
        LOGOUT: withVersion("logout"),
    },
    PROFILE: {
        GET_CUREENT_USER: withVersion("getCurrentUser"),
        CHANGE_PASSWORD: withVersion("changePassword"),
    },
    SESSIONS: {
        LIST: withVersion("sessions"),
        LOGOUT_OTHERS: withVersion("logoutOtherDevices"),
        DESTROY: withVersion("logoutSpecificDevice"),
    },
    ACTIVITY_LOGS: {
        LIST: withVersion("activity-logs"),
    },
    SETTINGS: {
        LIST: withVersion("allSettings"),
    },
    USERS: {
        LIST: withVersion("users"),
        DETAILS: (id: number) => withVersion(`users/${id}`),
        CREATE: withVersion("users"),
        UPDATE: (userId: number) => withVersion(`users/${userId}`),
        DELETE: (userId: number) => withVersion(`users/${userId}`),
    },
};

export default API_ENDPOINTS;
