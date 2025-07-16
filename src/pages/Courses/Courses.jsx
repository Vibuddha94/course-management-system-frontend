import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
    Box,
    Typography,
    Grid,
    TextField,
    InputAdornment,
    IconButton,
    Paper
} from '@mui/material';
import {
    School as SchoolIcon,
    Assignment as AssignmentIcon,
    Group as GroupIcon,
    Search as SearchIcon,
    Clear as ClearIcon
} from '@mui/icons-material';
import { StatsCard, PageHeader, CourseCard, LoadingSpinner, CourseFormDialog, ConfirmationDialog, CourseDetailsDialog } from '../../components';
import apiService from '../../service/AxiosOrder';
import { toast } from 'sonner';

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
    const [searchTerm, setSearchTerm] = useState('');
    const addButtonRef = useRef(null);

    // Memoized user role and permissions
    const { userRole, permissions } = useMemo(() => {
        const getCurrentUserRole = () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                return user?.role || 'Student';
            } catch {
                return 'Student';
            }
        };

        const role = getCurrentUserRole();
        const perms = {
            canCreate: role === 'Instructor',
            canView: true,
            canEdit: role === 'Instructor' || role === 'ADMIN',
            canDelete: role === 'Instructor' || role === 'ADMIN',
            showActions: true
        };

        return { userRole: role, permissions: perms };
    }, []);

    // Filtered courses based on search term
    const filteredCourses = useMemo(() => {
        if (!searchTerm.trim()) {
            return courses;
        }

        return courses.filter(course =>
            course.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.instructor?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [courses, searchTerm]);

    // Search handlers
    const handleSearchChange = useCallback((event) => {
        setSearchTerm(event.target.value);
    }, []);

    const handleClearSearch = useCallback(() => {
        setSearchTerm('');
    }, []);

    // Fetch functions with optimized error handling
    const fetchStudents = useCallback(async () => {
        setStudentsLoading(true);
        try {
            const response = await apiService.get('/user/getAll-by-role/Student');
            setStudents(response.data);
        } finally {
            setStudentsLoading(false);
        }
    }, []);

    const fetchCourses = useCallback(async () => {
        setCoursesLoading(true);
        try {
            const response = await apiService.get('/course');
            const transformedCourses = response.data.map(course => ({
                id: course.id,
                title: course.name,
                description: course.description || 'No description available',
                status: 'active'
            }));
            setCourses(transformedCourses);
        } finally {
            setCoursesLoading(false);
        }
    }, []);

    // Load data on component mount
    useEffect(() => {
        const loadData = async () => {
            await Promise.all([fetchStudents(), fetchCourses()]);
            setLoading(false);
        };
        loadData();
    }, []);

    // Optimized event handlers
    const handleAddCourse = useCallback(() => {
        if (!permissions.canCreate) return;

        if (addButtonRef.current) {
            addButtonRef.current.blur();
        }
        setCreateDialogOpen(true);
    }, [permissions.canCreate]);

    const handleCreateCourse = useCallback(async (courseData) => {
        setCreateLoading(true);
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const userId = user?.id;

            if (!userId) return;

            const response = await apiService.post(`/course/${userId}`, courseData);
            if (response.data) {
                setCreateDialogOpen(false);
                await fetchCourses();
            }
        } finally {
            setCreateLoading(false);
        }
    }, [fetchCourses]);

    const handleCreateCourseWithFiles = useCallback(async (courseData, pendingFiles) => {
        setCreateLoading(true);
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const userId = user?.id;

            if (!userId) return;

            const courseResponse = await apiService.post(`/course/${userId}`, courseData);

            if (courseResponse.data && courseResponse.data.id && pendingFiles.length > 0) {
                const formData = new FormData();
                pendingFiles.forEach(pendingFile => {
                    formData.append('files', pendingFile.file);
                });

                await apiService.post(`/course-modules/${courseResponse.data.id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            setCreateDialogOpen(false);
            await fetchCourses();
        } finally {
            setCreateLoading(false);
        }
    }, [fetchCourses]);

    const handleCloseCreateDialog = useCallback(() => {
        setCreateDialogOpen(false);
        setCreateLoading(false);
        setTimeout(() => {
            if (addButtonRef.current) {
                addButtonRef.current.blur();
            }
        }, 100);
    }, []);

    const handleEditCourse = useCallback((courseId) => {
        if (!permissions.canEdit) return;

        // Remove focus from the edit button to prevent aria-hidden accessibility warning
        if (document.activeElement && document.activeElement.blur) {
            document.activeElement.blur();
        }

        const courseToEdit = courses.find(course => course.id === courseId);
        if (courseToEdit) {
            setEditingCourse(courseToEdit);
            setEditDialogOpen(true);
        }
    }, [permissions.canEdit, courses]);

    const handleUpdateCourse = useCallback(async (courseData) => {
        if (!editingCourse) return;

        setEditLoading(true);
        try {
            const response = await apiService.put(`/course/${editingCourse.id}`, courseData);
            if (response.data) {
                setEditDialogOpen(false);
                setEditingCourse(null);
                await fetchCourses();
            }
        } finally {
            setEditLoading(false);
        }
    }, [editingCourse, fetchCourses]);

    const handleUpdateCourseWithFiles = useCallback(async (courseData, pendingFiles, pendingDeletions) => {
        if (!editingCourse) return;

        setEditLoading(true);
        try {
            const courseResponse = await apiService.put(`/course/${editingCourse.id}`, courseData);

            if (courseResponse.data) {
                // Delete pending materials
                if (pendingDeletions?.length > 0) {
                    await Promise.all(
                        pendingDeletions.map(materialId =>
                            apiService.delete(`/course-modules/${materialId}`)
                        )
                    );
                }

                // Upload pending files
                if (pendingFiles?.length > 0) {
                    const formData = new FormData();
                    pendingFiles.forEach(pendingFile => {
                        formData.append('files', pendingFile.file);
                    });

                    await apiService.post(`/course-modules/${editingCourse.id}`, formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                }

                setEditDialogOpen(false);
                setEditingCourse(null);
                await fetchCourses();
            }
        } finally {
            setEditLoading(false);
        }
    }, [editingCourse, fetchCourses]);

    const handleCloseEditDialog = useCallback(() => {
        setEditDialogOpen(false);
        setEditLoading(false);
        setEditingCourse(null);
    }, []);

    const handleDeleteCourse = useCallback((courseId) => {
        if (!permissions.canDelete) return;

        // Remove focus from the delete button to prevent aria-hidden accessibility warning
        if (document.activeElement && document.activeElement.blur) {
            document.activeElement.blur();
        }

        const courseToDelete = courses.find(course => course.id === courseId);
        if (courseToDelete) {
            setCourseToDelete(courseToDelete);
            setDeleteDialogOpen(true);
        }
    }, [permissions.canDelete, courses]);

    const handleConfirmDeleteCourse = useCallback(async () => {
        if (!courseToDelete) return;

        setDeleteLoading(true);
        try {
            // Try to delete course materials first, but don't fail if there are no materials
            try {
                await apiService.delete(`/course-modules/delete/all/${courseToDelete.id}`);
            } catch (error) {
                // If there are no course materials, the backend sends an error
                // But we should still proceed to delete the course
            }

            // Always proceed to delete the course itself
            await apiService.delete(`/course/${courseToDelete.id}`);
            toast.success(`Course "${courseToDelete.title}" deleted successfully!`);
            setDeleteDialogOpen(false);
            setCourseToDelete(null);
            await fetchCourses();
        } finally {
            setDeleteLoading(false);
        }
    }, [courseToDelete, fetchCourses]);

    const handleCloseDeleteDialog = useCallback(() => {
        setDeleteDialogOpen(false);
        setDeleteLoading(false);
        setCourseToDelete(null);
    }, []);

    const handleViewCourse = useCallback((courseId) => {
        // Remove focus from the view button to prevent aria-hidden accessibility warning
        if (document.activeElement && document.activeElement.blur) {
            document.activeElement.blur();
        }

        const courseToView = courses.find(course => course.id === courseId);
        if (courseToView) {
            setSelectedCourse(courseToView);
            setDetailsDialogOpen(true);
        }
    }, [courses]);

    const handleCloseDetailsDialog = useCallback(() => {
        setDetailsDialogOpen(false);
        setSelectedCourse(null);
    }, []);

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
                        {userRole !== 'Student' && (
                            <Grid span={{ xs: 12, sm: 6, md: 6 }}>
                                <StatsCard
                                    icon={GroupIcon}
                                    value={studentsLoading ? '...' : students.length}
                                    label="Total Students"
                                    color="secondary.main"
                                />
                            </Grid>
                        )}
                        <Grid span={{ xs: 12, sm: 6, md: 6 }}>
                            <StatsCard
                                icon={AssignmentIcon}
                                value={coursesLoading ? '...' : courses.filter(course => course.status === 'active').length}
                                label="Active Courses"
                                color="success.main"
                            />
                        </Grid>
                    </Grid>

                    {/* Search Section */}
                    <Paper elevation={1} sx={{ p: 2, mb: 4 }}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Search courses by name, description, or instructor..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon color="action" />
                                    </InputAdornment>
                                ),
                                endAdornment: searchTerm && (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={handleClearSearch}
                                            edge="end"
                                            size="small"
                                            aria-label="clear search"
                                        >
                                            <ClearIcon />
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    '&:hover fieldset': {
                                        borderColor: 'primary.main',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'primary.main',
                                    },
                                },
                            }}
                        />
                        {searchTerm && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                Found {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} matching "{searchTerm}"
                            </Typography>
                        )}
                    </Paper>

                    {/* Course Cards Section */}
                    <Grid container spacing={3}>
                        {coursesLoading ? (
                            <Grid size={12}>
                                <LoadingSpinner message="Loading courses..." />
                            </Grid>
                        ) : filteredCourses.length > 0 ? (
                            filteredCourses.map((course) => (
                                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2.4 }} key={course.id}>
                                    <Box sx={{ height: 280, width: '100%' }}>
                                        <CourseCard
                                            course={course}
                                            onView={permissions.canView ? handleViewCourse : undefined}
                                            onEdit={permissions.canEdit ? handleEditCourse : undefined}
                                            onDelete={permissions.canDelete ? handleDeleteCourse : undefined}
                                            showActions={permissions.showActions}
                                            showEnrollButton={false}
                                            userRole={userRole}
                                        />
                                    </Box>
                                </Grid>
                            ))
                        ) : searchTerm ? (
                            <Grid size={12}>
                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                    <Typography variant="h6" color="text.secondary">
                                        No courses found matching "{searchTerm}"
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                        Try adjusting your search terms or clear the search to see all courses
                                    </Typography>
                                </Box>
                            </Grid>
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
                onCourseCreated={handleCreateCourseWithFiles}
                title="Create New Course"
                submitLabel="Create Course"
                loading={createLoading}
            />

            {/* Course Edit Dialog */}
            <CourseFormDialog
                open={editDialogOpen}
                onClose={handleCloseEditDialog}
                onSubmit={handleUpdateCourse}
                onCourseCreated={handleUpdateCourseWithFiles}
                title="Edit Course"
                submitLabel="Update Course"
                loading={editLoading}
                initialData={editingCourse ? {
                    id: editingCourse.id,
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