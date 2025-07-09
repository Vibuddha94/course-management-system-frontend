import React from 'react';
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
    TableRow
} from '@mui/material';
import {
    Group as GroupIcon,
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    School as SchoolIcon,
    Grade as GradeIcon
} from '@mui/icons-material';

const mockStudents = [
    {
        id: 1,
        name: 'Alice Johnson',
        email: 'alice.johnson@student.edu',
        phone: '+1 (555) 111-2222',
        major: 'Computer Science',
        enrolledCourses: 4,
        gpa: 3.8,
        status: 'active',
        year: 'Junior'
    },
    {
        id: 2,
        name: 'Bob Smith',
        email: 'bob.smith@student.edu',
        phone: '+1 (555) 222-3333',
        major: 'Computer Science',
        enrolledCourses: 3,
        gpa: 3.5,
        status: 'active',
        year: 'Senior'
    },
    {
        id: 3,
        name: 'Carol Davis',
        email: 'carol.davis@student.edu',
        phone: '+1 (555) 333-4444',
        major: 'Design',
        enrolledCourses: 2,
        gpa: 3.9,
        status: 'inactive',
        year: 'Sophomore'
    }
];

function Students() {
    const handleAddStudent = () => {
        console.log('Add new student');
    };

    const handleEditStudent = (studentId) => {
        console.log('Edit student:', studentId);
    };

    const handleDeleteStudent = (studentId) => {
        console.log('Delete student:', studentId);
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
                            {mockStudents.length}
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
                            {mockStudents.reduce((sum, student) => sum + student.enrolledCourses, 0)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Total Enrollments
                        </Typography>
                    </Paper>
                </Grid>
                <Grid span={{ xs: 12, sm: 6, md: 3 }}>
                    <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                        <GradeIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                        <Typography variant="h4" fontWeight={700} color="success.main">
                            {mockStudents.filter(student => student.status === 'active').length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Active Students
                        </Typography>
                    </Paper>
                </Grid>
                <Grid span={{ xs: 12, sm: 6, md: 3 }}>
                    <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                        <GroupIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                        <Typography variant="h4" fontWeight={700} color="warning.main">
                            {mockStudents.filter(student => student.status === 'inactive').length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Inactive Students
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>

            {/* Students Table */}
            <Paper elevation={3} sx={{ overflow: 'hidden' }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'primary.main' }}>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Student</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Contact</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Major</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Year</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Courses</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>GPA</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Status</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {mockStudents.map((student) => (
                                <TableRow key={student.id} hover>
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
                                                    ID: {student.id}
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
                                                    {student.phone}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {student.major}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={student.year}
                                            size="small"
                                            color="primary"
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight={600}>
                                            {student.enrolledCourses}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight={600} color="success.main">
                                            {student.gpa}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={student.status}
                                            color={student.status === 'active' ? 'success' : 'default'}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <Tooltip title="View Details">
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    onClick={() => handleViewStudent(student.id)}
                                                >
                                                    <ViewIcon />
                                                </IconButton>
                                            </Tooltip>
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
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
}

export default Students; 