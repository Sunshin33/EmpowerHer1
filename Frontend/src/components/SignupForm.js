import React, { useState } from "react";
import "./LoginForm.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function SignupForm({ isOpen, onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { signup } = useAuth();   // ✅

  if (!isOpen) return null;

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    const result = await signup({
      email: email.trim(),
      password,
    }); // ✅

    if (!result.success) {
      setError(result.message);
      setLoading(false);
      return;
    }

    onClose();
    navigate("/profile"); // ✅ instant auth
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>Sign Up</h2>
        {error && <p className="error-text">{error}</p>}

        <form className="login-form" onSubmit={handleSignup}>
          <input type="email" placeholder="Email" required value={email}
            onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" required value={password}
            onChange={(e) => setPassword(e.target.value)} />
          <input type="password" placeholder="Confirm Password" required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)} />
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignupForm;
