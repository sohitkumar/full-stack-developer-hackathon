const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const healthRoutes = require('./routes/health');
const appointmentRoutes = require('./routes/appointments');

// Import middleware
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});

// Middleware
app.use(helmet()); // Security headers
app.use(limiter); // Apply rate limiting
app.use(compression()); // Compress responses
app.use(morgan('combined')); // Logging
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(mongoSanitize()); // Prevent NoSQL injection
app.use(xss()); // Clean user input from malicious HTML

// Database connection with better error handling
const connectDB = async () => {
    try {
        // MongoDB URI with authentication for Docker setup
        const mongoURI = process.env.MONGODB_URI || 'mongodb://admin:secret@localhost:27017/bayer_healthcare?authSource=admin';

        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // Add these options for better compatibility
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        };

        console.log('🔗 Attempting to connect to MongoDB...');
        console.log('📍 URI:', mongoURI.replace(/\/\/.*@/, '//***:***@')); // Hide credentials in logs

        const conn = await mongoose.connect(mongoURI, options);

        console.log('✅ Connected to MongoDB successfully');
        console.log(`📊 Database: ${conn.connection.name}`);
        console.log(`🌐 Host: ${conn.connection.host}:${conn.connection.port}`);

    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);

        // Provide helpful error messages
        if (error.message.includes('authentication')) {
            console.log('💡 Suggestion: Check MongoDB authentication credentials');
            console.log('💡 For Docker MongoDB with auth, use:');
            console.log('   MONGODB_URI=mongodb://admin:secret@localhost:27017/bayer_healthcare?authSource=admin');
        }

        if (error.message.includes('ECONNREFUSED')) {
            console.log('💡 Suggestion: Make sure MongoDB container is running');
            console.log('   Check with: docker ps | grep mongo');
        }

        process.exit(1);
    }
};

// Connect to database
connectDB();

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Bayer Healthcare API is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/health-topics', healthRoutes);
app.use('/api/appointments', appointmentRoutes);

// Welcome route
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to Bayer Healthcare API',
        version: '1.0.0',
        documentation: '/api/docs',
        endpoints: {
            auth: '/api/auth',
            users: '/api/users',
            health: '/api/health-topics',
            appointments: '/api/appointments',
            healthCheck: '/api/health'
        }
    });
});

// Handle undefined routes
app.all('*', (req, res) => {
    res.status(404).json({
        status: 'error',
        message: `Route ${req.originalUrl} not found`
    });
});

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`🚀 Bayer Healthcare API server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log('❌ Unhandled Promise Rejection:', err.message);
    server.close(() => {
        process.exit(1);
    });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.log('❌ Uncaught Exception:', err.message);
    process.exit(1);
});

module.exports = app; 