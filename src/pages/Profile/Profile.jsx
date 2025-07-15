import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Avatar,
    Button,
    Divider,
    Card,
    CardContent,
    IconButton,
    Tooltip,
    Chip,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress
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
    Work as WorkIcon,
    Lock as LockIcon
} from '@mui/icons-material';
import { toast } from 'sonner';
import apiService from '../../service/AxiosOrder';
import { FormField, LoadingSpinner } from '../../components';

function Profile() {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [profile, setProfile] = useState(null);
    const [originalProfile, setOriginalProfile] = useState(null);
    const [currentPassword, setCurrentPassword] = useState(''); // Store current password

    // Password change state
    const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [changingPassword, setChangingPassword] = useState(false);
    const [passwordError, setPasswordError] = useState(null);
    const dialogRef = useRef(null);

    // Get user ID from localStorage
    const getUserFromStorage = () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            return user;
        } catch (error) {
            console.error('Error parsing user from localStorage:', error);
            return null;
        }
    };

    // Fetch user profile from API
    const fetchUserProfile = async () => {
        const user = getUserFromStorage();
        if (!user?.id) {
            setError('User ID not found. Please login again.');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const response = await apiService.get(`/user/${user.id}`);
            const userData = response.data;

            // Transform API data to match our form structure
            const transformedProfile = {
                id: userData.id,
                name: userData.name,
                email: userData.email,
                contactNumber: userData.contactNumber,
                role: userData.role,
                // Student specific data
                address: userData.student?.address || '',
                age: userData.student?.age || '',
                // Instructor specific data
                qualification: userData.instructor?.qualification || '',
                // Additional fields for form
                department: userData.role === 'ADMIN' ? 'System Administration' :
                    userData.role === 'Instructor' ? 'Teaching Department' : 'Student Department',
                position: userData.role === 'ADMIN' ? 'System Administrator' :
                    userData.role === 'Instructor' ? 'Instructor' : 'Student',
                location: userData.student?.address || 'Not specified',
                bio: userData.role === 'Instructor' ?
                    `Qualified instructor with ${userData.instructor?.qualification}` :
                    userData.role === 'Student' ?
                        `Student aged ${userData.student?.age} from ${userData.student?.address}` :
                        'System administrator with full access to course management system.'
            };

            setProfile(transformedProfile);
            setOriginalProfile(transformedProfile);
            setCurrentPassword(userData.password || ''); // Store the current password
        } catch (error) {
            console.error('Error fetching user profile:', error);
            setError('Failed to load user profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Update user profile
    const updateUserProfile = async () => {
        const user = getUserFromStorage();
        if (!user?.id) {
            setError('User ID not found. Please login again.');
            return;
        }

        try {
            setSaving(true);
            setError(null);

            // Prepare update data based on user role
            const updateData = {
                id: profile.id,
                name: profile.name,
                email: profile.email,
                contactNumber: parseInt(profile.contactNumber) || 0,
                role: profile.role,
                password: currentPassword // Include the current password
            };

            // Add role-specific data
            if (profile.role === 'Student') {
                updateData.student = {
                    address: profile.address,
                    age: parseInt(profile.age) || 0
                };
                updateData.instructor = null;
            } else if (profile.role === 'Instructor') {
                updateData.instructor = {
                    qualification: profile.qualification
                };
                updateData.student = null;
            } else if (profile.role === 'ADMIN') {
                updateData.student = null;
                updateData.instructor = null;
            }

            const response = await apiService.put(`/user/${user.id}`, updateData);

            // Update localStorage with new user data
            const updatedUserData = { ...user, ...updateData };
            localStorage.setItem('user', JSON.stringify(updatedUserData));

            // Refresh profile data
            await fetchUserProfile();

            setIsEditing(false);
            toast.success('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating user profile:', error);
            setError('Failed to update profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const handleEdit = () => {
        setIsEditing(true);
        setError(null);
        setSuccess(null);
    };

    const handleSave = () => {
        updateUserProfile();
    };

    const handleCancel = () => {
        setProfile(originalProfile);
        setIsEditing(false);
        setError(null);
        setSuccess(null);
    };

    const handleInputChange = (field, value) => {
        setProfile(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Password change functions
    const handlePasswordChange = (field, value) => {
        setPasswordData(prev => ({
            ...prev,
            [field]: value
        }));
        setPasswordError(null);
    };

    const handleTogglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handleOpenPasswordDialog = () => {
        setPasswordDialogOpen(true);
        setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
        setShowPasswords({
            current: false,
            new: false,
            confirm: false
        });
        setPasswordError(null);
    };

    const handleClosePasswordDialog = () => {
        setPasswordDialogOpen(false);
        setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
        setPasswordError(null);
    };

    const handleChangePassword = async () => {
        // Validation
        if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
            setPasswordError('All fields are required');
            return;
        }

        if (passwordData.currentPassword !== currentPassword) {
            setPasswordError('Current password is incorrect');
            return;
        }

        if (passwordData.newPassword === currentPassword) {
            setPasswordError('New password cannot be the same as current password');
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError('New passwords do not match');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setPasswordError('New password must be at least 6 characters long');
            return;
        }

        try {
            setChangingPassword(true);
            setPasswordError(null);

            const user = getUserFromStorage();
            if (!user?.id) {
                setPasswordError('User ID not found. Please login again.');
                return;
            }

            // Call API to change password
            const response = await apiService.put(`/user/${user.id}`, {
                id: user.id,
                name: profile.name,
                email: profile.email,
                contactNumber: parseInt(profile.contactNumber) || 0,
                role: profile.role,
                password: passwordData.newPassword, // Send new password in password field
                currentPassword: passwordData.currentPassword, // Send current password for verification
                // Include role-specific data
                ...(profile.role === 'Student' && {
                    student: {
                        address: profile.address,
                        age: parseInt(profile.age) || 0
                    },
                    instructor: null
                }),
                ...(profile.role === 'Instructor' && {
                    instructor: {
                        qualification: profile.qualification
                    },
                    student: null
                }),
                ...(profile.role === 'ADMIN' && {
                    student: null,
                    instructor: null
                })
            });

            // Update localStorage with new user data
            const updatedUserData = { ...user, ...response.data };
            localStorage.setItem('user', JSON.stringify(updatedUserData));

            // Update the stored current password
            setCurrentPassword(passwordData.newPassword);

            // Close dialog and show success
            handleClosePasswordDialog();

            // Use Sonner toast for success notification
            toast.success('Password changed successfully!');

        } catch (error) {
            console.error('Error changing password:', error);
            setPasswordError(error.response?.data?.message || 'Failed to change password. Please try again.');
        } finally {
            setChangingPassword(false);
        }
    };

    if (loading) {
        return (
            <LoadingSpinner
                size={60}
                message="Loading profile..."
                showMessage={true}
                minHeight="400px"
            />
        );
    }

    if (error && !profile) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
                <Button variant="contained" onClick={fetchUserProfile}>
                    Retry
                </Button>
            </Box>
        );
    }

    if (!profile) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="warning">
                    No profile data available.
                </Alert>
            </Box>
        );
    }

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
                                startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                                onClick={handleSave}
                                disabled={saving}
                                sx={{ borderRadius: 2 }}
                            >
                                {saving ? 'Saving...' : 'Save'}
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<CancelIcon />}
                                onClick={handleCancel}
                                disabled={saving}
                                sx={{ borderRadius: 2 }}
                            >
                                Cancel
                            </Button>
                        </Box>
                    )}
                </Box>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {success && (
                <Alert severity="success" sx={{ mb: 3 }}>
                    {success}
                </Alert>
            )}

            <Box
                sx={{
                    display: { xs: 'block', md: 'flex' },
                    gap: 3,
                    alignItems: 'stretch',
                    width: '100%',
                }}
            >
                {/* Left column: Profile Card + Account Settings */}
                <Box
                    sx={{
                        flex: { md: 1 },
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3,
                        mb: { xs: 3, md: 0 },
                        minWidth: 0,
                    }}
                >
                    <Paper elevation={3} sx={{ p: 3, textAlign: 'center', mb: 3 }}>
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
                            color={profile.role === 'ADMIN' ? 'error' : profile.role === 'Instructor' ? 'warning' : 'primary'}
                            sx={{ mb: 2 }}
                        />
                    </Paper>
                    <Paper elevation={3} sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            Account Settings
                        </Typography>
                        <Divider sx={{ mb: 3 }} />

                        <Grid container spacing={3}>
                            <Grid span={{ xs: 12, sm: 6 }}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                                            Change Password
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                            Update your account password for security
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={handleOpenPasswordDialog}
                                            startIcon={<LockIcon />}
                                        >
                                            Change Password
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Paper>
                </Box>
                {/* Right column: Personal Information */}
                <Box
                    sx={{
                        flex: { md: 2 },
                        display: 'flex',
                        flexDirection: 'column',
                        minWidth: 0,
                    }}
                >
                    <Paper elevation={3} sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            Personal Information
                        </Typography>
                        <Divider sx={{ mb: 3 }} />

                        <Grid container spacing={3}>
                            <Grid span={{ xs: 12, sm: 6 }}>
                                <FormField
                                    name="name"
                                    label="Full Name"
                                    value={profile.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    disabled={!isEditing}
                                    startIcon={<PersonIcon />}
                                />
                            </Grid>
                            <Grid span={{ xs: 12, sm: 6 }}>
                                <FormField
                                    name="email"
                                    label="Email"
                                    type="email"
                                    value={profile.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    disabled={!isEditing}
                                    startIcon={<EmailIcon />}
                                />
                            </Grid>
                            <Grid span={{ xs: 12, sm: 6 }}>
                                <FormField
                                    name="contactNumber"
                                    label="Contact Number"
                                    value={profile.contactNumber}
                                    onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                                    disabled={!isEditing}
                                    startIcon={<PhoneIcon />}
                                />
                            </Grid>

                            {/* Role-specific fields */}
                            {profile.role === 'Student' && (
                                <>
                                    <Grid span={{ xs: 12, sm: 6 }}>
                                        <FormField
                                            name="age"
                                            label="Age"
                                            type="number"
                                            value={profile.age}
                                            onChange={(e) => handleInputChange('age', e.target.value)}
                                            disabled={!isEditing}
                                            startIcon={<PersonIcon />}
                                        />
                                    </Grid>
                                    <Grid span={{ xs: 12, sm: 6 }}>
                                        <FormField
                                            name="address"
                                            label="Address"
                                            value={profile.address}
                                            onChange={(e) => handleInputChange('address', e.target.value)}
                                            disabled={!isEditing}
                                            startIcon={<LocationIcon />}
                                        />
                                    </Grid>
                                </>
                            )}

                            {profile.role === 'Instructor' && (
                                <Grid span={{ xs: 12, sm: 6 }}>
                                    <FormField
                                        name="qualification"
                                        label="Qualification"
                                        value={profile.qualification}
                                        onChange={(e) => handleInputChange('qualification', e.target.value)}
                                        disabled={!isEditing}
                                        startIcon={<SchoolIcon />}
                                    />
                                </Grid>
                            )}
                        </Grid>
                    </Paper>
                </Box>
            </Box>

            {/* Password Change Dialog */}
            <Dialog
                ref={dialogRef}
                open={passwordDialogOpen}
                onClose={handleClosePasswordDialog}
                maxWidth="sm"
                fullWidth
                disableRestoreFocus
                keepMounted={false}
                aria-labelledby="password-dialog-title"
                aria-describedby="password-dialog-description"
                TransitionProps={{
                    onEntered: () => {
                        // Focus the first input when dialog opens
                        const firstInput = dialogRef.current?.querySelector('input');
                        if (firstInput) {
                            firstInput.focus();
                        }
                    }
                }}
            >
                <DialogTitle id="password-dialog-title">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LockIcon color="primary" />
                        <Typography variant="h6" fontWeight={600}>
                            Change Password
                        </Typography>
                    </Box>
                </DialogTitle>
                <DialogContent id="password-dialog-description">
                    {passwordError && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {passwordError}
                        </Alert>
                    )}

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <FormField
                            fullWidth
                            label="Current Password"
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                            required
                            error={passwordData.currentPassword !== '' && passwordData.currentPassword !== currentPassword}
                            helperText={passwordData.currentPassword !== '' && passwordData.currentPassword !== currentPassword ? 'Current password is incorrect' : ''}
                            color={passwordData.currentPassword && passwordData.currentPassword === currentPassword ? 'success' : passwordData.currentPassword && passwordData.currentPassword !== currentPassword ? 'error' : 'primary'}
                            showPassword={showPasswords.current}
                            onTogglePassword={() => handleTogglePasswordVisibility('current')}
                            icon={<LockIcon />}
                        />

                        <FormField
                            fullWidth
                            label="New Password"
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                            required
                            error={passwordData.newPassword !== '' && passwordData.newPassword === currentPassword}
                            helperText={passwordData.newPassword !== '' && passwordData.newPassword === currentPassword ? 'New password cannot be the same as current password' : ''}
                            color={passwordData.newPassword && passwordData.newPassword !== currentPassword && passwordData.newPassword.length >= 6 ? 'success' : passwordData.newPassword && (passwordData.newPassword === currentPassword || passwordData.newPassword.length < 6) ? 'error' : 'primary'}
                            showPassword={showPasswords.new}
                            onTogglePassword={() => handleTogglePasswordVisibility('new')}
                            icon={<LockIcon />}
                        />

                        <FormField
                            fullWidth
                            label="Confirm New Password"
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                            color={passwordData.confirmPassword && passwordData.newPassword === passwordData.confirmPassword ? 'success' : passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword ? 'error' : 'primary'}
                            showPassword={showPasswords.confirm}
                            onTogglePassword={() => handleTogglePasswordVisibility('confirm')}
                            icon={<LockIcon />}
                        />

                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Password must be at least 6 characters long
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button
                        onClick={handleClosePasswordDialog}
                        disabled={changingPassword}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleChangePassword}
                        disabled={changingPassword}
                        startIcon={changingPassword ? <CircularProgress size={20} /> : <SaveIcon />}
                    >
                        {changingPassword ? 'Changing Password...' : 'Change Password'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default Profile; 