# Healthcare Patient Portal - MVP Sprint Planning

## 🎯 Our Goal: Healthcare Portal

Build a **simple, smooth, scalable and working healthcare patient portal** where patients can manage their health information and providers can view patient data. Focus on **functional and easy to use**.

## 📋 8 MVP Deliverables

### 1. 🔐 **Authentication System**
- Patients and providers can create accounts
- Secure login/logout functionality
- Different access for different users

### 2. 📊 **Patient Dashboard**
- Welcome page with patient's basic info
- Display health information (height, weight, blood type)
- Show upcoming appointments

### 3. 👤 **Profile Management**
- Patients can update personal information
- Add medical info (allergies, medications)
- Emergency contact information

### 4. 🏥 **Provider View**
- Providers can see their patient list
- View patient profiles and information
- Basic search functionality

### 5. 📄 **Public Health Information**
- Public page (no login required)
- Health tips and clinic information
- Contact details and about section

### 6. 📅 **Appointment Requests**
- Patients can request appointments
- Choose provider and preferred time
- Simple booking system

### 7. 📅 **Testing & Code Quality**
- We will use jest, mocha, react-testing-library(frontend) for testing
- We will use SonarQube

### 8. 🚀 **Deployed Application**
- Working WebApp on the internet
- Secure and accessible online
- Both frontend and backend deployed
- **Deployed using Docker containers on AWS EC2 instances**

### 9. ⚙️ **CI/CD Pipeline**
- Automatic testing when code changes
- Automatic deployment to production
- Basic tests for main features

## 🛠️ Simple Tech Stack

**Frontend**: React + Material-UI (MUI) (what users see) + ContextAPI + eslint
**Backend**: Node.js + Express (server)  
**Database**: MongoDB (data storage)  
**Deployment**: Docker containers on AWS EC2 (packaging & hosting)  
**Testing**: GitHub Actions (automation)

## 🚀 Deployment Strategy: Docker on AWS EC2

### Why Docker Containers on AWS EC2?

#### 🏗️ **Architecture Benefits:**
- **Containerization**: Each service (frontend, backend, database) runs in isolated containers
- **Scalability**: Easy to scale individual services based on demand
- **Consistency**: Same environment from development to production
- **Portability**: Deploy anywhere that supports Docker

#### 💰 **Cost-Effective Solution:**
- **AWS EC2 Free Tier**: 750 hours of t2.micro instances per month (first 12 months)
- **On-Demand Scaling**: Pay only for what you use
- **Resource Optimization**: Docker containers use resources efficiently
- **No Managed Service Fees**: Unlike AWS ECS/EKS, direct EC2 deployment saves on orchestration costs
- **Flexible Instance Types**: Choose the most cost-effective instance size for your needs

#### 🎯 **Why This Approach:**
- **Learning Value**: Understanding Docker and AWS fundamentals
- **Cost Control**: Predictable costs with better resource utilization
- **Production Ready**: Industry-standard deployment approach
- **Easy Scaling**: Start small, scale as needed

### Deployment Architecture:
```
AWS EC2 Instance
├── Docker Container 1: Frontend (React + MUI)
├── Docker Container 2: Backend (Node.js + Express)
├── Docker Container 3: Database (MongoDB)
└── Docker Container 4: Reverse Proxy (Nginx)
```

## 🎨 Material-UI (MUI) Integration

### Why Material-UI?
- **Pre-built Components**: Buttons, forms, navigation, etc.
- **Responsive**: Mobile-first design approach
- **Accessibility**: Built-in ARIA support
- **Customizable**: Easy theming and styling
- **React Integration**: Seamless React component integration

### MUI Components We'll Use:
- **Navigation**: AppBar, Drawer, Tabs
- **Forms**: TextField, Select, Button, Checkbox
- **Data Display**: Card, List, Table, Avatar
- **Layout**: Grid, Box, Paper, FlexBox
- **Feedback**: Alert, Snackbar, Progress indicators

## 📅 Timeline

# In Spring 0 (Planning, RoadMaps, Identifyning Blockers, solve the puzzle):

### **Foundation** (Authentication + Setup)
- Set up project structure
- Create login and signup
- Basic user roles (patient/provider)
- Simple navigation

### **: Core Features** (Dashboards + Profiles)
- Patient dashboard with health info
- Profile management forms
- Provider view with patient list
- Basic styling with MUI components

### **Features** (Appointments + Public Page)
- Appointment request system
- Public health information page
- Testing and bug fixes
- User experience improvements

### **Deployment** (Online + CI/CD)
- Deploy to AWS EC2 using Docker containers
- Set up automatic deployment
- Add automated tests
- Final testing and polish

### 🏗️ **[Architecture](./Sprint-Planning/architecture.md)**
- **What**: How the app works (frontend, backend, database)

## 💡 Cost Optimization Tips

### AWS EC2 Cost Savings:
- **Free Tier**: Start with t2.micro instances (750 hours free monthly)
- **Reserved Instances**: Save up to 75% with 1-year commitments
- **Spot Instances**: Use for non-critical workloads (up to 90% savings)
- **Auto Scaling**: Scale down during low usage periods
- **Monitoring**: Use CloudWatch to track resource utilization

### Docker Optimization:
- **Multi-stage Builds**: Reduce image sizes
- **Resource Limits**: Set memory and CPU limits for containers
- **Health Checks**: Automatic container restart on failures
- **Shared Networks**: Efficient container communication

# In Spring 1 (Execution Phase):
  
### Foundation (Authentication + Setup)

### Project Setup
- [ ] Create project folders (frontend, backend)
- [ ] Set up Node.js backend with Express
- [ ] Set up React frontend with Material-UI
- [ ] Connect to MongoDB database
- [ ] Basic "Hello World" pages working
- [ ] Docker containers setup

### Setup + Login
- Goal: Basic signup, login, and role-based pages

- Set up React with MUI components and Node.js projects

- Connect to MongoDB

- Create signup/login pages using MUI forms

- Add JWT auth and logout

- Show pages based on user role

- Protect private routes

- Add MUI styling

### Home & Public Page
- public health page
- health tips, contact info

### Dashboards + Profiles
- Goal: Patient and provider dashboards + profile edit

- Patient dashboard: health info + appointments

- Profile form: personal + medical info

- Provider dashboard: view/search patients

### Appointments
- Goal: Appointment booking

- Request appointments: choose provider, time, reason

- Show requests in dashboard

### Deploy + Automate
- Goal: Make app live with AWS

- Docker setup and AWS EC2 deployment

- Add CI/CD with GitHub Actions

- Write basic tests

- Configure AWS security groups

