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
    Paper,
    TextField,
    InputAdornment,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
} from '@mui/material';
import {
    Person,
    Search,
    Email,
    Phone,
    CalendarToday,
    MedicalServices,
    Visibility,
    Edit,
    Delete,
    Add,
    Warning,
    CheckCircle,
    Cancel,
    PersonAdd,
    LocationOn,
    Badge,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import userService from '../services/userService';

interface Patient {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    isVerified: boolean;
    isActive: boolean;
    createdAt: string;
    lastLogin?: string;
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
}

const PatientPage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    // Check if user is provider/admin
    const isProvider = user?.role === 'provider' || user?.role === 'admin';

    useEffect(() => {
        if (!isProvider) {
            navigate('/dashboard');
            return;
        }
        fetchPatients();
    }, [user, navigate, isProvider]);

    const fetchPatients = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await userService.getPatients();

            if (response.success && 'data' in response) {
                setPatients(response.data.patients || []);
            } else {
                const errorMessage = !response.success && 'error' in response
                    ? response.error
                    : 'Failed to fetch patients';
                setError(errorMessage);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch patients');
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        setPage(0); // Reset to first page when searching
    };

    const handleViewPatient = (patient: Patient) => {
        setSelectedPatient(patient);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedPatient(null);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Filter patients based on search term
    const filteredPatients = patients.filter(patient =>
        patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Get patients for current page
    const paginatedPatients = filteredPatients.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    // Show access denied for non-providers
    if (!isProvider) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Alert severity="error" sx={{ mb: 4 }}>
                    <Typography variant="h6" gutterBottom>
                        Access Denied
                    </Typography>
                    <Typography variant="body1">
                        You do not have permission to view this page. Only healthcare providers can access patient information.
                    </Typography>
                </Alert>
                <Button variant="contained" onClick={() => navigate('/dashboard')}>
                    Return to Dashboard
                </Button>
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
                <Typography variant="h4" component="h1" gutterBottom>
                    Patient Management
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Manage and view patient information
                </Typography>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 4 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {/* Statistics Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                                    <Person />
                                </Avatar>
                                <Box>
                                    <Typography color="text.secondary" gutterBottom>
                                        Total Patients
                                    </Typography>
                                    <Typography variant="h5">
                                        {patients.length}
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
                                    <CheckCircle />
                                </Avatar>
                                <Box>
                                    <Typography color="text.secondary" gutterBottom>
                                        Active Patients
                                    </Typography>
                                    <Typography variant="h5">
                                        {patients.filter(p => p.isActive).length}
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
                                    <Badge />
                                </Avatar>
                                <Box>
                                    <Typography color="text.secondary" gutterBottom>
                                        Verified Patients
                                    </Typography>
                                    <Typography variant="h5">
                                        {patients.filter(p => p.isVerified).length}
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
                                    <Warning />
                                </Avatar>
                                <Box>
                                    <Typography color="text.secondary" gutterBottom>
                                        New This Month
                                    </Typography>
                                    <Typography variant="h5">
                                        {patients.filter(p => {
                                            const patientDate = new Date(p.createdAt);
                                            const now = new Date();
                                            return patientDate.getMonth() === now.getMonth() &&
                                                patientDate.getFullYear() === now.getFullYear();
                                        }).length}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Search and Actions */}
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <TextField
                    variant="outlined"
                    placeholder="Search patients..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    sx={{ width: '300px' }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        ),
                    }}
                />
                <Button
                    variant="contained"
                    startIcon={<PersonAdd />}
                    onClick={() => navigate('/register')}
                >
                    Add New Patient
                </Button>
            </Box>

            {/* Patients Table */}
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell>Patient</TableCell>
                                <TableCell>Contact</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Joined</TableCell>
                                <TableCell>Last Login</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedPatients.map((patient) => (
                                <TableRow key={patient.id} hover>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                                                <Person />
                                            </Avatar>
                                            <Box>
                                                <Typography variant="subtitle2">
                                                    {patient.firstName} {patient.lastName}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {patient.email}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Box>
                                            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                                <Email fontSize="small" sx={{ mr: 1 }} />
                                                {patient.email}
                                            </Typography>
                                            {patient.phoneNumber && (
                                                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Phone fontSize="small" sx={{ mr: 1 }} />
                                                    {patient.phoneNumber}
                                                </Typography>
                                            )}
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
                                            <Chip
                                                label={patient.isActive ? 'Active' : 'Inactive'}
                                                color={patient.isActive ? 'success' : 'default'}
                                                size="small"
                                            />
                                            {patient.isVerified && (
                                                <Chip
                                                    label="Verified"
                                                    color="info"
                                                    size="small"
                                                />
                                            )}
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {formatDate(patient.createdAt)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" color="text.secondary">
                                            {patient.lastLogin ? formatDateTime(patient.lastLogin) : 'Never'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            onClick={() => handleViewPatient(patient)}
                                            color="primary"
                                            size="small"
                                        >
                                            <Visibility />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => navigate(`/appointments?patient=${patient.id}`)}
                                            color="secondary"
                                            size="small"
                                        >
                                            <CalendarToday />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredPatients.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>

            {/* Patient Detail Dialog */}
            <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle>
                    Patient Details
                </DialogTitle>
                <DialogContent>
                    {selectedPatient && (
                        <Box sx={{ pt: 2 }}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="h6" gutterBottom>
                                        Basic Information
                                    </Typography>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="body2" color="text.secondary">Full Name</Typography>
                                        <Typography variant="body1">
                                            {selectedPatient.firstName} {selectedPatient.lastName}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="body2" color="text.secondary">Email</Typography>
                                        <Typography variant="body1">{selectedPatient.email}</Typography>
                                    </Box>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="body2" color="text.secondary">Phone</Typography>
                                        <Typography variant="body1">{selectedPatient.phoneNumber || 'Not provided'}</Typography>
                                    </Box>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="body2" color="text.secondary">Status</Typography>
                                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                            <Chip
                                                label={selectedPatient.isActive ? 'Active' : 'Inactive'}
                                                color={selectedPatient.isActive ? 'success' : 'default'}
                                                size="small"
                                            />
                                            {selectedPatient.isVerified && (
                                                <Chip label="Verified" color="info" size="small" />
                                            )}
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="h6" gutterBottom>
                                        Account Information
                                    </Typography>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="body2" color="text.secondary">Member Since</Typography>
                                        <Typography variant="body1">{formatDate(selectedPatient.createdAt)}</Typography>
                                    </Box>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="body2" color="text.secondary">Last Login</Typography>
                                        <Typography variant="body1">
                                            {selectedPatient.lastLogin ? formatDateTime(selectedPatient.lastLogin) : 'Never'}
                                        </Typography>
                                    </Box>
                                    {selectedPatient.patientInfo && (
                                        <>
                                            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                                                Medical Information
                                            </Typography>
                                            {selectedPatient.patientInfo.dateOfBirth && (
                                                <Box sx={{ mb: 2 }}>
                                                    <Typography variant="body2" color="text.secondary">Date of Birth</Typography>
                                                    <Typography variant="body1">{formatDate(selectedPatient.patientInfo.dateOfBirth)}</Typography>
                                                </Box>
                                            )}
                                            {selectedPatient.patientInfo.gender && (
                                                <Box sx={{ mb: 2 }}>
                                                    <Typography variant="body2" color="text.secondary">Gender</Typography>
                                                    <Typography variant="body1">{selectedPatient.patientInfo.gender}</Typography>
                                                </Box>
                                            )}
                                            {selectedPatient.patientInfo.bloodType && (
                                                <Box sx={{ mb: 2 }}>
                                                    <Typography variant="body2" color="text.secondary">Blood Type</Typography>
                                                    <Typography variant="body1">{selectedPatient.patientInfo.bloodType}</Typography>
                                                </Box>
                                            )}
                                        </>
                                    )}
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Close</Button>
                    <Button
                        variant="contained"
                        startIcon={<CalendarToday />}
                        onClick={() => {
                            handleCloseDialog();
                            navigate(`/appointments?patient=${selectedPatient?.id}`);
                        }}
                    >
                        View Appointments
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default PatientPage;
