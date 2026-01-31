// src/utils/api.js
import axios from "axios";

const DEFAULT_API_URL = "http://localhost:5000/api";
const API_URL = (process.env.REACT_APP_API_URL && process.env.REACT_APP_API_URL.trim()) || DEFAULT_API_URL;

console.info("API baseURL:", API_URL);

const API = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Attach JWT token to every request (if present)
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// src/utils/api.js
export const login2FA = async (userId, token) => {
  const { data } = await API.post("/auth/2fa/login", { userId, token });
  return data;
};

export default API;
