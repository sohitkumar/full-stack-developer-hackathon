import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box, CircularProgress, Typography } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';

// Always-loaded components (shown on every page)
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

// Lazy-loaded page components
const HomePage = React.lazy(() => import('./pages/HomePage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/RegisterPage'));
const PublicHealthPage = React.lazy(() => import('./pages/PublicHealthPage'));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const AppointmentsPage = React.lazy(() => import('./pages/AppointmentsPage'));
const PatientPage = React.lazy(() => import('./pages/PatientPage'));
const ServicesPage = React.lazy(() => import('./pages/ServicesPage'));
const ContactPage = React.lazy(() => import('./pages/ContactPage'));

// Loading fallback component
const LoadingFallback = () => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '60vh',
      gap: 2
    }}
  >
    <CircularProgress size={48} />
    <Typography variant="h6" color="text.secondary">
      Loading...
    </Typography>
  </Box>
);

// Create Material-UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1565C0',
    },
    secondary: {
      main: '#D32F2F',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <div className="App">
            <Navbar />
            <main style={{ minHeight: '80vh' }}>
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/services" element={<ServicesPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/health-topics" element={<PublicHealthPage />} />
                  <Route path="/appointments" element={<AppointmentsPage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/patients" element={<PatientPage />} />
                  <Route
                    path="*"
                    element={
                      <Box sx={{ textAlign: 'center', py: 8 }}>
                        <Typography variant="h4" color="error" gutterBottom>
                          404 - Page Not Found
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          The page you're looking for doesn't exist.
                        </Typography>
                      </Box>
                    }
                  />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
