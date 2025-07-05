const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - require authentication
exports.protect = async (req, res, next) => {
    let token;

    // Check if token exists in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
        return res.status(401).json({
            status: 'error',
            message: 'Access denied. No token provided.'
        });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');

        // Get user from token
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: 'Token is invalid. User not found.'
            });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(401).json({
                status: 'error',
                message: 'User account is deactivated.'
            });
        }

        // Add user to request object
        req.user = user;
        next();
    } catch (error) {
        console.error('JWT verification error:', error);

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid token.'
            });
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                status: 'error',
                message: 'Token has expired.'
            });
        } else {
            return res.status(500).json({
                status: 'error',
                message: 'Server error during authentication.'
            });
        }
    }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                status: 'error',
                message: 'Access denied. Please authenticate first.'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                status: 'error',
                message: `Access denied. Role '${req.user.role}' is not authorized to access this resource.`,
                requiredRoles: roles
            });
        }

        next();
    };
};

// Optional authentication - doesn't fail if no token
exports.optionalAuth = async (req, res, next) => {
    let token;

    // Check if token exists in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');

            // Get user from token
            const user = await User.findById(decoded.id).select('-password');

            if (user && user.isActive) {
                req.user = user;
            }
        } catch (error) {
            // Don't fail, just continue without user
            console.log('Optional auth failed:', error.message);
        }
    }

    next();
};

// Check if user owns the resource or is admin
exports.checkOwnership = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            status: 'error',
            message: 'Authentication required.'
        });
    }

    // Admin can access any resource
    if (req.user.role === 'admin') {
        return next();
    }

    // Check if user owns the resource
    const resourceUserId = req.params.userId || req.params.id;

    if (req.user._id.toString() !== resourceUserId) {
        return res.status(403).json({
            status: 'error',
            message: 'Access denied. You can only access your own resources.'
        });
    }

    next();
};

// Verify user account is verified
exports.requireVerification = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            status: 'error',
            message: 'Authentication required.'
        });
    }

    if (!req.user.isVerified) {
        return res.status(403).json({
            status: 'error',
            message: 'Account verification required. Please verify your email address.'
        });
    }

    next();
};

// Check if user is patient
exports.requirePatient = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            status: 'error',
            message: 'Authentication required.'
        });
    }

    if (req.user.role !== 'patient') {
        return res.status(403).json({
            status: 'error',
            message: 'Access denied. This resource is only available to patients.'
        });
    }

    next();
};

// Check if user is provider
exports.requireProvider = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            status: 'error',
            message: 'Authentication required.'
        });
    }

    if (req.user.role !== 'provider' && req.user.role !== 'admin') {
        return res.status(403).json({
            status: 'error',
            message: 'Access denied. This resource is only available to healthcare providers.'
        });
    }

    next();
};

// Rate limiting for authentication attempts
exports.authRateLimit = (maxAttempts = 5, windowMs = 15 * 60 * 1000) => {
    const attempts = new Map();

    return (req, res, next) => {
        const ip = req.ip;
        const now = Date.now();

        if (!attempts.has(ip)) {
            attempts.set(ip, { count: 1, resetTime: now + windowMs });
            return next();
        }

        const attemptData = attempts.get(ip);

        if (now > attemptData.resetTime) {
            // Reset the counter
            attempts.set(ip, { count: 1, resetTime: now + windowMs });
            return next();
        }

        if (attemptData.count >= maxAttempts) {
            return res.status(429).json({
                status: 'error',
                message: 'Too many authentication attempts. Please try again later.',
                retryAfter: Math.ceil((attemptData.resetTime - now) / 1000)
            });
        }

        attemptData.count++;
        next();
    };
}; 