import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingSpinner = ({
    size = 60,
    message = "Loading...",
    showMessage = false,
    minHeight = '400px',
    color = 'primary',
    sx = {}
}) => {
    return (
        <Box
            sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: minHeight,
                gap: 2,
                ...sx
            }}
        >
            <CircularProgress size={size} color={color} />
            {showMessage && (
                <Typography variant="body2" color="text.secondary">
                    {message}
                </Typography>
            )}
        </Box>
    );
};

export default LoadingSpinner;
