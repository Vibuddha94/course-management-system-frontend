import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon,
    MoreVert as MoreIcon
} from '@mui/icons-material';

const ActionButtons = ({
    onView,
    onEdit,
    onDelete,
    onMore,
    showView = true,
    showEdit = true,
    showDelete = true,
    showMore = false,
    viewTooltip = "View",
    editTooltip = "Edit",
    deleteTooltip = "Delete",
    moreTooltip = "More Actions",
    size = "small",
    disabled = false,
    sx = {}
}) => {
    return (
        <Box sx={{ display: 'flex', gap: 0.5, ...sx }}>
            {showView && onView && (
                <Tooltip title={viewTooltip}>
                    <IconButton
                        size={size}
                        color="primary"
                        onClick={onView}
                        disabled={disabled}
                    >
                        <ViewIcon />
                    </IconButton>
                </Tooltip>
            )}

            {showEdit && onEdit && (
                <Tooltip title={editTooltip}>
                    <IconButton
                        size={size}
                        color="secondary"
                        onClick={onEdit}
                        disabled={disabled}
                    >
                        <EditIcon />
                    </IconButton>
                </Tooltip>
            )}

            {showDelete && onDelete && (
                <Tooltip title={deleteTooltip}>
                    <IconButton
                        size={size}
                        color="error"
                        onClick={onDelete}
                        disabled={disabled}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            )}

            {showMore && onMore && (
                <Tooltip title={moreTooltip}>
                    <IconButton
                        size={size}
                        onClick={onMore}
                        disabled={disabled}
                    >
                        <MoreIcon />
                    </IconButton>
                </Tooltip>
            )}
        </Box>
    );
};

export default ActionButtons;
