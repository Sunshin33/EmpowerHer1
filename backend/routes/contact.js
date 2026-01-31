const express = require("express");
const Contact = require("../models/Contact");
const auth = require("../middleware/auth");

const router = express.Router();

/* ===== GET CONTACTS ===== */
router.get("/", auth, async (req, res) => {
  const contacts = await Contact.find({ userId: req.user.id })
    .sort({ createdAt: -1 });

  res.json(contacts);
});

/* ===== CREATE CONTACT ===== */
router.post("/", auth, async (req, res) => {
  const contact = await Contact.create({
    ...req.body,
    userId: req.user.id,
  });

  res.status(201).json(contact);
});

/* ===== DELETE CONTACT ===== */
router.delete("/:id", auth, async (req, res) => {
  await Contact.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.id,
  });

  res.json({ message: "Contact deleted" });
});

module.exports = router;
