import { apiRequest } from './api';

export const userService = {
    // Get all users (admin only)
    getAllUsers: async (params = {}) => {
        const queryParams = new URLSearchParams();

        // Add query parameters
        if (params.role) queryParams.append('role', params.role);
        if (params.isActive !== undefined) queryParams.append('isActive', params.isActive);
        if (params.isVerified !== undefined) queryParams.append('isVerified', params.isVerified);
        if (params.limit) queryParams.append('limit', params.limit);
        if (params.page) queryParams.append('page', params.page);
        if (params.search) queryParams.append('search', params.search);

        const queryString = queryParams.toString();
        const url = `/users${queryString ? `?${queryString}` : ''}`;

        return apiRequest({
            method: 'GET',
            url,
        });
    },

    // Get user by ID
    getUserById: async (id) => {
        return apiRequest({
            method: 'GET',
            url: `/users/${id}`,
        });
    },

    // Update user by ID
    updateUser: async (id, userData) => {
        return apiRequest({
            method: 'PUT',
            url: `/users/${id}`,
            data: userData,
        });
    },

    // Delete user by ID
    deleteUser: async (id) => {
        return apiRequest({
            method: 'DELETE',
            url: `/users/${id}`,
        });
    },

    // Get patients list (provider/admin only)
    getPatients: async (params = {}) => {
        const queryParams = new URLSearchParams();

        if (params.limit) queryParams.append('limit', params.limit);
        if (params.page) queryParams.append('page', params.page);
        if (params.search) queryParams.append('search', params.search);

        const queryString = queryParams.toString();
        const url = `/users/patients/list${queryString ? `?${queryString}` : ''}`;

        return apiRequest({
            method: 'GET',
            url,
        });
    },

    // Get providers list (admin only)
    getProviders: async (params = {}) => {
        const queryParams = new URLSearchParams();

        if (params.limit) queryParams.append('limit', params.limit);
        if (params.page) queryParams.append('page', params.page);
        if (params.search) queryParams.append('search', params.search);

        const queryString = queryParams.toString();
        const url = `/users/providers/list${queryString ? `?${queryString}` : ''}`;

        return apiRequest({
            method: 'GET',
            url,
        });
    },

    // Update patient info
    updatePatientInfo: async (id, patientData) => {
        return apiRequest({
            method: 'PUT',
            url: `/users/${id}/patient-info`,
            data: patientData,
        });
    },

    // Update provider info
    updateProviderInfo: async (id, providerData) => {
        return apiRequest({
            method: 'PUT',
            url: `/users/${id}/provider-info`,
            data: providerData,
        });
    },

    // Verify user account (admin only)
    verifyUser: async (id) => {
        return apiRequest({
            method: 'PATCH',
            url: `/users/${id}/verify`,
        });
    },

    // Activate/deactivate user account (admin only)
    activateUser: async (id) => {
        return apiRequest({
            method: 'PATCH',
            url: `/users/${id}/activate`,
        });
    },

    // Get user statistics overview (admin only)
    getUserStatsOverview: async () => {
        return apiRequest({
            method: 'GET',
            url: '/users/stats/overview',
        });
    },

    // Search users
    searchUsers: async (searchQuery, params = {}) => {
        return userService.getAllUsers({
            search: searchQuery,
            ...params,
        });
    },

    // Get user dashboard data
    getUserDashboardData: async (userId) => {
        try {
            const userResponse = await userService.getUserById(userId);

            if (!userResponse.success) {
                return userResponse;
            }

            const user = userResponse.data.user;
            let additionalData = {};

            // Get role-specific data
            if (user.role === 'admin') {
                const statsResponse = await userService.getUserStatsOverview();
                if (statsResponse.success) {
                    additionalData.userStats = statsResponse.data.stats;
                }
            }

            return {
                success: true,
                data: {
                    user,
                    ...additionalData,
                },
            };
        } catch (error) {
            return {
                success: false,
                error: 'Failed to fetch user dashboard data',
            };
        }
    },

    // Get user profile with extended info
    getUserProfile: async (userId) => {
        try {
            const userResponse = await userService.getUserById(userId);

            if (!userResponse.success) {
                return userResponse;
            }

            const user = userResponse.data.user;

            return {
                success: true,
                data: {
                    user,
                    canEdit: true, // This can be enhanced based on permissions
                },
            };
        } catch (error) {
            return {
                success: false,
                error: 'Failed to fetch user profile',
            };
        }
    },

    // Batch operations
    batchUpdateUsers: async (userIds, updateData) => {
        try {
            const promises = userIds.map(id => userService.updateUser(id, updateData));
            const results = await Promise.all(promises);

            const successful = results.filter(r => r.success);
            const failed = results.filter(r => !r.success);

            return {
                success: true,
                data: {
                    successful: successful.length,
                    failed: failed.length,
                    results,
                },
            };
        } catch (error) {
            return {
                success: false,
                error: 'Failed to batch update users',
            };
        }
    },

    // Get user activity summary
    getUserActivitySummary: async (userId) => {
        try {
            // This would typically combine multiple API calls
            const userResponse = await userService.getUserById(userId);

            if (!userResponse.success) {
                return userResponse;
            }

            // Add more activity data here as needed
            return {
                success: true,
                data: {
                    user: userResponse.data.user,
                    lastLogin: userResponse.data.user.lastLogin,
                    accountStatus: userResponse.data.user.isActive ? 'Active' : 'Inactive',
                    verificationStatus: userResponse.data.user.isVerified ? 'Verified' : 'Unverified',
                },
            };
        } catch (error) {
            return {
                success: false,
                error: 'Failed to fetch user activity summary',
            };
        }
    },
};

export default userService; 