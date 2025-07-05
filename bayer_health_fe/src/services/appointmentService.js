import api from './api';

export const appointmentService = {
    // Get all appointments (filtered by role on backend)
    getAllAppointments: async () => {
        try {
            const response = await api.get('/appointments');
            return response.data.data.appointments;
        } catch (error) {
            throw error;
        }
    },

    // Get appointment by ID
    getAppointmentById: async (id) => {
        try {
            const response = await api.get(`/appointments/${id}`);
            return response.data.data.appointment;
        } catch (error) {
            throw error;
        }
    },

    // Create new appointment (Provider/Admin only)
    createAppointment: async (appointmentData) => {
        try {
            const response = await api.post('/appointments', appointmentData);
            return response.data.data.appointment;
        } catch (error) {
            throw error;
        }
    },

    // Update appointment (Provider/Admin only)
    updateAppointment: async (id, appointmentData) => {
        try {
            const response = await api.put(`/appointments/${id}`, appointmentData);
            return response.data.data.appointment;
        } catch (error) {
            throw error;
        }
    },

    // Delete appointment (Provider/Admin only)
    deleteAppointment: async (id) => {
        try {
            const response = await api.delete(`/appointments/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get upcoming appointments
    getUpcomingAppointments: async () => {
        try {
            const appointments = await appointmentService.getAllAppointments();
            const now = new Date();
            return appointments.filter(apt => new Date(apt.time) > now);
        } catch (error) {
            throw error;
        }
    },

    // Get past appointments
    getPastAppointments: async () => {
        try {
            const appointments = await appointmentService.getAllAppointments();
            const now = new Date();
            return appointments.filter(apt => new Date(apt.time) <= now);
        } catch (error) {
            throw error;
        }
    }
};

export default appointmentService; 