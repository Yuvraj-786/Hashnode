import apiClient from './apiClient';

export const register = async ({ name, email, password }) => {
  const { data } = await apiClient.post('/auth/register', { name, email, password });
  return data; // { success, message, user, token }
};

export const login = async ({ email, password }) => {
  const { data } = await apiClient.post('/auth/login', { email, password });
  return data; // { success, message, user, token }
};

export const getCurrentUser = async () => {
  const { data } = await apiClient.get('/auth/me');
  return data; // { success, user }
};

export const logout = async () => {
  const { data } = await apiClient.get('/auth/logout');
  return data; // { success, message }
};
