import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Link, Stack, Avatar, Fade, Grow } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import apiService from '../../service/AxiosOrder';

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [address, setAddress] = useState('');
    const [age, setAge] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                name,
                email,
                password,
                role: 'Student',
                contactNumber: contactNumber ? Number(contactNumber) : undefined,
                student: {
                    address,
                    age: age ? Number(age) : undefined,
                },
            };
            await apiService.post('/user', payload);
            // Optionally show a success message here
            navigate('/login');
        } catch (error) {
            // Error handled globally
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
                    <Paper elevation={8} sx={{ p: 3, width: '100%', maxWidth: 380, borderRadius: 4, boxShadow: 8, backdropFilter: 'blur(2px)' }}>
                        <Stack spacing={2} alignItems="center" width="100%">
                            <Avatar sx={{ bgcolor: 'secondary.main', width: 64, height: 64 }}>
                                <PersonAddAlt1Icon fontSize="large" />
                            </Avatar>
                            <Typography variant="h4" align="center" fontWeight={700} color="secondary.main" letterSpacing={1}>
                                Student Registration
                            </Typography>
                            <Box component="form" noValidate autoComplete="off" width="100%" onSubmit={handleSubmit}>
                                <TextField
                                    label="Name"
                                    fullWidth
                                    margin="dense"
                                    required
                                    variant="outlined"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    disabled={loading}
                                    sx={{ transition: 'box-shadow 0.3s', boxShadow: 1, borderRadius: 2, bgcolor: 'white' }}
                                />
                                <TextField
                                    label="Email"
                                    type="email"
                                    fullWidth
                                    margin="dense"
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
                                    margin="dense"
                                    required
                                    variant="outlined"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    disabled={loading}
                                    sx={{ transition: 'box-shadow 0.3s', boxShadow: 1, borderRadius: 2, bgcolor: 'white' }}
                                />
                                <TextField
                                    label="Contact Number"
                                    type="tel"
                                    fullWidth
                                    margin="dense"
                                    required
                                    variant="outlined"
                                    value={contactNumber}
                                    onChange={e => setContactNumber(e.target.value)}
                                    disabled={loading}
                                    sx={{ transition: 'box-shadow 0.3s', boxShadow: 1, borderRadius: 2, bgcolor: 'white' }}
                                />
                                <TextField
                                    label="Address"
                                    fullWidth
                                    margin="dense"
                                    required
                                    variant="outlined"
                                    value={address}
                                    onChange={e => setAddress(e.target.value)}
                                    disabled={loading}
                                    sx={{ transition: 'box-shadow 0.3s', boxShadow: 1, borderRadius: 2, bgcolor: 'white' }}
                                />
                                <TextField
                                    label="Age"
                                    type="number"
                                    fullWidth
                                    margin="dense"
                                    required
                                    variant="outlined"
                                    value={age}
                                    onChange={e => setAge(e.target.value)}
                                    disabled={loading}
                                    sx={{ transition: 'box-shadow 0.3s', boxShadow: 1, borderRadius: 2, bgcolor: 'white' }}
                                />
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    fullWidth
                                    size="large"
                                    sx={{ mt: 2, borderRadius: 2, fontWeight: 600, letterSpacing: 1, boxShadow: 3, py: 1, fontSize: 18, transition: 'background 0.3s' }}
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? 'Registering...' : 'Register'}
                                </Button>
                            </Box>
                            <Typography align="center" variant="body2" color="text.secondary">
                                Already have an account?{' '}
                                <Link component={RouterLink} to="/login" underline="hover" color="primary" fontWeight={600}>
                                    Login
                                </Link>
                            </Typography>
                        </Stack>
                    </Paper>
                </Fade>
            </Grow>
        </Box>
    );
}

export default Register; 