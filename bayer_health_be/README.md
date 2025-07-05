# Bayer Healthcare Backend API

A comprehensive Node.js/Express backend API for the Bayer Healthcare Patient Portal application.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **User Management**: Patient and provider profiles with specialized information
- **Health Topics**: Content management system for health information
- **Security**: Rate limiting, input validation, data sanitization, and security headers
- **Database**: MongoDB with Mongoose ODM
- **Error Handling**: Comprehensive error handling and logging
- **Data Validation**: Input validation with express-validator
- **API Documentation**: Well-documented REST API endpoints

## 🛠️ Technology Stack

- **Runtime**: Node.js 16+
- **Framework**: Express.js
- **Database**: MongoDB
- **ODM**: Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Security**: helmet, cors, rate limiting
- **Testing**: Jest, Supertest

## 📦 Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd bayer_health_be
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env` file in the root directory:
   ```env
   NODE_ENV=development
   PORT=5000
   FRONTEND_URL=http://localhost:3000
   MONGODB_URI=mongodb://localhost:27017/bayer_healthcare
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=30d
   BCRYPT_SALT_ROUNDS=12
   ```

4. **Database Setup**:
   - Install MongoDB locally or use MongoDB Atlas
   - Start MongoDB service
   - Run the seed script to populate with sample data:
     ```bash
     npm run seed
     ```

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```
The server will start on `http://localhost:5000` with auto-reload enabled.

### Production Mode
```bash
npm start
```

### Run Tests
```bash
npm test
```

## 📁 Project Structure

```
bayer_health_be/
├── models/                 # Database models
│   ├── User.js            # User model (patients, providers, admins)
│   └── HealthTopic.js     # Health topics model
├── routes/                # API routes
│   ├── auth.js           # Authentication routes
│   ├── users.js          # User management routes
│   └── health.js         # Health topics routes
├── middleware/            # Custom middleware
│   ├── auth.js           # Authentication middleware
│   └── errorHandler.js   # Error handling middleware
├── scripts/               # Utility scripts
│   └── seedDatabase.js   # Database seeding script
├── server.js             # Main application file
├── package.json          # Dependencies and scripts
└── README.md            # This file
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Demo Accounts

After running the seed script, you can use these demo accounts:

- **Patient**: `patient@demo.com` / `password123`
- **Provider**: `provider@demo.com` / `password123`
- **Admin**: `admin@demo.com` / `password123`

## 📚 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/register` | Register new user | Public |
| POST | `/login` | Login user | Public |
| GET | `/me` | Get current user | Private |
| PUT | `/profile` | Update user profile | Private |
| PUT | `/change-password` | Change password | Private |
| POST | `/logout` | Logout user | Private |
| DELETE | `/account` | Delete account | Private |

### User Management Routes (`/api/users`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/` | Get all users | Admin |
| GET | `/:id` | Get user by ID | Private/Admin |
| PUT | `/:id` | Update user | Private/Admin |
| DELETE | `/:id` | Delete user | Private/Admin |
| GET | `/patients/list` | Get all patients | Provider/Admin |
| GET | `/providers/list` | Get all providers | Admin |
| PUT | `/:id/patient-info` | Update patient info | Private/Provider |
| PUT | `/:id/provider-info` | Update provider info | Private/Admin |

### Health Topics Routes (`/api/health-topics`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/` | Get all health topics | Public |
| GET | `/popular` | Get popular topics | Public |
| GET | `/recent` | Get recent topics | Public |
| GET | `/category/:category` | Get topics by category | Public |
| GET | `/:id` | Get single topic | Public |
| POST | `/` | Create new topic | Provider/Admin |
| PUT | `/:id` | Update topic | Provider/Admin |
| DELETE | `/:id` | Delete topic | Provider/Admin |
| PATCH | `/:id/publish` | Publish/unpublish topic | Admin |
| PATCH | `/:id/like` | Like/unlike topic | Private |

### Health Check Route

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/health` | API health check | Public |

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Prevents abuse with configurable limits
- **Input Validation**: Comprehensive validation using express-validator
- **Data Sanitization**: Prevents NoSQL injection and XSS attacks
- **Security Headers**: Helmet.js for security headers
- **Password Hashing**: bcryptjs with salt rounds
- **CORS**: Configured for frontend integration

## 📊 Database Schema

### User Model
```javascript
{
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  role: ['patient', 'provider', 'admin'],
  phoneNumber: String,
  isActive: Boolean,
  isVerified: Boolean,
  patientInfo: {
    dateOfBirth: Date,
    gender: String,
    bloodType: String,
    emergencyContact: Object,
    allergies: [String],
    medicalHistory: [String],
    currentMedications: [String]
  },
  providerInfo: {
    specialization: String,
    licenseNumber: String,
    yearsOfExperience: Number,
    education: [String],
    certifications: [String],
    hospitalAffiliations: [String]
  }
}
```

### HealthTopic Model
```javascript
{
  title: String,
  slug: String (unique),
  category: String,
  shortDescription: String,
  fullDescription: String,
  content: String,
  author: ObjectId (User),
  tags: [String],
  isPublished: Boolean,
  publishedAt: Date,
  views: Number,
  likes: Number,
  priority: ['low', 'medium', 'high', 'urgent']
}
```

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Watch mode for development:
```bash
npm run test:watch
```

## 📝 API Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "status": "success",
  "message": "Operation completed successfully",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "status": "error",
  "message": "Error description",
  "error": {
    // Error details (development only)
  }
}
```

## 🚀 Deployment

### Prerequisites
- Node.js 16+
- MongoDB instance
- Environment variables configured

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://your-production-mongodb-uri
JWT_SECRET=your-very-secure-secret-key
JWT_EXPIRE=7d
FRONTEND_URL=https://your-frontend-domain.com
```

### Deployment Steps
1. Set up MongoDB (Atlas recommended for production)
2. Configure environment variables
3. Install dependencies: `npm install --production`
4. Seed the database: `npm run seed`
5. Start the server: `npm start`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run tests to ensure they pass
6. Submit a pull request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 📄 License

This project is licensed under the ISC License.

---

**Built with ❤️ by the Bayer Healthcare Team** 