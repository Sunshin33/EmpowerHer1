const cloudinary = require("../config/cloudinary");
const fs = require("fs");

const Post = require("../models/Post");

const BASE_URL = process.env.BASE_URL || "http://localhost:5000";

/* ======================
   CREATE POST
====================== */
exports.createPost = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;

    let mediaUrl = null;
    let mediaType = null;

    if (req.file) {
      // IMAGE or VIDEO → Cloudinary
      if (
        req.file.mimetype.startsWith("image") ||
        req.file.mimetype.startsWith("video")
      ) {
        const result = await cloudinary.uploader.upload(req.file.path, {
          resource_type: req.file.mimetype.startsWith("video")
            ? "video"
            : "image",
          folder: "empowerher",
        });

        mediaUrl = result.secure_url;
        mediaType = req.file.mimetype;

        // delete local temp file
        fs.unlinkSync(req.file.path);
      } else {
        // DOCS & PDFs → KEEP LOCAL
        mediaUrl = `${BASE_URL}/uploads/${req.file.filename}`;
        mediaType = req.file.mimetype;
      }
    }

    const postData = {
      title: req.body.title || "",
      caption: req.body.caption || "",
      articleHtml: req.body.articleHtml || null,
      anonymous: req.body.anonymous === "true",
      user: userId,

      mediaUrl,
      mediaType,
      fileName: req.file ? req.file.originalname : null,
      fileSize: req.file ? req.file.size : null,

      contentType: "article",
    };

    if (req.file) {
      if (mediaType.startsWith("image")) postData.contentType = "image";
      else if (mediaType.startsWith("video")) postData.contentType = "video";
      else if (mediaType === "application/pdf") postData.contentType = "pdf";
      else postData.contentType = "doc";
    }

    const post = await Post.create(postData);
    res.status(201).json(post);
  } catch (err) {
    console.error("Create post error:", err);
    res.status(500).json({
      msg: "Post creation failed",
      error: err.message,
    });
  }
};


/* ======================
   GET ALL POSTS
====================== */
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find({ archived: false })
      .sort({ createdAt: -1 })
      .populate("user", "fullName");

    res.json(posts);
  } catch (err) {
    console.error("Get posts error:", err);
    res.status(500).json({ msg: "Failed to fetch posts" });
  }
};

/* ======================
   GET MY POSTS
====================== */
exports.getMyPosts = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;

    const posts = await Post.find({
      user: userId,
      archived: false,
    }).sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    console.error("Get my posts error:", err);
    res.status(500).json({ msg: "Failed to fetch user posts" });
  }
};

/* ======================
   UPDATE POST
====================== */
exports.updatePost = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;

    const updates = {
      title: req.body.title,
      caption: req.body.caption,
      anonymous:
        req.body.anonymous === true || req.body.anonymous === "true",
    };

    if (req.file) {
      let mediaUrl = null;
      let mediaType = null;

      if (
        req.file.mimetype.startsWith("image") ||
        req.file.mimetype.startsWith("video")
      ) {
        const result = await cloudinary.uploader.upload(req.file.path, {
          resource_type: req.file.mimetype.startsWith("video")
            ? "video"
            : "image",
          folder: "empowerher",
        });

        mediaUrl = result.secure_url;
        mediaType = req.file.mimetype;

        fs.unlinkSync(req.file.path);
      } else {
        mediaUrl = `${BASE_URL}/uploads/${req.file.filename}`;
        mediaType = req.file.mimetype;
      }

      updates.mediaUrl = mediaUrl;
      updates.mediaType = mediaType;
      updates.fileName = req.file.originalname;
      updates.fileSize = req.file.size;

      if (mediaType.startsWith("image")) updates.contentType = "image";
      else if (mediaType.startsWith("video")) updates.contentType = "video";
      else if (mediaType === "application/pdf") updates.contentType = "pdf";
      else updates.contentType = "doc";
    }

    const post = await Post.findOneAndUpdate(
      { _id: req.params.id, user: userId },
      updates,
      { new: true }
    );

    if (!post) {
      return res
        .status(404)
        .json({ msg: "Post not found or unauthorized" });
    }

    res.json(post);
  } catch (err) {
    console.error("Update post error:", err);
    res.status(500).json({ msg: "Update failed" });
  }
};


/* ======================
   DELETE POST
====================== */
exports.deletePost = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;

    const post = await Post.findOneAndDelete({
      _id: req.params.id,
      user: userId,
    });

    if (!post) {
      return res
        .status(404)
        .json({ msg: "Post not found or unauthorized" });
    }

    res.json({ msg: "Post deleted" });
  } catch (err) {
    console.error("Delete post error:", err);
    res.status(500).json({ msg: "Delete failed" });
  }
};

/* ======================
   TOGGLE REACTION
====================== */
exports.reactToPost = async (req, res) => {
  try {
    const { type } = req.body;
    const userId = req.user?.id || req.user?._id;

    if (!["like", "love", "sad"].includes(type)) {
      return res.status(400).json({ msg: "Invalid reaction type" });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    let userHadReaction = false;

    ["like", "love", "sad"].forEach((r) => {
      if (post.reactionUsers[r].some(id => id.toString() === userId.toString())) {
        userHadReaction = true;
      }

      post.reactionUsers[r] = post.reactionUsers[r].filter(
        (id) => id.toString() !== userId.toString()
      );
    });

    if (!userHadReaction) {
      post.reactionUsers[type].push(userId);
    }

    post.reactions.like = post.reactionUsers.like.length;
    post.reactions.love = post.reactionUsers.love.length;
    post.reactions.sad = post.reactionUsers.sad.length;

    await post.save();
    res.json(post);
  } catch (err) {
    console.error("React error:", err);
    res.status(500).json({ msg: "Reaction failed" });
  }
};

/* ======================
   GET POST BY ID
====================== */
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("user", "fullName email");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (err) {
    console.error("Get post by ID error:", err);
    res.status(500).json({ message: "Failed to fetch post" });
  }
};

/* ======================
   ARCHIVE POST
====================== */
exports.archivePost = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    if (post.user.toString() !== userId.toString()) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    post.archived = true;
    await post.save();

    res.json(post);
  } catch (err) {
    console.error("ArchivePost error:", err);
    res.status(500).json({ msg: "Archive failed" });
  }
};

/* ======================
   RESTORE POST
====================== */
exports.restorePost = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;

    const post = await Post.findOneAndUpdate(
      { _id: req.params.id, user: userId },
      { archived: false },
      { new: true }
    );

    if (!post) {
      return res
        .status(404)
        .json({ msg: "Post not found or unauthorized" });
    }

    res.json({ msg: "Post restored", post });
  } catch (err) {
    console.error("Restore post error:", err);
    res.status(500).json({ msg: "Failed to restore post" });
  }
};

/* ======================
   GET MY ARCHIVED POSTS
====================== */
exports.getMyArchivedPosts = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;

    const posts = await Post.find({
      user: userId,
      archived: true,
    }).sort({ updatedAt: -1 });

    res.json(posts);
  } catch (err) {
    console.error("Get archived posts error:", err);
    res.status(500).json({ msg: "Failed to fetch archived posts" });
  }
};
