import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form, Nav } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./AuthModal.css"; 
import { useAuth } from "../auth/AuthContext";

function AuthModal({ isOpen, onClose }) {
  const navigate = useNavigate(); 
  const { login, login2FA, signup } = useAuth();
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("signup");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
const [twoFactorToken, setTwoFactorToken] = useState("");
const [userId, setUserId] = useState(null); // store userId returned from backend


  /* ================= SIGNUP STATE ================= */
  const [signupData, setSignupData] = useState({
    email: "",
    fullName: "",
    age: "",
    bio: "",
    password: "",
    confirmPassword: "",
    confirmWoman: false,
    profilePicBase64: "",
  });

  /* ================= LOGIN STATE ================= */
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  /* ================= SIGNUP CHANGE ================= */
  const handleSignupChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "checkbox") {
      setSignupData((prev) => ({ ...prev, [name]: checked }));
      return;
    }

    if (files && files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignupData((prev) => ({
          ...prev,
          profilePicBase64: reader.result,
        }));
      };
      reader.readAsDataURL(files[0]);
      return;
    }

    setSignupData((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= LOGIN CHANGE ================= */
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= SIGNUP SUBMIT ================= */
  const submitSignup = async (e) => {
    e.preventDefault();

   if (!signupData.confirmWoman) {
  setError("You must confirm that you are a woman to join.");
  return;
}

if (signupData.password !== signupData.confirmPassword) {
  setError("Passwords do not match");
  return;
}


    try {
      setLoading(true);

      const res = await signup({
  email: signupData.email.trim(),
  fullName: signupData.fullName,
  age: signupData.age,
  bio: signupData.bio,
  password: signupData.password,
  profilePic: signupData.profilePicBase64,
});

if (!res.success) {
  setError(res.message);
  return;
}

onClose();
navigate("/profile", { replace: true });


    } catch (err) {
      setError(err.response?.data?.msg || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOGIN SUBMIT ================= */
 const submitLogin = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    if (!twoFactorRequired) {
      // Step 1: Normal login
      const res = await login(loginData.email.trim(), loginData.password);

      if (res.twoFactorRequired) {
        // 2FA is enabled for this user
        setTwoFactorRequired(true);
        setUserId(res.userId);
      } else {
        // Login successful
        localStorage.setItem("token", res.token);
        onClose();
        navigate("/profile", { replace: true });
      }
    } else {
      // Step 2: 2FA verification
      const res = await login2FA(userId, twoFactorToken);

      localStorage.setItem("token", res.token);
      onClose();
      navigate("/profile", { replace: true });
    }
  } catch (err) {
    console.error(err);
    setError(err.response?.data?.msg || "Login failed");
  } finally {
    setLoading(false);
  }
};


  return (
    <Modal
      show={isOpen}
      onHide={onClose}
      centered
      backdrop="static"
      dialogClassName="auth-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {activeTab === "signup" ? "Create Account" : "Log In"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* ================= TABS ================= */}
        <Nav variant="tabs" activeKey={activeTab} onSelect={(tab) => { setActiveTab(tab); setError(""); }} >
          <Nav.Item>
            <Nav.Link eventKey="signup">Sign Up</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="login">Log In</Nav.Link>
          </Nav.Item>
        </Nav>

        {error && <p className="error-text">{error}</p>}

        {/* ================= SIGNUP ================= */}
        {activeTab === "signup" && (
          <Form className="mt-3" onSubmit={submitSignup}>
            <Form.Control
              className="mb-2"
              name="email"
              type="email"
              placeholder="Email"
              required
              onChange={handleSignupChange}
            />

            <Form.Control
              className="mb-2"
              name="fullName"
              placeholder="Full Name"
              required
              onChange={handleSignupChange}
            />

            <Form.Control
              className="mb-2"
              name="age"
              type="number"
              placeholder="Age"
              required
              onChange={handleSignupChange}
            />

            <Form.Control
              as="textarea"
              rows={3}
              className="mb-2"
              name="bio"
              placeholder="Short Bio"
              onChange={handleSignupChange}
            />

              <Form.Group className="mb-2 position-relative">
  <Form.Control
    name="password"
    type={showSignupPassword ? "text" : "password"}
    placeholder="Create Password"
    required
    onChange={handleSignupChange}
  />

  <span
    onClick={() => setShowSignupPassword(!showSignupPassword)}
    style={{
      position: "absolute",
      right: "12px",
      top: "50%",
      transform: "translateY(-50%)",
      cursor: "pointer",
      color: "#ff69b4",
      fontSize: "18px",
    }}
  >
    {showSignupPassword ? <FaEyeSlash /> : <FaEye />}
  </span>
</Form.Group>


            <Form.Group className="mb-3">
  <Form.Control
    name="confirmPassword"
    type={showSignupPassword ? "text" : "password"}
    placeholder="Confirm Password"
    required
    onChange={handleSignupChange}
  />
</Form.Group>


            <Form.Check
              className="mb-3"
              label="I confirm that I am a woman and agree to the community guidelines"
              name="confirmWoman"
              onChange={handleSignupChange}
            />

            <Form.Control
              type="file"
              accept="image/*"
              className="mb-3"
              onChange={handleSignupChange}
            />

            <Button
              type="submit"
              className="w-100 auth-btn"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </Form>
        )}

       {/* ================= LOGIN ================= */}
{activeTab === "login" && (
  <Form className="mt-3" onSubmit={submitLogin}>
    {!twoFactorRequired && (
      <>
        <Form.Control
          className="mb-3"
          name="email"
          type="email"
          placeholder="Email"
          required
          onChange={handleLoginChange}
        />

        <Form.Group className="mb-3 position-relative">
          <Form.Control
            name="password"
            type={showLoginPassword ? "text" : "password"}
            placeholder="Password"
            required
            onChange={handleLoginChange}
          />

          <span
            onClick={() => setShowLoginPassword(!showLoginPassword)}
            style={{
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              color: "#ff69b4",
              fontSize: "18px",
            }}
          >
            {showLoginPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </Form.Group>
      </>
    )}

    {twoFactorRequired && (
      <>
        <p className="mb-2">Two-Factor Authentication required</p>
        <Form.Control
          className="mb-3"
          type="text"
          placeholder="Enter 2FA code"
          required
          value={twoFactorToken}
          onChange={(e) => setTwoFactorToken(e.target.value)}
        />
      </>
    )}

    <Button
      type="submit"
      className="w-100 auth-btn"
      disabled={loading}
    >
      {loading
        ? "Logging In..."
        : twoFactorRequired
        ? "Verify 2FA"
        : "Log In"}
    </Button>
  </Form>
)}

      </Modal.Body>
    </Modal>
  );
}

export default AuthModal;
