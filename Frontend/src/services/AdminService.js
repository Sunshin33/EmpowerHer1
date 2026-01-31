import API from "../api";

/* ===== POSTS MODERATION ===== */

export const getAllPostsAdmin = async () => {
  const { data } = await API.get("/admin/posts");
  return data;
};

export const deletePostAdmin = async (id) => {
  return API.delete(`/admin/posts/${id}`);
};

export const togglePinPost = async (id) => {
  const { data } = await API.put(`/admin/posts/${id}/pin`);
  return data;
};

export const toggleInappropriatePost = async (id) => {
  const { data } = await API.put(`/admin/posts/${id}/inappropriate`);
  return data;
};
