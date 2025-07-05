const express = require('express');
const { protect } = require('../middleware/auth');
const appointmentController = require('../controllers/appointmentController');

const router = express.Router();

// Apply authentication to all routes
router.use(protect);

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private
router.get('/', appointmentController.getAllAppointments);

// @desc    Get single appointment
// @route   GET /api/appointments/:id
// @access  Private
router.get('/:id', appointmentController.getAppointmentById);

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Private/Provider
router.post('/', appointmentController.createAppointment);

// @desc    Update appointment
// @route   PUT /api/appointments/:id
// @access  Private/Provider
router.put('/:id', appointmentController.updateAppointment);

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Private/Provider
router.delete('/:id', appointmentController.deleteAppointment);

module.exports = router; 