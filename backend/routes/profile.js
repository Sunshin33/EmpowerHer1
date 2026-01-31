const router = require("express").Router();
const auth = require("../middleware/auth");
const profileController = require("../controllers/profileController");

/* ============================
   GET MY PROFILE
============================ */
router.get("/", auth, profileController.getMyProfile);

/* ============================
   SOCIAL LINKS
============================ */
router.post("/social-links", auth, profileController.addSocialLink);
router.delete("/social-links/:index", auth, profileController.deleteSocialLink);

router.put("/change-email", auth, async (req, res) => {
  try {
    const { newEmail, password } = req.body;

    if (!newEmail || !password) {
      return res.status(400).json({ msg: "Missing fields" });
    }

    const user = await User.findById(req.user.id).select("+password");

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid password" });
    }

    user.email = newEmail.toLowerCase();
    await user.save();

    res.json({ success: true, email: user.email });
  } catch (err) {
    console.error("Change email error:", err);
    res.status(500).json({ msg: "Failed to change email" });
  }
});

const speakeasy = require("speakeasy");
const QRCode = require("qrcode");

/* ===== INIT 2FA ===== */
router.post("/2fa/setup", auth, async (req, res) => {
  const secret = speakeasy.generateSecret();

  const qr = await QRCode.toDataURL(secret.otpauth_url);

  await User.findByIdAndUpdate(req.user.id, {
    twoFactorSecret: secret.base32,
  });

  res.json({ qr });
});

/* ===== VERIFY & ENABLE 2FA ===== */
router.post("/2fa/verify", auth, async (req, res) => {
  const { token } = req.body;

  const user = await User.findById(req.user.id);

  const verified = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: "base32",
    token,
  });

  if (!verified) {
    return res.status(400).json({ msg: "Invalid 2FA code" });
  }

  user.twoFactorEnabled = true;
  await user.save();

  res.json({ success: true });
});

module.exports = router;
