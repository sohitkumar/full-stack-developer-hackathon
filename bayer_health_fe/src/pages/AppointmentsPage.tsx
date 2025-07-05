import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    CircularProgress,
    Alert,
    Chip,
    Divider,
    MenuItem,
    Select,
    FormControl,
    InputLabel
} from '@mui/material';
import {
    Add,
    Edit,
    Delete,
    Schedule,
    Person,
    Email,
} from '@mui/icons-material';
import appointmentService from '../services/appointmentService';
import { useAuth } from '../contexts/AuthContext';

interface Appointment {
    _id: string;
    patientName: string;
    patientEmail: string;
    reason: string;
    time: string;
    createdAt: string;
    updatedAt: string;
}

const AppointmentsPage: React.FC = () => {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
    const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');
    const [formData, setFormData] = useState({
        patientName: '',
        patientEmail: '',
        reason: '',
        time: ''
    });

    const isProvider = user?.role === 'provider' || user?.role === 'admin';

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await appointmentService.getAllAppointments();
            setAppointments(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch appointments');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (appointment?: Appointment) => {
        if (appointment) {
            setEditingAppointment(appointment);
            setFormData({
                patientName: appointment.patientName,
                patientEmail: appointment.patientEmail,
                reason: appointment.reason,
                time: new Date(appointment.time).toISOString().slice(0, 16)
            });
        } else {
            setEditingAppointment(null);
            setFormData({
                patientName: '',
                patientEmail: '',
                reason: '',
                time: ''
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingAppointment(null);
        setFormData({
            patientName: '',
            patientEmail: '',
            reason: '',
            time: ''
        });
    };

    const handleSubmit = async () => {
        try {
            setError(null);
            const appointmentData = {
                ...formData,
                time: new Date(formData.time).toISOString()
            };

            if (editingAppointment) {
                await appointmentService.updateAppointment(editingAppointment._id, appointmentData);
            } else {
                await appointmentService.createAppointment(appointmentData);
            }

            handleCloseDialog();
            fetchAppointments();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to save appointment');
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this appointment?')) {
            try {
                setError(null);
                await appointmentService.deleteAppointment(id);
                fetchAppointments();
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to delete appointment');
            }
        }
    };

    const getFilteredAppointments = () => {
        const now = new Date();
        return appointments.filter(appointment => {
            const appointmentTime = new Date(appointment.time);
            switch (filter) {
                case 'upcoming':
                    return appointmentTime > now;
                case 'past':
                    return appointmentTime <= now;
                default:
                    return true;
            }
        });
    };

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const getStatusColor = (appointmentTime: string) => {
        const now = new Date();
        const time = new Date(appointmentTime);
        return time > now ? 'primary' : 'default';
    };

    const getStatusText = (appointmentTime: string) => {
        const now = new Date();
        const time = new Date(appointmentTime);
        return time > now ? 'Upcoming' : 'Completed';
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    const filteredAppointments = getFilteredAppointments();

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    {isProvider ? 'Manage Appointments' : 'My Appointments'}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    {isProvider
                        ? 'Schedule and manage patient appointments'
                        : 'View your upcoming and past appointments'
                    }
                </Typography>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {!isProvider && (
                <Alert severity="info" sx={{ mb: 3 }}>
                    <Typography variant="body2">
                        Need to schedule an appointment? Please contact your healthcare provider directly.
                    </Typography>
                </Alert>
            )}

            <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Filter</InputLabel>
                    <Select
                        value={filter}
                        label="Filter"
                        onChange={(e) => setFilter(e.target.value as 'all' | 'upcoming' | 'past')}
                    >
                        <MenuItem value="all">All Appointments</MenuItem>
                        <MenuItem value="upcoming">Upcoming</MenuItem>
                        <MenuItem value="past">Past</MenuItem>
                    </Select>
                </FormControl>

                {isProvider && (
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => handleOpenDialog()}
                    >
                        Schedule Appointment
                    </Button>
                )}
            </Box>

            {filteredAppointments.length === 0 ? (
                <Card>
                    <CardContent sx={{ textAlign: 'center', py: 4 }}>
                        <Schedule sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary">
                            No appointments found
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {isProvider
                                ? 'Schedule your first appointment using the button above'
                                : 'Contact your healthcare provider to schedule an appointment'
                            }
                        </Typography>
                    </CardContent>
                </Card>
            ) : (
                <Grid container spacing={3}>
                    {filteredAppointments.map((appointment) => (
                        <Grid item xs={12} md={6} key={appointment._id}>
                            <Card>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Person color="primary" />
                                            <Typography variant="h6">
                                                {appointment.patientName}
                                            </Typography>
                                        </Box>
                                        <Chip
                                            label={getStatusText(appointment.time)}
                                            color={getStatusColor(appointment.time)}
                                            size="small"
                                        />
                                    </Box>

                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <Email fontSize="small" color="action" />
                                        <Typography variant="body2" color="text.secondary">
                                            {appointment.patientEmail}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <Schedule fontSize="small" color="action" />
                                        <Typography variant="body2" color="text.secondary">
                                            {formatDateTime(appointment.time)}
                                        </Typography>
                                    </Box>

                                    <Typography variant="body1" sx={{ mb: 2 }}>
                                        <strong>Reason:</strong> {appointment.reason}
                                    </Typography>

                                    {isProvider && (
                                        <>
                                            <Divider sx={{ my: 2 }} />
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <Button
                                                    size="small"
                                                    startIcon={<Edit />}
                                                    onClick={() => handleOpenDialog(appointment)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    size="small"
                                                    color="error"
                                                    startIcon={<Delete />}
                                                    onClick={() => handleDelete(appointment._id)}
                                                >
                                                    Delete
                                                </Button>
                                            </Box>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Appointment Dialog (Provider Only) */}
            {isProvider && (
                <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                    <DialogTitle>
                        {editingAppointment ? 'Edit Appointment' : 'Schedule New Appointment'}
                    </DialogTitle>
                    <DialogContent>
                        <Box sx={{ pt: 2 }}>
                            <TextField
                                fullWidth
                                label="Patient Name"
                                value={formData.patientName}
                                onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                                margin="normal"
                                required
                            />
                            <TextField
                                fullWidth
                                label="Patient Email"
                                type="email"
                                value={formData.patientEmail}
                                onChange={(e) => setFormData({ ...formData, patientEmail: e.target.value })}
                                margin="normal"
                                required
                                helperText="The patient will be notified about this appointment"
                            />
                            <TextField
                                fullWidth
                                label="Reason for Visit"
                                value={formData.reason}
                                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                margin="normal"
                                multiline
                                rows={2}
                                required
                            />
                            <TextField
                                fullWidth
                                label="Appointment Date & Time"
                                type="datetime-local"
                                value={formData.time}
                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                required
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancel</Button>
                        <Button onClick={handleSubmit} variant="contained">
                            {editingAppointment ? 'Update' : 'Schedule'}
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </Container>
    );
};

export default AppointmentsPage; 