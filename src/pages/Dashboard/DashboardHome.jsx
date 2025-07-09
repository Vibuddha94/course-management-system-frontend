import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Button,
    Chip
} from '@mui/material';
import {
    School as SchoolIcon,
    Group as GroupIcon,
    Person as PersonIcon
} from '@mui/icons-material';

function DashboardHome({ user }) {
    const navigate = useNavigate();
    const role = user?.role || 'Student';

    // Mock data for different user types
    const adminStats = {
        totalCourses: 15,
        totalStudents: 245,
        totalInstructors: 12,
        activeCourses: 13,
        pendingApprovals: 3
    };

    const studentStats = {
        enrolledCourses: 4,
        completedCourses: 2,
        currentGPA: 3.8,
        upcomingAssignments: 5,
        recentGrades: [
            { course: 'Introduction to React', grade: 'A', score: 95 },
            { course: 'Advanced JavaScript', grade: 'A-', score: 88 }
        ]
    };

    const instructorStats = {
        teachingCourses: 3,
        totalStudents: 87,
        averageRating: 4.7,
        pendingGrading: 12,
        upcomingClasses: [
            { course: 'React Fundamentals', time: '10:00 AM', date: 'Today' },
            { course: 'JavaScript Basics', time: '2:00 PM', date: 'Tomorrow' }
        ]
    };

    const handleQuickAction = (action) => {
        switch (action) {
            case 'addCourse':
                navigate('/dashboard/courses');
                break;
            case 'manageStudents':
                navigate('/dashboard/students');
                break;
            case 'manageInstructors':
                navigate('/dashboard/instructors');
                break;
            case 'viewCourses':
                navigate('/dashboard/courses');
                break;
            case 'viewProfile':
                navigate('/dashboard/profile');
                break;
            default:
                break;
        }
    };

    // Admin Dashboard
    if (role === 'ADMIN') {
        return (
            <Box sx={{ p: 3 }}>
                {/* Welcome Header */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" fontWeight={700} color="primary" gutterBottom>
                        Welcome back, Administrator!
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Here's an overview of your course management system
                    </Typography>
                </Box>

                {/* Stats Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={2.4}>
                        <Paper elevation={3} sx={{ p: 3, textAlign: 'center', bgcolor: 'primary.main', color: 'white' }}>
                            <SchoolIcon sx={{ fontSize: 40, mb: 1 }} />
                            <Typography variant="h4" fontWeight={700}>
                                {adminStats.totalCourses}
                            </Typography>
                            <Typography variant="body2">
                                Total Courses
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2.4}>
                        <Paper elevation={3} sx={{ p: 3, textAlign: 'center', bgcolor: 'secondary.main', color: 'white' }}>
                            <GroupIcon sx={{ fontSize: 40, mb: 1 }} />
                            <Typography variant="h4" fontWeight={700}>
                                {adminStats.totalStudents}
                            </Typography>
                            <Typography variant="body2">
                                Total Students
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2.4}>
                        <Paper elevation={3} sx={{ p: 3, textAlign: 'center', bgcolor: 'success.main', color: 'white' }}>
                            <PersonIcon sx={{ fontSize: 40, mb: 1 }} />
                            <Typography variant="h4" fontWeight={700}>
                                {adminStats.totalInstructors}
                            </Typography>
                            <Typography variant="body2">
                                Instructors
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2.4}>
                        <Paper elevation={3} sx={{ p: 3, textAlign: 'center', bgcolor: 'warning.main', color: 'white' }}>
                            <SchoolIcon sx={{ fontSize: 40, mb: 1 }} />
                            <Typography variant="h4" fontWeight={700}>
                                {adminStats.activeCourses}
                            </Typography>
                            <Typography variant="body2">
                                Active Courses
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2.4}>
                        <Paper elevation={3} sx={{ p: 3, textAlign: 'center', bgcolor: 'error.main', color: 'white' }}>
                            <PersonIcon sx={{ fontSize: 40, mb: 1 }} />
                            <Typography variant="h4" fontWeight={700}>
                                {adminStats.pendingApprovals}
                            </Typography>
                            <Typography variant="body2">
                                Pending Approvals
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>

                {/* Quick Actions */}
                <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                        Quick Actions
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={3}>
                            <Button
                                fullWidth
                                variant="contained"
                                startIcon={<SchoolIcon />}
                                onClick={() => handleQuickAction('addCourse')}
                                sx={{ py: 2, borderRadius: 2 }}
                            >
                                Add New Course
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Button
                                fullWidth
                                variant="outlined"
                                startIcon={<GroupIcon />}
                                onClick={() => handleQuickAction('manageStudents')}
                                sx={{ py: 2, borderRadius: 2 }}
                            >
                                Manage Students
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Button
                                fullWidth
                                variant="outlined"
                                startIcon={<PersonIcon />}
                                onClick={() => handleQuickAction('manageInstructors')}
                                sx={{ py: 2, borderRadius: 2 }}
                            >
                                Manage Instructors
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Button
                                fullWidth
                                variant="outlined"
                                startIcon={<PersonIcon />}
                                onClick={() => handleQuickAction('viewProfile')}
                                sx={{ py: 2, borderRadius: 2 }}
                            >
                                View Profile
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Recent Activity */}
                <Paper elevation={3} sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                        Recent Activity
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                            <SchoolIcon sx={{ mr: 2, color: 'primary.main' }} />
                            <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="body2" fontWeight={600}>
                                    New course "Advanced React" added
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    2 hours ago
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                            <GroupIcon sx={{ mr: 2, color: 'secondary.main' }} />
                            <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="body2" fontWeight={600}>
                                    5 new student registrations
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    4 hours ago
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                            <PersonIcon sx={{ mr: 2, color: 'success.main' }} />
                            <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="body2" fontWeight={600}>
                                    Instructor profile updated
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    1 day ago
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        );
    }

    // Student Dashboard
    if (role === 'Student') {
        return (
            <Box sx={{ p: 3 }}>
                {/* Welcome Header */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" fontWeight={700} color="primary" gutterBottom>
                        Welcome back, Student!
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Track your academic progress and manage your courses
                    </Typography>
                </Box>

                {/* Stats Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper elevation={3} sx={{ p: 3, textAlign: 'center', bgcolor: 'primary.main', color: 'white' }}>
                            <SchoolIcon sx={{ fontSize: 40, mb: 1 }} />
                            <Typography variant="h4" fontWeight={700}>
                                {studentStats.enrolledCourses}
                            </Typography>
                            <Typography variant="body2">
                                Enrolled Courses
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper elevation={3} sx={{ p: 3, textAlign: 'center', bgcolor: 'success.main', color: 'white' }}>
                            <SchoolIcon sx={{ fontSize: 40, mb: 1 }} />
                            <Typography variant="h4" fontWeight={700}>
                                {studentStats.completedCourses}
                            </Typography>
                            <Typography variant="body2">
                                Completed Courses
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper elevation={3} sx={{ p: 3, textAlign: 'center', bgcolor: 'warning.main', color: 'white' }}>
                            <PersonIcon sx={{ fontSize: 40, mb: 1 }} />
                            <Typography variant="h4" fontWeight={700}>
                                {studentStats.currentGPA}
                            </Typography>
                            <Typography variant="body2">
                                Current GPA
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper elevation={3} sx={{ p: 3, textAlign: 'center', bgcolor: 'error.main', color: 'white' }}>
                            <SchoolIcon sx={{ fontSize: 40, mb: 1 }} />
                            <Typography variant="h4" fontWeight={700}>
                                {studentStats.upcomingAssignments}
                            </Typography>
                            <Typography variant="body2">
                                Upcoming Assignments
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>

                <Grid container spacing={3}>
                    {/* Recent Grades */}
                    <Grid item xs={12} md={6}>
                        <Paper elevation={3} sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight={600} gutterBottom>
                                Recent Grades
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {studentStats.recentGrades.map((grade, index) => (
                                    <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                                        <Box>
                                            <Typography variant="body2" fontWeight={600}>
                                                {grade.course}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Score: {grade.score}%
                                            </Typography>
                                        </Box>
                                        <Chip
                                            label={grade.grade}
                                            color={grade.grade === 'A' ? 'success' : 'primary'}
                                            size="small"
                                        />
                                    </Box>
                                ))}
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Quick Actions */}
                    <Grid item xs={12} md={6}>
                        <Paper elevation={3} sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight={600} gutterBottom>
                                Quick Actions
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    startIcon={<SchoolIcon />}
                                    onClick={() => handleQuickAction('viewCourses')}
                                    sx={{ py: 2, borderRadius: 2 }}
                                >
                                    View My Courses
                                </Button>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    startIcon={<PersonIcon />}
                                    onClick={() => handleQuickAction('viewProfile')}
                                    sx={{ py: 2, borderRadius: 2 }}
                                >
                                    Update Profile
                                </Button>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        );
    }

    // Instructor Dashboard (fallback for any other role)
    return (
        <Box sx={{ p: 3 }}>
            {/* Welcome Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight={700} color="primary" gutterBottom>
                    Welcome back, Instructor!
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Manage your courses and track student progress
                </Typography>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper elevation={3} sx={{ p: 3, textAlign: 'center', bgcolor: 'primary.main', color: 'white' }}>
                        <SchoolIcon sx={{ fontSize: 40, mb: 1 }} />
                        <Typography variant="h4" fontWeight={700}>
                            {instructorStats.teachingCourses}
                        </Typography>
                        <Typography variant="body2">
                            Teaching Courses
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper elevation={3} sx={{ p: 3, textAlign: 'center', bgcolor: 'secondary.main', color: 'white' }}>
                        <GroupIcon sx={{ fontSize: 40, mb: 1 }} />
                        <Typography variant="h4" fontWeight={700}>
                            {instructorStats.totalStudents}
                        </Typography>
                        <Typography variant="body2">
                            Total Students
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper elevation={3} sx={{ p: 3, textAlign: 'center', bgcolor: 'success.main', color: 'white' }}>
                        <PersonIcon sx={{ fontSize: 40, mb: 1 }} />
                        <Typography variant="h4" fontWeight={700}>
                            {instructorStats.averageRating}
                        </Typography>
                        <Typography variant="body2">
                            Average Rating
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper elevation={3} sx={{ p: 3, textAlign: 'center', bgcolor: 'warning.main', color: 'white' }}>
                        <SchoolIcon sx={{ fontSize: 40, mb: 1 }} />
                        <Typography variant="h4" fontWeight={700}>
                            {instructorStats.pendingGrading}
                        </Typography>
                        <Typography variant="body2">
                            Pending Grading
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                {/* Upcoming Classes */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            Upcoming Classes
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {instructorStats.upcomingClasses.map((classInfo, index) => (
                                <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                                    <Box>
                                        <Typography variant="body2" fontWeight={600}>
                                            {classInfo.course}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {classInfo.date} at {classInfo.time}
                                        </Typography>
                                    </Box>
                                    <Chip
                                        label={classInfo.date === 'Today' ? 'Today' : 'Tomorrow'}
                                        color={classInfo.date === 'Today' ? 'error' : 'warning'}
                                        size="small"
                                    />
                                </Box>
                            ))}
                        </Box>
                    </Paper>
                </Grid>

                {/* Quick Actions */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            Quick Actions
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Button
                                fullWidth
                                variant="contained"
                                startIcon={<SchoolIcon />}
                                onClick={() => handleQuickAction('viewCourses')}
                                sx={{ py: 2, borderRadius: 2 }}
                            >
                                View My Courses
                            </Button>
                            <Button
                                fullWidth
                                variant="outlined"
                                startIcon={<PersonIcon />}
                                onClick={() => handleQuickAction('viewProfile')}
                                sx={{ py: 2, borderRadius: 2 }}
                            >
                                Update Profile
                            </Button>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}

DashboardHome.propTypes = {
    user: PropTypes.object,
};

export default DashboardHome; 