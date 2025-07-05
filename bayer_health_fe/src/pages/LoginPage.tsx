import React, { useState } from 'react';
import {
    Container,
    Paper,
    Box,
    Typography,
    TextField,
    Button,
    Link,
    Alert,
    CircularProgress,
    Divider,
    Chip,
} from '@mui/material';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from '../styles/LoginPage.module.css';

interface FormData {
    email: string;
    password: string;
}

interface FormErrors {
    email?: string;
    password?: string;
    general?: string;
}

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const [formData, setFormData] = useState<FormData>({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);

    // Get the intended destination from location state
    const from = location.state?.from?.pathname || '/dashboard';

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field: keyof FormData) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = event.target.value;
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: undefined
            }));
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setErrors({});

        try {
            const result = await login(formData.email, formData.password);

            if (result.success) {
                // Redirect to intended destination or dashboard
                navigate(from, { replace: true });
            } else {
                setErrors({ general: result.error || 'Invalid email or password' });
            }
        } catch (error) {
            setErrors({ general: 'An unexpected error occurred. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const handleDemoLogin = async (email: string, password: string, role: string) => {
        setLoading(true);
        setErrors({});
        setFormData({ email, password });

        try {
            const result = await login(email, password);
            if (result.success) {
                navigate(from, { replace: true });
            } else {
                setErrors({ general: `Demo ${role} login failed. Please try again.` });
            }
        } catch (error) {
            setErrors({ general: 'Demo login failed. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="sm">
            <Box className={styles.container}>
                <Paper elevation={3} className={styles.paper}>
                    <Box className={styles.formContainer}>
                        <Typography component="h1" variant="h4" gutterBottom className={styles.title}>
                            Welcome Back
                        </Typography>
                        <Typography variant="body2" className={styles.subtitle}>
                            Sign in to access your healthcare dashboard and personalized health information
                        </Typography>

                        {errors.general && (
                            <Alert severity="error" className={styles.errorAlert}>
                                {errors.general}
                            </Alert>
                        )}

                        <Box component="form" onSubmit={handleSubmit} className={styles.form}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange('email')}
                                error={!!errors.email}
                                helperText={errors.email}
                                disabled={loading}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                value={formData.password}
                                onChange={handleInputChange('password')}
                                error={!!errors.password}
                                helperText={errors.password}
                                disabled={loading}
                            />

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                className={styles.submitButton}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <CircularProgress size={20} className={styles.loadingIcon} />
                                        Signing In...
                                    </>
                                ) : (
                                    'Sign In'
                                )}
                            </Button>

                            <Box className={styles.linksContainer}>
                                <Link href="#" variant="body2">
                                    Forgot password?
                                </Link>
                                <Link component={RouterLink} to="/register" variant="body2">
                                    Don't have an account? Sign Up
                                </Link>
                            </Box>
                        </Box>

                        {/* Demo Account Section */}
                        <Divider className={styles.divider}>
                            <Typography variant="body2" className={styles.dividerText}>
                                Try Demo Accounts
                            </Typography>
                        </Divider>

                        <Box className={styles.demoContainer}>
                            <Box className={styles.demoChipsContainer}>
                                <div
                                    className={`${styles.demoChipPrimary} ${loading ? styles.demoChipDisabled : ''}`}
                                    onClick={() => !loading && handleDemoLogin('patient@demo.com', 'password123', 'patient')}
                                >
                                    Demo Patient
                                </div>
                                <div
                                    className={`${styles.demoChipSecondary} ${loading ? styles.demoChipDisabled : ''}`}
                                    onClick={() => !loading && handleDemoLogin('provider@demo.com', 'password123', 'provider')}
                                >
                                    Demo Provider
                                </div>
                            </Box>

                            <Typography variant="caption" className={styles.demoCaption}>
                                Use demo accounts to explore the platform features without registration
                            </Typography>
                        </Box>

                        {/* API Status Info */}
                        <Box className={styles.apiStatusContainer}>
                            <Typography variant="caption" className={styles.apiStatusText}>
                                <strong>For Development:</strong> The app will try to connect to the backend API.
                                If the backend is not running, demo accounts will work as fallback.
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default LoginPage; 