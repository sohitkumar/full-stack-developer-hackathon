import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService from '../services/authService';

interface User {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    role: 'patient' | 'provider' | 'admin';
    phoneNumber?: string;
    isVerified: boolean;
    isActive: boolean;
    profilePicture?: string;
    lastLogin?: string;
    createdAt: string;
    patientInfo?: {
        dateOfBirth?: string;
        gender?: string;
        bloodType?: string;
        allergies?: string[];
        medicalHistory?: string[];
        emergencyContact?: {
            name: string;
            relationship: string;
            phoneNumber: string;
        };
    };
    providerInfo?: {
        specialization?: string;
        licenseNumber?: string;
        yearsOfExperience?: number;
        education?: string[];
        certifications?: string[];
        hospitalAffiliations?: string[];
    };
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    register: (userData: any) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    updateUser: (updatedUser: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const { token, user: userData } = authService.getAuthData();

                if (token && userData) {
                    // Verify token is still valid by fetching user profile
                    const response = await authService.getProfile();
                    if (response.success && 'data' in response) {
                        setUser(response.data.user);
                    } else {
                        // Token is invalid, clear auth data
                        authService.clearAuthData();
                    }
                } else {
                    // No token, check for demo accounts
                    const demoToken = localStorage.getItem('token');
                    if (demoToken && demoToken.includes('demo-token')) {
                        // Handle demo accounts for backward compatibility
                        if (demoToken === 'demo-token-123') {
                            setUser({
                                id: '1',
                                firstName: 'Demo',
                                lastName: 'Patient',
                                fullName: 'Demo Patient',
                                email: 'patient@demo.com',
                                role: 'patient',
                                phoneNumber: '+1234567890',
                                isVerified: true,
                                isActive: true,
                                createdAt: new Date().toISOString()
                            });
                        } else if (demoToken === 'demo-token-456') {
                            setUser({
                                id: '2',
                                firstName: 'Demo',
                                lastName: 'Provider',
                                fullName: 'Demo Provider',
                                email: 'provider@demo.com',
                                role: 'provider',
                                phoneNumber: '+1234567891',
                                isVerified: true,
                                isActive: true,
                                createdAt: new Date().toISOString()
                            });
                        }
                    }
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                authService.clearAuthData();
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        try {
            setIsLoading(true);

            // First try real API login
            const response = await authService.login({ email, password });

            if (response.success && 'data' in response) {
                const { token, user } = response.data;

                // Store authentication data
                authService.setAuthData(token, user);
                setUser(user);

                return { success: true };
            } else {
                // If API fails, fall back to demo accounts
                if (email === 'patient@demo.com' && password === 'password123') {
                    const userData = {
                        id: '1',
                        firstName: 'Demo',
                        lastName: 'Patient',
                        fullName: 'Demo Patient',
                        email: 'patient@demo.com',
                        role: 'patient' as const,
                        phoneNumber: '+1234567890',
                        isVerified: true,
                        isActive: true,
                        createdAt: new Date().toISOString()
                    };
                    localStorage.setItem('token', 'demo-token-123');
                    setUser(userData);
                    return { success: true };
                } else if (email === 'provider@demo.com' && password === 'password123') {
                    const userData = {
                        id: '2',
                        firstName: 'Demo',
                        lastName: 'Provider',
                        fullName: 'Demo Provider',
                        email: 'provider@demo.com',
                        role: 'provider' as const,
                        phoneNumber: '+1234567891',
                        isVerified: true,
                        isActive: true,
                        createdAt: new Date().toISOString()
                    };
                    localStorage.setItem('token', 'demo-token-456');
                    setUser(userData);
                    return { success: true };
                } else {
                    const errorMessage = !response.success && 'error' in response ? response.error : 'Invalid credentials';
                    return { success: false, error: errorMessage };
                }
            }
        } catch (error) {
            console.error('Login failed:', error);
            return { success: false, error: 'Login failed' };
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (userData: any): Promise<{ success: boolean; error?: string }> => {
        try {
            setIsLoading(true);

            const response = await authService.register(userData);

            if (response.success && 'data' in response) {
                const { token, user } = response.data;

                // Store authentication data
                authService.setAuthData(token, user);
                setUser(user);

                return { success: true };
            } else {
                const errorMessage = !response.success && 'error' in response ? response.error : 'Registration failed';
                return { success: false, error: errorMessage };
            }
        } catch (error) {
            console.error('Registration failed:', error);
            return { success: false, error: 'Registration failed' };
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        authService.clearAuthData();
        localStorage.removeItem('token'); // Also clear demo tokens
        setUser(null);
    };

    const updateUser = (updatedUser: User) => {
        setUser(updatedUser);
    };

    const value: AuthContextType = {
        user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}; 