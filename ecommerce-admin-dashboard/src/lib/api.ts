import axios from 'axios';
import { getLocalToken } from './auth';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Attach token
api.interceptors.request.use((config) => {
  const token = getLocalToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ✅ Better error handling (NO HARD REDIRECT)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem('accessToken');
    }

    return Promise.reject(err?.response?.data || err);
  }
);

export default api;
