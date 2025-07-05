const { validationResult } = require('express-validator');
const User = require('../models/User');
const { ValidationError, NotFoundError } = require('../middleware/errorHandler');

// Helper function to check validation errors
const checkValidationErrors = (req) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        throw new ValidationError(errorMessages.join(', '));
    }
};

// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Private/Admin
exports.getAllUsers = async (req, res, next) => {
    try {
        checkValidationErrors(req);

        const {
            role,
            isActive,
            isVerified,
            limit = 10,
            page = 1,
            search
        } = req.query;

        // Build query
        let query = {};

        if (role) query.role = role;
        if (isActive !== undefined) query.isActive = isActive === 'true';
        if (isVerified !== undefined) query.isVerified = isVerified === 'true';

        if (search) {
            query.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phoneNumber: { $regex: search, $options: 'i' } }
            ];
        }

        const options = {
            limit: parseInt(limit),
            skip: (parseInt(page) - 1) * parseInt(limit),
            sort: { createdAt: -1 }
        };

        const users = await User.find(query, '-password')
            .sort(options.sort)
            .limit(options.limit)
            .skip(options.skip);

        const total = await User.countDocuments(query);

        res.status(200).json({
            status: 'success',
            results: users.length,
            data: {
                users,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / parseInt(limit))
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private (own profile) or Admin
exports.getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            throw new NotFoundError('User not found');
        }

        res.status(200).json({
            status: 'success',
            data: {
                user
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update user by ID
// @route   PUT /api/users/:id
// @access  Private (own profile) or Admin
exports.updateUser = async (req, res, next) => {
    try {
        checkValidationErrors(req);

        const user = await User.findById(req.params.id);

        if (!user) {
            throw new NotFoundError('User not found');
        }

        // Only admin can change role, isActive, isVerified
        const adminOnlyFields = ['role', 'isActive', 'isVerified'];
        const isAdmin = req.user.role === 'admin';

        const updates = {};
        Object.keys(req.body).forEach(key => {
            if (adminOnlyFields.includes(key)) {
                if (isAdmin) {
                    updates[key] = req.body[key];
                }
            } else {
                updates[key] = req.body[key];
            }
        });

        // Handle role-specific updates
        if (req.body.patientInfo && (user.role === 'patient' || updates.role === 'patient')) {
            updates.patientInfo = { ...user.patientInfo, ...req.body.patientInfo };
        }

        if (req.body.providerInfo && (user.role === 'provider' || updates.role === 'provider')) {
            updates.providerInfo = { ...user.providerInfo, ...req.body.providerInfo };
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        ).select('-password');

        res.status(200).json({
            status: 'success',
            message: 'User updated successfully',
            data: {
                user: updatedUser
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete user by ID
// @route   DELETE /api/users/:id
// @access  Private (own profile) or Admin
exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            throw new NotFoundError('User not found');
        }

        // Soft delete - deactivate instead of actually deleting
        user.isActive = false;
        user.email = `deleted_${Date.now()}_${user.email}`;
        await user.save();

        res.status(200).json({
            status: 'success',
            message: 'User account deactivated successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get patients (provider and admin only)
// @route   GET /api/users/patients/list
// @access  Private/Provider/Admin
exports.getPatients = async (req, res, next) => {
    try {
        checkValidationErrors(req);

        const {
            limit = 10,
            page = 1,
            search
        } = req.query;

        let query = { role: 'patient', isActive: true };

        if (search) {
            query.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const options = {
            limit: parseInt(limit),
            skip: (parseInt(page) - 1) * parseInt(limit)
        };

        const patients = await User.find(query, 'firstName lastName email phoneNumber patientInfo createdAt')
            .sort({ createdAt: -1 })
            .limit(options.limit)
            .skip(options.skip);

        const total = await User.countDocuments(query);

        res.status(200).json({
            status: 'success',
            results: patients.length,
            data: {
                patients,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / parseInt(limit))
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get providers (admin only)
// @route   GET /api/users/providers/list
// @access  Private/Admin
exports.getProviders = async (req, res, next) => {
    try {
        checkValidationErrors(req);

        const {
            limit = 10,
            page = 1,
            search
        } = req.query;

        let query = { role: 'provider', isActive: true };

        if (search) {
            query.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { 'providerInfo.specialization': { $regex: search, $options: 'i' } }
            ];
        }

        const options = {
            limit: parseInt(limit),
            skip: (parseInt(page) - 1) * parseInt(limit)
        };

        const providers = await User.find(query, 'firstName lastName email phoneNumber providerInfo createdAt')
            .sort({ createdAt: -1 })
            .limit(options.limit)
            .skip(options.skip);

        const total = await User.countDocuments(query);

        res.status(200).json({
            status: 'success',
            results: providers.length,
            data: {
                providers,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / parseInt(limit))
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update patient info
// @route   PUT /api/users/:id/patient-info
// @access  Private (own profile) or Provider/Admin
exports.updatePatientInfo = async (req, res, next) => {
    try {
        checkValidationErrors(req);

        const user = await User.findById(req.params.id);

        if (!user) {
            throw new NotFoundError('User not found');
        }

        if (user.role !== 'patient') {
            throw new ValidationError('User is not a patient');
        }

        // Check authorization
        const isOwner = req.user.id === req.params.id;
        const isAuthorized = isOwner || req.user.role === 'provider' || req.user.role === 'admin';

        if (!isAuthorized) {
            throw new ValidationError('Not authorized to update this patient information');
        }

        // Update patient info
        const updatedPatientInfo = { ...user.patientInfo, ...req.body };

        user.patientInfo = updatedPatientInfo;
        await user.save();

        res.status(200).json({
            status: 'success',
            message: 'Patient information updated successfully',
            data: {
                patientInfo: user.patientInfo
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update provider info
// @route   PUT /api/users/:id/provider-info
// @access  Private (own profile) or Admin
exports.updateProviderInfo = async (req, res, next) => {
    try {
        checkValidationErrors(req);

        const user = await User.findById(req.params.id);

        if (!user) {
            throw new NotFoundError('User not found');
        }

        if (user.role !== 'provider') {
            throw new ValidationError('User is not a provider');
        }

        // Check authorization
        const isOwner = req.user.id === req.params.id;
        const isAuthorized = isOwner || req.user.role === 'admin';

        if (!isAuthorized) {
            throw new ValidationError('Not authorized to update this provider information');
        }

        // Update provider info
        const updatedProviderInfo = { ...user.providerInfo, ...req.body };

        user.providerInfo = updatedProviderInfo;
        await user.save();

        res.status(200).json({
            status: 'success',
            message: 'Provider information updated successfully',
            data: {
                providerInfo: user.providerInfo
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Verify user account (admin only)
// @route   PATCH /api/users/:id/verify
// @access  Private/Admin
exports.verifyUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            throw new NotFoundError('User not found');
        }

        user.isVerified = !user.isVerified;
        await user.save();

        res.status(200).json({
            status: 'success',
            message: `User ${user.isVerified ? 'verified' : 'unverified'} successfully`,
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    isVerified: user.isVerified
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Activate/deactivate user account (admin only)
// @route   PATCH /api/users/:id/activate
// @access  Private/Admin
exports.activateUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            throw new NotFoundError('User not found');
        }

        user.isActive = !user.isActive;
        await user.save();

        res.status(200).json({
            status: 'success',
            message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    isActive: user.isActive
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get user statistics (admin only)
// @route   GET /api/users/stats/overview
// @access  Private/Admin
exports.getUserStatsOverview = async (req, res, next) => {
    try {
        const stats = await User.getUserStats();

        // Additional stats
        const recentUsers = await User.find({ isActive: true })
            .sort({ createdAt: -1 })
            .limit(5)
            .select('firstName lastName email role createdAt');

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const newUsersThisMonth = await User.countDocuments({
            createdAt: { $gte: thirtyDaysAgo }
        });

        res.status(200).json({
            status: 'success',
            data: {
                stats: {
                    ...stats,
                    newUsersThisMonth,
                    recentUsers
                }
            }
        });
    } catch (error) {
        next(error);
    }
}; 