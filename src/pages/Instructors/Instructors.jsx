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

const mockInstructors = [
    {
        id: 1,
        name: 'John Smith',
        email: 'john.smith@university.edu',
        phone: '+1 (555) 123-4567',
        department: 'Computer Science',
        courses: 5,
        rating: 4.8,
        status: 'active',
        specialization: 'React, JavaScript'
    },
    {
        id: 2,
        name: 'Sarah Johnson',
        email: 'sarah.johnson@university.edu',
        phone: '+1 (555) 234-5678',
        department: 'Computer Science',
        courses: 3,
        rating: 4.9,
        status: 'active',
        specialization: 'Python, Data Science'
    },
    {
        id: 3,
        name: 'Mike Wilson',
        email: 'mike.wilson@university.edu',
        phone: '+1 (555) 345-6789',
        department: 'Design',
        courses: 2,
        rating: 4.7,
        status: 'inactive',
        specialization: 'UI/UX Design'
    }
];

function Instructors() {
    const handleAddInstructor = () => {
        console.log('Add new instructor');
    };

    const handleEditInstructor = (instructorId) => {
        console.log('Edit instructor:', instructorId);
    };

    const handleDeleteInstructor = (instructorId) => {
        console.log('Delete instructor:', instructorId);
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
                <Grid item xs={12} sm={6} md={3}>
                    <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                        <PersonIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                        <Typography variant="h4" fontWeight={700} color="primary">
                            {mockInstructors.length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Total Instructors
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                        <SchoolIcon sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
                        <Typography variant="h4" fontWeight={700} color="secondary.main">
                            {mockInstructors.reduce((sum, instructor) => sum + instructor.courses, 0)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Total Courses
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                        <StarIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                        <Typography variant="h4" fontWeight={700} color="success.main">
                            {mockInstructors.filter(instructor => instructor.status === 'active').length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Active Instructors
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                        <PersonIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                        <Typography variant="h4" fontWeight={700} color="warning.main">
                            {mockInstructors.filter(instructor => instructor.status === 'inactive').length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Inactive Instructors
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>

            {/* Instructors Table */}
            <Paper elevation={3} sx={{ overflow: 'hidden' }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'primary.main' }}>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Instructor</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Contact</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Department</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Courses</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Rating</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Status</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {mockInstructors.map((instructor) => (
                                <TableRow key={instructor.id} hover>
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
                                                    {instructor.specialization}
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
                                                    {instructor.phone}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {instructor.department}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight={600}>
                                            {instructor.courses}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <StarIcon sx={{ fontSize: 16, color: 'warning.main', mr: 0.5 }} />
                                            <Typography variant="body2" fontWeight={600}>
                                                {instructor.rating}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={instructor.status}
                                            color={instructor.status === 'active' ? 'success' : 'default'}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <Tooltip title="View Details">
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    onClick={() => handleViewInstructor(instructor.id)}
                                                >
                                                    <ViewIcon />
                                                </IconButton>
                                            </Tooltip>
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
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
}

export default Instructors; 