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
import { StatsCard, PageHeader, CourseCard } from '../../components';

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
            <PageHeader
                title="Courses"
                subtitle="Manage and view all available courses"
                onAdd={handleAddCourse}
                addTooltip="Add New Course"
            />

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid span={{ xs: 12, sm: 6, md: 3 }}>
                    <StatsCard
                        icon={SchoolIcon}
                        value={mockCourses.length}
                        label="Total Courses"
                        color="primary.main"
                    />
                </Grid>
                <Grid span={{ xs: 12, sm: 6, md: 3 }}>
                    <StatsCard
                        icon={GroupIcon}
                        value={mockCourses.reduce((sum, course) => sum + course.students, 0)}
                        label="Total Students"
                        color="secondary.main"
                    />
                </Grid>
                <Grid span={{ xs: 12, sm: 6, md: 3 }}>
                    <StatsCard
                        icon={AssignmentIcon}
                        value={mockCourses.filter(course => course.status === 'active').length}
                        label="Active Courses"
                        color="success.main"
                    />
                </Grid>
                <Grid span={{ xs: 12, sm: 6, md: 3 }}>
                    <StatsCard
                        icon={ScheduleIcon}
                        value={mockCourses.filter(course => course.status === 'draft').length}
                        label="Draft Courses"
                        color="warning.main"
                    />
                </Grid>
            </Grid>

            {/* Courses Grid */}
            <Grid container spacing={3}>
                {mockCourses.map((course) => (
                    <Grid span={{ xs: 12, sm: 6, md: 4 }} key={course.id}>
                        <CourseCard
                            course={course}
                            onView={handleViewCourse}
                            onEdit={handleEditCourse}
                            onDelete={handleDeleteCourse}
                            onEnroll={() => console.log('Enroll in course:', course.id)}
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default Courses; 