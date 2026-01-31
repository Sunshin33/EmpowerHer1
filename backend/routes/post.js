const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const postController = require("../controllers/postController");
const Report = require("../models/Report");
const multer = require("multer");

/* =======================
   GET POSTS
======================= */
router.get("/", postController.getPosts);
router.get("/mine", auth, postController.getMyPosts);
router.get("/mine/archived", auth, postController.getMyArchivedPosts);

/* =======================
   CREATE POST
======================= */
router.post(
  "/",
  auth,
  upload.single("file"),
  (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ msg: err.message });
    } else if (err) {
      return res.status(400).json({ msg: err.message });
    }
    next();
  },
  postController.createPost
);

/* =======================
   REACT TO POST
======================= */
router.post("/:id/react", auth, postController.reactToPost);

/* =======================
   ARCHIVE + RESTORE
======================= */
router.patch("/:id/archive", auth, postController.archivePost);
router.put("/:id/restore", auth, postController.restorePost);

/* =======================
   REPORT POST
======================= */
router.post("/:id/report", auth, async (req, res) => {
  try {
    const report = await Report.create({
      post: req.params.id,
      reporter: req.user.id,
      reason: req.body.reason || "Inappropriate content",
    });

    res.json({ success: true, report });
  } catch (err) {
    console.error("Report error:", err);
    res.status(500).json({ msg: "Report failed" });
  }
});

/* =======================
   SINGLE POST
======================= */
router.get("/:id", postController.getPostById);

/* =======================
   UPDATE + DELETE
======================= */
router.put("/:id", auth, upload.single("file"), postController.updatePost);
router.delete("/:id", auth, postController.deletePost);

module.exports = router;
