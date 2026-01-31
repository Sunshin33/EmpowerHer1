const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true },
    caption: { type: String, trim: true },

    // FILE / MEDIA
    mediaUrl: String,
    mediaType: String,
    fileName: String,
    fileSize: Number,

    // CONTENT TYPE
    contentType: {
      type: String,
      enum: ["image", "video", "pdf", "doc", "ebook", "article"],
      default: "article",
    },

    // For long-form articles (TipTap)
    articleHtml: String,

    anonymous: Boolean,

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // REACTIONS COUNTS
    reactions: {
      like: { type: Number, default: 0 },
      love: { type: Number, default: 0 },
      sad: { type: Number, default: 0 }
    },

    // REACTION TOGGLES (WHO REACTED)
    reactionUsers: {
      like: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      love: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      sad: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published"
    },
    archived: {
  type: Boolean,
  default: false
},

isPinned: {
  type: Boolean,
  default: false
},
isInappropriate: {
  type: Boolean,
  default: false
},

  },
  {
    timestamps: true
  },
  
);


module.exports = mongoose.model("Post", postSchema);
