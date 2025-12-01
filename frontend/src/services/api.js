import axios from 'axios';

// Resolve API base URL from multiple possible env names
const resolveBaseUrl = () => {
  const env = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : {};
  const candidate = env.VITE_API_BASE_URL
    || env.VITE_BACKEND_URL
    || env.VITE_API_URL
    || env.VITE_BASE_API_URL
    || env.VITE_SERVER_URL
    || env.VITE_BASE_URL
    || 'http://localhost:3000/api';

  // Normalize: remove trailing slash for consistency
  return typeof candidate === 'string' ? candidate.replace(/\/$/, '') : candidate;
};

const API_BASE_URL = resolveBaseUrl();

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
