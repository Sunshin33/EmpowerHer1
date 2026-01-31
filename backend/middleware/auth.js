const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async function auth(req, res, next) {
  try {
    let token = null;

    // 1️⃣ Try cookie token first
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // 2️⃣ Fallback to Bearer token
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;

      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    // 3️⃣ No token found
    if (!token) {
      return res.status(401).json({ msg: "No token, authorization denied" });
    }

    // 4️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5️⃣ Load user
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ msg: "User not found" });
    }

    // 6️⃣ Attach user to request
    req.user = user;

    next();
  } catch (err) {
    console.error("Auth middleware error:", err.message);
    return res.status(401).json({
      msg: "Token invalid or expired",
    });
  }
};
