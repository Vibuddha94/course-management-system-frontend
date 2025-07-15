import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Typography,
    CircularProgress
} from '@mui/material';
import { FormField } from '../';

const CourseFormDialog = ({
    open,
    onClose,
    onSubmit,
    title = "Create New Course",
    initialData = { name: '', description: '' },
    submitLabel = "Create Course",
    loading = false
}) => {
    const [formData, setFormData] = useState(initialData);
    const [errors, setErrors] = useState({});

    // Reset form data when dialog opens
    useEffect(() => {
        if (open) {
            setFormData(initialData);
            setErrors({});
        }
    }, [open]); // Remove initialData from dependency array

    // Update form data when initialData changes (for edit mode)
    useEffect(() => {
        if (initialData && initialData.name) {
            setFormData(initialData);
        }
    }, [initialData.name, initialData.description]); // Only depend on actual values

    const handleChange = (field) => (event) => {
        const value = event.target.value;
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Course name is required';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Course description is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            onSubmit(formData);
        }
    };

    const handleClose = () => {
        setFormData(initialData);
        setErrors({});
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            disableEscapeKeyDown={loading}
            disableEnforceFocus={false}
            disableAutoFocus={false}
            disableRestoreFocus={true}
            PaperProps={{
                sx: { borderRadius: 2 }
            }}
        >
            <DialogTitle sx={{ fontWeight: 600 }}>
                {title}
            </DialogTitle>

            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
                    <FormField
                        label="Course Name"
                        value={formData.name}
                        onChange={handleChange('name')}
                        error={errors.name}
                        placeholder="Enter course name"
                        required
                    />

                    <FormField
                        label="Course Description"
                        value={formData.description}
                        onChange={handleChange('description')}
                        error={errors.description}
                        placeholder="Enter course description"
                        multiline
                        rows={4}
                        required
                    />
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 2 }}>
                <Button
                    onClick={handleClose}
                    disabled={loading}
                    sx={{ borderRadius: 2 }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={loading}
                    sx={{ borderRadius: 2, minWidth: 120 }}
                >
                    {loading ? (
                        <CircularProgress size={20} color="inherit" />
                    ) : (
                        submitLabel
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CourseFormDialog;
