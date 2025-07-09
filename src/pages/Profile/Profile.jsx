import React, { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Avatar,
    TextField,
    Button,
    Divider,
    Card,
    CardContent,
    IconButton,
    Tooltip,
    Chip
} from '@mui/material';
import {
    Person as PersonIcon,
    Edit as EditIcon,
    Save as SaveIcon,
    Cancel as CancelIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    LocationOn as LocationIcon,
    School as SchoolIcon,
    Work as WorkIcon
} from '@mui/icons-material';

const mockUserProfile = {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    role: 'ADMIN',
    department: 'Computer Science',
    position: 'System Administrator',
    location: 'New York, NY',
    bio: 'Experienced system administrator with expertise in course management systems and educational technology.',
    avatar: null
};

function Profile() {
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState(mockUserProfile);
    const [originalProfile] = useState(mockUserProfile);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        setIsEditing(false);
        console.log('Profile saved:', profile);
    };

    const handleCancel = () => {
        setProfile(originalProfile);
        setIsEditing(false);
    };

    const handleInputChange = (field, value) => {
        setProfile(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" fontWeight={700} color="primary" gutterBottom>
                        Profile
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Manage your personal information and account settings
                    </Typography>
                </Box>
                <Box>
                    {!isEditing ? (
                        <Button
                            variant="contained"
                            startIcon={<EditIcon />}
                            onClick={handleEdit}
                            sx={{ borderRadius: 2 }}
                        >
                            Edit Profile
                        </Button>
                    ) : (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                                variant="contained"
                                color="success"
                                startIcon={<SaveIcon />}
                                onClick={handleSave}
                                sx={{ borderRadius: 2 }}
                            >
                                Save
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<CancelIcon />}
                                onClick={handleCancel}
                                sx={{ borderRadius: 2 }}
                            >
                                Cancel
                            </Button>
                        </Box>
                    )}
                </Box>
            </Box>

            <Grid container spacing={3}>
                {/* Profile Card */}
                <Grid item xs={12} md={4}>
                    <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
                        <Box sx={{ position: 'relative', display: 'inline-block', mb: 3 }}>
                            <Avatar
                                sx={{
                                    width: 120,
                                    height: 120,
                                    fontSize: '3rem',
                                    bgcolor: 'primary.main',
                                    mb: 2
                                }}
                            >
                                {profile.name.split(' ').map(n => n[0]).join('')}
                            </Avatar>
                            {isEditing && (
                                <Tooltip title="Change Avatar">
                                    <IconButton
                                        sx={{
                                            position: 'absolute',
                                            bottom: 0,
                                            right: 0,
                                            bgcolor: 'primary.main',
                                            color: 'white',
                                            '&:hover': { bgcolor: 'primary.dark' }
                                        }}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                </Tooltip>
                            )}
                        </Box>
                        <Typography variant="h5" fontWeight={600} gutterBottom>
                            {profile.name}
                        </Typography>
                        <Chip
                            label={profile.role}
                            color="primary"
                            sx={{ mb: 2 }}
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {profile.position}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {profile.department}
                        </Typography>
                    </Paper>
                </Grid>

                {/* Profile Details */}
                <Grid item xs={12} md={8}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            Personal Information
                        </Typography>
                        <Divider sx={{ mb: 3 }} />

                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Full Name"
                                    value={profile.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    disabled={!isEditing}
                                    InputProps={{
                                        startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    type="email"
                                    value={profile.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    disabled={!isEditing}
                                    InputProps={{
                                        startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Phone"
                                    value={profile.phone}
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                    disabled={!isEditing}
                                    InputProps={{
                                        startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Location"
                                    value={profile.location}
                                    onChange={(e) => handleInputChange('location', e.target.value)}
                                    disabled={!isEditing}
                                    InputProps={{
                                        startAdornment: <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Department"
                                    value={profile.department}
                                    onChange={(e) => handleInputChange('department', e.target.value)}
                                    disabled={!isEditing}
                                    InputProps={{
                                        startAdornment: <SchoolIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Position"
                                    value={profile.position}
                                    onChange={(e) => handleInputChange('position', e.target.value)}
                                    disabled={!isEditing}
                                    InputProps={{
                                        startAdornment: <WorkIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Bio"
                                    multiline
                                    rows={4}
                                    value={profile.bio}
                                    onChange={(e) => handleInputChange('bio', e.target.value)}
                                    disabled={!isEditing}
                                />
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                {/* Account Settings */}
                <Grid item xs={12}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            Account Settings
                        </Typography>
                        <Divider sx={{ mb: 3 }} />

                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                                            Change Password
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                            Update your account password for security
                                        </Typography>
                                        <Button variant="outlined" size="small">
                                            Change Password
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                                            Notification Settings
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                            Manage your email and notification preferences
                                        </Typography>
                                        <Button variant="outlined" size="small">
                                            Configure Notifications
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}

export default Profile; 