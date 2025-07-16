import React from 'react';
import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Box,
    Chip,
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
    userRole = 'Student',
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

    return (
        <Card
            elevation={3}
            sx={{
                height: 280, // Fixed height for consistency
                width: '100%', // Fixed width for consistency
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
            <CardContent sx={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                p: 2,
                pb: 1
            }}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    mb: 2
                }}>
                    <Typography
                        variant="h6"
                        fontWeight={600}
                        gutterBottom
                        sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            lineHeight: 1.3,
                            maxWidth: '70%',
                            minHeight: '2.6em' // Fixed height for up to 2 lines
                        }}
                    >
                        {course.title}
                    </Typography>
                    <Chip
                        label={course.status}
                        color={getStatusColor(course.status)}
                        size="small"
                    />
                </Box>

                <Box sx={{ flexGrow: 1 }}>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            lineHeight: 1.4,
                            height: '4.2em' // Fixed height for 3 lines
                        }}
                    >
                        {course.description}
                    </Typography>
                </Box>
            </CardContent>

            {showActions && (
                <CardActions sx={{
                    justifyContent: 'space-between',
                    p: 2,
                    pt: 1,
                    mt: 'auto' // Push to bottom
                }}>
                    {userRole === 'Student' ? (
                        // For students: show a normal "View" button instead of eye icon
                        <Button
                            variant="outlined"
                            sx={{ borderRadius: 2, width: '100%' }}
                            onClick={() => onView?.(course.id)}
                            disabled={!onView}
                        >
                            View Course
                        </Button>
                    ) : (
                        // For instructors/admins: show action buttons with eye icon
                        <ActionButtons
                            onView={onView ? () => onView(course.id) : undefined}
                            onEdit={onEdit ? () => onEdit(course.id) : undefined}
                            onDelete={onDelete ? () => onDelete(course.id) : undefined}
                            size="small"
                            viewTooltip="View Course"
                            editTooltip="Edit Course"
                            deleteTooltip="Delete Course"
                        />
                    )}

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
