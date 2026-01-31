const express = require("express");
const Journal = require("../models/Journal");
const auth = require("../middleware/auth");
const { encrypt, decrypt } = require("../utils/encrypt");

const router = express.Router();

/* GET JOURNALS */
router.get("/", auth, async (req, res) => {
  const journals = await Journal.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(
    journals.map(j => ({
      _id: j._id,
      title: j.title,
      text: decrypt(j.encryptedText),
      createdAt: j.createdAt,
      updatedAt: j.updatedAt,
    }))
  );
});

router.post("/", auth, async (req, res) => {
  const { title, text } = req.body;

  const encryptedText = encrypt(text);

  const journal = await Journal.create({
    user: req.user.id,
    title,
    encryptedText,
  });

  res.status(201).json({
    _id: journal._id,
    title: journal.title,
    text,
    createdAt: journal.createdAt,
    updatedAt: journal.updatedAt,
  });
});

/* UPDATE JOURNAL */
router.put("/:id", auth, async (req, res) => {
  const { title, text } = req.body;

  const journal = await Journal.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!journal) {
    return res.status(404).json({ message: "Journal not found" });
  }

  if (title) journal.title = title;
  if (text) journal.encryptedText = encrypt(text);

  await journal.save();

  res.json({
    _id: journal._id,
    title: journal.title,
    text,
    createdAt: journal.createdAt,
    updatedAt: journal.updatedAt,
  });
});

/* DELETE JOURNAL */
router.delete("/:id", auth, async (req, res) => {
  const journal = await Journal.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!journal) {
    return res.status(404).json({ message: "Journal not found" });
  }

  res.json({ message: "Journal deleted" });
});

module.exports = router;
