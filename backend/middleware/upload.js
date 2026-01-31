const multer = require("multer");
const path = require("path");

/* ======================
   FILE FILTER
====================== */
const fileFilter = (req, file, cb) => {
  // Allow images, videos, pdfs, docs
  const allowedTypes = [
    "image/",
    "video/",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  const isAllowed = allowedTypes.some(type =>
    file.mimetype.startsWith(type)
  );

  if (!isAllowed) {
    cb(new Error("Unsupported file type"), false);
  } else {
    cb(null, true);
  }
};

/* ======================
   STORAGE (LOCAL TEMP)
====================== */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // TEMP for cloudinary + permanent for docs
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

module.exports = upload;
