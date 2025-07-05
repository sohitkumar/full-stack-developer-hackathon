const express = require('express');
const { body } = require('express-validator');
const { protect, authRateLimit } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const authController = require('../controllers/authController');

const router = express.Router();

// Validation rules
const registerValidation = [
    body('firstName')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('First name must be between 2 and 50 characters'),
    body('lastName')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Last name must be between 2 and 50 characters'),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
    body('role')
        .isIn(['patient', 'provider'])
        .withMessage('Role must be either patient or provider'),
    body('phoneNumber')
        .isMobilePhone()
        .withMessage('Please provide a valid phone number')
];

const loginValidation = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
];

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', authRateLimit(3, 15 * 60 * 1000), registerValidation, authController.register);

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', authRateLimit(5, 15 * 60 * 1000), loginValidation, authController.login);

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, authController.getMe);

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
router.put('/profile', protect, [
    body('firstName').optional().trim().isLength({ min: 2, max: 50 }),
    body('lastName').optional().trim().isLength({ min: 2, max: 50 }),
    body('phoneNumber').optional().isMobilePhone(),
], authController.updateProfile);

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
router.put('/change-password', protect, [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword')
        .isLength({ min: 6 })
        .withMessage('New password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('New password must contain at least one lowercase letter, one uppercase letter, and one number'),
], authController.changePassword);

// @desc    Logout user (client-side token removal)
// @route   POST /api/auth/logout
// @access  Private
router.post('/logout', protect, authController.logout);

// @desc    Delete account
// @route   DELETE /api/auth/account
// @access  Private
router.delete('/account', protect, [
    body('password').notEmpty().withMessage('Password confirmation is required'),
    body('confirmDelete').equals('DELETE').withMessage('Please type DELETE to confirm account deletion')
], authController.deleteAccount);

// @desc    Get user stats (admin only)
// @route   GET /api/auth/stats
// @access  Private/Admin
router.get('/stats', protect, authController.getUserStats);

module.exports = router; 