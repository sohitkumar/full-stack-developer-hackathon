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
import styles from '../styles/PatientPage.module.css';

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
            <Container maxWidth="lg" className={styles.accessDeniedContainer}>
                <Alert severity="error" className={styles.accessDeniedAlert}>
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
            <Box className={styles.loadingContainer}>
                <CircularProgress size={60} />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" className={styles.container}>
            {/* Header */}
            <Box className={styles.header}>
                <Typography variant="h4" component="h1" className={styles.headerTitle}>
                    Patient Management
                </Typography>
                <Typography variant="body1" className={styles.headerSubtitle}>
                    Manage and view patient information
                </Typography>
            </Box>

            {error && (
                <Alert severity="error" className={styles.errorAlert} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {/* Statistics Cards */}
            <Grid container spacing={3} className={styles.statsGrid}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card className={styles.statsCard}>
                        <CardContent>
                            <Box className={styles.statsCardContent}>
                                <Avatar className={styles.statsAvatar}>
                                    <Person />
                                </Avatar>
                                <Box>
                                    <Typography className={styles.statsText} gutterBottom>
                                        Total Patients
                                    </Typography>
                                    <Typography variant="h5" className={styles.statsNumber}>
                                        {patients.length}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card className={styles.statsCard}>
                        <CardContent>
                            <Box className={styles.statsCardContent}>
                                <Avatar className={styles.statsAvatarSuccess}>
                                    <CheckCircle />
                                </Avatar>
                                <Box>
                                    <Typography className={styles.statsText} gutterBottom>
                                        Active Patients
                                    </Typography>
                                    <Typography variant="h5" className={styles.statsNumber}>
                                        {patients.filter(p => p.isActive).length}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card className={styles.statsCard}>
                        <CardContent>
                            <Box className={styles.statsCardContent}>
                                <Avatar className={styles.statsAvatarInfo}>
                                    <Badge />
                                </Avatar>
                                <Box>
                                    <Typography className={styles.statsText} gutterBottom>
                                        Verified Patients
                                    </Typography>
                                    <Typography variant="h5" className={styles.statsNumber}>
                                        {patients.filter(p => p.isVerified).length}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card className={styles.statsCard}>
                        <CardContent>
                            <Box className={styles.statsCardContent}>
                                <Avatar className={styles.statsAvatarWarning}>
                                    <Warning />
                                </Avatar>
                                <Box>
                                    <Typography className={styles.statsText} gutterBottom>
                                        New This Month
                                    </Typography>
                                    <Typography variant="h5" className={styles.statsNumber}>
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
            <Box className={styles.searchActionContainer}>
                <TextField
                    variant="outlined"
                    placeholder="Search patients..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className={styles.searchField}
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
            <Paper className={styles.tableContainer}>
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
                                <TableRow key={patient.id} hover className={styles.tableRow}>
                                    <TableCell>
                                        <Box className={styles.patientCell}>
                                            <Avatar className={styles.patientAvatar}>
                                                <Person />
                                            </Avatar>
                                            <Box>
                                                <Typography variant="subtitle2" className={styles.patientName}>
                                                    {patient.firstName} {patient.lastName}
                                                </Typography>
                                                <Typography variant="body2" className={styles.patientEmail}>
                                                    {patient.email}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Box>
                                            <Typography variant="body2" className={styles.contactItem}>
                                                <Email fontSize="small" className={styles.contactIcon} />
                                                {patient.email}
                                            </Typography>
                                            {patient.phoneNumber && (
                                                <Typography variant="body2" className={`${styles.contactItem} ${styles.contactSecondary}`}>
                                                    <Phone fontSize="small" className={styles.contactIcon} />
                                                    {patient.phoneNumber}
                                                </Typography>
                                            )}
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Box className={styles.statusContainer}>
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
                                        <Typography variant="body2" className={styles.dateText}>
                                            {formatDate(patient.createdAt)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" className={styles.dateTextSecondary}>
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
                        <Box className={styles.dialogContent}>
                            <Grid container spacing={3} className={styles.dialogGrid}>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="h6" className={styles.dialogSectionTitle}>
                                        Basic Information
                                    </Typography>
                                    <Box className={styles.dialogInfoBox}>
                                        <Typography variant="body2" className={styles.dialogLabel}>Full Name</Typography>
                                        <Typography variant="body1" className={styles.dialogValue}>
                                            {selectedPatient.firstName} {selectedPatient.lastName}
                                        </Typography>
                                    </Box>
                                    <Box className={styles.dialogInfoBox}>
                                        <Typography variant="body2" className={styles.dialogLabel}>Email</Typography>
                                        <Typography variant="body1" className={styles.dialogValue}>{selectedPatient.email}</Typography>
                                    </Box>
                                    <Box className={styles.dialogInfoBox}>
                                        <Typography variant="body2" className={styles.dialogLabel}>Phone</Typography>
                                        <Typography variant="body1" className={styles.dialogValue}>{selectedPatient.phoneNumber || 'Not provided'}</Typography>
                                    </Box>
                                    <Box className={styles.dialogInfoBox}>
                                        <Typography variant="body2" className={styles.dialogLabel}>Status</Typography>
                                        <Box className={styles.dialogStatusContainer}>
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
                                    <Typography variant="h6" className={styles.dialogSectionTitle}>
                                        Account Information
                                    </Typography>
                                    <Box className={styles.dialogInfoBox}>
                                        <Typography variant="body2" className={styles.dialogLabel}>Member Since</Typography>
                                        <Typography variant="body1" className={styles.dialogValue}>{formatDate(selectedPatient.createdAt)}</Typography>
                                    </Box>
                                    <Box className={styles.dialogInfoBox}>
                                        <Typography variant="body2" className={styles.dialogLabel}>Last Login</Typography>
                                        <Typography variant="body1" className={styles.dialogValue}>
                                            {selectedPatient.lastLogin ? formatDateTime(selectedPatient.lastLogin) : 'Never'}
                                        </Typography>
                                    </Box>
                                    {selectedPatient.patientInfo && (
                                        <>
                                            <Typography variant="h6" className={`${styles.dialogSectionTitle} ${styles.medicalSection}`}>
                                                Medical Information
                                            </Typography>
                                            {selectedPatient.patientInfo.dateOfBirth && (
                                                <Box className={styles.dialogInfoBox}>
                                                    <Typography variant="body2" className={styles.dialogLabel}>Date of Birth</Typography>
                                                    <Typography variant="body1" className={styles.dialogValue}>{formatDate(selectedPatient.patientInfo.dateOfBirth)}</Typography>
                                                </Box>
                                            )}
                                            {selectedPatient.patientInfo.gender && (
                                                <Box className={styles.dialogInfoBox}>
                                                    <Typography variant="body2" className={styles.dialogLabel}>Gender</Typography>
                                                    <Typography variant="body1" className={styles.dialogValue}>{selectedPatient.patientInfo.gender}</Typography>
                                                </Box>
                                            )}
                                            {selectedPatient.patientInfo.bloodType && (
                                                <Box className={styles.dialogInfoBox}>
                                                    <Typography variant="body2" className={styles.dialogLabel}>Blood Type</Typography>
                                                    <Typography variant="body1" className={styles.dialogValue}>{selectedPatient.patientInfo.bloodType}</Typography>
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
