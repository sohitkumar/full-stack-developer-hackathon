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

### 7. 🚀 **Deployed Application**
- Working website on the internet
- Secure and accessible online
- Both frontend and backend deployed

### 8. ⚙️ **CI/CD Pipeline**
- Automatic testing when code changes
- Automatic deployment to production
- Basic tests for main features

## 🛠️ Simple Tech Stack

**Frontend**: React (what users see)  
**Backend**: Node.js + Express (server)  
**Database**: MongoDB (data storage)  
**Deployment**: Docker (packaging)  
**Testing**: GitHub Actions (automation)

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
- Basic styling

### **Features** (Appointments + Public Page)
- Appointment request system
- Public health information page
- Testing and bug fixes
- User experience improvements

### **Deployment** (Online + CI/CD)
- Deploy to cloud hosting
- Set up automatic deployment
- Add automated tests
- Final testing and polish

### 🏗️ **[Architecture](./Sprint-Planning/architecture.md)**
- **What**: How the app works (frontend, backend, database)


# In Spring 1 (Execution Phase):
  
### Foundation (Authentication + Setup)

### Project Setup
- [ ] Create project folders (frontend, backend)
- [ ] Set up Node.js backend with Express
- [ ] Set up React frontend
- [ ] Connect to MongoDB database
- [ ] Basic "Hello World" pages working

### Setup + Login
- Goal: Basic signup, login, and role-based pages

- Set up React and Node.js projects

- Connect to MongoDB

- Create signup/login pages

- Add JWT auth and logout

- Show pages based on user role

- Protect private routes

- Add basic styling

### Dashboards + Profiles
- Goal: Patient and provider dashboards + profile edit

- Patient dashboard: health info + appointments

- Profile form: personal + medical info

- Provider dashboard: view/search patients

### Appointments + Public Page
- Goal: Appointment booking + public health page

- Request appointments: choose provider, time, reason

- Show requests in dashboard

- Public page: health tips, contact info

### Deploy + Automate
- Goal: Make app live with auto-deploy

- Docker setup and cloud deploy

- Add CI/CD with GitHub Actions

- Write basic tests

