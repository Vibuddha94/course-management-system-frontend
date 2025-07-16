import React, { useState, useEffect } from 'react';
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
    IconButton,
    Card,
    CardContent,
    CardActions
} from '@mui/material';
import {
    Close as CloseIcon,
    School as SchoolIcon,
    Description as DescriptionIcon,
    CloudUpload as CloudUploadIcon,
    Download as DownloadIcon,
    InsertDriveFile as FileIcon
} from '@mui/icons-material';
import apiService from '../../service/AxiosOrder';

const CourseDetailsDialog = ({
    open,
    onClose,
    course,
    onEdit,
    onDelete,
    canEdit = false,
    canDelete = false
}) => {
    const [courseMaterials, setCourseMaterials] = useState([]);
    const [materialsLoading, setMaterialsLoading] = useState(false);

    // Fetch course materials when dialog opens
    useEffect(() => {
        if (open && course?.id) {
            fetchCourseMaterials();
        }
    }, [open, course?.id]);

    // Early return after hooks
    if (!course) return null;

    const fetchCourseMaterials = async () => {
        setMaterialsLoading(true);
        try {
            const response = await apiService.get(`/course-modules/get/all/${course.id}`);
            setCourseMaterials(response.data || []);
        } finally {
            setMaterialsLoading(false);
        }
    };

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
    }; const handleDownloadMaterial = async (material) => {
        const response = await apiService.get(`/course-modules/${material.id}`, {
            responseType: 'blob',
        });

        const blob = new Blob([response.data], {
            type: response.headers['content-type'] || 'application/octet-stream'
        });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = material.originalName || 'download';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };

    // Material Card Component
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
                    startIcon={<DownloadIcon />}
                    onClick={() => handleDownloadMaterial(material)}
                    sx={{ borderRadius: 1 }}
                >
                    Download
                </Button>
            </CardActions>
        </Card>
    );

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            slotProps={{
                paper: {
                    sx: { borderRadius: 2, minHeight: '500px' }
                }
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

                    {/* Course Materials */}
                    <Grid size={{ xs: 12 }}>
                        <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6" fontWeight={600}>
                                    Course Materials
                                </Typography>
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
