const express = require('express');
const { body, query } = require('express-validator');
const { protect, authorize, checkOwnership } = require('../middleware/auth');
const userController = require('../controllers/userController');

const router = express.Router();

// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Private/Admin
router.get('/', protect, authorize('admin'), [
    query('role').optional().isIn(['patient', 'provider', 'admin']),
    query('isActive').optional().isBoolean(),
    query('isVerified').optional().isBoolean(),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('page').optional().isInt({ min: 1 }),
    query('search').optional().isLength({ min: 1, max: 100 })
], userController.getAllUsers);

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private (own profile) or Admin
router.get('/:id', protect, checkOwnership, userController.getUserById);

// @desc    Update user by ID
// @route   PUT /api/users/:id
// @access  Private (own profile) or Admin
router.put('/:id', protect, checkOwnership, [
    body('firstName').optional().trim().isLength({ min: 2, max: 50 }),
    body('lastName').optional().trim().isLength({ min: 2, max: 50 }),
    body('phoneNumber').optional().isMobilePhone(),
    body('role').optional().isIn(['patient', 'provider', 'admin']),
    body('isActive').optional().isBoolean(),
    body('isVerified').optional().isBoolean()
], userController.updateUser);

// @desc    Delete user by ID
// @route   DELETE /api/users/:id
// @access  Private (own profile) or Admin
router.delete('/:id', protect, checkOwnership, userController.deleteUser);

// @desc    Get patients (provider and admin only)
// @route   GET /api/users/patients/list
// @access  Private/Provider/Admin
router.get('/patients/list', protect, authorize('provider', 'admin'), [
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('page').optional().isInt({ min: 1 }),
    query('search').optional().isLength({ min: 1, max: 100 })
], userController.getPatients);

// @desc    Get providers (admin only)
// @route   GET /api/users/providers/list
// @access  Private/Admin
router.get('/providers/list', protect, authorize('admin'), [
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('page').optional().isInt({ min: 1 }),
    query('search').optional().isLength({ min: 1, max: 100 })
], userController.getProviders);

// @desc    Update patient info
// @route   PUT /api/users/:id/patient-info
// @access  Private (own profile) or Provider/Admin
router.put('/:id/patient-info', protect, [
    body('dateOfBirth').optional().isISO8601(),
    body('gender').optional().isIn(['male', 'female', 'other', 'prefer-not-to-say']),
    body('bloodType').optional().isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
    body('allergies').optional().isArray(),
    body('medicalHistory').optional().isArray(),
    body('currentMedications').optional().isArray(),
    body('emergencyContact.name').optional().isLength({ min: 2, max: 100 }),
    body('emergencyContact.relationship').optional().isLength({ min: 2, max: 50 }),
    body('emergencyContact.phoneNumber').optional().isMobilePhone()
], userController.updatePatientInfo);

// @desc    Update provider info
// @route   PUT /api/users/:id/provider-info
// @access  Private (own profile) or Admin
router.put('/:id/provider-info', protect, [
    body('specialization').optional().isLength({ min: 2, max: 100 }),
    body('licenseNumber').optional().isLength({ min: 2, max: 50 }),
    body('yearsOfExperience').optional().isInt({ min: 0, max: 70 }),
    body('education').optional().isArray(),
    body('certifications').optional().isArray(),
    body('hospitalAffiliations').optional().isArray()
], userController.updateProviderInfo);

// @desc    Verify user account (admin only)
// @route   PATCH /api/users/:id/verify
// @access  Private/Admin
router.patch('/:id/verify', protect, authorize('admin'), userController.verifyUser);

// @desc    Activate/deactivate user account (admin only)
// @route   PATCH /api/users/:id/activate
// @access  Private/Admin
router.patch('/:id/activate', protect, authorize('admin'), userController.activateUser);

// @desc    Get user statistics (admin only)
// @route   GET /api/users/stats/overview
// @access  Private/Admin
router.get('/stats/overview', protect, authorize('admin'), userController.getUserStatsOverview);

module.exports = router; 