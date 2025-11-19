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

// API methods for briefs
export const briefsAPI = {
  getAll: () => api.get('/briefs'),
  getById: (id) => api.get(`/briefs/${id}`),
  create: (briefData) => api.post('/briefs', briefData),
  update: (id, briefData) => api.put(`/briefs/${id}`, briefData),
  delete: (id) => api.delete(`/briefs/${id}`),
};

export default api;