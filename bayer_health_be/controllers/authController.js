const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { ValidationError, AuthenticationError, ConflictError } = require('../middleware/errorHandler');

// Helper function to check validation errors
const checkValidationErrors = (req) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        throw new ValidationError(errorMessages.join(', '));
    }
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
    try {
        checkValidationErrors(req);

        const { firstName, lastName, email, password, role, phoneNumber } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            throw new ConflictError('User already exists with this email address');
        }

        // Check if phone number is already in use
        const existingPhone = await User.findOne({ phoneNumber });
        if (existingPhone) {
            throw new ConflictError('Phone number is already registered');
        }

        // Create user
        const user = await User.create({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.toLowerCase(),
            password,
            role,
            phoneNumber,
            isVerified: process.env.NODE_ENV === 'development' // Auto-verify in development
        });

        // Generate token
        const token = user.getSignedJwtToken();

        // Remove password from response
        user.password = undefined;

        res.status(201).json({
            status: 'success',
            message: 'Registration successful',
            data: {
                token,
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    fullName: user.fullName,
                    email: user.email,
                    role: user.role,
                    phoneNumber: user.phoneNumber,
                    isVerified: user.isVerified,
                    isActive: user.isActive,
                    createdAt: user.createdAt
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    try {
        checkValidationErrors(req);

        const { email, password } = req.body;

        // Find user and include password for comparison
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

        if (!user || !await user.matchPassword(password)) {
            throw new AuthenticationError('Invalid email or password');
        }

        // Check if user is active
        if (!user.isActive) {
            throw new AuthenticationError('Account has been deactivated. Please contact support.');
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save({ validateBeforeSave: false });

        // Generate token
        const token = user.getSignedJwtToken();

        // Remove password from response
        user.password = undefined;

        res.status(200).json({
            status: 'success',
            message: 'Login successful',
            data: {
                token,
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    fullName: user.fullName,
                    email: user.email,
                    role: user.role,
                    phoneNumber: user.phoneNumber,
                    isVerified: user.isVerified,
                    isActive: user.isActive,
                    lastLogin: user.lastLogin,
                    createdAt: user.createdAt
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            status: 'success',
            data: {
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    fullName: user.fullName,
                    email: user.email,
                    role: user.role,
                    phoneNumber: user.phoneNumber,
                    profilePicture: user.profilePicture,
                    isVerified: user.isVerified,
                    isActive: user.isActive,
                    lastLogin: user.lastLogin,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                    ...(user.role === 'patient' && { patientInfo: user.patientInfo }),
                    ...(user.role === 'provider' && { providerInfo: user.providerInfo })
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
    try {
        checkValidationErrors(req);

        const allowedFields = ['firstName', 'lastName', 'phoneNumber'];
        const updates = {};

        // Only include allowed fields
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        // Handle role-specific updates
        if (req.user.role === 'patient' && req.body.patientInfo) {
            updates.patientInfo = { ...req.user.patientInfo, ...req.body.patientInfo };
        }

        if (req.user.role === 'provider' && req.body.providerInfo) {
            updates.providerInfo = { ...req.user.providerInfo, ...req.body.providerInfo };
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            updates,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            status: 'success',
            message: 'Profile updated successfully',
            data: {
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    fullName: user.fullName,
                    email: user.email,
                    role: user.role,
                    phoneNumber: user.phoneNumber,
                    profilePicture: user.profilePicture,
                    isVerified: user.isVerified,
                    isActive: user.isActive,
                    updatedAt: user.updatedAt,
                    ...(user.role === 'patient' && { patientInfo: user.patientInfo }),
                    ...(user.role === 'provider' && { providerInfo: user.providerInfo })
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res, next) => {
    try {
        checkValidationErrors(req);

        const { currentPassword, newPassword } = req.body;

        // Get user with password
        const user = await User.findById(req.user.id).select('+password');

        // Check current password
        if (!await user.matchPassword(currentPassword)) {
            throw new AuthenticationError('Current password is incorrect');
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.status(200).json({
            status: 'success',
            message: 'Password changed successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Logout user (client-side token removal)
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
    try {
        // In a JWT setup, logout is handled client-side by removing the token
        // But we can track it for security purposes

        res.status(200).json({
            status: 'success',
            message: 'Logged out successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete account
// @route   DELETE /api/auth/account
// @access  Private
exports.deleteAccount = async (req, res, next) => {
    try {
        checkValidationErrors(req);

        const { password } = req.body;

        // Get user with password
        const user = await User.findById(req.user.id).select('+password');

        // Verify password
        if (!await user.matchPassword(password)) {
            throw new AuthenticationError('Password is incorrect');
        }

        // Soft delete by deactivating account
        user.isActive = false;
        user.email = `deleted_${Date.now()}_${user.email}`;
        await user.save();

        res.status(200).json({
            status: 'success',
            message: 'Account deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get user stats (admin only)
// @route   GET /api/auth/stats
// @access  Private/Admin
exports.getUserStats = async (req, res, next) => {
    try {
        if (req.user.role !== 'admin') {
            throw new AuthenticationError('Access denied. Admin role required.');
        }

        const stats = await User.getUserStats();

        res.status(200).json({
            status: 'success',
            data: {
                stats
            }
        });
    } catch (error) {
        next(error);
    }
}; 