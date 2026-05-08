import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'https://taskforge-backend-6xmv.onrender.com';

const api = axios.create({
  baseURL:"https://taskforge-backend-6xmv.onrender.com",
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attach JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('taskforge_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('taskforge_token');
      localStorage.removeItem('taskforge_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Auth ───────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
};

// ─── Tasks ──────────────────────────────────────────────────
export const tasksAPI = {
  getAll: (params) => api.get('/api/tasks', { params }),
  getById: (id) => api.get(`/api/tasks/${id}`),
  create: (data) => api.post('/api/tasks', data),
  update: (id, data) => api.put(`/api/tasks/${id}`, data),
  delete: (id) => api.delete(`/api/tasks/${id}`),
  updateStatus: (id, status) => api.patch(`/api/tasks/${id}/status`, { status }),
};

// ─── AI ─────────────────────────────────────────────────────
export const aiAPI = {
  prioritize: (data) => api.post('/api/tasks/prioritize', data),
  suggest: (data) => api.post('/api/tasks/suggest', data),
};

export default api;
