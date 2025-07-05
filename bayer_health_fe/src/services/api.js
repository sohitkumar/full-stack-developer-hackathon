import axios from 'axios';

// Base API URL - adjust this based on your backend deployment
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with base configuration
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors and token refresh
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle common errors
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }

        // Extract error message from response
        const errorMessage = error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            'An unexpected error occurred';

        return Promise.reject({
            ...error,
            message: errorMessage,
            status: error.response?.status,
        });
    }
);

// Common API response handler
export const handleApiResponse = (response) => {
    return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message,
        status: response.status,
    };
};

// Common API error handler
export const handleApiError = (error) => {
    return {
        success: false,
        error: error.message,
        status: error.status || 500,
    };
};

// Generic API request function
export const apiRequest = async (config) => {
    try {
        const response = await api(config);
        return handleApiResponse(response);
    } catch (error) {
        return handleApiError(error);
    }
};

export default api; 