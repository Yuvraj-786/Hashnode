import apiClient from './apiClient';

export const getMyProfile = async () => {
  const { data } = await apiClient.get('/users/me');
  return data; // { success, user }
};

// Only the supported fields are ever sent.
export const updateMyProfile = async ({ name, bio, avatarUrl }) => {
  const { data } = await apiClient.put('/users/me', { name, bio, avatarUrl });
  return data; // { success, message, user }
};

export const getUserById = async (id) => {
  const { data } = await apiClient.get(`/users/${id}`);
  return data; // { success, user, posts }
};
