// API Configuration
export const API_CONFIG = {
    // Base API URL - can be overridden with environment variable
    BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',

    // Timeout settings
    TIMEOUT: 10000, // 10 seconds

    // Retry configuration
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000, // 1 second

    // Environment
    IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
    IS_PRODUCTION: process.env.NODE_ENV === 'production',

    // Feature flags
    ENABLE_DEMO_ACCOUNTS: true,
    ENABLE_OFFLINE_MODE: false,

    // Debug settings
    DEBUG: process.env.REACT_APP_DEBUG === 'true' || process.env.NODE_ENV === 'development',
};

// API Endpoints
export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        PROFILE: '/auth/me',
        UPDATE_PROFILE: '/auth/profile',
        CHANGE_PASSWORD: '/auth/change-password',
        LOGOUT: '/auth/logout',
        DELETE_ACCOUNT: '/auth/account',
        STATS: '/auth/stats',
    },
    USERS: {
        LIST: '/users',
        BY_ID: (id: string) => `/users/${id}`,
        UPDATE: (id: string) => `/users/${id}`,
        DELETE: (id: string) => `/users/${id}`,
        PATIENTS: '/users/patients/list',
        PROVIDERS: '/users/providers/list',
        PATIENT_INFO: (id: string) => `/users/${id}/patient-info`,
        PROVIDER_INFO: (id: string) => `/users/${id}/provider-info`,
        VERIFY: (id: string) => `/users/${id}/verify`,
        ACTIVATE: (id: string) => `/users/${id}/activate`,
        STATS_OVERVIEW: '/users/stats/overview',
    },
    HEALTH: {
        TOPICS: '/health-topics',
        BY_ID: (id: string) => `/health-topics/${id}`,
        POPULAR: '/health-topics/popular',
        RECENT: '/health-topics/recent',
        BY_CATEGORY: (category: string) => `/health-topics/category/${encodeURIComponent(category)}`,
        CREATE: '/health-topics',
        UPDATE: (id: string) => `/health-topics/${id}`,
        DELETE: (id: string) => `/health-topics/${id}`,
        PUBLISH: (id: string) => `/health-topics/${id}/publish`,
        LIKE: (id: string) => `/health-topics/${id}/like`,
        CATEGORIES: '/health-topics/categories/list',
    },
};

// Error Messages
export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Network error. Please check your internet connection.',
    TIMEOUT_ERROR: 'Request timed out. Please try again.',
    SERVER_ERROR: 'Server error. Please try again later.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    FORBIDDEN: 'Access denied. You do not have permission.',
    NOT_FOUND: 'The requested resource was not found.',
    VALIDATION_ERROR: 'Please check your input and try again.',
    UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
    LOGIN: 'Login successful',
    REGISTER: 'Registration successful',
    LOGOUT: 'Logged out successfully',
    PROFILE_UPDATED: 'Profile updated successfully',
    PASSWORD_CHANGED: 'Password changed successfully',
    TOPIC_CREATED: 'Health topic created successfully',
    TOPIC_UPDATED: 'Health topic updated successfully',
    TOPIC_DELETED: 'Health topic deleted successfully',
    TOPIC_LIKED: 'Topic liked',
    TOPIC_UNLIKED: 'Topic unliked',
};

export default API_CONFIG; 