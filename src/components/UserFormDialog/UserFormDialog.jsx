import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box
} from '@mui/material';
import {
    Person as PersonIcon,
    Email as EmailIcon,
    Lock as LockIcon,
    Phone as PhoneIcon,
    LocationOn as LocationIcon,
    Cake as CakeIcon,
    School as SchoolIcon
} from '@mui/icons-material';
import { FormField } from '../../common/components';

const UserFormDialog = ({
    open,
    onClose,
    onSubmit,
    title,
    formData,
    onInputChange,
    loading,
    submitLabel,
    userType, // 'Student' or 'Instructor'
    isEdit = false
}) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit();
    };

    const renderStudentFields = () => (
        <>
            <FormField
                label="Address"
                fullWidth
                value={formData.address || ''}
                onChange={(e) => onInputChange('address', e.target.value)}
                disabled={loading}
                placeholder="e.g., Colombo, Sri Lanka"
                icon={<LocationIcon />}
            />
            <FormField
                label="Age"
                type="number"
                fullWidth
                value={formData.age || ''}
                onChange={(e) => onInputChange('age', e.target.value)}
                disabled={loading}
                icon={<CakeIcon />}
            />
        </>
    );

    const renderInstructorFields = () => (
        <FormField
            label="Qualification"
            fullWidth
            value={formData.qualification || ''}
            onChange={(e) => onInputChange('qualification', e.target.value)}
            disabled={loading}
            placeholder="e.g., BSc Software Engineering"
            icon={<SchoolIcon />}
        />
    );

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <form onSubmit={handleSubmit}>
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <FormField
                            label="Name"
                            fullWidth
                            value={formData.name || ''}
                            onChange={(e) => onInputChange('name', e.target.value)}
                            disabled={loading}
                            required
                            icon={<PersonIcon />}
                        />
                        <FormField
                            label="Email"
                            type="email"
                            fullWidth
                            value={formData.email || ''}
                            onChange={(e) => onInputChange('email', e.target.value)}
                            disabled={loading}
                            required
                            icon={<EmailIcon />}
                        />
                        <FormField
                            label="Password"
                            type="password"
                            fullWidth
                            value={formData.password || ''}
                            onChange={(e) => onInputChange('password', e.target.value)}
                            disabled={loading}
                            placeholder={isEdit ? "Enter new password" : ""}
                            required
                            icon={<LockIcon />}
                            showPassword={showPassword}
                            onTogglePassword={() => setShowPassword(!showPassword)}
                        />
                        <FormField
                            label="Contact Number"
                            type="number"
                            fullWidth
                            value={formData.contactNumber || ''}
                            onChange={(e) => onInputChange('contactNumber', e.target.value)}
                            disabled={loading}
                            required
                            icon={<PhoneIcon />}
                        />
                        {userType === 'Student' && renderStudentFields()}
                        {userType === 'Instructor' && renderInstructorFields()}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                    >
                        {loading ? `${isEdit ? 'Updating' : 'Adding'}...` : submitLabel}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default UserFormDialog;
