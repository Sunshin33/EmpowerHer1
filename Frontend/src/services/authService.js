import API from "../api";

export const logout = async () => {
  try {
    await API.post("/auth/logout");
  } catch (e) {
    // ignore error
  } finally {
    localStorage.clear();
  }
};
