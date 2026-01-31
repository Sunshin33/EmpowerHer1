const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    fullName: {
      type: String,
      required: true,
    },

    age: {
      type: Number,
    },

    bio: {
      type: String,
    },

    profilePic: {
      type: String, // Cloudinary URL
    },

    /* 🔗 SOCIAL LINKS */
    socialLinks: [
      {
        platform: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],

    /* 🔐 ADMIN & MODERATION */
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    isBanned: {
      type: Boolean,
      default: false,
    },

    isSuspended: {
      type: Boolean,
      default: false,
    },

    /* ✅ VERIFICATION SYSTEM */
    isVerified: {
      type: Boolean,
      default: false,
    },

    verificationDoc: {
      type: String, // Cloudinary URL of ID/selfie/doc
    },

    verificationStatus: {
      type: String,
      enum: ["none", "pending", "approved", "rejected"],
      default: "none",
    },

    suspensionReason: {
      type: String,
    },

    twoFactorEnabled: {
  type: Boolean,
  default: false,
},
twoFactorSecret: {
  type: String,
},

  },
  { timestamps: true } // ⭐ Needed for admin dashboard stats
);

module.exports = mongoose.model("User", UserSchema);
