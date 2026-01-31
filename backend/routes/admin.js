const express = require("express");
const User = require("../models/User");
const Post = require("../models/Post");
const Report = require("../models/Report");
const auth = require("../middleware/auth");
const admin = require("../middleware/adminAuth");

const router = express.Router();

/* ===== ADMIN STATS ===== */
router.get("/stats", auth, admin, async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const postsToday = await Post.countDocuments({
      createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
    });
    const anonymousPosts = await Post.countDocuments({ anonymous: true });
    const flaggedPosts = await Report.countDocuments();

    res.json({
      usersCount,
      postsToday,
      anonymousPosts,
      flaggedPosts
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to load admin stats" });
  }
});

/* ===== LIST USERS ===== */
router.get("/users", auth, admin, async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

/* ===== BAN / UNBAN USER ===== */
router.put("/users/:id/ban", auth, admin, async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isBanned: true },
    { new: true }
  ).select("-password");

  res.json(user);
});

/* ===== UNBAN USER ===== */
router.put("/users/:id/unban", auth, admin, async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isBanned: false },
    { new: true }
  ).select("-password");

  res.json(user);
});
/* =========================
   POSTS MODERATION
========================= */

// GET all posts (admin view)
router.get("/posts", auth, admin, async (req, res) => {
  const posts = await Post.find()
    .populate("user", "fullName email")
    .sort({ createdAt: -1 });

  res.json(posts);
});

// Delete post
router.delete("/posts/:id", auth, admin, async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.json({ msg: "Post deleted" });
});

// Pin / Unpin post
router.put("/posts/:id/pin", auth, admin, async (req, res) => {
  const post = await Post.findById(req.params.id);
  post.isPinned = !post.isPinned;
  await post.save();
  res.json(post);
});

// Mark inappropriate
router.put("/posts/:id/inappropriate", auth, admin, async (req, res) => {
  const post = await Post.findById(req.params.id);
  post.isInappropriate = !post.isInappropriate;
  await post.save();
  res.json(post);
});

/* =========================
   REPORTED CONTENT
========================= */

router.get("/reports", auth, admin, async (req, res) => {
  const reports = await Report.find()
    .populate("post")
    .populate("reportedBy", "fullName email")
    .sort({ createdAt: -1 });

  res.json(reports);
});

module.exports = router;
