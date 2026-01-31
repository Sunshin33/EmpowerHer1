import API from "../api";

export const getPosts = async () => {
  const { data } = await API.get("/posts");
  return data;
};

export const createPost = async (formData) => {
  const { data } = await API.post("/posts", formData);
  return data;
};

export const getMyPosts = async () => {
  const { data } = await API.get("/posts/mine");
  return data;
};

export const deletePost = async (id) => {
  await API.delete(`/posts/${id}`);
};

export const updatePost = async (id, updates) => {
  const { data } = await API.put(`/posts/${id}`, updates);
  return data;
};

export const reactToPost = async (id, type) => {
  const { data } = await API.post(`/posts/${id}/react`, { type });
  return data;
};

export const getPostById = async (id) => {
  const { data } = await API.get(`/posts/${id}`);
  return data;
};

export const archivePost = async (postId) => {
  const res = await API.patch(`/posts/${postId}/archive`);
  return res.data;
};


export const reportPost = (postId, reason) =>
  API.post(`/posts/${postId}/report`, { reason });

export const getMyArchivedPosts = async () => {
  const { data } = await API.get("/posts/mine/archived");
  return data;
};

export const restorePost = (postId) =>
  API.put(`/posts/${postId}/restore`);
