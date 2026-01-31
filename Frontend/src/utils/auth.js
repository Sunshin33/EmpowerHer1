import API from "../api";

/** 
 * Checks if user is logged in by asking backend
 */
export const isLoggedIn = async () => {
  try {
    await API.get("/auth/me"); 
    return true; 
  } catch {
    return false; 
  }
};

/**
 * Logs out user (clears HTTP-only cookie)
 */
export const logout = async () => {
  try {
    await API.post("/auth/logout");
  } finally {
    window.location.href = "/";
  }
};
