import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Button,
    Avatar,
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
    Person as PersonIcon,
    Add as AddIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    School as SchoolIcon
} from '@mui/icons-material';
import { toast } from 'sonner';
import apiService from '../../service/AxiosOrder';
import TableRow from '../../components/TableRow/TableRow';
import UserFormDialog from '../../components/UserFormDialog/UserFormDialog';
import { StatsCard, PageHeader } from '../../components';

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

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <PageHeader
                title="Instructors"
                subtitle="Manage all instructors and their information"
                onAdd={handleAddInstructor}
                addTooltip="Add New Instructor"
            />

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid span={{ xs: 12, sm: 6, md: 6 }}>
                    <StatsCard
                        icon={PersonIcon}
                        value={instructors.length}
                        label="Total Instructors"
                        color="primary.main"
                    />
                </Grid>
                <Grid span={{ xs: 12, sm: 6, md: 6 }}>
                    <StatsCard
                        icon={SchoolIcon}
                        value={totalCourses}
                        label="Total Courses"
                        color="secondary.main"
                    />
                </Grid>
            </Grid>

            {/* Instructors Table */}
            <Paper elevation={3} sx={{ overflow: 'hidden' }}>
                <TableContainer sx={{ overflow: 'hidden' }}>
                    <Table>
                        <TableHead>
                            <MuiTableRow sx={{ bgcolor: 'primary.main' }}>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Instructor</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Contact</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Qualification</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Actions</TableCell>
                            </MuiTableRow>
                        </TableHead>
                        <TableBody>
                            {instructors.map((instructor) => (
                                <TableRow
                                    key={instructor.id}
                                    item={instructor}
                                    isDeleting={deletingInstructorId === instructor.id}
                                    onEdit={handleEditInstructor}
                                    onDelete={handleDeleteInstructor}
                                    onConfirmDelete={confirmDelete}
                                    onCancelDelete={cancelDelete}
                                    columnsCount={4}
                                    renderCells={(instructor) => (
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
                                        </>
                                    )}
                                />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Add Instructor Dialog */}
            <UserFormDialog
                open={openDialog}
                onClose={handleCloseDialog}
                onSubmit={handleSubmit}
                title="Add New Instructor"
                formData={formData}
                onInputChange={handleInputChange}
                loading={loading}
                submitLabel="Add Instructor"
                userType="Instructor"
                isEdit={false}
            />

            {/* Edit Instructor Dialog */}
            <UserFormDialog
                open={openEditDialog}
                onClose={handleCloseEditDialog}
                onSubmit={handleUpdateSubmit}
                title="Edit Instructor"
                formData={formData}
                onInputChange={handleInputChange}
                loading={loading}
                submitLabel="Update Instructor"
                userType="Instructor"
                isEdit={true}
            />
        </Box>
    );
}

export default Instructors; 