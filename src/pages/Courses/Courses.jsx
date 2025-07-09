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
    Fab
} from '@mui/material';
import {
    School as SchoolIcon,
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon,
    Assignment as AssignmentIcon,
    Group as GroupIcon,
    Schedule as ScheduleIcon
} from '@mui/icons-material';

const mockCourses = [
    {
        id: 1,
        title: 'Introduction to React',
        description: 'Learn the fundamentals of React development',
        instructor: 'John Smith',
        students: 45,
        duration: '8 weeks',
        status: 'active',
        category: 'Programming'
    },
    {
        id: 2,
        title: 'Advanced JavaScript',
        description: 'Deep dive into modern JavaScript concepts',
        instructor: 'Sarah Johnson',
        students: 32,
        duration: '10 weeks',
        status: 'active',
        category: 'Programming'
    },
    {
        id: 3,
        title: 'UI/UX Design Principles',
        description: 'Master the art of user interface design',
        instructor: 'Mike Wilson',
        students: 28,
        duration: '6 weeks',
        status: 'draft',
        category: 'Design'
    }
];

function Courses() {
    const handleAddCourse = () => {
        console.log('Add new course');
    };

    const handleEditCourse = (courseId) => {
        console.log('Edit course:', courseId);
    };

    const handleDeleteCourse = (courseId) => {
        console.log('Delete course:', courseId);
    };

    const handleViewCourse = (courseId) => {
        console.log('View course:', courseId);
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" fontWeight={700} color="primary" gutterBottom>
                        Courses
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Manage and view all available courses
                    </Typography>
                </Box>
                <Tooltip title="Add New Course">
                    <Fab
                        color="primary"
                        aria-label="add course"
                        onClick={handleAddCourse}
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
                        <SchoolIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                        <Typography variant="h4" fontWeight={700} color="primary">
                            {mockCourses.length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Total Courses
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                        <GroupIcon sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
                        <Typography variant="h4" fontWeight={700} color="secondary.main">
                            {mockCourses.reduce((sum, course) => sum + course.students, 0)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Total Students
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                        <AssignmentIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                        <Typography variant="h4" fontWeight={700} color="success.main">
                            {mockCourses.filter(course => course.status === 'active').length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Active Courses
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                        <ScheduleIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                        <Typography variant="h4" fontWeight={700} color="warning.main">
                            {mockCourses.filter(course => course.status === 'draft').length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Draft Courses
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>

            {/* Courses Grid */}
            <Grid container spacing={3}>
                {mockCourses.map((course) => (
                    <Grid item xs={12} sm={6} md={4} key={course.id}>
                        <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                    <Typography variant="h6" fontWeight={600} gutterBottom>
                                        {course.title}
                                    </Typography>
                                    <Chip
                                        label={course.status}
                                        color={course.status === 'active' ? 'success' : 'default'}
                                        size="small"
                                    />
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    {course.description}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <Avatar sx={{ width: 24, height: 24, mr: 1, fontSize: '0.75rem' }}>
                                        {course.instructor.split(' ').map(n => n[0]).join('')}
                                    </Avatar>
                                    <Typography variant="body2" color="text.secondary">
                                        {course.instructor}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="body2" color="text.secondary">
                                        {course.students} students
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {course.duration}
                                    </Typography>
                                </Box>
                                <Chip
                                    label={course.category}
                                    size="small"
                                    sx={{ mt: 1 }}
                                />
                            </CardContent>
                            <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                                <Box>
                                    <Tooltip title="View Course">
                                        <IconButton
                                            size="small"
                                            color="primary"
                                            onClick={() => handleViewCourse(course.id)}
                                        >
                                            <ViewIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Edit Course">
                                        <IconButton
                                            size="small"
                                            color="secondary"
                                            onClick={() => handleEditCourse(course.id)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete Course">
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => handleDeleteCourse(course.id)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                                <Button
                                    variant="contained"
                                    size="small"
                                    sx={{ borderRadius: 2 }}
                                >
                                    Enroll
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default Courses; 