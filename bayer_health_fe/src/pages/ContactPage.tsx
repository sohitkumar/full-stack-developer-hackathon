import React, { useState } from 'react';
import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    Grid,
    Paper,
} from '@mui/material';
import styles from '../styles/ContactPage.module.css';

const ContactPage: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        // Optionally send data to backend here
    };

    return (
        <Container maxWidth="sm" className={styles.container}>
            <Paper elevation={3} className={styles.paper}>
                <Typography variant="h4" gutterBottom className={styles.title}>
                    Contact Us
                </Typography>

                <Box component="form" onSubmit={handleSubmit} className={styles.form}>
                    <Grid container spacing={2} className={styles.formGrid}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                required
                                label="Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                required
                                label="Email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                required
                                multiline
                                rows={4}
                                label="Message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} className={styles.submitButtonContainer}>
                            <Button variant="contained" type="submit" color="primary" className={styles.submitButton}>
                                Send Message
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    );
};

export default ContactPage;