import React from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const FormField = ({
    name,
    label,
    value,
    onChange,
    type = 'text',
    required = false,
    disabled = false,
    multiline = false,
    rows = 1,
    fullWidth = true,
    margin = 'normal',
    placeholder,
    helperText,
    error = false,
    startIcon,
    endIcon,
    showPassword,
    onTogglePassword,
    variant = 'outlined',
    size = 'medium',
    sx = {},
    ...props
}) => {
    const isPasswordField = type === 'password';
    const inputType = isPasswordField && showPassword ? 'text' : type;

    return (
        <TextField
            name={name}
            label={label}
            value={value}
            onChange={onChange}
            type={inputType}
            required={required}
            disabled={disabled}
            multiline={multiline}
            rows={multiline ? rows : undefined}
            fullWidth={fullWidth}
            margin={margin}
            placeholder={placeholder}
            helperText={helperText}
            error={error}
            variant={variant}
            size={size}
            sx={{
                '& .MuiOutlinedInput-root': {
                    transition: 'all 0.3s ease',
                    '&:hover fieldset': {
                        borderColor: 'primary.main',
                    },
                    '&.Mui-focused fieldset': {
                        borderWidth: 2,
                    },
                },
                ...sx
            }}
            InputProps={{
                startAdornment: startIcon && (
                    <InputAdornment position="start">
                        {startIcon}
                    </InputAdornment>
                ),
                endAdornment: (isPasswordField || endIcon) && (
                    <InputAdornment position="end">
                        {isPasswordField && (
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={onTogglePassword}
                                edge="end"
                                size="small"
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        )}
                        {endIcon && !isPasswordField && endIcon}
                    </InputAdornment>
                ),
            }}
            {...props}
        />
    );
};

export default FormField;
