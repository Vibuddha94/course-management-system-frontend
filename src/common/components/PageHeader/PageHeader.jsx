import React, { forwardRef } from 'react';
import { Box, Typography, Fab, Tooltip } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

const PageHeader = forwardRef(({
    title,
    subtitle,
    onAdd,
    addTooltip = "Add New",
    icon = AddIcon,
    showAddButton = true,
    sx = {}
}, ref) => {
    const IconComponent = icon;

    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
            ...sx
        }}>
            <Box>
                <Typography variant="h4" fontWeight={700} color="primary" gutterBottom>
                    {title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    {subtitle}
                </Typography>
            </Box>
            {showAddButton && (
                <Tooltip title={addTooltip}>
                    <Fab
                        ref={ref}
                        color="primary"
                        aria-label={addTooltip}
                        onClick={onAdd}
                        sx={{
                            boxShadow: 3,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'scale(1.1)',
                                boxShadow: 6
                            }
                        }}
                    >
                        <IconComponent />
                    </Fab>
                </Tooltip>
            )}
        </Box>
    );
});

PageHeader.displayName = 'PageHeader';

export default PageHeader;
