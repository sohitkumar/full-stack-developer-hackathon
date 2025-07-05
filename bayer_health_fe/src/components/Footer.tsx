import React from 'react';
import { Box, Typography, Container, Link, Grid } from '@mui/material';

const Footer: React.FC = () => {
    return (
        <Box
            component="footer"
            sx={{
                backgroundColor: (theme) => theme.palette.grey[800],
                color: 'white',
                py: 6,
                mt: 'auto',
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h6" color="inherit" gutterBottom>
                            Bayer Healthcare
                        </Typography>
                        <Typography variant="body2" color="inherit">
                            Your Health, Our Priority. Committed to providing quality healthcare
                            information and services.
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h6" color="inherit" gutterBottom>
                            Quick Links
                        </Typography>
                        <Link href="/" color="inherit" display="block" variant="body2">
                            Home
                        </Link>
                        <Link href="/health-topics" color="inherit" display="block" variant="body2">
                            Health Topics
                        </Link>
                        <Link href="/services" color="inherit" display="block" variant="body2">
                            Services
                        </Link>
                        <Link href="/contact" color="inherit" display="block" variant="body2">
                            Contact
                        </Link>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h6" color="inherit" gutterBottom>
                            Services
                        </Typography>
                        <Typography variant="body2" color="inherit" display="block">
                            Patient Portal
                        </Typography>
                        <Typography variant="body2" color="inherit" display="block">
                            Health Information
                        </Typography>
                        <Typography variant="body2" color="inherit" display="block">
                            Appointment Booking
                        </Typography>
                        <Typography variant="body2" color="inherit" display="block">
                            Provider Access
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h6" color="inherit" gutterBottom>
                            Contact Info
                        </Typography>
                        <Typography variant="body2" color="inherit">
                            Phone: +1 (555) 123-4567
                        </Typography>
                        <Typography variant="body2" color="inherit">
                            Email: info@bayerhealthcare.com
                        </Typography>
                        <Typography variant="body2" color="inherit">
                            Address: 123 Healthcare Ave, Medical City, MC 12345
                        </Typography>
                    </Grid>
                </Grid>

                <Box mt={5}>
                    <Typography variant="body2" color="inherit" align="center">
                        {'© '}
                        {new Date().getFullYear()}{' '}
                        Bayer Healthcare. All rights reserved.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer; 