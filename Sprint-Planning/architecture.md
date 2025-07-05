# System Architecture - Healthcare Patient Portal

## High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend │    │   Express API   │    │   MongoDB       │
│   (Client)       │◄──►│   (Server)      │◄──►│   (Database)    │
│                 │    │                 │    │                 │
│ - Components    │    │ - Routes        │    │ - Users         │
│ - Context API   │    │ - Middleware    │    │ - Patients      │
│ - CSS Modules   │    │ - JWT Auth      │    │ - Appointments  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Component Architecture

### Frontend (React)
```
src/
├── components/
│   ├── common/
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── Navigation.jsx
│   │   └── LoadingSpinner.jsx
│   ├── auth/
│   │   ├── LoginForm.jsx
│   │   ├── RegisterForm.jsx
│   │   └── ForgotPassword.jsx
│   ├── patient/
│   │   ├── PatientDashboard.jsx
│   │   ├── PatientProfile.jsx
│   │   ├── AppointmentList.jsx
│   │   └── MedicalHistory.jsx
│   └── provider/
│       ├── ProviderDashboard.jsx
│       ├── PatientList.jsx
│       ├── AppointmentManager.jsx
│       └── PatientDetails.jsx
├── context/
│   ├── AuthContext.jsx
│   ├── PatientContext.jsx
│   └── AppointmentContext.jsx
├── pages/
│   ├── HomePage.jsx
│   ├── LoginPage.jsx
│   ├── DashboardPage.jsx
│   └── NotFoundPage.jsx
├── services/
│   ├── authService.js
│   ├── patientService.js
│   └── appointmentService.js
├── utils/
│   ├── constants.js
│   ├── helpers.js
│   └── validators.js
└── styles/
    ├── components/
    └── globals.css
```

### Backend (Express)
```
server/
├── controllers/
│   ├── authController.js
│   ├── patientController.js
│   ├── providerController.js
│   └── appointmentController.js
├── middleware/
│   ├── authMiddleware.js
│   ├── roleMiddleware.js
│   ├── validationMiddleware.js
│   └── errorHandler.js
├── models/
│   ├── User.js
│   ├── Patient.js
│   ├── Provider.js
│   └── Appointment.js
├── routes/
│   ├── authRoutes.js
│   ├── patientRoutes.js
│   ├── providerRoutes.js
│   └── appointmentRoutes.js
├── utils/
│   ├── database.js
│   ├── jwtUtils.js
│   └── validators.js
├── config/
│   ├── database.js
│   └── auth.js
└── app.js
```

## Authentication Flow

```
1. User Registration/Login
   ↓
2. JWT Token Generation
   ↓
3. Token Storage (Frontend)
   ↓
4. Token Validation (Each Request)
   ↓
5. Role-based Access Control
```

## Data Flow

### Patient Flow
1. **Login** → JWT Token → Patient Dashboard
2. **View Profile** → API Call → MongoDB → Patient Data
3. **Schedule Appointment** → API Call → Validation → MongoDB
4. **View Medical History** → API Call → Filtered Data → Display

### Provider Flow
1. **Login** → JWT Token → Provider Dashboard
2. **View Patient List** → API Call → MongoDB → Patient Data
3. **Manage Appointments** → API Call → CRUD Operations → MongoDB
4. **Update Patient Records** → API Call → Validation → MongoDB

## Security Architecture

### Authentication Layer
- JWT tokens for stateless authentication
- Token expiration and refresh mechanism
- Password hashing with bcrypt

### Authorization Layer
- Role-based middleware
- Route protection based on user roles
- Resource-level access control

### Data Protection
- Input validation and sanitization
- SQL injection prevention (NoSQL injection)
- XSS protection
- CORS configuration

## Deployment Architecture

```
We'll use Docker Container for the deployment.
```

## Performance Considerations

- **Frontend**: Component memoization, lazy loading
- **Backend**: Database indexing, caching strategies
- **Database**: Proper schema design, query optimization