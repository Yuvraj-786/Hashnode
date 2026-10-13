import apiClient from './apiClient';

export const getPosts = async ({ search, tag } = {}) => {
  const params = {};
  if (search) params.search = search;
  if (tag) params.tag = tag;
  const { data } = await apiClient.get('/posts', { params });
  return data; // { success, posts, count }
};

export const getPostBySlug = async (slug) => {
  const { data } = await apiClient.get(`/posts/${slug}`);
  return data; // { success, post }
};

export const getMyPosts = async () => {
  const { data } = await apiClient.get('/posts/mine');
  return data; // { success, posts, count }
};

export const createPost = async (payload) => {
  const { data } = await apiClient.post('/posts', payload);
  return data; // { success, message, post }
};

export const updatePost = async (id, payload) => {
  const { data } = await apiClient.put(`/posts/${id}`, payload);
  return data; // { success, message, post }
};

export const deletePost = async (id) => {
  const { data } = await apiClient.delete(`/posts/${id}`);
  return data; // { success, message }
};
