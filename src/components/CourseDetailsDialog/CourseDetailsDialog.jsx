import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Chip,
    Divider,
    Grid,
    Paper,
    IconButton
} from '@mui/material';
import {
    Close as CloseIcon,
    School as SchoolIcon,
    Description as DescriptionIcon,
    CloudUpload as CloudUploadIcon
} from '@mui/icons-material';

const CourseDetailsDialog = ({
    open,
    onClose,
    course,
    onEdit,
    onDelete,
    canEdit = false,
    canDelete = false
}) => {
    if (!course) return null;

    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'success';
            case 'draft':
                return 'default';
            case 'archived':
                return 'error';
            default:
                return 'default';
        }
    };

    const handleEdit = () => {
        onEdit?.(course.id);
        onClose();
    };

    const handleDelete = () => {
        onDelete?.(course.id);
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 2, minHeight: '500px' }
            }}
        >
            <DialogTitle sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                pb: 1
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <SchoolIcon color="primary" />
                    <Typography variant="h5" fontWeight={600}>
                        {course.title}
                    </Typography>
                    <Chip
                        label={course.status}
                        color={getStatusColor(course.status)}
                        size="small"
                    />
                </Box>
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ pt: 2 }}>
                <Grid container spacing={3}>
                    {/* Course Description */}
                    <Grid size={12}>
                        <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <DescriptionIcon color="primary" />
                                <Typography variant="h6" fontWeight={600}>
                                    Description
                                </Typography>
                            </Box>
                            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                                {course.description}
                            </Typography>
                        </Paper>
                    </Grid>

                    {/* Course Materials (Placeholder for future development) */}
                    <Grid size={{ xs: 12 }}>
                        <Paper elevation={1} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                            <Typography variant="h6" fontWeight={600} gutterBottom>
                                Course Materials
                            </Typography>
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
                                    Course materials will be available here
                                </Typography>
                                <Typography variant="caption" color="text.secondary" textAlign="center">
                                    Upload files, documents, videos, etc.
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Course Statistics (if available) */}
                    {(course.students || course.students === 0) && (
                        <Grid size={12}>
                            <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
                                <Typography variant="h6" fontWeight={600} gutterBottom>
                                    Course Statistics
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 4, mt: 2 }}>
                                    <Box sx={{ textAlign: 'center' }}>
                                        <Typography variant="h4" color="primary" fontWeight={600}>
                                            {course.students || 0}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Enrolled Students
                                        </Typography>
                                    </Box>
                                    <Divider orientation="vertical" flexItem />
                                    <Box sx={{ textAlign: 'center' }}>
                                        <Typography variant="h4" color="secondary" fontWeight={600}>
                                            {course.lessons || 0}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Lessons
                                        </Typography>
                                    </Box>
                                    <Divider orientation="vertical" flexItem />
                                    <Box sx={{ textAlign: 'center' }}>
                                        <Typography variant="h4" color="success.main" fontWeight={600}>
                                            {course.assignments || 0}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Assignments
                                        </Typography>
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>
                    )}
                </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 2 }}>
                <Button
                    onClick={onClose}
                    sx={{ borderRadius: 2 }}
                >
                    Close
                </Button>
                {canEdit && (
                    <Button
                        onClick={handleEdit}
                        variant="outlined"
                        color="secondary"
                        sx={{ borderRadius: 2 }}
                    >
                        Edit Course
                    </Button>
                )}
                {canDelete && (
                    <Button
                        onClick={handleDelete}
                        variant="outlined"
                        color="error"
                        sx={{ borderRadius: 2 }}
                    >
                        Delete Course
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default CourseDetailsDialog;
