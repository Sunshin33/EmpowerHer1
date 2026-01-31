import React, { useState } from "react";
import "./LoginForm.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function LoginForm({ isOpen, onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const [twoFactorToken, setTwoFactorToken] = useState("");
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login, login2FA } = useAuth(); // ✅ assume login2FA is added in context

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!twoFactorRequired) {
        // Step 1: normal login
        const result = await login(email.trim(), password);

        if (result.twoFactorRequired) {
          // User has 2FA enabled → prompt for code
          setTwoFactorRequired(true);
          setUserId(result.userId);
        } else {
          // No 2FA → login success
          localStorage.setItem("token", result.token);
          onClose();
          navigate("/profile");
        }
      } else {
        // Step 2: 2FA verification
        const res = await login2FA(userId, twoFactorToken);
        localStorage.setItem("token", res.token);
        onClose();
        navigate("/profile");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>Login</h2>
        {error && <p className="error-text">{error}</p>}

        <form className="login-form" onSubmit={handleLogin}>
          {!twoFactorRequired && (
            <>
              <input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </>
          )}

          {twoFactorRequired && (
            <>
              <p className="mb-2">Two-Factor Authentication required</p>
              <input
                type="text"
                placeholder="Enter 2FA code"
                required
                value={twoFactorToken}
                onChange={(e) => setTwoFactorToken(e.target.value)}
              />
            </>
          )}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Logging in..." : twoFactorRequired ? "Verify 2FA" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
