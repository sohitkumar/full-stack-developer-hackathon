const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log error for debugging
    console.error('Error Details:', {
        name: err.name,
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString()
    });

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = 'Resource not found';
        error = {
            statusCode: 404,
            message,
            name: 'NotFoundError'
        };
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        const value = err.keyValue[field];
        const message = `${field.charAt(0).toUpperCase() + field.slice(1)} '${value}' already exists`;
        error = {
            statusCode: 400,
            message,
            name: 'DuplicateFieldError'
        };
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = err.errors && typeof err.errors === 'object'
            ? Object.values(err.errors).map(val => val.message).join(', ')
            : err.message || 'Validation failed';
        error = {
            statusCode: 400,
            message,
            name: 'ValidationError'
        };
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        const message = 'Invalid token';
        error = {
            statusCode: 401,
            message,
            name: 'AuthenticationError'
        };
    }

    if (err.name === 'TokenExpiredError') {
        const message = 'Token expired';
        error = {
            statusCode: 401,
            message,
            name: 'AuthenticationError'
        };
    }

    // File upload errors
    if (err.code === 'LIMIT_FILE_SIZE') {
        const message = 'File size too large';
        error = {
            statusCode: 400,
            message,
            name: 'FileUploadError'
        };
    }

    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        const message = 'Unexpected file field';
        error = {
            statusCode: 400,
            message,
            name: 'FileUploadError'
        };
    }

    // Rate limiting errors
    if (err.status === 429) {
        const message = 'Too many requests, please try again later';
        error = {
            statusCode: 429,
            message,
            name: 'RateLimitError'
        };
    }

    // Database connection errors
    if (err.name === 'MongoNetworkError' || err.name === 'MongooseServerSelectionError') {
        const message = 'Database connection error';
        error = {
            statusCode: 503,
            message,
            name: 'DatabaseError'
        };
    }

    // Send error response
    const statusCode = error.statusCode || err.statusCode || 500;
    const message = error.message || 'Internal Server Error';

    // Prepare response object
    const response = {
        status: 'error',
        message,
        ...(process.env.NODE_ENV === 'development' && {
            error: {
                name: error.name || err.name,
                stack: err.stack,
                details: err
            }
        })
    };

    // Add request info in development
    if (process.env.NODE_ENV === 'development') {
        response.request = {
            method: req.method,
            url: req.originalUrl,
            headers: req.headers,
            body: req.body,
            params: req.params,
            query: req.query
        };
    }

    // Health-specific error handling
    if (statusCode >= 500) {
        // Log critical errors for monitoring
        console.error('CRITICAL ERROR:', {
            message,
            stack: err.stack,
            url: req.originalUrl,
            method: req.method,
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            timestamp: new Date().toISOString()
        });

        // In production, don't leak error details
        if (process.env.NODE_ENV === 'production') {
            response.message = 'Something went wrong on our end. Please try again later.';
            delete response.error;
        }
    }

    // Send response
    res.status(statusCode).json(response);
};

// Handle 404 errors for undefined routes
const notFound = (req, res, next) => {
    const error = new Error(`Route ${req.originalUrl} not found`);
    res.status(404).json({
        status: 'error',
        message: error.message,
        path: req.originalUrl,
        method: req.method
    });
};

// Async error handler wrapper
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Custom error class
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

// Specific error classes for healthcare domain
class ValidationError extends AppError {
    constructor(message) {
        super(message, 400);
        this.name = 'ValidationError';
    }
}

class AuthenticationError extends AppError {
    constructor(message = 'Authentication failed') {
        super(message, 401);
        this.name = 'AuthenticationError';
    }
}

class AuthorizationError extends AppError {
    constructor(message = 'Access denied') {
        super(message, 403);
        this.name = 'AuthorizationError';
    }
}

class NotFoundError extends AppError {
    constructor(resource = 'Resource') {
        super(`${resource} not found`, 404);
        this.name = 'NotFoundError';
    }
}

class ConflictError extends AppError {
    constructor(message = 'Resource already exists') {
        super(message, 409);
        this.name = 'ConflictError';
    }
}

class RateLimitError extends AppError {
    constructor(message = 'Too many requests') {
        super(message, 429);
        this.name = 'RateLimitError';
    }
}

class DatabaseError extends AppError {
    constructor(message = 'Database error') {
        super(message, 503);
        this.name = 'DatabaseError';
    }
}

module.exports = {
    errorHandler,
    notFound,
    asyncHandler,
    AppError,
    ValidationError,
    AuthenticationError,
    AuthorizationError,
    NotFoundError,
    ConflictError,
    RateLimitError,
    DatabaseError
}; 