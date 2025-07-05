# Bayer Healthcare Portal - Local Setup Instructions

## Overview
This healthcare portal consists of a React TypeScript frontend, Express.js backend, and MongoDB database. The application supports patient and provider roles with authentication, appointments, and health information management.

## Prerequisites

### Required Software
1. **Node.js** (v20 or higher)
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify installation: `node --version` and `npm --version`

2. **MongoDB** (v5.0 or higher)
   - **Option A - Local Installation:**
     - Download from [mongodb.com](https://www.mongodb.com/try/download/community)
     - Follow installation guide for your OS
   - **Option B - MongoDB Atlas (Cloud):**
     - Create free account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
     - Create cluster and get connection string

3. **Git**
   - Download from [git-scm.com](https://git-scm.com/)

## Database Setup

### Option A: Local MongoDB
1. **Start MongoDB service:**
   ```bash
   # Windows
   net start MongoDB
   
   # macOS (if installed via Homebrew)
   brew services start mongodb/brew/mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

2. **Verify MongoDB is running:**
   ```bash
   mongosh
   # Should connect to MongoDB shell
   ```

### Option B: MongoDB Atlas (Cloud)
1. Create a free MongoDB Atlas account
2. Create a new cluster
3. Create a database user with read/write permissions
4. Get your connection string (replace `<password>` with your actual password)
5. Whitelist your IP address or use 0.0.0.0/0 for development

## Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd full-stack-developer-hackathon/bayer_health_be
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   # Create .env file
   touch .env
   ```

4. **Configure environment variables:**
   Edit `.env` file with the following:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/bayer_healthcare
   # OR for MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bayer_healthcare

   # JWT
   JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-complex
   JWT_EXPIRES_IN=7d

   # Server
   PORT=5000
   NODE_ENV=development

   # CORS
   FRONTEND_URL=http://localhost:3000
   ```

5. **Start the backend server:**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # OR production mode
   npm start
   ```

6. **Verify backend is running:**
   - Open browser to `http://localhost:5000`
   - Should see "Bayer Healthcare API is running!"

## Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd full-stack-developer-hackathon/bayer_health_fe
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   # Create .env file
   touch .env
   ```

4. **Configure environment variables:**
   Edit `.env` file with:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_ENV=development
   ```

5. **Start the frontend development server:**
   ```bash
   npm start
   ```

6. **Verify frontend is running:**
   - Open browser to `http://localhost:3000`
   - Should see the Bayer Healthcare homepage

## Running the Full Application

### Start Order
1. **Start MongoDB** (if running locally)
2. **Start Backend** (runs on port 5000)
3. **Start Frontend** (runs on port 3000)

### Quick Start Script
Create a `start.sh` script in the root directory:
```bash
#!/bin/bash
echo "Starting Bayer Healthcare Portal..."

# Start MongoDB (if local)
echo "Starting MongoDB..."
mongod --dbpath /usr/local/var/mongodb &

# Start Backend
echo "Starting Backend..."
cd full-stack-developer-hackathon/bayer_health_be
npm run dev &

# Start Frontend
echo "Starting Frontend..."
cd ../bayer_health_fe
npm start &

echo "All services started!"
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:5000"
```

## Demo Accounts

The application comes with pre-seeded demo accounts:

### Patient Account
- **Email:** `patient@demo.com`
- **Password:** `password123`
- **Role:** Patient
- **Access:** Dashboard, Profile, Appointments (view only)

### Provider Account
- **Email:** `provider@demo.com`
- **Password:** `password123`
- **Role:** Healthcare Provider
- **Access:** Dashboard, Profile, Appointments (full management), Patient Management

## Application Features

### For Patients
- View health topics and information
- Access personal dashboard
- View and manage profile
- View assigned appointments
- Contact healthcare providers

### For Providers
- All patient features
- Create and manage appointments
- View patient information
- Access provider-specific features

## Project Structure

```
full-stack-developer-hackathon/
├── bayer_health_fe/          # React Frontend
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── contexts/        # React contexts
│   │   ├── services/        # API services
│   │   └── styles/          # CSS modules
│   └── package.json
├── bayer_health_be/          # Express Backend
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Custom middleware
│   │   ├── models/          # MongoDB models
│   │   ├── routes/          # API routes
│   │   └── utils/           # Utility functions
│   └── package.json
└── instructions.md           # This file
```

## Troubleshooting

### Common Issues

1. **Port already in use:**
   ```bash
   # Kill process on port 3000 or 5000
   lsof -ti:3000 | xargs kill -9
   lsof -ti:5000 | xargs kill -9
   ```

2. **MongoDB connection failed:**
   - Check if MongoDB is running
   - Verify connection string in `.env`
   - For Atlas: Check IP whitelist and credentials

3. **Frontend can't connect to backend:**
   - Verify backend is running on port 5000
   - Check `REACT_APP_API_URL` in frontend `.env`
   - Check CORS settings in backend

4. **Authentication issues:**
   - Clear browser localStorage
   - Check JWT_SECRET in backend `.env`
   - Verify demo accounts are seeded

### Database Seeding
If demo accounts aren't working:
```bash
cd full-stack-developer-hackathon/bayer_health_be
npm run seed
```