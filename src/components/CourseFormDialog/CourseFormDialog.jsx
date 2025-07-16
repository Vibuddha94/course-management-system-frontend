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
    CloudUpload as CloudUploadIcon,
    Undo as UndoIcon
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
    loading = false,
    onCourseCreated // New prop to handle course creation with pending files
}) => {
    const [formData, setFormData] = useState(initialData);
    const [errors, setErrors] = useState({});
    const [courseMaterials, setCourseMaterials] = useState([]);
    const [originalMaterials, setOriginalMaterials] = useState([]); // Store original state for rollback
    const [pendingDeletions, setPendingDeletions] = useState([]); // Track materials marked for deletion
    const [materialsLoading, setMaterialsLoading] = useState(false);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [pendingFiles, setPendingFiles] = useState([]); // For create mode - temporary file storage

    // Check if this is edit mode (has an id)
    const isEditMode = initialData && initialData.id;

    // Reset form data when dialog opens
    useEffect(() => {
        if (open) {
            setFormData(initialData);
            setErrors({});
            setPendingFiles([]); // Clear pending files when dialog opens
            setPendingDeletions([]); // Clear pending deletions when dialog opens
            // Fetch course materials if in edit mode
            if (isEditMode && initialData.id) {
                fetchCourseMaterials();
            } else {
                setCourseMaterials([]);
                setOriginalMaterials([]);
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
            const materials = response.data || [];
            setCourseMaterials(materials);
            setOriginalMaterials(materials); // Store original state for rollback
        } catch (error) {
            console.error('Error fetching course materials:', error);
            setCourseMaterials([]);
            setOriginalMaterials([]);
        } finally {
            setMaterialsLoading(false);
        }
    };

    const handleDeleteMaterial = (material) => {
        // Mark for deletion instead of immediate deletion
        setPendingDeletions(prev => [...prev, material.id]);
    };

    const handleRestoreMaterial = (materialId) => {
        // Remove from pending deletions (restore the material)
        setPendingDeletions(prev => prev.filter(id => id !== materialId));
    };

    const deletePendingMaterials = async () => {
        if (pendingDeletions.length === 0) return;

        try {
            // Delete all materials marked for deletion
            await Promise.all(
                pendingDeletions.map(materialId =>
                    apiService.delete(`/course-modules/${materialId}`)
                )
            );

            // Clear pending deletions after successful deletion
            setPendingDeletions([]);

        } catch (error) {
            console.error('Error deleting materials:', error);
            // You might want to show a toast notification here
        }
    };

    const handleAddMaterial = () => {
        // Create a file input element
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.multiple = true; // Allow multiple file selection
        fileInput.accept = '*/*'; // Accept all file types

        fileInput.onchange = async (event) => {
            const files = Array.from(event.target.files);
            if (files.length > 0) {
                // Both create and edit mode: store files temporarily
                handlePendingFiles(files);
            }
        };

        // Trigger file selection dialog
        fileInput.click();
    };

    const handlePendingFiles = (files) => {
        // Add files to pending list for create mode
        const newPendingFiles = files.map(file => ({
            file,
            id: Date.now() + Math.random(), // Temporary ID
            originalName: file.name,
            size: file.size,
            type: file.type
        }));

        setPendingFiles(prev => [...prev, ...newPendingFiles]);
    };

    const handleRemovePendingFile = (fileId) => {
        setPendingFiles(prev => prev.filter(file => file.id !== fileId));
    };

    const uploadPendingFiles = async (courseId) => {
        if (pendingFiles.length === 0) return;

        try {
            // Create FormData for multipart/form-data request
            const formData = new FormData();

            // Append all pending files to FormData with key 'files'
            pendingFiles.forEach(pendingFile => {
                formData.append('files', pendingFile.file);
            });

            // Upload files to the newly created course
            await apiService.post(`/course-modules/${courseId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Clear pending files after successful upload
            setPendingFiles([]);

        } catch (error) {
            console.error('Error uploading pending files:', error);
            // You might want to show a toast notification here
        }
    };

    const handleFileUpload = async (files) => {
        try {
            setUploadLoading(true);

            // Create FormData for multipart/form-data request
            const formData = new FormData();

            // Append all files to FormData with key 'files'
            files.forEach(file => {
                formData.append('files', file);
            });

            // Upload files to the course
            const response = await apiService.post(`/course-modules/${initialData.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Refresh course materials after successful upload
            await fetchCourseMaterials();

        } catch (error) {
            console.error('Error uploading files:', error);
            // You might want to show a toast notification here
        } finally {
            setUploadLoading(false);
        }
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

    const handleSubmit = async () => {
        if (validateForm()) {
            if (isEditMode) {
                // Edit mode: submit form data and handle pending files and deletions
                if (onCourseCreated && (pendingFiles.length > 0 || pendingDeletions.length > 0)) {
                    // Custom handler for edit mode with pending files or deletions
                    await onCourseCreated(formData, pendingFiles, pendingDeletions);
                } else {
                    // Standard submit without files or deletions
                    onSubmit(formData);
                }
            } else {
                // Create mode: submit form data and handle pending files
                if (onCourseCreated && pendingFiles.length > 0) {
                    // Custom handler for create mode with pending files
                    await onCourseCreated(formData, pendingFiles);
                } else {
                    // Standard submit without files
                    onSubmit(formData);
                }
            }
        }
    };

    const handleClose = () => {
        setFormData(initialData);
        setErrors({});
        // Restore original materials state (rollback any pending deletions)
        setCourseMaterials(originalMaterials);
        setPendingDeletions([]);
        setPendingFiles([]); // Clear pending files when dialog closes
        onClose();
    };

    // Material Card Component for Edit Mode
    const MaterialCard = ({ material }) => {
        const isPendingDeletion = pendingDeletions.includes(material.id);

        return (
            <Card
                elevation={2}
                sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.2s ease',
                    opacity: isPendingDeletion ? 0.5 : 1,
                    backgroundColor: isPendingDeletion ? 'error.light' : 'background.paper',
                    '&:hover': {
                        transform: isPendingDeletion ? 'none' : 'translateY(-2px)',
                        boxShadow: isPendingDeletion ? 2 : 4
                    }
                }}
            >
                <CardContent sx={{ flexGrow: 1, p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <FileIcon
                            color={isPendingDeletion ? "error" : "primary"}
                            fontSize="small"
                        />
                        <Typography
                            variant="body2"
                            fontWeight={600}
                            color={isPendingDeletion ? "error.main" : "text.primary"}
                            sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                textDecoration: isPendingDeletion ? 'line-through' : 'none'
                            }}
                            title={material.originalName} // Show full name on hover
                        >
                            {material.originalName || 'Material'}
                        </Typography>
                    </Box>
                    {isPendingDeletion ? (
                        <Typography
                            variant="caption"
                            color="error.main"
                            sx={{ fontWeight: 600 }}
                        >
                            Will be deleted when course is updated
                        </Typography>
                    ) : (
                        material.savedName && (
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
                        )
                    )}
                </CardContent>
                <CardActions sx={{ p: 1, pt: 0 }}>
                    {isPendingDeletion ? (
                        <Button
                            size="small"
                            startIcon={<UndoIcon />}
                            onClick={() => handleRestoreMaterial(material.id)}
                            color="primary"
                            sx={{ borderRadius: 1 }}
                        >
                            Restore
                        </Button>
                    ) : (
                        <Button
                            size="small"
                            startIcon={<DeleteIcon />}
                            onClick={() => handleDeleteMaterial(material)}
                            color="error"
                            sx={{ borderRadius: 1 }}
                        >
                            Delete
                        </Button>
                    )}
                </CardActions>
            </Card>
        );
    };

    // Pending File Card Component for Create Mode
    const PendingFileCard = ({ pendingFile }) => (
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
                },
                opacity: 0.8 // Slightly transparent to indicate pending state
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
                        title={pendingFile.originalName}
                    >
                        {pendingFile.originalName}
                    </Typography>
                </Box>
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
                    Size: {(pendingFile.size / 1024).toFixed(1)} KB • Pending upload
                </Typography>
            </CardContent>
            <CardActions sx={{ p: 1, pt: 0 }}>
                <Button
                    size="small"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleRemovePendingFile(pendingFile.id)}
                    color="error"
                    sx={{ borderRadius: 1 }}
                >
                    Remove
                </Button>
            </CardActions>
        </Card>
    );

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
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

                    {/* Course Materials Section - Show in both create and edit modes */}
                    <Paper elevation={1} sx={{ p: 3, borderRadius: 2, mt: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6" fontWeight={600}>
                                Course Materials {!isEditMode && '(will be uploaded after course creation)'}
                                {isEditMode && pendingFiles.length > 0 && '(new files will be uploaded after update)'}
                                {isEditMode && pendingDeletions.length > 0 && ` (${pendingDeletions.length} file${pendingDeletions.length > 1 ? 's' : ''} will be deleted after update)`}
                            </Typography>
                            <Fab
                                size="small"
                                color="primary"
                                onClick={handleAddMaterial}
                                disabled={uploadLoading}
                                sx={{ boxShadow: 2 }}
                            >
                                {uploadLoading ? (
                                    <CircularProgress size={20} color="inherit" />
                                ) : (
                                    <AddIcon />
                                )}
                            </Fab>
                        </Box>

                        {isEditMode ? (
                            // Edit Mode: Show existing materials and pending files
                            <>
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
                                ) : (
                                    <Grid container spacing={2}>
                                        {/* Existing materials */}
                                        {courseMaterials.map((material, index) => (
                                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={material.id || index}>
                                                <MaterialCard material={material} />
                                            </Grid>
                                        ))}
                                        {/* Pending files */}
                                        {pendingFiles.map((pendingFile) => (
                                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={pendingFile.id}>
                                                <PendingFileCard pendingFile={pendingFile} />
                                            </Grid>
                                        ))}
                                    </Grid>
                                )}
                                {!materialsLoading && courseMaterials.length === 0 && pendingFiles.length === 0 && (
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
                            </>
                        ) : (
                            // Create Mode: Show pending files
                            pendingFiles.length > 0 ? (
                                <Grid container spacing={2}>
                                    {pendingFiles.map((pendingFile) => (
                                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={pendingFile.id}>
                                            <PendingFileCard pendingFile={pendingFile} />
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
                                        No files selected
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" textAlign="center">
                                        Click the + button to select files for upload
                                    </Typography>
                                </Box>
                            )
                        )}
                    </Paper>
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
