import React from 'react';
import {
    Box,
    Container,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    CardActions,
} from '@mui/material';
import { Link } from 'react-router-dom';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PeopleIcon from '@mui/icons-material/People';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import { useAuth } from '../contexts/AuthContext';

const HomePage: React.FC = () => {
    const { user } = useAuth();
    const features = [
        {
            icon: <HealthAndSafetyIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
            title: 'Health Information',
            description: 'Access the latest health information and medical resources.',
            link: '/health-topics',
        },
        {
            icon: <LocalHospitalIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
            title: 'Medical Services',
            description: 'Comprehensive healthcare services for all your needs.',
            link: '/services',
        },
        {
            icon: <PeopleIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
            title: 'Patient Portal',
            description: 'Manage your health records and appointments online.',
            link: '/login',
        },
        {
            icon: <BookOnlineIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
            title: 'Book Appointment',
            description: 'Schedule appointments with our healthcare providers.',
            link: '/login',
        },
    ];
    console.log(user);

    return (
        <Box>
            {/* Hero Section - Big Block */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                    color: 'white',
                    py: { xs: 8, md: 12 },
                    textAlign: 'center',
                }}
            >
                <Container maxWidth="lg">
                    <Typography
                        variant="h2"
                        component="h1"
                        gutterBottom
                        sx={{
                            fontWeight: 'bold',
                            fontSize: { xs: '2.5rem', md: '3.75rem' },
                            mb: 3,
                        }}
                    >
                        Your Health, Our Priority
                    </Typography>
                    <Typography
                        variant="h5"
                        component="p"
                        sx={{
                            mb: 4,
                            fontSize: { xs: '1.25rem', md: '1.5rem' },
                            opacity: 0.9,
                        }}
                    >
                        Explore the latest health information and resources from Bayer HealthCare
                    </Typography>
                    <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Button
                            variant="contained"
                            size="large"
                            component={Link}
                            to="/health-topics"
                            sx={{
                                backgroundColor: 'white',
                                color: 'primary.main',
                                '&:hover': {
                                    backgroundColor: 'grey.100',
                                },
                                px: 4,
                                py: 1.5,
                            }}
                        >
                            Explore Health Topics
                        </Button>
                        {!user &&
                            <Button
                                variant="outlined"
                                size="large"
                                component={Link}
                                to={"/login"}
                                sx={{
                                    borderColor: 'white',
                                    color: 'white',
                                    '&:hover': {
                                        borderColor: 'white',
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    },
                                    px: 4,
                                    py: 1.5,
                                }}
                            >
                                Patient Portal
                            </Button>
                        }
                    </Box>
                </Container>
            </Box>

            {/* Features Section */}
            <Container maxWidth="lg" sx={{ py: 8 }}>
                <Typography
                    variant="h3"
                    component="h2"
                    gutterBottom
                    align="center"
                    sx={{ mb: 6, fontWeight: 'bold' }}
                >
                    Our Services
                </Typography>
                <Grid container spacing={4}>
                    {features.map((feature, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Card
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    textAlign: 'center',
                                    transition: 'transform 0.3s ease-in-out',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: 3,
                                    },
                                }}
                            >
                                <CardContent sx={{ flexGrow: 1, pt: 4 }}>
                                    <Box sx={{ mb: 2 }}>
                                        {feature.icon}
                                    </Box>
                                    <Typography gutterBottom variant="h5" component="h3" sx={{ fontWeight: 'bold' }}>
                                        {feature.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {feature.description}
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                                    <Button
                                        size="small"
                                        variant="contained"
                                        component={Link}
                                        to={feature.link}
                                    >
                                        Learn More
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Call to Action Section */}
            <Box
                sx={{
                    backgroundColor: 'grey.100',
                    py: 8,
                }}
            >
                <Container maxWidth="md" sx={{ textAlign: 'center' }}>
                    <Typography
                        variant="h4"
                        component="h2"
                        gutterBottom
                        sx={{ fontWeight: 'bold', mb: 3 }}
                    >
                        Ready to Take Control of Your Health?
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{ mb: 4, fontSize: '1.1rem' }}
                    >
                        Join thousands of patients who trust Bayer Healthcare for their medical needs.
                        Access your health records, book appointments, and stay informed about the latest
                        health information.
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        component={Link}
                        to="/login"
                        sx={{ px: 4, py: 1.5 }}
                    >
                        Get Started Today
                    </Button>
                </Container>
            </Box>
        </Box>
    );
};

export default HomePage; 