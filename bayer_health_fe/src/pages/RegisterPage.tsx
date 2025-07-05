import React, { useState } from 'react';
import {
    Box,
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Link,
    Alert,
    CircularProgress,
    Divider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    FormHelperText,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from '../styles/RegisterPage.module.css';

interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
    confirmPassword: string;
    role: 'patient' | 'provider';
}

interface FormErrors {
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    password?: string;
    confirmPassword?: string;
    role?: string;
    general?: string;
}

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [formData, setFormData] = useState<FormData>({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        role: 'patient',
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        // First name validation
        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        } else if (formData.firstName.trim().length < 2) {
            newErrors.firstName = 'First name must be at least 2 characters';
        }

        // Last name validation
        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        } else if (formData.lastName.trim().length < 2) {
            newErrors.lastName = 'Last name must be at least 2 characters';
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Phone number validation
        const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
        if (!formData.phoneNumber) {
            newErrors.phoneNumber = 'Phone number is required';
        } else if (!phoneRegex.test(formData.phoneNumber)) {
            newErrors.phoneNumber = 'Please enter a valid phone number';
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            newErrors.password = 'Password must contain at least one lowercase letter, one uppercase letter, and one number';
        }

        // Confirm password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        // Role validation
        if (!formData.role) {
            newErrors.role = 'Please select a role';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field: keyof FormData) => (
        event: React.ChangeEvent<HTMLInputElement | { value: unknown }>
    ) => {
        const value = event.target.value as string;
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

    const handleSelectChange = (field: keyof FormData) => (
        event: React.ChangeEvent<HTMLInputElement> | { target: { value: unknown } }
    ) => {
        const value = event.target.value as string;
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
        setSuccessMessage('');

        try {
            const result = await register({
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                email: formData.email.toLowerCase().trim(),
                phoneNumber: formData.phoneNumber.trim(),
                password: formData.password,
                role: formData.role,
            });

            if (result.success) {
                setSuccessMessage('Registration successful! Redirecting to dashboard...');
                setTimeout(() => {
                    navigate('/dashboard');
                }, 2000);
            } else {
                setErrors({ general: result.error || 'Registration failed. Please try again.' });
            }
        } catch (error) {
            setErrors({ general: 'An unexpected error occurred. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box className={styles.pageContainer}>
            <Container component="main" maxWidth="md">
                <Paper elevation={3} className={styles.paper}>
                    <Typography component="h1" variant="h4" className={styles.title}>
                        Create Account
                    </Typography>
                    <Typography variant="body1" className={styles.subtitle}>
                        Join Bayer Healthcare to access personalized health services
                    </Typography>

                    {errors.general && (
                        <Alert severity="error" className={styles.errorAlert}>
                            {errors.general}
                        </Alert>
                    )}

                    {successMessage && (
                        <Alert severity="success" className={styles.successAlert}>
                            {successMessage}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit} className={styles.form}>
                        <Grid container spacing={2} className={styles.formGrid}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="firstName"
                                    label="First Name"
                                    name="firstName"
                                    autoComplete="given-name"
                                    autoFocus
                                    value={formData.firstName}
                                    onChange={handleInputChange('firstName')}
                                    error={!!errors.firstName}
                                    helperText={errors.firstName}
                                    disabled={loading}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="lastName"
                                    label="Last Name"
                                    name="lastName"
                                    autoComplete="family-name"
                                    value={formData.lastName}
                                    onChange={handleInputChange('lastName')}
                                    error={!!errors.lastName}
                                    helperText={errors.lastName}
                                    disabled={loading}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange('email')}
                                    error={!!errors.email}
                                    helperText={errors.email}
                                    disabled={loading}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="phoneNumber"
                                    label="Phone Number"
                                    name="phoneNumber"
                                    autoComplete="tel"
                                    type="tel"
                                    value={formData.phoneNumber}
                                    onChange={handleInputChange('phoneNumber')}
                                    error={!!errors.phoneNumber}
                                    helperText={errors.phoneNumber}
                                    disabled={loading}
                                    placeholder="e.g., +1 (555) 123-4567"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth required error={!!errors.role}>
                                    <InputLabel id="role-label">I am a</InputLabel>
                                    <Select
                                        labelId="role-label"
                                        id="role"
                                        value={formData.role}
                                        label="I am a"
                                        onChange={handleSelectChange('role')}
                                        disabled={loading}
                                    >
                                        <MenuItem value="patient">Patient</MenuItem>
                                        <MenuItem value="provider">Healthcare Provider</MenuItem>
                                    </Select>
                                    {errors.role && (
                                        <Typography variant="caption" className={styles.roleError}>
                                            {errors.role}
                                        </Typography>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                    value={formData.password}
                                    onChange={handleInputChange('password')}
                                    error={!!errors.password}
                                    helperText={errors.password || 'Must contain at least one lowercase, uppercase letter and number'}
                                    disabled={loading}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="confirmPassword"
                                    label="Confirm Password"
                                    type="password"
                                    id="confirmPassword"
                                    autoComplete="new-password"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange('confirmPassword')}
                                    error={!!errors.confirmPassword}
                                    helperText={errors.confirmPassword}
                                    disabled={loading}
                                />
                            </Grid>
                        </Grid>

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
                                    Creating Account...
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </Button>

                        <Divider className={styles.divider}>
                            <Typography variant="body2" className={styles.dividerText}>
                                OR
                            </Typography>
                        </Divider>

                        <Button
                            fullWidth
                            variant="outlined"
                            component={RouterLink}
                            to="/login"
                            className={styles.signInButton}
                            disabled={loading}
                        >
                            Already have an account? Sign In
                        </Button>
                    </Box>

                    <Box className={styles.footerContainer}>
                        <Typography variant="body2" className={styles.footerText}>
                            By creating an account, you agree to our{' '}
                            <Link href="#" variant="body2">
                                Terms of Service
                            </Link>{' '}
                            and{' '}
                            <Link href="#" variant="body2">
                                Privacy Policy
                            </Link>
                        </Typography>
                    </Box>

                    {/* Demo Information */}
                    <Box className={styles.demoInfoContainer}>
                        <Typography variant="body2" className={styles.demoTitle}>
                            Demo Mode:
                        </Typography>
                        <Typography variant="body2" className={styles.demoDescription}>
                            Fill out the form and click "Create Account" to simulate registration.
                            You'll be automatically logged in after successful registration.
                        </Typography>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default RegisterPage; 