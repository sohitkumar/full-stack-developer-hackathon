const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const HealthTopic = require('../models/HealthTopic');
const Appointment = require('../models/Appointment');

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://admin:secret@localhost:27017/bayer_healthcare?authSource=admin', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('📊 MongoDB Connected');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error);
        process.exit(1);
    }
};

// Clear existing data
const clearData = async () => {
    try {
        await User.deleteMany({});
        await HealthTopic.deleteMany({});
        await Appointment.deleteMany({});
        console.log('🗑️  Data cleared');
    } catch (error) {
        console.error('❌ Error clearing data:', error);
    }
};

// Create demo users
const createUsers = async () => {
    const users = [
        {
            firstName: 'Demo',
            lastName: 'Patient',
            email: 'patient@demo.com',
            password: await bcrypt.hash('password123', 10),
            role: 'patient',
            isActive: true,
            isVerified: true,
            phoneNumber: '+1234567890'
        },
        {
            firstName: 'Dr. Sarah',
            lastName: 'Johnson',
            email: 'provider@demo.com',
            password: await bcrypt.hash('password123', 10),
            role: 'provider',
            isActive: true,
            isVerified: true,
            phoneNumber: '+1234567892'
        },
        {
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@demo.com',
            password: await bcrypt.hash('password123', 10),
            role: 'admin',
            isActive: true,
            isVerified: true,
            phoneNumber: '+1234567893'
        }
    ];

    const createdUsers = await User.insertMany(users);
    console.log('👥 Users created');
    return createdUsers;
};

// Create health topics
const createHealthTopics = async () => {
    const healthTopics = [
        {
            title: 'COVID-19 Prevention and Safety',
            description: 'Learn about COVID-19 prevention measures, vaccination information, and safety protocols to protect yourself and others.'
        },
        {
            title: 'Heart Health: Prevention and Management',
            description: 'Understanding cardiovascular health, risk factors, prevention strategies, and management of heart conditions.'
        },
        {
            title: 'Mental Health Awareness and Support',
            description: 'Mental health resources, awareness information, and support systems for maintaining psychological wellbeing.'
        },
        {
            title: 'Diabetes Management and Prevention',
            description: 'Comprehensive guide to diabetes prevention, management strategies, and lifestyle modifications for better health.'
        }
    ];

    const createdTopics = await HealthTopic.insertMany(healthTopics);
    console.log('📚 Health topics created');
    return createdTopics;
};

// Create sample appointments
const createAppointments = async () => {
    const now = new Date();
    const appointments = [
        {
            patientName: 'John Doe',
            patientEmail: 'patient@demo.com',
            reason: 'Annual Check-up',
            time: new Date('2024-01-20T10:00:00Z')
        },
        {
            patientName: 'Jane Smith',
            patientEmail: 'patient@demo.com',
            reason: 'Blood Pressure Monitoring',
            time: new Date('2024-01-25T14:30:00Z')
        },
        {
            patientName: 'Bob Johnson',
            patientEmail: 'patient@demo.com',
            reason: 'Diabetes Follow-up',
            time: new Date('2024-01-30T09:15:00Z')
        },
        {
            patientName: 'Alice Brown',
            patientEmail: 'patient@demo.com',
            reason: 'Vaccination',
            time: new Date('2024-02-05T11:45:00Z')
        },
        {
            patientName: 'Charlie Wilson',
            patientEmail: 'patient@demo.com',
            reason: 'Mental Health Consultation',
            time: new Date('2024-02-10T16:00:00Z')
        }
    ];

    const createdAppointments = await Appointment.insertMany(appointments);
    console.log('📅 Appointments created');
    return createdAppointments;
};

// Main seed function
const seedDatabase = async () => {
    try {
        await connectDB();
        await clearData();

        const users = await createUsers();
        const topics = await createHealthTopics();
        const appointments = await createAppointments();

        console.log('✅ Database seeded successfully!');
        console.log('\n📊 Summary:');
        console.log(`- Users: ${users.length}`);
        console.log(`- Health Topics: ${topics.length}`);
        console.log(`- Appointments: ${appointments.length}`);

        console.log('\n🔐 Demo Accounts:');
        console.log('Patient: patient@demo.com / password123');
        console.log('Provider: provider@demo.com / password123');
        console.log('Admin: admin@demo.com / password123');

    } catch (error) {
        console.error('❌ Error seeding database:', error);
    } finally {
        mongoose.connection.close();
    }
};

seedDatabase(); 