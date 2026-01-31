const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const cloudinary = require("../config/cloudinary");
const router = express.Router();

/* ===== GET PROFILE ===== */
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch {
    res.status(500).json({ message: "Failed to load profile" });
  }
});

/* ===== UPDATE PROFILE ===== */
router.put("/profile", auth, upload.single("profilePic"), async (req, res) => {
  try {
    const { fullName, age, bio } = req.body;

    let updateData = { fullName, age, bio };

    // If image uploaded → upload to Cloudinary
    if (req.file) {
      const result = await cloudinary.uploader.upload_stream(
        { folder: "profiles" },
        async (error, result) => {
          if (error) throw error;

          updateData.profilePic = result.secure_url;

          const user = await User.findByIdAndUpdate(
            req.user.id,
            updateData,
            { new: true }
          ).select("-password");

          return res.json(user);
        }
      );

      // Write buffer to stream
      require("streamifier").createReadStream(req.file.buffer).pipe(result);
    } else {
      const user = await User.findByIdAndUpdate(
        req.user.id,
        updateData,
        { new: true }
      ).select("-password");

      res.json(user);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update profile" });
  }
});

/* ===== UPLOAD PROFILE PICTURE ===== */
router.put(
  "/profile/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Cloudinary gives us a secure URL
      const imageUrl = req.file.path;

      const user = await User.findByIdAndUpdate(
        req.user.id,
        { profilePic: imageUrl },
        { new: true }
      ).select("-password");

      res.json({
        message: "Profile picture updated",
        profilePic: imageUrl,
        user,
      });
    } catch (err) {
      console.error("Avatar upload failed:", err);
      res.status(500).json({ message: "Failed to upload profile picture" });
    }
  }
);

/* ===== CHANGE PASSWORD ===== */
router.put("/profile/password", auth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id);
  const match = await bcrypt.compare(currentPassword, user.password);

  if (!match) {
    return res.status(400).json({ message: "Wrong password" });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.json({ message: "Password updated" });
});

/* ===== DELETE ACCOUNT ===== */
router.delete("/profile", auth, async (req, res) => {
  await User.findByIdAndDelete(req.user.id);
  res.json({ message: "Account deleted" });
});

module.exports = router;
