import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
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
    Group as GroupIcon,
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    School as SchoolIcon,
    Grade as GradeIcon
} from '@mui/icons-material';
import { toast } from 'sonner';
import apiService from '../../service/AxiosOrder';

function Students() {
    const [totalCourses, setTotalCourses] = useState(0);
    const [students, setStudents] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [deletingStudentId, setDeletingStudentId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        contactNumber: '',
        address: '',
        age: ''
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

        const fetchStudents = async () => {
            try {
                const response = await apiService.get('/user/getAll-by-role/Student');
                setStudents(response.data || []);
            } catch (error) {
                console.error('Error fetching students:', error);
                // Error will be handled globally by AxiosOrder
            }
        };

        fetchCourses();
        fetchStudents();
    }, []);

    const handleAddStudent = () => {
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
            address: '',
            age: ''
        });
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
        setEditingStudent(null);
        setFormData({
            name: '',
            email: '',
            password: '',
            contactNumber: '',
            address: '',
            age: ''
        });
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.email || !formData.password || !formData.contactNumber || !formData.address || !formData.age) {
            toast.error('Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: 'Student',
                contactNumber: Number(formData.contactNumber),
                instructor: null,
                student: {
                    address: formData.address,
                    age: Number(formData.age)
                }
            };

            await apiService.post('/user', payload);
            toast.success('Student added successfully!');
            handleCloseDialog();

            // Refresh the students list
            const response = await apiService.get('/user/getAll-by-role/Student');
            setStudents(response.data || []);
        } catch (error) {
            // Error will be handled globally by AxiosOrder
            console.error('Error adding student:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateSubmit = async () => {
        if (!formData.name || !formData.email || !formData.password || !formData.contactNumber || !formData.address || !formData.age) {
            toast.error('Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: 'Student',
                contactNumber: Number(formData.contactNumber),
                instructor: null,
                student: {
                    address: formData.address,
                    age: Number(formData.age)
                }
            };

            await apiService.put(`/user/${editingStudent.id}`, payload);
            toast.success('Student updated successfully!');
            handleCloseEditDialog();

            // Refresh the students list
            const response = await apiService.get('/user/getAll-by-role/Student');
            setStudents(response.data || []);
        } catch (error) {
            // Error will be handled globally by AxiosOrder
            console.error('Error updating student:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditStudent = async (studentId) => {
        // Remove focus from the edit button to prevent aria-hidden accessibility warning
        if (document.activeElement && document.activeElement.blur) {
            document.activeElement.blur();
        }
        try {
            const response = await apiService.get(`/user/${studentId}`);
            const student = response.data;
            setEditingStudent(student);
            setFormData({
                name: student.name,
                email: student.email,
                password: '', // Don't pre-fill password for security
                contactNumber: student.contactNumber.toString(),
                address: student.student?.address || '',
                age: student.student?.age ? student.student.age.toString() : ''
            });
            setOpenEditDialog(true);
        } catch (error) {
            console.error('Error fetching student:', error);
            // Error will be handled globally by AxiosOrder
        }
    };

    const handleDeleteStudent = (studentId) => {
        // Remove focus from the delete button to prevent aria-hidden accessibility warning
        if (document.activeElement && document.activeElement.blur) {
            document.activeElement.blur();
        }
        setDeletingStudentId(studentId);
    };

    const confirmDelete = async (studentId) => {
        try {
            await apiService.delete(`/user/${studentId}`);
            toast.success('Student deleted successfully!');
            setDeletingStudentId(null);

            // Refresh the students list
            const response = await apiService.get('/user/getAll-by-role/Student');
            setStudents(response.data || []);
        } catch (error) {
            console.error('Error deleting student:', error);
            setDeletingStudentId(null);
            // Error will be handled globally by AxiosOrder
        }
    };

    const cancelDelete = () => {
        setDeletingStudentId(null);
    };

    const handleViewStudent = (studentId) => {
        console.log('View student:', studentId);
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" fontWeight={700} color="primary" gutterBottom>
                        Students
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Manage all students and their academic information
                    </Typography>
                </Box>
                <Tooltip title="Add New Student">
                    <Fab
                        color="primary"
                        aria-label="add student"
                        onClick={handleAddStudent}
                        sx={{ boxShadow: 3 }}
                    >
                        <AddIcon />
                    </Fab>
                </Tooltip>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid span={{ xs: 12, sm: 6, md: 3 }}>
                    <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                        <GroupIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                        <Typography variant="h4" fontWeight={700} color="primary">
                            {students.length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Total Students
                        </Typography>
                    </Paper>
                </Grid>
                <Grid span={{ xs: 12, sm: 6, md: 3 }}>
                    <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                        <SchoolIcon sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
                        <Typography variant="h4" fontWeight={700} color="secondary.main">
                            {totalCourses}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Available Courses
                        </Typography>
                    </Paper>
                </Grid>
                <Grid span={{ xs: 12, sm: 6, md: 3 }}>
                    <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                        <GradeIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                        <Typography variant="h4" fontWeight={700} color="success.main">
                            {students.filter(student => student.student?.age >= 18).length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Adult Students
                        </Typography>
                    </Paper>
                </Grid>
                <Grid span={{ xs: 12, sm: 6, md: 3 }}>
                    <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                        <GroupIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                        <Typography variant="h4" fontWeight={700} color="warning.main">
                            {students.filter(student => student.student?.age < 18).length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Minor Students
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>

            {/* Students Table */}
            <Paper elevation={3} sx={{ overflow: 'hidden' }}>
                <TableContainer sx={{ overflow: 'hidden' }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'primary.main' }}>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Student</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Contact</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Address</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Age</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {students.map((student) => (
                                <TableRow
                                    key={student.id}
                                    hover
                                    sx={{
                                        backgroundColor: deletingStudentId === student.id
                                            ? 'rgba(220, 38, 38, 0.1)'
                                            : 'transparent',
                                        transition: 'background-color 0.3s ease',
                                        border: deletingStudentId === student.id
                                            ? '2px solid rgba(220, 38, 38, 0.3)'
                                            : 'none',
                                        overflow: 'hidden'
                                    }}
                                >
                                    {deletingStudentId === student.id ? (
                                        // Confirmation mode
                                        <TableCell colSpan={5} sx={{ overflow: 'hidden' }}>
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
                                                            Delete {student.name}?
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
                                                        onClick={() => confirmDelete(student.id)}
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
                                                    <Avatar sx={{ mr: 2, bgcolor: 'secondary.main' }}>
                                                        {student.name.split(' ').map(n => n[0]).join('')}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="subtitle1" fontWeight={600}>
                                                            {student.name}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {student.role}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                                        <EmailIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                                                        <Typography variant="body2">
                                                            {student.email}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <PhoneIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                                                        <Typography variant="body2">
                                                            {student.contactNumber}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" fontWeight={600}>
                                                    {student.student?.address || 'Not specified'}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={student.student?.age || 'N/A'}
                                                    size="small"
                                                    color={student.student?.age >= 18 ? 'success' : 'warning'}
                                                    variant="outlined"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                    <Tooltip title="Edit Student">
                                                        <IconButton
                                                            size="small"
                                                            color="secondary"
                                                            onClick={() => handleEditStudent(student.id)}
                                                        >
                                                            <EditIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Delete Student">
                                                        <IconButton
                                                            size="small"
                                                            color="error"
                                                            onClick={() => handleDeleteStudent(student.id)}
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

            {/* Add Student Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>Add New Student</DialogTitle>
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
                            label="Address"
                            fullWidth
                            value={formData.address}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            disabled={loading}
                            placeholder="e.g., Colombo, Sri Lanka"
                        />
                        <TextField
                            label="Age"
                            type="number"
                            fullWidth
                            value={formData.age}
                            onChange={(e) => handleInputChange('age', e.target.value)}
                            disabled={loading}
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
                        {loading ? 'Adding...' : 'Add Student'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Student Dialog */}
            <Dialog open={openEditDialog} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
                <DialogTitle>Edit Student</DialogTitle>
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
                            label="Address"
                            fullWidth
                            value={formData.address}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            disabled={loading}
                            placeholder="e.g., Colombo, Sri Lanka"
                        />
                        <TextField
                            label="Age"
                            type="number"
                            fullWidth
                            value={formData.age}
                            onChange={(e) => handleInputChange('age', e.target.value)}
                            disabled={loading}
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
                        {loading ? 'Updating...' : 'Update Student'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default Students; 