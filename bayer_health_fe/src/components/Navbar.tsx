import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    IconButton,
    Menu,
    MenuItem,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
    const { user, logout } = useAuth();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();

    const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
        handleMobileMenuClose();
    };

    const menuItems = [
        { label: 'Home', path: '/' },
        ...(user ? [{ label: 'Dashboard', path: '/dashboard' }] : []),
        { label: 'Health Topics', path: '/health-topics' },
        ...(user ? [{ label: 'Appointments', path: '/appointments' }] : []),
        { label: 'Services', path: '/services' },
        { label: 'Contact', path: '/contact' },
    ];

    const renderDesktopNav = () => (
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>

            {menuItems.map((item) => (
                <Button
                    key={item.label}
                    component={Link}
                    to={item.path}
                    sx={{ color: 'white', textTransform: 'none' }}
                >
                    {item.label}
                </Button>
            ))}
            {user ? (
                <Button
                    onClick={handleLogout}
                    sx={{ color: 'white', textTransform: 'none' }}
                >
                    Logout
                </Button>
            ) : (
                <Button
                    component={Link}
                    to="/login"
                    variant="outlined"
                    sx={{
                        color: 'white',
                        borderColor: 'white',
                        textTransform: 'none',
                        '&:hover': {
                            borderColor: 'white',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)'
                        }
                    }}
                >
                    Login
                </Button>
            )}
        </Box>
    );

    const renderMobileNav = () => (
        <>
            <IconButton
                sx={{ display: { xs: 'flex', md: 'none' }, color: 'white' }}
                onClick={handleMobileMenuOpen}
            >
                <MenuIcon />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMobileMenuClose}
                sx={{ display: { xs: 'block', md: 'none' } }}
            >
                {menuItems.map((item) => (
                    <MenuItem
                        key={item.label}
                        component={Link}
                        to={item.path}
                        onClick={handleMobileMenuClose}
                    >
                        {item.label}
                    </MenuItem>
                ))}
                {user ? (
                    <MenuItem onClick={handleLogout}>
                        Logout
                    </MenuItem>
                ) : (
                    <MenuItem component={Link} to="/login" onClick={handleMobileMenuClose}>
                        Login
                    </MenuItem>
                )}
            </Menu>
        </>
    );

    return (
        <AppBar position="sticky">
            <Toolbar>
                <Typography
                    variant="h6"
                    component={Link}
                    to="/"
                    sx={{
                        flexGrow: 1,
                        textDecoration: 'none',
                        color: 'inherit',
                        fontWeight: 'bold'
                    }}
                >
                    Bayer Healthcare
                </Typography>

                {renderDesktopNav()}
                {renderMobileNav()}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar; 