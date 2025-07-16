import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import { useNavigate, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LogoutIcon from '@mui/icons-material/Logout';
import apiService from '../../service/AxiosOrder';
import { getNavigation } from '../../common/navigation/routes';

const drawerWidth = 240;
const collapsedDrawerWidth = 64;


export default function Dashboard() {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

    let user = null;
    try {
        user = JSON.parse(localStorage.getItem('user'));
    } catch { }
    const role = user?.role || 'Student';



    const navigation = getNavigation(role);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleSidebarToggle = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    const handleLogout = () => {
        apiService.removeBearerToken();
        localStorage.removeItem('user');
        window.location.reload(); // Reload to clear user data
    };

    const handleNavigation = (path) => {
        navigate(path);
        if (isMobile) {
            setMobileOpen(false);
        }
    };

    const drawer = (
        <Box>
            <Toolbar sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                px: sidebarCollapsed ? 0 : 2
            }}>
                {!isMobile && (
                    <IconButton onClick={handleSidebarToggle}>
                        {sidebarCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                )}
            </Toolbar>
            <Divider />
            <List>
                {navigation.map((item) => (
                    <ListItem key={item.path} disablePadding>
                        <Tooltip
                            title={sidebarCollapsed ? item.title : ''}
                            placement="right"
                            disableHoverListener={!sidebarCollapsed}
                        >
                            <ListItemButton
                                onClick={() => handleNavigation(item.path)}
                                selected={location.pathname === item.path}
                                sx={{
                                    minHeight: 48,
                                    justifyContent: sidebarCollapsed ? 'center' : 'initial',
                                    px: sidebarCollapsed ? 2.5 : 3,
                                    '&.Mui-selected': {
                                        bgcolor: 'primary.main',
                                        color: 'white',
                                        '&:hover': {
                                            bgcolor: 'primary.dark',
                                        },
                                        '& .MuiListItemIcon-root': {
                                            color: 'white',
                                        },
                                    },
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: sidebarCollapsed ? 0 : 3,
                                        justifyContent: 'center',
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                {!sidebarCollapsed && <ListItemText primary={item.title} />}
                            </ListItemButton>
                        </Tooltip>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    const currentDrawerWidth = sidebarCollapsed ? collapsedDrawerWidth : drawerWidth;

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar
                position="fixed"
                sx={{
                    width: { md: `calc(100% - ${currentDrawerWidth}px)` },
                    ml: { md: `${currentDrawerWidth}px` },
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    transition: theme.transitions.create(['margin', 'width'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { md: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        Course Management
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>
                            {user?.name || 'User'}
                        </Typography>
                        <Tooltip title="Logout">
                            <IconButton color="inherit" onClick={handleLogout}>
                                <LogoutIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Toolbar>
            </AppBar>

            <Box
                component="nav"
                sx={{ width: { md: currentDrawerWidth }, flexShrink: { md: 0 } }}
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', md: 'block' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: currentDrawerWidth,
                            transition: theme.transitions.create('width', {
                                easing: theme.transitions.easing.sharp,
                                duration: theme.transitions.duration.enteringScreen,
                            }),
                        },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { md: `calc(100% - ${currentDrawerWidth}px)` },
                    mt: '64px',
                    transition: theme.transitions.create(['margin', 'width'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
                }}
            >
                <Routes>
                    <Route path="*" element={<Navigate to="/home" />} />
                    {navigation.map((item) => (
                        <Route key={item.path} path={item.path} element={item.element} />
                    ))}
                </Routes>
            </Box>
        </Box>
    );
} 