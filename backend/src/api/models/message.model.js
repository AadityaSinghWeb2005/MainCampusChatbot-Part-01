const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: { type: String, enum: ["user", "bot"], required: true },
    text: { type: String, required: true },
    language: { type: String, default: "en" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
