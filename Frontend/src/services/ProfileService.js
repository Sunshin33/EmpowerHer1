import API from "../api";

export const getProfile = async () => {
  const { data } = await API.get("/users/profile");
  return data;
};

export const updateProfile = async (formData) => {
  const { data } = await API.put("/users/profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export const changePassword = async (payload) => {
  return API.put("/users/profile/password", payload);
};

export const deleteAccount = async () => {
  return API.delete("/users/profile");
};

// ===== Upload Profile Picture =====
export const uploadProfilePic = async (file) => {
  const formData = new FormData();
  formData.append("avatar", file);

  const { data } = await API.put("/users/profile/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

export const changeEmail = async (newEmail, password) => {
  const { data } = await API.put("/profile/change-email", {
    newEmail,
    password,
  });
  return data;
};

