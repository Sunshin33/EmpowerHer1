const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");



/* ================= APP ================= */
const app = express();

/* ================= SECURITY ================= */
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5000",
  process.env.FRONTEND_URL || "https://your-frontend-domain.com", // 🔴 Set FRONTEND_URL in .env
];

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(helmet());
app.use("/api", apiLimiter);

/* ================= MIDDLEWARE ================= */
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

/* ================= STATIC FILES ================= */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ================= ROUTES ================= */
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");
const journalRoutes = require("./routes/journals");
const contactRoutes = require("./routes/contact");
const profileRoutes = require("./routes/profile");

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/journals", journalRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/admin", adminRoutes);

/* ================= ROOT ================= */
app.get("/api", (req, res) => {
  res.send("🚀 EmpowerHer API is running");
});

/* ================= SERVE REACT FRONTEND ================= */
if (process.env.NODE_ENV === "production") {
  const buildPath = path.join(__dirname, "..", "build");
  app.use(express.static(buildPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(buildPath, "index.html"));
  });
}

/* ================= DATABASE ================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Atlas connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection failed");
    console.error(err.message);
  });

/* ================= GLOBAL ERROR ================= */
app.use((err, req, res, next) => {
  console.error("🔥 GLOBAL ERROR HANDLER:", err.message);
  res.status(500).json({ msg: err.message || "Server error" });
});

/* ================= START ================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;
