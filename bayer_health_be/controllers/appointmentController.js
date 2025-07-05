const Appointment = require('../models/Appointment');

// @desc    Get all appointments (filtered by role)
// @route   GET /api/appointments
// @access  Private
exports.getAllAppointments = async (req, res, next) => {
    try {
        let query = {};

        // If user is a patient, only show their appointments
        if (req.user && req.user.role === 'patient') {
            query.patientEmail = req.user.email;
        }
        // Providers and admins can see all appointments

        const appointments = await Appointment.find(query).sort({ time: 1 });

        res.status(200).json({
            status: 'success',
            results: appointments.length,
            data: {
                appointments
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get appointment by ID
// @route   GET /api/appointments/:id
// @access  Private
exports.getAppointmentById = async (req, res, next) => {
    try {
        let query = { _id: req.params.id };

        // If user is a patient, only allow viewing their own appointments
        if (req.user && req.user.role === 'patient') {
            query.patientEmail = req.user.email;
        }

        const appointment = await Appointment.findOne(query);

        if (!appointment) {
            return res.status(404).json({
                status: 'error',
                message: 'Appointment not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                appointment
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new appointment (Provider/Admin only)
// @route   POST /api/appointments
// @access  Private/Provider
exports.createAppointment = async (req, res, next) => {
    try {
        // Only providers and admins can create appointments
        if (req.user.role === 'patient') {
            return res.status(403).json({
                status: 'error',
                message: 'Patients cannot create appointments. Please contact your healthcare provider.'
            });
        }

        const { patientName, patientEmail, reason, time } = req.body;

        const appointment = await Appointment.create({
            patientName,
            patientEmail,
            reason,
            time
        });

        res.status(201).json({
            status: 'success',
            message: 'Appointment created successfully',
            data: {
                appointment
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update appointment (Provider/Admin only)
// @route   PUT /api/appointments/:id
// @access  Private/Provider
exports.updateAppointment = async (req, res, next) => {
    try {
        // Only providers and admins can update appointments
        if (req.user.role === 'patient') {
            return res.status(403).json({
                status: 'error',
                message: 'Patients cannot modify appointments. Please contact your healthcare provider.'
            });
        }

        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!appointment) {
            return res.status(404).json({
                status: 'error',
                message: 'Appointment not found'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Appointment updated successfully',
            data: {
                appointment
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete appointment (Provider/Admin only)
// @route   DELETE /api/appointments/:id
// @access  Private/Provider
exports.deleteAppointment = async (req, res, next) => {
    try {
        // Only providers and admins can delete appointments
        if (req.user.role === 'patient') {
            return res.status(403).json({
                status: 'error',
                message: 'Patients cannot delete appointments. Please contact your healthcare provider.'
            });
        }

        const appointment = await Appointment.findByIdAndDelete(req.params.id);

        if (!appointment) {
            return res.status(404).json({
                status: 'error',
                message: 'Appointment not found'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Appointment deleted successfully'
        });
    } catch (error) {
        next(error);
    }
}; 