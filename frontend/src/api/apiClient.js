import axios from 'axios';

export const TOKEN_KEY = 'token';

/**
 * Central axios instance.
 * - Base URL comes from VITE_API_URL
 * - JSON requests
 * - Attaches `Authorization: Bearer <token>` automatically when a token is stored
 * - No withCredentials: the backend uses Bearer JWT, not cookies
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default apiClient;
