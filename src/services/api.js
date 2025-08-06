import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userEmail');
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
};

export const moviesAPI = {
  getMovies: async (page = 1, limit = 8) => {
    const response = await api.get(`/movies?page=${page}&limit=${limit}`);
    return response.data;
  },

  getMovie: async (id) => {
    const response = await api.get(`/movies/${id}`);
    return response.data;
  },

  createMovie: async (formData) => {
    const response = await api.post('/movies', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateMovie: async (id, formData) => {
    const response = await api.patch(`/movies/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteMovie: async (id) => {
    const response = await api.delete(`/movies/${id}`);
    return response.data;
  },
};

export default api;

