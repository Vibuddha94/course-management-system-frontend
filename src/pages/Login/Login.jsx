import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Link, Stack, Avatar, Fade, Grow } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import apiService from '../../service/AxiosOrder';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await apiService.post('/auth/login', { email, password });
            const { token, role, ...otherUserData } = response.data;
            apiService.setBearerToken(token);
            // Store complete user info including role and any other data
            const userData = { role, ...otherUserData };
            localStorage.setItem('user', JSON.stringify(userData));
            window.location.reload(); // Reload to apply new token and user data
        } catch (error) {
            // Error is handled globally by AxiosOrder
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            minHeight="100vh"
            display="flex"
            alignItems="center"
            justifyContent="center"
            sx={{
                background: 'linear-gradient(135deg, #e3f0ff 0%, #b6e0fe 50%, #e0c3fc 100%)',
                transition: 'background 0.5s',
            }}
        >
            <Grow in timeout={600}>
                <Fade in timeout={800}>
                    <Paper elevation={8} sx={{ p: 5, width: '100%', maxWidth: 380, borderRadius: 4, boxShadow: 8, backdropFilter: 'blur(2px)' }}>
                        <Stack spacing={3} alignItems="center" width="100%">
                            <Avatar sx={{ bgcolor: 'primary.main', width: 64, height: 64 }}>
                                <LockOutlinedIcon fontSize="large" />
                            </Avatar>
                            <Typography variant="h4" align="center" fontWeight={700} color="primary.main" letterSpacing={1}>
                                Sign In
                            </Typography>
                            <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit} width="100%">
                                <TextField
                                    label="Email"
                                    type="email"
                                    fullWidth
                                    margin="normal"
                                    required
                                    variant="outlined"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    disabled={loading}
                                    sx={{ transition: 'box-shadow 0.3s', boxShadow: 1, borderRadius: 2, bgcolor: 'white' }}
                                />
                                <TextField
                                    label="Password"
                                    type="password"
                                    fullWidth
                                    margin="normal"
                                    required
                                    variant="outlined"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    disabled={loading}
                                    sx={{ transition: 'box-shadow 0.3s', boxShadow: 1, borderRadius: 2, bgcolor: 'white' }}
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    size="large"
                                    sx={{ mt: 2, borderRadius: 2, fontWeight: 600, letterSpacing: 1, boxShadow: 3, py: 1.5, fontSize: 18, transition: 'background 0.3s' }}
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? 'Logging in...' : 'Login'}
                                </Button>
                            </Box>
                            <Typography align="center" variant="body2" color="text.secondary">
                                Don't have an account?{' '}
                                <Link component={RouterLink} to="/register" underline="hover" color="secondary" fontWeight={600}>
                                    Register as Student
                                </Link>
                            </Typography>
                        </Stack>
                    </Paper>
                </Fade>
            </Grow>
        </Box>
    );
}

export default Login; 