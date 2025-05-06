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
    CATEGORIES: {
        LIST: withVersion("categories"),
        DETAILS: (id: number) => withVersion(`categories/${id}`),
        CREATE: withVersion("categories"),
        UPDATE: (categoryId: number) => withVersion(`categories/${categoryId}`),
        DELETE: (categoryId: number) => withVersion(`categories/${categoryId}`),
    },
    BRANDS: {
        LIST: withVersion("brands"),
        DETAILS: (id: number) => withVersion(`brands/${id}`),
        CREATE: withVersion("brands"),
        UPDATE: (categoryId: number) => withVersion(`brands/${categoryId}`),
        DELETE: (categoryId: number) => withVersion(`brands/${categoryId}`),
    },
    COLOR_SEASONS: {
        LIST: withVersion("color-seasons"),
        DETAILS: (id: number) => withVersion(`color-seasons/${id}`),
        CREATE: withVersion("color-seasons"),
        UPDATE: (colorSeasonId: number) => withVersion(`color-seasons/${colorSeasonId}`),
        DELETE: (colorSeasonId: number) => withVersion(`color-seasons/${colorSeasonId}`),
    },
    COLORS: {
        LIST: withVersion("colors"),
        DETAILS: (id: number) => withVersion(`colors/${id}`),
        CREATE: withVersion("colors"),
        UPDATE: (colorId: number) => withVersion(`colors/${colorId}`),
        DELETE: (colorId: number) => withVersion(`colors/${colorId}`),
    },
    WAREHOUSES: {
        LIST: withVersion("warehouses"),
        DETAILS: (id: number) => withVersion(`warehouses/${id}`),
        CREATE: withVersion("warehouses"),
        UPDATE: (warehouseId: number) => withVersion(`warehouses/${warehouseId}`),
        DELETE: (warehouseId: number) => withVersion(`warehouses/${warehouseId}`),
    },
    SHELVES: {
        LIST: withVersion("shelves"),
        DETAILS: (id: number) => withVersion(`shelves/${id}`),
        CREATE: withVersion("shelves"),
        UPDATE: (shelfId: number) => withVersion(`shelves/${shelfId}`),
        DELETE: (shelfId: number) => withVersion(`shelves/${shelfId}`),
    },
    SIZES: {
        LIST: withVersion("sizes"),
        DETAILS: (id: number) => withVersion(`sizes/${id}`),
        CREATE: withVersion("sizes"),
        UPDATE: (sizeId: number) => withVersion(`sizes/${sizeId}`),
        DELETE: (sizeId: number) => withVersion(`sizes/${sizeId}`),
    },
    TAGS: {
        LIST: withVersion("tags"),
        DETAILS: (id: number) => withVersion(`tags/${id}`),
        CREATE: withVersion("tags"),
        UPDATE: (tagId: number) => withVersion(`tags/${tagId}`),
        DELETE: (tagId: number) => withVersion(`tags/${tagId}`),
    },
    CONFIGURATIONS: {
        LIST: withVersion("configurations"),
        UPDATE: withVersion(`configurations`),
    },
    LEARNING_VIDEOS: {
        LIST: withVersion("learning-videos"),
        DETAILS: (id: number) => withVersion(`learning-videos/${id}`),
        CREATE: withVersion("learning-videos"),
        UPDATE: (learningVideoId: number) => withVersion(`learning-videos/${learningVideoId}`),
        DELETE: (learningVideoId: number) => withVersion(`learning-videos/${learningVideoId}`),
    },
    HOME_SECTIONS: {
        LIST: withVersion("home-sections"),
        DETAILS: (id: number) => withVersion(`home-sections/${id}`),
        CREATE: withVersion("home-sections"),
        UPDATE: (homeSectionId: number) => withVersion(`home-sections/${homeSectionId}`),
        DELETE: (homeSectionId: number) => withVersion(`home-sections/${homeSectionId}`),
    },
};

export default API_ENDPOINTS;
