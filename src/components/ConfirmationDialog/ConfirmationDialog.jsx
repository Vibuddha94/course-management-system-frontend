import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    CircularProgress
} from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';

const ConfirmationDialog = ({
    open,
    onClose,
    onConfirm,
    title = "Confirm Action",
    message = "Are you sure you want to proceed?",
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    loading = false,
    severity = "warning"
}) => {
    const getColor = () => {
        switch (severity) {
            case 'error':
                return 'error.main';
            case 'warning':
                return 'warning.main';
            case 'info':
                return 'info.main';
            default:
                return 'warning.main';
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 2 }
            }}
        >
            <DialogTitle sx={{ fontWeight: 600 }}>
                {title}
            </DialogTitle>

            <DialogContent>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    mt: 1
                }}>
                    <WarningIcon sx={{ color: getColor(), fontSize: 40 }} />
                    <Typography variant="body1">
                        {message}
                    </Typography>
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 2 }}>
                <Button
                    onClick={onClose}
                    disabled={loading}
                    sx={{ borderRadius: 2 }}
                >
                    {cancelLabel}
                </Button>
                <Button
                    onClick={onConfirm}
                    variant="contained"
                    color={severity === 'error' ? 'error' : 'warning'}
                    disabled={loading}
                    sx={{ borderRadius: 2, minWidth: 120 }}
                >
                    {loading ? (
                        <CircularProgress size={20} color="inherit" />
                    ) : (
                        confirmLabel
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmationDialog;
