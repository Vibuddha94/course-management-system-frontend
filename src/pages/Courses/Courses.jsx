import React, { useState, useEffect, useRef } from 'react';
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
    Group as GroupIcon
} from '@mui/icons-material';
import { StatsCard, PageHeader, CourseCard, LoadingSpinner, CourseFormDialog, ConfirmationDialog, CourseDetailsDialog } from '../../components';
import apiService from '../../service/AxiosOrder';

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
    const [courses, setCourses] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [studentsLoading, setStudentsLoading] = useState(true);
    const [coursesLoading, setCoursesLoading] = useState(true);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [courseToDelete, setCourseToDelete] = useState(null);
    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const addButtonRef = useRef(null);

    // Get current user role
    const getCurrentUserRole = () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            return user?.role || 'Student';
        } catch {
            return 'Student';
        }
    };

    const userRole = getCurrentUserRole();

    // Role-based permissions
    const permissions = {
        canCreate: userRole === 'Instructor',           // Only instructors can create courses
        canView: true,                                  // All roles can view courses
        canEdit: userRole === 'Instructor' || userRole === 'ADMIN',    // Instructors and admins can edit
        canDelete: userRole === 'Instructor' || userRole === 'ADMIN',  // Instructors and admins can delete
        showActions: true                               // All roles can see action buttons (view for students, all for instructors/admins)
    };

    // Fetch students data from API
    const fetchStudents = async () => {
        try {
            setStudentsLoading(true);
            const response = await apiService.get('/user/getAll-by-role/Student');
            setStudents(response.data);
        } catch (error) {
            console.error('Error fetching students:', error);
        } finally {
            setStudentsLoading(false);
        }
    };

    // Fetch courses data from API
    const fetchCourses = async () => {
        try {
            setCoursesLoading(true);
            const response = await apiService.get('/course');
            // Transform API data to match CourseCard component expectations
            const transformedCourses = response.data.map(course => ({
                id: course.id,
                title: course.name,
                description: course.description || 'No description available',
                status: 'active' // TODO: Add status field to backend
            }));
            setCourses(transformedCourses);
        } catch (error) {
            console.error('Error fetching courses:', error);
            // Fallback to mock data if API fails
            setCourses(mockCourses);
        } finally {
            setCoursesLoading(false);
        }
    };

    // Load data on component mount
    useEffect(() => {
        const loadData = async () => {
            await Promise.all([fetchStudents(), fetchCourses()]);
            setLoading(false);
        };
        loadData();
    }, []);

    const handleAddCourse = () => {
        if (permissions.canCreate) {
            // Blur the button to remove focus before opening dialog
            if (addButtonRef.current) {
                addButtonRef.current.blur();
            }
            setCreateDialogOpen(true);
        } else {
            console.log('Access denied: Only instructors can create courses');
        }
    };

    const handleCreateCourse = async (courseData) => {
        try {
            setCreateLoading(true);

            // Get current user ID from localStorage
            const user = JSON.parse(localStorage.getItem('user'));
            const userId = user?.id;

            if (!userId) {
                console.error('User ID not found in localStorage');
                return;
            }

            const response = await apiService.post(`/course/${userId}`, courseData);

            if (response.data) {
                // Close the dialog first
                setCreateDialogOpen(false);
                // Then refresh the courses list
                await fetchCourses();
            }
        } catch (error) {
            console.error('Error creating course:', error);
        } finally {
            setCreateLoading(false);
        }
    };

    const handleCloseCreateDialog = () => {
        setCreateDialogOpen(false);
        setCreateLoading(false);
        // Ensure the button doesn't retain focus after dialog closes
        setTimeout(() => {
            if (addButtonRef.current) {
                addButtonRef.current.blur();
            }
        }, 100);
    };

    const handleEditCourse = (courseId) => {
        if (permissions.canEdit) {
            // Find the course to edit
            const courseToEdit = courses.find(course => course.id === courseId);
            if (courseToEdit) {
                setEditingCourse(courseToEdit);
                setEditDialogOpen(true);
            }
        } else {
            console.log('Access denied: Only instructors and admins can edit courses');
        }
    };

    const handleUpdateCourse = async (courseData) => {
        try {
            setEditLoading(true);

            if (!editingCourse) {
                console.error('No course selected for editing');
                return;
            }

            const response = await apiService.put(`/course/${editingCourse.id}`, courseData);

            if (response.data) {
                // Close the dialog first
                setEditDialogOpen(false);
                // Clear editing course
                setEditingCourse(null);
                // Then refresh the courses list
                await fetchCourses();
            }
        } catch (error) {
            console.error('Error updating course:', error);
        } finally {
            setEditLoading(false);
        }
    };

    const handleCloseEditDialog = () => {
        setEditDialogOpen(false);
        setEditLoading(false);
        setEditingCourse(null);
    };

    const handleDeleteCourse = (courseId) => {
        if (permissions.canDelete) {
            // Find the course to delete
            const courseToDelete = courses.find(course => course.id === courseId);
            if (courseToDelete) {
                setCourseToDelete(courseToDelete);
                setDeleteDialogOpen(true);
            }
        } else {
            console.log('Access denied: Only instructors and admins can delete courses');
        }
    };

    const handleConfirmDeleteCourse = async () => {
        try {
            setDeleteLoading(true);

            if (!courseToDelete) {
                console.error('No course selected for deletion');
                return;
            }

            const response = await apiService.delete(`/course/${courseToDelete.id}`);

            // Close the dialog first
            setDeleteDialogOpen(false);
            // Clear course to delete
            setCourseToDelete(null);
            // Then refresh the courses list
            await fetchCourses();
        } catch (error) {
            console.error('Error deleting course:', error);
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleCloseDeleteDialog = () => {
        setDeleteDialogOpen(false);
        setDeleteLoading(false);
        setCourseToDelete(null);
    };

    const handleViewCourse = (courseId) => {
        // Find the course to view
        const courseToView = courses.find(course => course.id === courseId);
        if (courseToView) {
            setSelectedCourse(courseToView);
            setDetailsDialogOpen(true);
        }
    };

    const handleCloseDetailsDialog = () => {
        setDetailsDialogOpen(false);
        setSelectedCourse(null);
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <PageHeader
                ref={addButtonRef}
                title="Courses"
                subtitle={`Manage and view all available courses - ${userRole} View`}
                onAdd={permissions.canCreate ? handleAddCourse : undefined}
                addTooltip="Add New Course"
                showAddButton={permissions.canCreate}
            />

            {/* Loading State */}
            {loading ? (
                <LoadingSpinner message="Loading courses data..." />
            ) : (
                <>
                    {/* Stats Cards Section */}
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid span={{ xs: 12, sm: 6, md: 6 }}>
                            <StatsCard
                                icon={SchoolIcon}
                                value={coursesLoading ? '...' : courses.length}
                                label="Total Courses"
                                color="primary.main"
                            />
                        </Grid>
                        <Grid span={{ xs: 12, sm: 6, md: 6 }}>
                            <StatsCard
                                icon={GroupIcon}
                                value={studentsLoading ? '...' : students.length}
                                label="Total Students"
                                color="secondary.main"
                            />
                        </Grid>
                        <Grid span={{ xs: 12, sm: 6, md: 6 }}>
                            <StatsCard
                                icon={AssignmentIcon}
                                value={coursesLoading ? '...' : courses.filter(course => course.status === 'active').length}
                                label="Active Courses"
                                color="success.main"
                            />
                        </Grid>
                    </Grid>

                    {/* Course Cards Section */}
                    <Grid container spacing={3}>
                        {coursesLoading ? (
                            <Grid size={12}>
                                <LoadingSpinner message="Loading courses..." />
                            </Grid>
                        ) : courses.length > 0 ? (
                            courses.map((course) => (
                                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2.4 }} key={course.id}>
                                    <Box sx={{ height: 280, width: '100%' }}>
                                        <CourseCard
                                            course={course}
                                            onView={permissions.canView ? handleViewCourse : undefined}
                                            onEdit={permissions.canEdit ? handleEditCourse : undefined}
                                            onDelete={permissions.canDelete ? handleDeleteCourse : undefined}
                                            showActions={permissions.showActions}
                                            showEnrollButton={false}
                                        />
                                    </Box>
                                </Grid>
                            ))
                        ) : (
                            <Grid size={12}>
                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                    <Typography variant="h6" color="text.secondary">
                                        No courses available
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                        {permissions.canCreate
                                            ? 'Click the "Add New Course" button to create your first course'
                                            : 'No courses have been created yet'
                                        }
                                    </Typography>
                                </Box>
                            </Grid>
                        )}
                    </Grid>
                </>
            )}

            {/* Course Creation Dialog */}
            <CourseFormDialog
                open={createDialogOpen}
                onClose={handleCloseCreateDialog}
                onSubmit={handleCreateCourse}
                title="Create New Course"
                submitLabel="Create Course"
                loading={createLoading}
            />

            {/* Course Edit Dialog */}
            <CourseFormDialog
                open={editDialogOpen}
                onClose={handleCloseEditDialog}
                onSubmit={handleUpdateCourse}
                title="Edit Course"
                submitLabel="Update Course"
                loading={editLoading}
                initialData={editingCourse ? {
                    name: editingCourse.title,
                    description: editingCourse.description
                } : { name: '', description: '' }}
            />

            {/* Course Delete Confirmation Dialog */}
            <ConfirmationDialog
                open={deleteDialogOpen}
                onClose={handleCloseDeleteDialog}
                onConfirm={handleConfirmDeleteCourse}
                title="Delete Course"
                message={`Are you sure you want to delete the course "${courseToDelete?.title}"? This action cannot be undone.`}
                confirmLabel="Delete Course"
                cancelLabel="Cancel"
                loading={deleteLoading}
                severity="error"
            />

            {/* Course Details Dialog */}
            <CourseDetailsDialog
                open={detailsDialogOpen}
                onClose={handleCloseDetailsDialog}
                course={selectedCourse}
                onEdit={handleEditCourse}
                onDelete={handleDeleteCourse}
                canEdit={permissions.canEdit}
                canDelete={permissions.canDelete}
            />
        </Box>
    );
}

export default Courses; 