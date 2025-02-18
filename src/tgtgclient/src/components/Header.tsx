﻿import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { store } from '../redux/store';
import { authSelectors, authThunks } from '../redux/auth';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { ApiClient } from '../apiClient/ApiClient';
import { useSelector } from 'react-redux';
import AdbIcon from '@mui/icons-material/Adb';
import { CircularProgress } from '@mui/material';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const pages = ['Profile', 'Shops', 'Subscriptions'];

function ResponsiveAppBar() {
    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const logout = () => {
        store.dispatch(authThunks.logout())
    }

    const api = ApiClient.getNoAuthInstance();
    const login = async (response: CredentialResponse) => {
        await api.userGoogleCreate({ token: response.credential })
            .then((response) => response.json())
            .then((data) => {
                store.dispatch(authThunks.login(data.token))
                setIsLoggingIn((false));
            });
    };

    const isLoggedIn = useSelector(authSelectors.selectIsAuthenticated);
    const tokenPayload = useSelector(authSelectors.selectTokenPayload);

    return (
        <AppBar position="static" sx={{ backgroundColor: '#057267' }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}>
                        LOGO
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit">

                        <MenuIcon />

                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}>
                            {pages.map((page) => (
                                <MenuItem key={page} onClick={handleCloseNavMenu}>
                                    <Typography textAlign="center">{page}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="#app-bar-with-responsive-menu"
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}>
                        <Link to='/'>
                            LOGO
                        </Link>
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => (
                            <Button
                                key={page}
                                onClick={handleCloseNavMenu}
                                sx={{ my: 2, color: 'white', display: 'block' }}>
                                <NavLink to={page}>
                                    {page}
                                </NavLink>
                            </Button>
                        ))}
                    </Box>

                    {isLoggingIn ? <CircularProgress color="info" /> : <></>} 
                    <Box sx={{ flexGrow: 0 }}>
                    {isLoggedIn ?
                        (
                            <>
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, pb: 0 }}>
                                    {tokenPayload?.firstName} &nbsp;
                                    <Tooltip title="Open settings">
                                        <Avatar src={tokenPayload?.picture} />
                                    </Tooltip>
                                </IconButton>
                                <Menu
                                    sx={{ mt: '45px' }}
                                    id="menu-appbar"
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}>

                                    <MenuItem key='Profile' onClick={handleCloseUserMenu}>
                                            <Typography textAlign="center" component="a" href="/profile">Profile</Typography>
                                    </MenuItem>
                                    <MenuItem key='Shops' onClick={handleCloseUserMenu}>
                                        <Typography textAlign="center" component="a" href="#stores">Stores</Typography>
                                    </MenuItem>
                                        <MenuItem key='Subscriptions' onClick={handleCloseUserMenu}>
                                        <Typography textAlign="center" component="a" href="/subscriptions">Subscriptions</Typography>
                                    </MenuItem>
                                        <MenuItem key='Logout' onClick={() => { handleCloseUserMenu(); logout(); }}>
                                        <Typography textAlign="center">Logout</Typography>
                                    </MenuItem>
                                </Menu>
                            </>
                        ) :
                        (
                            <>
                                <GoogleLogin
                                    click_listener={() => { setIsLoggingIn(true) }}
                                    onSuccess={login} />
                            </>
                        )
                    }

                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
export default ResponsiveAppBar;