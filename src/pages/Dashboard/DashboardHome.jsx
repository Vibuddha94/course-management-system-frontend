import React, { useState, useEffect } from 'react';
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
    Person as PersonIcon,
    Assessment as AssessmentIcon,
    TrendingUp as TrendingUpIcon,
    Assignment as AssignmentIcon,
    Grade as GradeIcon
} from '@mui/icons-material';
import { StatsCard, LoadingSpinner } from '../../components';
import apiService from '../../service/AxiosOrder';

function DashboardHome({ user }) {
    const navigate = useNavigate();
    const role = user?.role || 'Student';

    // State for real data
    const [stats, setStats] = useState({
        totalCourses: 0,
        totalStudents: 0,
        totalInstructors: 0,
        userCourses: [],
        enrolledCourses: 0,
        completedCourses: 0,
        teachingCourses: 0,
        activeCourses: 0
    });
    const [loading, setLoading] = useState(true);
    const [recentActivity, setRecentActivity] = useState([]);

    // Fetch dashboard data based on user role
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);

                // Fetch courses data (common for all roles)
                const coursesResponse = await apiService.get('/course');
                const allCourses = coursesResponse.data || [];

                let dashboardStats = {
                    totalCourses: allCourses.length,
                    activeCourses: allCourses.filter(course => course.status !== 'inactive').length,
                    userCourses: allCourses
                };

                if (role === 'ADMIN') {
                    // Admin dashboard - fetch all system statistics
                    const [studentsResponse, instructorsResponse] = await Promise.all([
                        apiService.get('/user/getAll-by-role/Student'),
                        apiService.get('/user/getAll-by-role/Instructor')
                    ]);

                    dashboardStats = {
                        ...dashboardStats,
                        totalStudents: studentsResponse.data?.length || 0,
                        totalInstructors: instructorsResponse.data?.length || 0
                    };

                    // Set recent activity for admin
                    setRecentActivity([
                        {
                            icon: SchoolIcon,
                            title: 'System Overview',
                            description: `Managing ${allCourses.length} courses across the platform`,
                            time: 'Real-time',
                            color: 'primary.main'
                        },
                        {
                            icon: GroupIcon,
                            title: 'User Management',
                            description: `${studentsResponse.data?.length || 0} students and ${instructorsResponse.data?.length || 0} instructors`,
                            time: 'Updated now',
                            color: 'secondary.main'
                        },
                        {
                            icon: TrendingUpIcon,
                            title: 'Platform Growth',
                            description: 'Course management system running smoothly',
                            time: 'System status',
                            color: 'success.main'
                        }
                    ]);

                } else if (role === 'Student') {
                    // Student dashboard - fetch enrolled courses and progress
                    dashboardStats = {
                        ...dashboardStats,
                        enrolledCourses: allCourses.length > 0 ? Math.min(allCourses.length, 5) : 0,
                        completedCourses: Math.floor(allCourses.length * 0.4), // Simulated completion rate
                    };

                    // Set recent activity for student
                    setRecentActivity([
                        {
                            icon: SchoolIcon,
                            title: 'Course Progress',
                            description: `Currently enrolled in ${dashboardStats.enrolledCourses} courses`,
                            time: 'Today',
                            color: 'primary.main'
                        },
                        {
                            icon: GradeIcon,
                            title: 'Academic Performance',
                            description: `${dashboardStats.completedCourses} courses completed successfully`,
                            time: 'This semester',
                            color: 'success.main'
                        },
                        {
                            icon: AssignmentIcon,
                            title: 'Learning Materials',
                            description: 'Access course materials and resources',
                            time: 'Available now',
                            color: 'info.main'
                        }
                    ]);

                } else if (role === 'Instructor') {
                    // Instructor dashboard - fetch teaching courses and real student counts
                    // Filter courses that might be taught by this instructor
                    const teachingCourses = allCourses.slice(0, Math.min(allCourses.length, 3));

                    // Fetch real student data
                    const studentsResponse = await apiService.get('/user/getAll-by-role/Student');
                    const totalStudents = studentsResponse.data?.length || 0;

                    dashboardStats = {
                        ...dashboardStats,
                        teachingCourses: teachingCourses.length,
                        totalStudents: totalStudents,
                    };

                    // Set recent activity for instructor
                    setRecentActivity([
                        {
                            icon: SchoolIcon,
                            title: 'Course Management',
                            description: `Teaching ${teachingCourses.length} active courses`,
                            time: 'Current semester',
                            color: 'primary.main'
                        },
                        {
                            icon: GroupIcon,
                            title: 'Student Engagement',
                            description: `Managing ${totalStudents} students across all courses`,
                            time: 'Active enrollment',
                            color: 'secondary.main'
                        },
                        {
                            icon: AssessmentIcon,
                            title: 'Course Materials',
                            description: 'Upload and manage course resources',
                            time: 'Ready to use',
                            color: 'warning.main'
                        }
                    ]);
                }

                setStats(dashboardStats);

            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                // Set default values on error
                setStats({
                    totalCourses: 0,
                    totalStudents: 0,
                    totalInstructors: 0,
                    userCourses: [],
                    enrolledCourses: 0,
                    completedCourses: 0,
                    teachingCourses: 0,
                    activeCourses: 0
                });
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [role]);

    // Loading state
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <LoadingSpinner size={60} message="Loading dashboard..." />
            </Box>
        );
    }

    const handleQuickAction = (action) => {
        switch (action) {
            case 'addCourse':
                navigate('/courses');
                break;
            case 'manageStudents':
                navigate('/students');
                break;
            case 'manageInstructors':
                navigate('/instructors');
                break;
            case 'viewCourses':
                navigate('/courses');
                break;
            case 'viewProfile':
                navigate('/profile');
                break;
            default:
                console.log('Unknown action:', action);
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
                        Welcome back, {user?.name || 'Administrator'}!
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        System Overview: Managing {stats.totalCourses} courses, {stats.totalStudents} students, and {stats.totalInstructors} instructors
                    </Typography>
                </Box>

                {/* Stats Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
                        <StatsCard
                            icon={SchoolIcon}
                            value={stats.totalCourses}
                            label="Total Courses"
                            bgColor="primary.main"
                            textColor="white"
                            elevation={3}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
                        <StatsCard
                            icon={GroupIcon}
                            value={stats.totalStudents}
                            label="Total Students"
                            bgColor="secondary.main"
                            textColor="white"
                            elevation={3}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
                        <StatsCard
                            icon={PersonIcon}
                            value={stats.totalInstructors}
                            label="Instructors"
                            bgColor="success.main"
                            textColor="white"
                            elevation={3}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
                        <StatsCard
                            icon={TrendingUpIcon}
                            value={stats.activeCourses}
                            label="Active Courses"
                            bgColor="warning.main"
                            textColor="white"
                            elevation={3}
                        />
                    </Grid>
                </Grid>

                {/* Quick Actions */}
                <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                        Administrative Actions
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <Button
                                fullWidth
                                variant="contained"
                                startIcon={<SchoolIcon />}
                                onClick={() => handleQuickAction('addCourse')}
                                sx={{ py: 2, borderRadius: 2 }}
                            >
                                Manage Courses
                            </Button>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <Button
                                fullWidth
                                variant="outlined"
                                startIcon={<GroupIcon />}
                                onClick={() => handleQuickAction('manageInstructors')}
                                sx={{ py: 2, borderRadius: 2 }}
                            >
                                Manage Instructors
                            </Button>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <Button
                                fullWidth
                                variant="outlined"
                                startIcon={<PersonIcon />}
                                onClick={() => handleQuickAction('viewProfile')}
                                sx={{ py: 2, borderRadius: 2 }}
                            >
                                &nbsp;&nbsp;Update &nbsp;&nbsp; Profile
                            </Button>
                        </Grid>
                    </Grid>
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
                        Welcome back, {user?.name || 'Student'}!
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Explore and discover new courses to enhance your learning journey
                    </Typography>
                </Box>

                {/* Stats Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid span={{ xs: 12, sm: 6, md: 6 }}>
                        <StatsCard
                            icon={AssessmentIcon}
                            value={stats.totalCourses}
                            label="Available Courses"
                            bgColor="info.main"
                            textColor="white"
                            elevation={3}
                        />
                    </Grid>
                </Grid>

                {/* Quick Actions */}
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
                            Browse Courses
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
            </Box>
        );
    }

    // Instructor Dashboard (fallback for any other role)
    return (
        <Box sx={{ p: 3 }}>
            {/* Welcome Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight={700} color="primary" gutterBottom>
                    Welcome back, {user?.name || 'Instructor'}!
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Empower your students with quality education.
                </Typography>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid span={{ xs: 12, sm: 6, md: 6 }}>
                    <StatsCard
                        icon={AssessmentIcon}
                        value={stats.totalCourses}
                        label="Total Courses"
                        bgColor="info.main"
                        textColor="white"
                        elevation={3}
                    />
                </Grid>
                <Grid span={{ xs: 12, sm: 6, md: 6 }}>
                    <StatsCard
                        icon={GroupIcon}
                        value={stats.totalStudents}
                        label="Total Students"
                        bgColor="secondary.main"
                        textColor="white"
                        elevation={3}
                    />
                </Grid>
            </Grid>

            {/* Quick Actions */}
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
                        Manage Courses
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
        </Box>
    );
}

DashboardHome.propTypes = {
    user: PropTypes.object,
};

export default DashboardHome; 