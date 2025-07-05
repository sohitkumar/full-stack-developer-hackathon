import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Box,
    Avatar,
    Button,
    CircularProgress,
    Alert,
    Chip,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Divider,
    Paper,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Snackbar,
} from '@mui/material';
import {
    Person,
    HealthAndSafety,
    Article,
    TrendingUp,
    Visibility,
    Favorite,
    LocalHospital,
    Groups,
    AdminPanelSettings,
    Edit,
    Settings,
    Height,
    MonitorWeight,
    Bloodtype,
    FitnessCenter,
    Save,
    Cancel,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import healthService from '../services/healthService';
import userService from '../services/userService';
import authService from '../services/authService';

interface DashboardStats {
    totalTopics?: number;
    totalViews?: number;
    totalLikes?: number;
    totalUsers?: number;
    totalPatients?: number;
    totalProviders?: number;
    newUsersThisMonth?: number;
    recentTopics?: Array<{
        _id: string;
        title: string;
        category: string;
        views: number;
        publishedAt: string;
    }>;
    recentUsers?: Array<{
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        role: string;
        createdAt: string;
    }>;
}

const DashboardPage: React.FC = () => {
    const { user, logout, updateUser } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState<DashboardStats>({});
    const [recentTopics, setRecentTopics] = useState<any[]>([]);

    // Profile update state
    const [profileDialogOpen, setProfileDialogOpen] = useState(false);
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileError, setProfileError] = useState<string | null>(null);
    const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: ''
    });

    useEffect(() => {
        if (user) {
            fetchDashboardData();
        }
    }, [user]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch recent health topics for all users
            const topicsResponse = await healthService.getAllTopics();
            if (topicsResponse.success && 'data' in topicsResponse) {
                setRecentTopics(topicsResponse.data.topics || []);
            }

            // Fetch role-specific data
            if (user?.role === 'admin') {
                try {
                    const userStatsResponse = await userService.getUserStatsOverview();
                    if (userStatsResponse.success && 'data' in userStatsResponse) {
                        setStats(prev => ({
                            ...prev,
                            ...userStatsResponse.data.stats,
                        }));
                    }
                } catch (err) {
                    console.warn('Failed to fetch admin stats:', err);
                }
            }

        } catch (err) {
            console.error('Failed to fetch dashboard data:', err);
            setError('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'admin': return 'error';
            case 'provider': return 'primary';
            case 'patient': return 'success';
            default: return 'default';
        }
    };

    // Profile update handlers
    const handleOpenProfileDialog = () => {
        setProfileData({
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            phoneNumber: user?.phoneNumber || ''
        });
        setProfileError(null);
        setProfileDialogOpen(true);
    };

    const handleCloseProfileDialog = () => {
        setProfileDialogOpen(false);
        setProfileError(null);
        setProfileData({
            firstName: '',
            lastName: '',
            phoneNumber: ''
        });
    };

    const handleProfileInputChange = (field: string) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setProfileData(prev => ({
            ...prev,
            [field]: event.target.value
        }));
    };

    const handleSaveProfile = async () => {
        try {
            setProfileLoading(true);
            setProfileError(null);

            // Validate required fields
            if (!profileData.firstName.trim() || !profileData.lastName.trim()) {
                setProfileError('First name and last name are required');
                return;
            }

            // Call the auth service to update profile
            await authService.updateProfile(profileData);

            // Update user context
            if (updateUser && user) {
                const updatedUser = {
                    ...user,
                    firstName: profileData.firstName,
                    lastName: profileData.lastName,
                    phoneNumber: profileData.phoneNumber,
                    fullName: `${profileData.firstName} ${profileData.lastName}`
                };
                updateUser(updatedUser);
            }

            setProfileSuccess('Profile updated successfully!');
            handleCloseProfileDialog();
        } catch (err: any) {
            setProfileError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setProfileLoading(false);
        }
    };

    if (!user) {
        return (
            <Container>
                <Alert severity="error">
                    No user data available. Please log in again.
                </Alert>
            </Container>
        );
    }

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress size={60} />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} md={8}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Avatar
                                sx={{
                                    width: 64,
                                    height: 64,
                                    mr: 3,
                                    bgcolor: `${getRoleColor(user.role)}.main`
                                }}
                            >
                                {user.role === 'admin' ? <AdminPanelSettings /> :
                                    user.role === 'provider' ? <LocalHospital /> : <Person />}
                            </Avatar>
                            <Box>
                                <Typography variant="h4" gutterBottom>
                                    Welcome back, {user.fullName || `${user.firstName} ${user.lastName}`}!
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Chip
                                        label={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                        color={getRoleColor(user.role) as any}
                                        variant="outlined"
                                    />
                                    {user.isVerified && (
                                        <Chip label="Verified" color="success" size="small" />
                                    )}
                                </Box>
                            </Box>
                        </Box>
                        <Typography variant="body1" color="text.secondary">
                            {user.role === 'patient' && 'Access your health information and connect with healthcare providers.'}
                            {user.role === 'provider' && 'Manage your patients and create health content.'}
                            {user.role === 'admin' && 'Oversee platform operations and user management.'}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={handleLogout}
                            >
                                Logout
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 4 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {/* Stats Cards - Admin Only */}
            {user.role === 'admin' && (
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                                        <Groups />
                                    </Avatar>
                                    <Box>
                                        <Typography color="text.secondary" gutterBottom>
                                            Total Users
                                        </Typography>
                                        <Typography variant="h5">
                                            {stats.totalUsers || 0}
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                                        <Person />
                                    </Avatar>
                                    <Box>
                                        <Typography color="text.secondary" gutterBottom>
                                            Patients
                                        </Typography>
                                        <Typography variant="h5">
                                            {stats.totalPatients || 0}
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                                        <LocalHospital />
                                    </Avatar>
                                    <Box>
                                        <Typography color="text.secondary" gutterBottom>
                                            Providers
                                        </Typography>
                                        <Typography variant="h5">
                                            {stats.totalProviders || 0}
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                                        <TrendingUp />
                                    </Avatar>
                                    <Box>
                                        <Typography color="text.secondary" gutterBottom>
                                            New This Month
                                        </Typography>
                                        <Typography variant="h5">
                                            {stats.newUsersThisMonth || 0}
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {/* Patient Basic Health Information */}
            {user.role === 'patient' && (
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <HealthAndSafety color="primary" />
                            Basic Health Information
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                                        <Height />
                                    </Avatar>
                                    <Box>
                                        <Typography color="text.secondary" gutterBottom>
                                            Height
                                        </Typography>
                                        <Typography variant="h5">
                                            5'8"
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            173 cm
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                                        <MonitorWeight />
                                    </Avatar>
                                    <Box>
                                        <Typography color="text.secondary" gutterBottom>
                                            Weight
                                        </Typography>
                                        <Typography variant="h5">
                                            165 lbs
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            75 kg • BMI: 23.2
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Avatar sx={{ bgcolor: 'error.main', mr: 2 }}>
                                        <Bloodtype />
                                    </Avatar>
                                    <Box>
                                        <Typography color="text.secondary" gutterBottom>
                                            Blood Type
                                        </Typography>
                                        <Typography variant="h5">
                                            A+
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Universal donor
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            <Grid container spacing={3}>
                {/* Quick Actions */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Quick Actions
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        startIcon={<Article />}
                                        onClick={() => navigate('/health')}
                                        sx={{ justifyContent: 'flex-start' }}
                                    >
                                        Browse Health Topics
                                    </Button>
                                </Grid>
                                {user.role === 'provider' && (
                                    <Grid item xs={12}>
                                        <Button
                                            fullWidth
                                            variant="outlined"
                                            startIcon={<Groups />}
                                            onClick={() => navigate('/patients')}
                                            sx={{ justifyContent: 'flex-start' }}
                                        >
                                            Manage Patients
                                        </Button>
                                    </Grid>
                                )}
                                {user.role === 'admin' && (
                                    <Grid item xs={12}>
                                        <Button
                                            fullWidth
                                            variant="outlined"
                                            startIcon={<AdminPanelSettings />}
                                            onClick={() => navigate('/admin')}
                                            sx={{ justifyContent: 'flex-start' }}
                                        >
                                            Admin Panel
                                        </Button>
                                    </Grid>
                                )}
                                <Grid item xs={12}>
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        startIcon={<HealthAndSafety />}
                                        onClick={() => navigate('/appointments')}
                                        sx={{ justifyContent: 'flex-start' }}
                                    >
                                        {user.role === 'patient' ? 'My Appointments' : 'Manage Appointments'}
                                    </Button>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Recent Health Topics */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Recent Health Topics
                            </Typography>
                            {recentTopics.length > 0 ? (
                                <List>
                                    {recentTopics.map((topic, index) => (
                                        <React.Fragment key={topic._id}>
                                            <ListItem
                                                alignItems="flex-start"
                                                button
                                                onClick={() => navigate(`/health/${topic._id}`)}
                                            >
                                                <ListItemAvatar>
                                                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                                                        <Article />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={topic.title}
                                                    secondary={
                                                        <Box>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {topic.category}
                                                            </Typography>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                                                <Visibility sx={{ fontSize: 14, mr: 0.5 }} />
                                                                <Typography variant="caption" sx={{ mr: 2 }}>
                                                                    {topic.views} views
                                                                </Typography>
                                                                <Typography variant="caption">
                                                                    {formatDate(topic.publishedAt)}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    }
                                                />
                                            </ListItem>
                                            {index < recentTopics.length - 1 && <Divider variant="inset" component="li" />}
                                        </React.Fragment>
                                    ))}
                                </List>
                            ) : (
                                <Typography color="text.secondary">
                                    No recent topics available.
                                </Typography>
                            )}
                            <Box sx={{ mt: 2 }}>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    onClick={() => navigate('/health-topics')}
                                >
                                    View All Topics
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* User Profile Info */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6">
                                Profile Information
                            </Typography>
                            <IconButton
                                onClick={handleOpenProfileDialog}
                                color="primary"
                                size="small"
                            >
                                <Edit />
                            </IconButton>
                        </Box>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body2" color="text.secondary">First Name</Typography>
                                <Typography variant="body1">{user.firstName}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body2" color="text.secondary">Last Name</Typography>
                                <Typography variant="body1">{user.lastName}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body2" color="text.secondary">Email</Typography>
                                <Typography variant="body1">{user.email}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body2" color="text.secondary">Phone</Typography>
                                <Typography variant="body1">{user.phoneNumber || 'Not provided'}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body2" color="text.secondary">Account Status</Typography>
                                <Typography variant="body1">
                                    {user.isActive ? 'Active' : 'Inactive'}
                                    {user.isVerified && ' • Verified'}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body2" color="text.secondary">Member Since</Typography>
                                <Typography variant="body1">{formatDate(user.createdAt)}</Typography>
                            </Grid>
                            {user.lastLogin && (
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body2" color="text.secondary">Last Login</Typography>
                                    <Typography variant="body1">{formatDate(user.lastLogin)}</Typography>
                                </Grid>
                            )}
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>

            {/* Profile Update Dialog */}
            <Dialog open={profileDialogOpen} onClose={handleCloseProfileDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    Edit Profile
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        {profileError && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {profileError}
                            </Alert>
                        )}
                        <TextField
                            fullWidth
                            label="First Name"
                            value={profileData.firstName}
                            onChange={handleProfileInputChange('firstName')}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Last Name"
                            value={profileData.lastName}
                            onChange={handleProfileInputChange('lastName')}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Phone Number"
                            value={profileData.phoneNumber}
                            onChange={handleProfileInputChange('phoneNumber')}
                            margin="normal"
                            placeholder="+1234567890"
                            helperText="Optional - Include country code"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseProfileDialog} startIcon={<Cancel />}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSaveProfile}
                        variant="contained"
                        disabled={profileLoading}
                        startIcon={profileLoading ? <CircularProgress size={16} /> : <Save />}
                    >
                        {profileLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Success/Error Snackbar */}
            <Snackbar
                open={!!profileSuccess}
                autoHideDuration={6000}
                onClose={() => setProfileSuccess(null)}
            >
                <Alert onClose={() => setProfileSuccess(null)} severity="success" sx={{ width: '100%' }}>
                    {profileSuccess}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default DashboardPage; 