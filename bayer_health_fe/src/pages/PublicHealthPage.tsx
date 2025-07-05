import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    Collapse,
    CircularProgress,
    Alert,
} from '@mui/material';
import {
    ExpandMore,
    ExpandLess,
} from '@mui/icons-material';
import healthService from '../services/healthService';
import styles from '../styles/PublicHealthPage.module.css';

interface HealthTopic {
    _id: string;
    title: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

const PublicHealthPage: React.FC = () => {
    const [healthTopics, setHealthTopics] = useState<HealthTopic[]>([]);
    const [expandedCards, setExpandedCards] = useState<{ [key: string]: boolean }>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchHealthTopics();
    }, []);

    const fetchHealthTopics = async () => {
        try {
            setLoading(true);
            const response = await healthService.getAllTopics();

            if (response.success && 'data' in response) {
                setHealthTopics(response.data.topics || []);
                setError(null);
            } else {
                const errorMessage = !response.success && 'error' in response ? response.error : 'Failed to fetch health topics';
                setError(errorMessage);
            }
        } catch (err) {
            setError('Failed to fetch health topics');
        } finally {
            setLoading(false);
        }
    };

    const handleExpandClick = (cardId: string) => {
        setExpandedCards(prev => ({
            ...prev,
            [cardId]: !prev[cardId]
        }));
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <Container maxWidth="lg" className={styles.container}>
            <Box className={styles.header}>
                <Typography variant="h3" component="h1" gutterBottom className={styles.headerTitle}>
                    Health Topics
                </Typography>
                <Typography variant="h6" className={styles.headerSubtitle}>
                    Explore our comprehensive health information resources
                </Typography>
            </Box>

            {loading && (
                <Box className={styles.loadingContainer}>
                    <CircularProgress size={50} />
                </Box>
            )}

            {error && (
                <Alert severity="error" className={styles.errorAlert}>
                    {error}
                </Alert>
            )}

            {!loading && !error && (
                <Grid container spacing={3} className={styles.topicsGrid}>
                    {healthTopics?.map((topic) => (
                        <Grid item xs={12} md={6} key={topic._id}>
                            <Card className={styles.topicCard}>
                                <CardContent className={styles.cardContent}>
                                    <Typography variant="h5" component="h2" gutterBottom className={styles.cardTitle}>
                                        {topic.title}
                                    </Typography>

                                    <Typography variant="body2" className={styles.publishDate}>
                                        Published: {formatDate(topic.createdAt)}
                                    </Typography>

                                    <Typography variant="body1" paragraph className={styles.description}>
                                        {expandedCards[topic._id]
                                            ? topic.description
                                            : `${topic?.description?.substring(0, 150)}...`}
                                    </Typography>

                                    <Button
                                        onClick={() => handleExpandClick(topic._id)}
                                        endIcon={expandedCards[topic._id] ? <ExpandLess /> : <ExpandMore />}
                                        className={styles.readMoreButton}
                                    >
                                        {expandedCards[topic._id] ? 'Read Less' : 'Read More'}
                                    </Button>
                                </CardContent>

                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {!loading && !error && healthTopics.length === 0 && (
                <Box className={styles.emptyState}>
                    <Typography variant="h6" className={styles.emptyStateText}>
                        No health topics available at the moment.
                    </Typography>
                </Box>
            )}
        </Container>
    );
};

export default PublicHealthPage; 