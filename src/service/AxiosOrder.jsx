import axios from 'axios';
import { toast } from 'sonner';

// Base URL for API
const BASE_URL = 'http://127.0.0.1:8080/api/v1';
const TOKEN_KEY = 'token';

// Token management utilities
export function setBearerToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
}

export function getBearerToken() {
    return localStorage.getItem(TOKEN_KEY);
}

export function removeBearerToken() {
    localStorage.removeItem(TOKEN_KEY);
}

// Create Axios instance
const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add bearer token if available
axiosInstance.interceptors.request.use(
    (config) => {
        const token = getBearerToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Centralized response and error handling
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const { status, data } = error.response;
            let message = data?.message || 'An error occurred.';
            switch (status) {
                case 401:
                    message = 'Unauthorized. Please log in again.';
                    removeBearerToken();
                    break;
                case 403:
                    message = 'Forbidden. You do not have permission to perform this action.';
                    break;
                case 404:
                    message = 'Resource not found.';
                    break;
                case 500:
                    message = 'Server error. Please try again later.';
                    break;
                default:
                    // Use message from server or fallback
                    break;
            }
            toast.error(message);
        } else if (error.request) {
            toast.error('No response from server. Please check your connection.');
        } else {
            toast.error(error.message || 'An unknown error occurred.');
        }
        return Promise.reject(error);
    }
);

// HTTP methods service
const apiService = {
    get: (url, config) => axiosInstance.get(url, config),
    post: (url, data, config) => axiosInstance.post(url, data, config),
    put: (url, data, config) => axiosInstance.put(url, data, config),
    patch: (url, data, config) => axiosInstance.patch(url, data, config),
    delete: (url, config) => axiosInstance.delete(url, config),
    setBearerToken,
    getBearerToken,
    removeBearerToken,
};

export default apiService; 