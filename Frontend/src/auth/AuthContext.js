import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import API from "../api";
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= CHECK SESSION ON LOAD ================= */
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await API.get("/auth/me");
        setUser(data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []); 

  /* ================= LOGIN ================= */
  const login = async (email, password) => {
    try {
      await API.post("/auth/login", { email, password });

      const { data } = await API.get("/auth/me");
      setUser(data.user);

      return { success: true };
    } catch (err) {
      return {
        success: false,
        message:
          err.response?.data?.msg || "Login failed",
      };
    }
  };

  /* ================= SIGNUP ================= */
  const signup = async (data) => {
    try {
      await API.post("/auth/signup", data);

      const { data: me } = await API.get("/auth/me");
      setUser(me.user);

      return { success: true };
    } catch (err) {
      return {
        success: false,
        message:
          err.response?.data?.msg || "Signup failed",
      };
    } 
  };

  /* ================= LOGOUT ================= */
 const logout = async () => {
  await API.post("/auth/logout");
  setUser(null);
};

  return (
    <AuthContext.Provider
      value={{ user, loading, login, signup, logout }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
