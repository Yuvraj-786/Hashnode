import apiClient from './apiClient';

export const getTags = async () => {
  const { data } = await apiClient.get('/tags');
  return data; // { success, tags, count }
};

export const getTag = async (slug) => {
  const { data } = await apiClient.get(`/tags/${slug}`);
  return data; // { success, tag }
};

export const getTagPosts = async (slug) => {
  const { data } = await apiClient.get(`/tags/${slug}/posts`);
  return data; // { success, tag, posts, count }
};

export const createTag = async ({ name }) => {
  const { data } = await apiClient.post('/tags', { name });
  return data; // { success, message, tag }
};
