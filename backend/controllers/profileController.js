const User = require("../models/User");

/* ============================
   GET MY PROFILE
============================ */
exports.getMyProfile = async (req, res) => {
  try {
    res.json(req.user);
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ message: "Failed to get profile" });
  }
};

/* ============================
   ADD SOCIAL LINK
============================ */
exports.addSocialLink = async (req, res) => {
  try {
    const { platform, url } = req.body;

    if (!platform || !url) {
      return res.status(400).json({ message: "Platform and URL required" });
    }

    const user = await User.findById(req.user.id);

    user.socialLinks.push({ platform, url });
    await user.save();

    res.json(user.socialLinks);
  } catch (err) {
    console.error("Add social link error:", err);
    res.status(500).json({ message: "Failed to add social link" });
  }
};

/* ============================
   DELETE SOCIAL LINK
============================ */
exports.deleteSocialLink = async (req, res) => {
  try {
    const index = Number(req.params.index);

    const user = await User.findById(req.user.id);

    if (!user.socialLinks[index]) {
      return res.status(404).json({ message: "Social link not found" });
    }

    user.socialLinks.splice(index, 1);
    await user.save();

    res.json(user.socialLinks);
  } catch (err) {
    console.error("Delete social link error:", err);
    res.status(500).json({ message: "Failed to delete social link" });
  }
};

exports.changeEmail = async (req, res) => {
  try {
    const { newEmail, password } = req.body;
    const user = req.user;

    if (!newEmail || !password) {
      return res.status(400).json({ msg: "Email and password required" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Incorrect password" });
    }

    user.email = newEmail;
    await user.save();

    res.json({ success: true, email: newEmail });
  } catch (err) {
    console.error("Change email error:", err);
    res.status(500).json({ msg: "Failed to change email" });
  }
};
