const User = require("../models/User");

module.exports = async function adminAuth(req, res, next) {
  try {
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    next();
  } catch (err) {
    console.error("Admin auth error:", err);
    res.status(500).json({ message: "Admin authorization failed" });
  }
};
