import React from 'react';
import { Paper, Typography, Box } from '@mui/material';

const StatsCard = ({
    icon: Icon,
    value,
    label,
    color = 'primary.main',
    elevation = 2,
    bgColor = null,
    textColor = null,
    sx = {}
}) => {
    const isColoredBg = bgColor !== null;

    return (
        <Paper
            elevation={elevation}
            sx={{
                p: 3,
                textAlign: 'center',
                bgcolor: bgColor || 'background.paper',
                color: textColor || 'text.primary',
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 4
                },
                ...sx
            }}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Icon sx={{
                    fontSize: 40,
                    color: isColoredBg ? 'inherit' : color,
                    mb: 1
                }} />
                <Typography
                    variant="h4"
                    fontWeight={700}
                    color={isColoredBg ? 'inherit' : color}
                >
                    {value}
                </Typography>
                <Typography
                    variant="body2"
                    color={isColoredBg ? 'inherit' : 'text.secondary'}
                >
                    {label}
                </Typography>
            </Box>
        </Paper>
    );
};

export default StatsCard;
