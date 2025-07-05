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
            <Box
                sx={{
                    marginTop: 8,
                    marginBottom: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Typography component="h1" variant="h4" gutterBottom>
                            Welcome Back
                        </Typography>
                        <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 3 }}>
                            Sign in to access your healthcare dashboard and personalized health information
                        </Typography>

                        {errors.general && (
                            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                                {errors.general}
                            </Alert>
                        )}

                        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
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
                                sx={{ mt: 3, mb: 2, py: 1.5 }}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <CircularProgress size={20} sx={{ mr: 1 }} />
                                        Signing In...
                                    </>
                                ) : (
                                    'Sign In'
                                )}
                            </Button>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Link href="#" variant="body2">
                                    Forgot password?
                                </Link>
                                <Link component={RouterLink} to="/register" variant="body2">
                                    Don't have an account? Sign Up
                                </Link>
                            </Box>
                        </Box>

                        {/* Demo Account Section */}
                        <Divider sx={{ width: '100%', my: 3 }}>
                            <Typography variant="body2" color="text.secondary">
                                Try Demo Accounts
                            </Typography>
                        </Divider>

                        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                                <Chip
                                    label="Demo Patient"
                                    color="primary"
                                    variant="outlined"
                                    clickable
                                    disabled={loading}
                                    onClick={() => handleDemoLogin('patient@demo.com', 'password123', 'patient')}
                                    sx={{
                                        '&:hover': { backgroundColor: 'primary.light', color: 'white' },
                                        transition: 'all 0.3s'
                                    }}
                                />
                                <Chip
                                    label="Demo Provider"
                                    color="secondary"
                                    variant="outlined"
                                    clickable
                                    disabled={loading}
                                    onClick={() => handleDemoLogin('provider@demo.com', 'password123', 'provider')}
                                    sx={{
                                        '&:hover': { backgroundColor: 'secondary.light', color: 'white' },
                                        transition: 'all 0.3s'
                                    }}
                                />
                            </Box>

                            <Typography variant="caption" color="text.secondary" textAlign="center">
                                Use demo accounts to explore the platform features without registration
                            </Typography>
                        </Box>

                        {/* API Status Info */}
                        <Box sx={{ mt: 3, p: 2, backgroundColor: 'grey.50', borderRadius: 1, width: '100%' }}>
                            <Typography variant="caption" color="text.secondary" textAlign="center" display="block">
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