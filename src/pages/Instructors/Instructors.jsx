import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Card,
    CardContent,
    CardActions,
    Button,
    Chip,
    Avatar,
    IconButton,
    Tooltip,
    Fab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField
} from '@mui/material';
import {
    Person as PersonIcon,
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    School as SchoolIcon,
    Star as StarIcon
} from '@mui/icons-material';
import { toast } from 'sonner';
import apiService from '../../service/AxiosOrder';

const mockInstructors = [
    {
        id: 1,
        name: 'Sahan',
        email: 'sahan@gmail.com',
        role: 'Instructor',
        contactNumber: 9874563210,
        instructor: {
            id: 1,
            qualification: 'BSc Software Engineering'
        },
        student: null
    },
    {
        id: 2,
        name: 'Sarah Johnson',
        email: 'sarah.johnson@university.edu',
        role: 'Instructor',
        contactNumber: 1234567890,
        instructor: {
            id: 2,
            qualification: 'MSc Computer Science'
        },
        student: null
    },
    {
        id: 3,
        name: 'Mike Wilson',
        email: 'mike.wilson@university.edu',
        role: 'Instructor',
        contactNumber: 9876543210,
        instructor: {
            id: 3,
            qualification: 'PhD in Design'
        },
        student: null
    }
];

function Instructors() {
    const [totalCourses, setTotalCourses] = useState(0);
    const [instructors, setInstructors] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [editingInstructor, setEditingInstructor] = useState(null);
    const [deletingInstructorId, setDeletingInstructorId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        contactNumber: '',
        qualification: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await apiService.get('/course');
                setTotalCourses(response.data.length || 0);
            } catch (error) {
                console.error('Error fetching courses:', error);
                // Error will be handled globally by AxiosOrder
            }
        };

        const fetchInstructors = async () => {
            try {
                const response = await apiService.get('/user/getAll-by-role/Instructor');
                setInstructors(response.data || []);
            } catch (error) {
                console.error('Error fetching instructors:', error);
                // Error will be handled globally by AxiosOrder
            }
        };

        fetchCourses();
        fetchInstructors();
    }, []);

    const handleAddInstructor = () => {
        // Remove focus from the fab button to prevent aria-hidden accessibility warning
        if (document.activeElement && document.activeElement.blur) {
            document.activeElement.blur();
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setFormData({
            name: '',
            email: '',
            password: '',
            contactNumber: '',
            qualification: ''
        });
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
        setEditingInstructor(null);
        setFormData({
            name: '',
            email: '',
            password: '',
            contactNumber: '',
            qualification: ''
        });
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.email || !formData.password || !formData.contactNumber || !formData.qualification) {
            toast.error('Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: 'Instructor',
                contactNumber: Number(formData.contactNumber),
                instructor: {
                    qualification: formData.qualification
                },
                student: null
            };

            await apiService.post('/user', payload);
            toast.success('Instructor added successfully!');
            handleCloseDialog();

            // Refresh the instructors list
            const response = await apiService.get('/user/getAll-by-role/Instructor');
            setInstructors(response.data || []);
        } catch (error) {
            // Error will be handled globally by AxiosOrder
            console.error('Error adding instructor:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateSubmit = async () => {
        if (!formData.name || !formData.email || !formData.password || !formData.contactNumber || !formData.qualification) {
            toast.error('Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: 'Instructor',
                contactNumber: Number(formData.contactNumber),
                instructor: {
                    qualification: formData.qualification
                },
                student: null
            };

            await apiService.put(`/user/${editingInstructor.id}`, payload);
            toast.success('Instructor updated successfully!');
            handleCloseEditDialog();

            // Refresh the instructors list
            const response = await apiService.get('/user/getAll-by-role/Instructor');
            setInstructors(response.data || []);
        } catch (error) {
            // Error will be handled globally by AxiosOrder
            console.error('Error updating instructor:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditInstructor = async (instructorId) => {
        // Remove focus from the edit button to prevent aria-hidden accessibility warning
        if (document.activeElement && document.activeElement.blur) {
            document.activeElement.blur();
        }
        try {
            const response = await apiService.get(`/user/${instructorId}`);
            const instructor = response.data;
            setEditingInstructor(instructor);
            setFormData({
                name: instructor.name,
                email: instructor.email,
                password: '', // Don't pre-fill password for security
                contactNumber: instructor.contactNumber.toString(),
                qualification: instructor.instructor?.qualification || ''
            });
            setOpenEditDialog(true);
        } catch (error) {
            console.error('Error fetching instructor:', error);
            // Error will be handled globally by AxiosOrder
        }
    };

    const handleDeleteInstructor = (instructorId) => {
        // Remove focus from the delete button to prevent aria-hidden accessibility warning
        if (document.activeElement && document.activeElement.blur) {
            document.activeElement.blur();
        }
        setDeletingInstructorId(instructorId);
    };

    const confirmDelete = async (instructorId) => {
        try {
            await apiService.delete(`/user/${instructorId}`);
            toast.success('Instructor deleted successfully!');
            setDeletingInstructorId(null);

            // Refresh the instructors list
            const response = await apiService.get('/user/getAll-by-role/Instructor');
            setInstructors(response.data || []);
        } catch (error) {
            console.error('Error deleting instructor:', error);
            setDeletingInstructorId(null);
            // Error will be handled globally by AxiosOrder
        }
    };

    const cancelDelete = () => {
        setDeletingInstructorId(null);
    };

    const handleViewInstructor = (instructorId) => {
        console.log('View instructor:', instructorId);
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" fontWeight={700} color="primary" gutterBottom>
                        Instructors
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Manage all instructors and their information
                    </Typography>
                </Box>
                <Tooltip title="Add New Instructor">
                    <Fab
                        color="primary"
                        aria-label="add instructor"
                        onClick={handleAddInstructor}
                        sx={{ boxShadow: 3 }}
                    >
                        <AddIcon />
                    </Fab>
                </Tooltip>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid span={{ xs: 12, sm: 6, md: 6 }}>
                    <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                        <PersonIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                        <Typography variant="h4" fontWeight={700} color="primary">
                            {instructors.length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Total Instructors
                        </Typography>
                    </Paper>
                </Grid>
                <Grid span={{ xs: 12, sm: 6, md: 6 }}>
                    <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                        <SchoolIcon sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
                        <Typography variant="h4" fontWeight={700} color="secondary.main">
                            {totalCourses}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Total Courses
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>

            {/* Instructors Table */}
            <Paper elevation={3} sx={{ overflow: 'hidden' }}>
                <TableContainer sx={{ overflow: 'hidden' }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'primary.main' }}>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Instructor</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Contact</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Qualification</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {instructors.map((instructor) => (
                                <TableRow
                                    key={instructor.id}
                                    hover
                                    sx={{
                                        backgroundColor: deletingInstructorId === instructor.id
                                            ? 'rgba(220, 38, 38, 0.1)'
                                            : 'transparent',
                                        transition: 'background-color 0.3s ease',
                                        border: deletingInstructorId === instructor.id
                                            ? '2px solid rgba(220, 38, 38, 0.3)'
                                            : 'none',
                                        overflow: 'hidden'
                                    }}
                                >
                                    {deletingInstructorId === instructor.id ? (
                                        // Confirmation mode
                                        <TableCell colSpan={4} sx={{ overflow: 'hidden' }}>
                                            <Box sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                height: '57px',
                                                px: 2,
                                                overflow: 'hidden',
                                                animation: 'slideInFromRight 0.4s ease-out',
                                                '@keyframes slideInFromRight': {
                                                    '0%': {
                                                        transform: 'translateX(100%)',
                                                        opacity: 0
                                                    },
                                                    '100%': {
                                                        transform: 'translateX(0)',
                                                        opacity: 1
                                                    }
                                                }
                                            }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Avatar sx={{ bgcolor: 'error.main', width: 40, height: 40 }}>
                                                        <DeleteIcon sx={{ fontSize: 20 }} />
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="subtitle1" color="error.main" fontWeight={600}>
                                                            Delete {instructor.name}?
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            This action cannot be undone
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                    <Button
                                                        variant="outlined"
                                                        color="inherit"
                                                        size="small"
                                                        onClick={cancelDelete}
                                                        sx={{
                                                            borderRadius: 1,
                                                            px: 2,
                                                            fontWeight: 600
                                                        }}
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        color="error"
                                                        size="small"
                                                        onClick={() => confirmDelete(instructor.id)}
                                                        sx={{
                                                            borderRadius: 1,
                                                            px: 2,
                                                            fontWeight: 600,
                                                            boxShadow: 1
                                                        }}
                                                    >
                                                        Delete
                                                    </Button>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                    ) : (
                                        // Normal row mode
                                        <>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                                                        {instructor.name.split(' ').map(n => n[0]).join('')}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="subtitle1" fontWeight={600}>
                                                            {instructor.name}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {instructor.role}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                                        <EmailIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                                                        <Typography variant="body2">
                                                            {instructor.email}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <PhoneIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                                                        <Typography variant="body2">
                                                            {instructor.contactNumber}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" fontWeight={600}>
                                                    {instructor.instructor?.qualification || 'Not specified'}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                    <Tooltip title="Edit Instructor">
                                                        <IconButton
                                                            size="small"
                                                            color="secondary"
                                                            onClick={() => handleEditInstructor(instructor.id)}
                                                        >
                                                            <EditIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Delete Instructor">
                                                        <IconButton
                                                            size="small"
                                                            color="error"
                                                            onClick={() => handleDeleteInstructor(instructor.id)}
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            </TableCell>
                                        </>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Add Instructor Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>Add New Instructor</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <TextField
                            label="Name"
                            fullWidth
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            disabled={loading}
                        />
                        <TextField
                            label="Email"
                            type="email"
                            fullWidth
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            disabled={loading}
                        />
                        <TextField
                            label="Password"
                            type="password"
                            fullWidth
                            value={formData.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            disabled={loading}
                        />
                        <TextField
                            label="Contact Number"
                            type="number"
                            fullWidth
                            value={formData.contactNumber}
                            onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                            disabled={loading}
                        />
                        <TextField
                            label="Qualification"
                            fullWidth
                            value={formData.qualification}
                            onChange={(e) => handleInputChange('qualification', e.target.value)}
                            disabled={loading}
                            placeholder="e.g., BSc Software Engineering"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={loading}
                    >
                        {loading ? 'Adding...' : 'Add Instructor'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Instructor Dialog */}
            <Dialog open={openEditDialog} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
                <DialogTitle>Edit Instructor</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <TextField
                            label="Name"
                            fullWidth
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            disabled={loading}
                        />
                        <TextField
                            label="Email"
                            type="email"
                            fullWidth
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            disabled={loading}
                        />
                        <TextField
                            label="Password"
                            type="password"
                            fullWidth
                            value={formData.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            disabled={loading}
                            placeholder="Enter new password"
                        />
                        <TextField
                            label="Contact Number"
                            type="number"
                            fullWidth
                            value={formData.contactNumber}
                            onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                            disabled={loading}
                        />
                        <TextField
                            label="Qualification"
                            fullWidth
                            value={formData.qualification}
                            onChange={(e) => handleInputChange('qualification', e.target.value)}
                            disabled={loading}
                            placeholder="e.g., BSc Software Engineering"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEditDialog} disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleUpdateSubmit}
                        variant="contained"
                        disabled={loading}
                    >
                        {loading ? 'Updating...' : 'Update Instructor'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default Instructors; 