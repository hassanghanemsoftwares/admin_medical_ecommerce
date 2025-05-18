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
        UPDATE: (id: number) => withVersion(`users/${id}`),
        DELETE: (id: number) => withVersion(`users/${id}`),
    },
    CATEGORIES: {
        LIST: withVersion("categories"),
        DETAILS: (id: number) => withVersion(`categories/${id}`),
        CREATE: withVersion("categories"),
        UPDATE: (id: number) => withVersion(`categories/${id}`),
        DELETE: (id: number) => withVersion(`categories/${id}`),
    },
    BRANDS: {
        LIST: withVersion("brands"),
        DETAILS: (id: number) => withVersion(`brands/${id}`),
        CREATE: withVersion("brands"),
        UPDATE: (id: number) => withVersion(`brands/${id}`),
        DELETE: (id: number) => withVersion(`brands/${id}`),
    },
    COLOR_SEASONS: {
        LIST: withVersion("color-seasons"),
        DETAILS: (id: number) => withVersion(`color-seasons/${id}`),
        CREATE: withVersion("color-seasons"),
        UPDATE: (id: number) => withVersion(`color-seasons/${id}`),
        DELETE: (id: number) => withVersion(`color-seasons/${id}`),
    },
    OCCUPATIONS: {
        LIST: withVersion("occupations"),
        DETAILS: (id: number) => withVersion(`occupations/${id}`),
        CREATE: withVersion("occupations"),
        UPDATE: (id: number) => withVersion(`occupations/${id}`),
        DELETE: (id: number) => withVersion(`occupations/${id}`),
    },
    COLORS: {
        LIST: withVersion("colors"),
        DETAILS: (id: number) => withVersion(`colors/${id}`),
        CREATE: withVersion("colors"),
        UPDATE: (id: number) => withVersion(`colors/${id}`),
        DELETE: (id: number) => withVersion(`colors/${id}`),
    },
    WAREHOUSES: {
        LIST: withVersion("warehouses"),
        DETAILS: (id: number) => withVersion(`warehouses/${id}`),
        CREATE: withVersion("warehouses"),
        UPDATE: (id: number) => withVersion(`warehouses/${id}`),
        DELETE: (id: number) => withVersion(`warehouses/${id}`),
    },
    SHELVES: {
        LIST: withVersion("shelves"),
        DETAILS: (id: number) => withVersion(`shelves/${id}`),
        CREATE: withVersion("shelves"),
        UPDATE: (id: number) => withVersion(`shelves/${id}`),
        DELETE: (id: number) => withVersion(`shelves/${id}`),
    },
    SIZES: {
        LIST: withVersion("sizes"),
        DETAILS: (id: number) => withVersion(`sizes/${id}`),
        CREATE: withVersion("sizes"),
        UPDATE: (id: number) => withVersion(`sizes/${id}`),
        DELETE: (id: number) => withVersion(`sizes/${id}`),
    },
    TAGS: {
        LIST: withVersion("tags"),
        DETAILS: (id: number) => withVersion(`tags/${id}`),
        CREATE: withVersion("tags"),
        UPDATE: (id: number) => withVersion(`tags/${id}`),
        DELETE: (id: number) => withVersion(`tags/${id}`),
    },
    CONFIGURATIONS: {
        LIST: withVersion("configurations"),
        UPDATE: withVersion(`configurations`),
    },
    LEARNING_VIDEOS: {
        LIST: withVersion("learning-videos"),
        DETAILS: (id: number) => withVersion(`learning-videos/${id}`),
        CREATE: withVersion("learning-videos"),
        UPDATE: (id: number) => withVersion(`learning-videos/${id}`),
        DELETE: (id: number) => withVersion(`learning-videos/${id}`),
    },
    HOME_SECTIONS: {
        LIST: withVersion("home-sections"),
        DETAILS: (id: number) => withVersion(`home-sections/${id}`),
        CREATE: withVersion("home-sections"),
        UPDATE: (id: number) => withVersion(`home-sections/${id}`),
        DELETE: (id: number) => withVersion(`home-sections/${id}`),
    },
    PRODUCTS: {
        LIST: withVersion("products"),
        DETAILS: (id: number) => withVersion(`products/${id}`),
        CREATE: withVersion("products"),
        UPDATE: (id: number) => withVersion(`products/${id}`),
        DELETE: (id: number) => withVersion(`products/${id}`),
    },
    PRODUCT_IMAGES: {
        UPDATE: (id: number) => withVersion(`product_image/${id}`),
        DELETE: (id: number) => withVersion(`product_image/${id}`),
    },
    PRODUCT_VARIANT: {

        DELETE: (id: number) => withVersion(`product_variant/${id}`),
    },
};

export default API_ENDPOINTS;
