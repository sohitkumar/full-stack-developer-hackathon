import { apiRequest } from './api';

export const healthService = {
    // Get all health topics
    getAllTopics: async () => {
        return apiRequest({
            method: 'GET',
            url: '/health-topics',
        });
    },

    // Get single health topic
    getTopicById: async (id) => {
        return apiRequest({
            method: 'GET',
            url: `/health-topics/${id}`,
        });
    },
};

export default healthService; 