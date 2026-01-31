import API from "../api";

export const addSocialLink = async (platform, url) => {
  const { data } = await API.post("/profile/social-links", {
    platform,
    url,
  });
  return data;
};

export const deleteSocialLink = async (index) => {
  const { data } = await API.delete(`/profile/social-links/${index}`);
  return data;
};
