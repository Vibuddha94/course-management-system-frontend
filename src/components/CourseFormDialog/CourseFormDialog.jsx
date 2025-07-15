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
    CircularProgress,
    Paper,
    Grid,
    Card,
    CardContent,
    CardActions,
    Fab,
    IconButton
} from '@mui/material';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    InsertDriveFile as FileIcon,
    CloudUpload as CloudUploadIcon
} from '@mui/icons-material';
import { FormField } from '../';
import apiService from '../../service/AxiosOrder';

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
    const [courseMaterials, setCourseMaterials] = useState([]);
    const [materialsLoading, setMaterialsLoading] = useState(false);

    // Check if this is edit mode (has an id)
    const isEditMode = initialData && initialData.id;

    // Reset form data when dialog opens
    useEffect(() => {
        if (open) {
            setFormData(initialData);
            setErrors({});
            // Fetch course materials if in edit mode
            if (isEditMode && initialData.id) {
                fetchCourseMaterials();
            } else {
                setCourseMaterials([]);
            }
        }
    }, [open]); // Remove initialData from dependency array

    // Update form data when initialData changes (for edit mode)
    useEffect(() => {
        if (initialData && initialData.name) {
            setFormData(initialData);
        }
    }, [initialData.name, initialData.description]); // Only depend on actual values

    const fetchCourseMaterials = async () => {
        try {
            setMaterialsLoading(true);
            const response = await apiService.get(`/course-modules/get/all/${initialData.id}`);
            setCourseMaterials(response.data || []);
        } catch (error) {
            console.error('Error fetching course materials:', error);
            setCourseMaterials([]);
        } finally {
            setMaterialsLoading(false);
        }
    };

    const handleDeleteMaterial = async (material) => {
        try {
            await apiService.delete(`/course-modules/${material.id}`);
            // Remove from local state
            setCourseMaterials(prev => prev.filter(m => m.id !== material.id));
        } catch (error) {
            console.error('Error deleting material:', error);
            // You might want to show a toast notification here
        }
    };

    const handleAddMaterial = () => {
        // TODO: Implement add material functionality
        console.log('Add material clicked');
    };

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
        setCourseMaterials([]);
        onClose();
    };

    // Material Card Component for Edit Mode
    const MaterialCard = ({ material }) => (
        <Card
            elevation={2}
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.2s ease',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 4
                }
            }}
        >
            <CardContent sx={{ flexGrow: 1, p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <FileIcon color="primary" fontSize="small" />
                    <Typography
                        variant="body2"
                        fontWeight={600}
                        sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}
                        title={material.originalName} // Show full name on hover
                    >
                        {material.originalName || 'Material'}
                    </Typography>
                </Box>
                {material.savedName && (
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                        }}
                    >
                        Saved as: {material.savedName}
                    </Typography>
                )}
            </CardContent>
            <CardActions sx={{ p: 1, pt: 0 }}>
                <Button
                    size="small"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDeleteMaterial(material)}
                    color="error"
                    sx={{ borderRadius: 1 }}
                >
                    Delete
                </Button>
            </CardActions>
        </Card>
    );

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth={isEditMode ? "md" : "sm"}
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

                    {/* Course Materials Section - Only show in edit mode */}
                    {isEditMode && (
                        <Paper elevation={1} sx={{ p: 3, borderRadius: 2, mt: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6" fontWeight={600}>
                                    Course Materials
                                </Typography>
                                <Fab
                                    size="small"
                                    color="primary"
                                    onClick={handleAddMaterial}
                                    sx={{ boxShadow: 2 }}
                                >
                                    <AddIcon />
                                </Fab>
                            </Box>

                            {materialsLoading ? (
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    minHeight: '120px'
                                }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Loading materials...
                                    </Typography>
                                </Box>
                            ) : courseMaterials.length > 0 ? (
                                <Grid container spacing={2}>
                                    {courseMaterials.map((material, index) => (
                                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={material.id || index}>
                                            <MaterialCard material={material} />
                                        </Grid>
                                    ))}
                                </Grid>
                            ) : (
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    minHeight: '120px',
                                    border: '2px dashed',
                                    borderColor: 'divider',
                                    borderRadius: 2,
                                    backgroundColor: 'grey.50'
                                }}>
                                    <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                                    <Typography variant="body2" color="text.secondary" textAlign="center">
                                        No course materials available
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" textAlign="center">
                                        Click the + button to add materials
                                    </Typography>
                                </Box>
                            )}
                        </Paper>
                    )}
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
