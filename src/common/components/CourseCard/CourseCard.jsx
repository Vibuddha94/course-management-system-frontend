import React from 'react';
import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Box,
    Chip,
    Avatar,
    Button
} from '@mui/material';
import { ActionButtons } from '../';

const CourseCard = ({
    course,
    onView,
    onEdit,
    onDelete,
    onEnroll,
    showActions = true,
    showEnrollButton = true,
    sx = {}
}) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'success';
            case 'draft':
                return 'default';
            case 'archived':
                return 'error';
            default:
                return 'default';
        }
    };

    const getInitials = (name) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase();
    };

    return (
        <Card
            elevation={3}
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                },
                ...sx
            }}
        >
            <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    mb: 2
                }}>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                        {course.title}
                    </Typography>
                    <Chip
                        label={course.status}
                        color={getStatusColor(course.status)}
                        size="small"
                    />
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {course.description}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar sx={{ width: 24, height: 24, mr: 1, fontSize: '0.75rem' }}>
                        {getInitials(course.instructor)}
                    </Avatar>
                    <Typography variant="body2" color="text.secondary">
                        {course.instructor}
                    </Typography>
                </Box>

                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 1
                }}>
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

            {showActions && (
                <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                    <ActionButtons
                        onView={() => onView?.(course.id)}
                        onEdit={() => onEdit?.(course.id)}
                        onDelete={() => onDelete?.(course.id)}
                        size="small"
                        viewTooltip="View Course"
                        editTooltip="Edit Course"
                        deleteTooltip="Delete Course"
                    />

                    {showEnrollButton && (
                        <Button
                            variant="contained"
                            size="small"
                            sx={{ borderRadius: 2 }}
                            onClick={() => onEnroll?.(course.id)}
                        >
                            Enroll
                        </Button>
                    )}
                </CardActions>
            )}
        </Card>
    );
};

export default CourseCard;
