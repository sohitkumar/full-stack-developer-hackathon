import React from 'react';
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CardHeader,
    Divider,
} from '@mui/material';

interface LabService {
    name: string;
    price: string;
}

const services: LabService[] = [
    { name: 'Complete Blood Count (CBC)', price: '₹400' },
    { name: 'Lipid Profile', price: '₹600' },
    { name: 'Liver Function Test (LFT)', price: '₹700' },
    { name: 'Kidney Function Test (KFT)', price: '₹650' },
    { name: 'Thyroid Panel (T3, T4, TSH)', price: '₹500' },
    { name: 'Blood Sugar (Fasting)', price: '₹200' },
    { name: 'Vitamin D Test', price: '₹800' },
    { name: 'COVID-19 RT-PCR Test', price: '₹1200' },
];

const ServicesPage: React.FC = () => {
    return (
        <Container sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom color="primary">
                Lab Test Services
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
                {services.map((service, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card elevation={3}>
                            <CardHeader title={service.name} />
                            <CardContent>
                                <Typography variant="h6" color="text.secondary">
                                    Price: {service.price}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default ServicesPage;
