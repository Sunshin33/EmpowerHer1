const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    relation: {
      type: String,
      default: "other",
    },
    name: {
      type: String,
      required: true,
    },
    address: String,
    phone1: {
      type: String,
      required: true,
    },
    phone2: String,
    email: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contact", ContactSchema);
