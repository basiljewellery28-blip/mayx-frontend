// src/services/api.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Create axios instance with base configuration
const api = axios.create({
    baseURL: API_BASE_URL,
});

// Add token to requests automatically
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// API methods for auth
export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
};

// API methods for briefs
export const briefsAPI = {
    getAll: (params) => api.get('/briefs', { params }),
    getById: (id) => api.get(`/briefs/${id}`),
    create: (briefData) => api.post('/briefs', briefData),
    update: (id, briefData) => api.put(`/briefs/${id}`, briefData),
    updateStatus: (id, status) => api.put(`/briefs/${id}/status`, { status }),
    getVersions: (id) => api.get(`/briefs/${id}/versions`),
    getComments: (id) => api.get(`/briefs/${id}/comments`),
    addComment: (id, commentData) => {
        // Check if commentData is FormData (has file) or regular object
        const isFormData = commentData instanceof FormData;
        return api.post(`/briefs/${id}/comments`, commentData, {
            headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
        });
    },
    delete: (id) => api.delete(`/briefs/${id}`),
    requestRender: (id) => api.post(`/briefs/${id}/request-render`),
    uploadRender: (id, formData) => api.post(`/briefs/${id}/upload-render`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
};

// API methods for users
export const usersAPI = {
    getMe: () => api.get('/users/me'),
    getAll: () => api.get('/users'),
    getProfile: () => api.get('/users/profile'),
    updateProfile: (userData) => api.put('/users/profile', userData),
};

// API methods for notifications
export const notificationsAPI = {
    getAll: () => api.get('/notifications'),
    markRead: (id) => api.put(`/notifications/${id}/read`),
    markAllRead: () => api.put('/notifications/read-all'),
};

// API methods for clients
export const clientsAPI = {
    getAll: () => api.get('/clients'),
};

// API methods for products
export const productsAPI = {
    getAll: (params) => api.get('/products', { params }),
    getById: (id) => api.get(`/products/${id}`),
    create: (data) => api.post('/products', data),
};

// API methods for analytics
export const analyticsAPI = {
    getSummary: () => api.get('/analytics/summary'),
    getStatusDistribution: () => api.get('/analytics/status-distribution'),
};

export default api;