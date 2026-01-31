import React, { useEffect, useState } from "react";
import { Container, Card, Button, Form, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
  uploadProfilePic,
  changeEmail,
} from "../services/ProfileService";
import "./UserSettings.css";

function UserSettings() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  

  const [profile, setProfile] = useState({
    fullName: "",
    age: "",
    bio: "",
    email: "",
    profilePic: "",
  });

  const [uploading, setUploading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [emailPasswordConfirm, setEmailPasswordConfirm] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [profilePrivate, setProfilePrivate] = useState(false);


  /* ===== Load Profile ===== */
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getProfile();
        setProfile({
          fullName: data.fullName || "",
          age: data.age || "",
          bio: data.bio || "",
          email: data.email || "",
          profilePic: data.profilePic || "",
        });
      } catch (err) {
        console.error("Failed to load profile", err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  /* ===== Upload Profile Picture ===== */
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      setError("");
      setSuccess("");

      const data = await uploadProfilePic(file);

      setProfile((prev) => ({
        ...prev,
        profilePic: data.profilePic,
      }));

      setSuccess("Profile picture updated 💖");
    } catch (err) {
      console.error(err);
      setError("Failed to upload profile picture");
    } finally {
      setUploading(false);
    }
  };

  /* ===== Save Profile Info ===== */
  const handleSaveProfile = async () => {
    if (profile.age && Number(profile.age) < 13) {
      return setError("Age must be 13 or older");
    }

    try {
      setSavingProfile(true);
      setError("");
      setSuccess("");

      await updateProfile({
        fullName: profile.fullName,
        age: profile.age,
        bio: profile.bio,
      });

      setSuccess("Profile updated successfully 💖");
    } catch (err) {
      setError("Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  /* ===== Change Password ===== */
  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      return setError("Please fill in all password fields");
    }

    if (newPassword.length < 6) {
      return setError("New password must be at least 6 characters");
    }

    if (newPassword !== confirmPassword) {
      return setError("New passwords do not match");
    }

    try {
      setChangingPassword(true);
      setError("");
      setSuccess("");

      await changePassword({
        currentPassword,
        newPassword,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setSuccess("Password updated successfully 🔒");
    } catch (err) {
      setError("Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  /* ===== Two-Factor Auth (UI Placeholder) ===== */
const handleToggleTwoFactor = () => {
  setTwoFactorEnabled((prev) => !prev);
  setSuccess(
    !twoFactorEnabled
      ? "Two-factor authentication enabled (UI only for now) 🔐"
      : "Two-factor authentication disabled (UI only for now)"
  );
};

/* ===== Change Email (Frontend Only) ===== */
const handleChangeEmail = async () => {
  try {
    if (!newEmail || !emailPasswordConfirm) {
      return setError("Please enter new email and password");
    }

    await changeEmail(newEmail, emailPasswordConfirm);

    setProfile((prev) => ({ ...prev, email: newEmail }));
    setSuccess("Email updated successfully 📧");

    setNewEmail("");
    setEmailPasswordConfirm("");
  } catch (err) {
    setError(err.response?.data?.msg || "Failed to change email");
  }
};



const handleTogglePrivacy = () => {
  setProfilePrivate((prev) => !prev);
  setSuccess(
    !profilePrivate
      ? "Profile set to private (UI only) 🔒"
      : "Profile set to public"
  );
};

  /* ===== Delete Account ===== */
  const handleDeleteAccount = async () => {
    const confirm = window.confirm(
      "⚠️ This will permanently delete your account, posts, and data. This cannot be undone.\n\nType OK to confirm."
    );

    if (!confirm) return;

    try {
      await deleteAccount();
      navigate("/register");
    } catch (err) {
      setError("Failed to delete account");
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" className="mb-3" />
        <p className="text-muted">Loading settings...</p>
      </Container>
    );
  }

  return (
    <div className="settings-page">
      <Container className="py-5 settings-container">
        <h3 className="settings-title">Account Settings</h3>

        {success && <Alert variant="success">{success}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        {/* ===== PROFILE CARD ===== */}
        <Card className="settings-card">
          <h5 className="settings-section-title">Profile</h5>

          <div className="settings-avatar-row">
            <div className="settings-avatar">
              {profile.profilePic ? (
                <img src={profile.profilePic} alt="Avatar" />
              ) : (
                <div className="settings-avatar-placeholder">👤</div>
              )}
            </div>

            <div>
              <Form.Label>Profile Picture</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={uploading}
              />
              <small className="text-muted">
                {uploading ? "Uploading..." : "JPG/PNG recommended"}
              </small>
            </div>
          </div>

          <Form.Group className="mb-3">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              value={profile.fullName}
              onChange={(e) =>
                setProfile({ ...profile, fullName: e.target.value })
              }
            />
          </Form.Group>



          <Form.Group className="mb-3">
            <Form.Label>Age</Form.Label>
            <Form.Control
              type="number"
              min="13"
              value={profile.age}
              onChange={(e) =>
                setProfile({ ...profile, age: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Bio</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={profile.bio}
              onChange={(e) =>
                setProfile({ ...profile, bio: e.target.value })
              }
            />
          </Form.Group>

          <Button
            className="btn-pink w-100"
            onClick={handleSaveProfile}
            disabled={savingProfile}
          >
            {savingProfile ? "Saving..." : "Save Profile"}
          </Button>
        </Card>
{/* ===== CHANGE EMAIL ===== */}
<Card className="settings-card">
  <h5 className="settings-section-title">Change Email</h5>

  <Form.Group className="mb-3">
    <Form.Label>New Email Address</Form.Label>
    <Form.Control
      type="email"
      placeholder="Enter new email"
      value={newEmail}
      onChange={(e) => setNewEmail(e.target.value)}
    />
  </Form.Group>

  <Form.Group className="mb-3">
    <Form.Label>Confirm with Password</Form.Label>
    <Form.Control
      type="password"
      placeholder="Enter your password"
      value={emailPasswordConfirm}
      onChange={(e) => setEmailPasswordConfirm(e.target.value)}
    />
  </Form.Group>

  <Button className="btn-pink w-100" onClick={handleChangeEmail}>
    Request Email Change
  </Button>

  <small className="text-muted d-block mt-2">
  
  </small>
</Card>

        {/* ===== PASSWORD CARD ===== */}
        <Card className="settings-card">
          <h5 className="settings-section-title">Change Password</h5>

          <Form.Group className="mb-3">
            <Form.Label>Current Password</Form.Label>
            <Form.Control
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Confirm New Password</Form.Label>
            <Form.Control
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Group>

          <Button
            className="btn-pink w-100"
            onClick={handleChangePassword}
            disabled={changingPassword}
          >
            {changingPassword ? "Updating..." : "Update Password"}
          </Button>
        </Card>

{/* ===== TWO-FACTOR AUTH ===== */}
<Card className="settings-card">
  <h5 className="settings-section-title">Security</h5>

  <p className="text-muted">
    Add an extra layer of security to your account.
  </p>

  <Form.Check
    type="switch"
    id="two-factor-switch"
    label={
      twoFactorEnabled
        ? "Two-factor authentication is ON"
        : "Two-factor authentication is OFF"
    }
    checked={twoFactorEnabled}
    onChange={handleToggleTwoFactor}
  />


</Card>

{/* ===== THEME & PRIVACY ===== */}
<Card className="settings-card">
  <h5 className="settings-section-title">Preferences</h5>



  <Form.Check
    type="switch"
    id="privacy-switch"
    label={
      profilePrivate
        ? "Profile is PRIVATE"
        : "Profile is PUBLIC"
    }
    checked={profilePrivate}
    onChange={handleTogglePrivacy}
  />

  
</Card>

        {/* ===== DANGER ZONE ===== */}
        <Card className="settings-card danger-zone">
          <h5 className="settings-section-title text-danger">
            Danger Zone
          </h5>

          <p className="text-muted">
            Deleting your account is permanent and cannot be undone.
          </p>

          <Button
            variant="outline-danger"
            className="w-100"
            onClick={handleDeleteAccount}
          >
            Delete My Account
          </Button>
        </Card>
      </Container>
    </div>
  );
}

export default UserSettings;
