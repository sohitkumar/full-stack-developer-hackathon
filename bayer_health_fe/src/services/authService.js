import api, { apiRequest } from './api';

export const authService = {
    // Register new user
    register: async (userData) => {
        return apiRequest({
            method: 'POST',
            url: '/auth/register',
            data: userData,
        });
    },

    // Login user
    login: async (credentials) => {
        return apiRequest({
            method: 'POST',
            url: '/auth/login',
            data: credentials,
        });
    },

    // Get current user profile
    getProfile: async () => {
        return apiRequest({
            method: 'GET',
            url: '/auth/me',
        });
    },

    // Update user profile
    updateProfile: async (profileData) => {
        return apiRequest({
            method: 'PUT',
            url: '/auth/profile',
            data: profileData,
        });
    },

    // Change password
    changePassword: async (passwordData) => {
        return apiRequest({
            method: 'PUT',
            url: '/auth/change-password',
            data: passwordData,
        });
    },

    // Logout user
    logout: async () => {
        return apiRequest({
            method: 'POST',
            url: '/auth/logout',
        });
    },

    // Delete account
    deleteAccount: async (password) => {
        return apiRequest({
            method: 'DELETE',
            url: '/auth/account',
            data: { password, confirmDelete: 'DELETE' },
        });
    },

    // Get user stats (admin only)
    getUserStats: async () => {
        return apiRequest({
            method: 'GET',
            url: '/auth/stats',
        });
    },

    // Helper function to store auth data
    setAuthData: (token, user) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
    },

    // Helper function to get auth data
    getAuthData: () => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        return {
            token,
            user: user ? JSON.parse(user) : null,
        };
    },

    // Helper function to clear auth data
    clearAuthData: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        const token = localStorage.getItem('token');
        return !!token;
    },

    // Check if user has specific role
    hasRole: (role) => {
        const user = localStorage.getItem('user');
        if (!user) return false;

        const userData = JSON.parse(user);
        return userData.role === role;
    },

    // Check if user is admin
    isAdmin: () => {
        return authService.hasRole('admin');
    },

    // Check if user is provider
    isProvider: () => {
        return authService.hasRole('provider');
    },

    // Check if user is patient
    isPatient: () => {
        return authService.hasRole('patient');
    },
};

export default authService; 