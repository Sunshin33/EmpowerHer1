const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth");
const router = express.Router();


router.get("/profile", auth, (req, res) => {
  res.json(req.user);
});


//* SIGN UP */
router.post("/signup", async (req, res) => {
  try {
    const { email, password, ...rest } = req.body;

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ msg: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashed,
      ...rest,
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Signup failed" });
  }
});


/* LOGIN */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ msg: "Wrong password" });

  // If 2FA is enabled, require token
  if (user.twoFactorEnabled) {
    return res.json({ twoFactorRequired: true, userId: user._id });
  }

  // Otherwise, issue JWT
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ token, user });
});


/* GET CURRENT USER */
router.get("/me", auth, (req, res) => {
  res.json({ user: req.user });
});


router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
  res.json({ msg: "Logged out" });
});

router.post("/2fa/login", async (req, res) => {
  const { userId, token } = req.body;

  const user = await User.findById(userId);
  if (!user) return res.status(400).json({ msg: "User not found" });

  if (!user.twoFactorEnabled)
    return res.status(400).json({ msg: "2FA not enabled for this user" });

  const verified = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: "base32",
    token,
  });

  if (!verified) return res.status(400).json({ msg: "Invalid 2FA token" });

  // Issue JWT
  const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

  res.cookie("token", jwtToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ token: jwtToken, user });
});

router.post("/2fa/disable", auth, async (req, res) => {
  const { password, token } = req.body;

  const user = await User.findById(req.user.id).select("+password");
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ msg: "Incorrect password" });

  const verified = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: "base32",
    token,
  });

  if (!verified) return res.status(400).json({ msg: "Invalid 2FA token" });

  user.twoFactorEnabled = false;
  user.twoFactorSecret = undefined;
  await user.save();

  res.json({ success: true, msg: "2FA disabled" });
});

module.exports = router;
