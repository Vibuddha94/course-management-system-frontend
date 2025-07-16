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
    TableRow as MuiTableRow,
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
import TableRow from '../../components/TableRow/TableRow';
import UserFormDialog from '../../components/UserFormDialog/UserFormDialog';
import { StatsCard, PageHeader } from '../../components';

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
            const response = await apiService.get('/course');
            setTotalCourses(response.data.length || 0);
        };

        const fetchStudents = async () => {
            const response = await apiService.get('/user/getAll-by-role/Student');
            setStudents(response.data || []);
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

            const response = await apiService.get('/user/getAll-by-role/Student');
            setStudents(response.data || []);
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

            const response = await apiService.get('/user/getAll-by-role/Student');
            setStudents(response.data || []);
        } finally {
            setLoading(false);
        }
    };

    const handleEditStudent = async (studentId) => {
        if (document.activeElement && document.activeElement.blur) {
            document.activeElement.blur();
        }

        const response = await apiService.get(`/user/${studentId}`);
        const student = response.data;
        setEditingStudent(student);
        setFormData({
            name: student.name,
            email: student.email,
            password: '',
            contactNumber: student.contactNumber.toString(),
            address: student.student?.address || '',
            age: student.student?.age ? student.student.age.toString() : ''
        });
        setOpenEditDialog(true);
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

            const response = await apiService.get('/user/getAll-by-role/Student');
            setStudents(response.data || []);
        } catch (error) {
            console.error('Error deleting student:', error);
            setDeletingStudentId(null);
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
            <PageHeader
                title="Students"
                subtitle="Manage all students and their academic information"
                onAdd={handleAddStudent}
                addTooltip="Add New Student"
            />

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid span={{ xs: 12, sm: 6, md: 3 }}>
                    <StatsCard
                        icon={GroupIcon}
                        value={students.length}
                        label="Total Students"
                        color="primary.main"
                    />
                </Grid>
                <Grid span={{ xs: 12, sm: 6, md: 3 }}>
                    <StatsCard
                        icon={SchoolIcon}
                        value={totalCourses}
                        label="Available Courses"
                        color="secondary.main"
                    />
                </Grid>
                <Grid span={{ xs: 12, sm: 6, md: 3 }}>
                    <StatsCard
                        icon={GradeIcon}
                        value={students.filter(student => student.student?.age >= 18).length}
                        label="Adult Students"
                        color="success.main"
                    />
                </Grid>
                <Grid span={{ xs: 12, sm: 6, md: 3 }}>
                    <StatsCard
                        icon={GroupIcon}
                        value={students.filter(student => student.student?.age < 18).length}
                        label="Minor Students"
                        color="warning.main"
                    />
                </Grid>
            </Grid>

            {/* Students Table */}
            <Paper elevation={3} sx={{ overflow: 'hidden' }}>
                <TableContainer sx={{ overflow: 'hidden' }}>
                    <Table>
                        <TableHead>
                            <MuiTableRow sx={{ bgcolor: 'primary.main' }}>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Student</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Contact</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Address</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Age</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Actions</TableCell>
                            </MuiTableRow>
                        </TableHead>
                        <TableBody>
                            {students.map((student) => (
                                <TableRow
                                    key={student.id}
                                    item={student}
                                    isDeleting={deletingStudentId === student.id}
                                    onEdit={handleEditStudent}
                                    onDelete={handleDeleteStudent}
                                    onConfirmDelete={confirmDelete}
                                    onCancelDelete={cancelDelete}
                                    columnsCount={5}
                                    renderCells={(student) => (
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
                                        </>
                                    )}
                                />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Add Student Dialog */}
            <UserFormDialog
                open={openDialog}
                onClose={handleCloseDialog}
                onSubmit={handleSubmit}
                title="Add New Student"
                formData={formData}
                onInputChange={handleInputChange}
                loading={loading}
                submitLabel="Add Student"
                userType="Student"
                isEdit={false}
            />

            {/* Edit Student Dialog */}
            <UserFormDialog
                open={openEditDialog}
                onClose={handleCloseEditDialog}
                onSubmit={handleUpdateSubmit}
                title="Edit Student"
                formData={formData}
                onInputChange={handleInputChange}
                loading={loading}
                submitLabel="Update Student"
                userType="Student"
                isEdit={true}
            />
        </Box>
    );
}

export default Students; 