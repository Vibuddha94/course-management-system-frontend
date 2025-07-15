import React from 'react';
import {
    Box,
    Typography,
    Button,
    Avatar,
    TableCell,
    TableRow as MuiTableRow
} from '@mui/material';
import {
    Delete as DeleteIcon
} from '@mui/icons-material';
import { ActionButtons } from '../../common/components';

const TableRow = ({
    item,
    isDeleting,
    onEdit,
    onDelete,
    onConfirmDelete,
    onCancelDelete,
    renderCells,
    columnsCount = 5
}) => {
    return (
        <MuiTableRow
            hover
            sx={{
                backgroundColor: isDeleting
                    ? 'rgba(220, 38, 38, 0.1)'
                    : 'transparent',
                transition: 'background-color 0.3s ease',
                border: isDeleting
                    ? '2px solid rgba(220, 38, 38, 0.3)'
                    : 'none',
                overflow: 'hidden'
            }}
        >
            {isDeleting ? (
                // Confirmation mode
                <TableCell colSpan={columnsCount} sx={{ overflow: 'hidden' }}>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        height: '57px',
                        px: 2,
                        overflow: 'hidden',
                        animation: 'slideInFromRight 0.4s ease-out',
                        '@keyframes slideInFromRight': {
                            '0%': {
                                transform: 'translateX(100%)',
                                opacity: 0
                            },
                            '100%': {
                                transform: 'translateX(0)',
                                opacity: 1
                            }
                        }
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: 'error.main', width: 40, height: 40 }}>
                                <DeleteIcon sx={{ fontSize: 20 }} />
                            </Avatar>
                            <Box>
                                <Typography variant="subtitle1" color="error.main" fontWeight={600}>
                                    Delete {item.name}?
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    This action cannot be undone
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                                variant="outlined"
                                color="inherit"
                                size="small"
                                onClick={onCancelDelete}
                                sx={{
                                    borderRadius: 1,
                                    px: 2,
                                    fontWeight: 600
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                size="small"
                                onClick={() => onConfirmDelete(item.id)}
                                sx={{
                                    borderRadius: 1,
                                    px: 2,
                                    fontWeight: 600,
                                    boxShadow: 1
                                }}
                            >
                                Delete
                            </Button>
                        </Box>
                    </Box>
                </TableCell>
            ) : (
                // Normal row mode
                <>
                    {renderCells(item)}
                    <TableCell>
                        <ActionButtons
                            onEdit={() => onEdit(item.id)}
                            onDelete={() => onDelete(item.id)}
                            showView={false}
                            size="small"
                        />
                    </TableCell>
                </>
            )}
        </MuiTableRow>
    );
};

export default TableRow;
