const crypto = require("crypto");

const algorithm = "aes-256-cbc";

if (!process.env.JOURNAL_SECRET) {
  throw new Error("❌ JOURNAL_SECRET is missing in .env");
}

const key = Buffer.from(process.env.JOURNAL_SECRET, "hex");
const ivLength = 16;

exports.encrypt = (text) => {
  const iv = crypto.randomBytes(ivLength);
  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  return iv.toString("hex") + ":" + encrypted;
};

exports.decrypt = (text) => {
  const [ivHex, encryptedText] = text.split(":");

  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv(algorithm, key, iv);

  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
};
