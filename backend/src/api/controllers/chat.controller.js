const Message = require("../models/message.model");
const { getBotResponse } = require("../../services/bot.service");

/**
 * Send a message to the bot
 * POST /api/chat
 * Body: { text: string, language: string (optional) }
 */
exports.sendMessage = async (req, res) => {
  try {
    const { text, language, history } = req.body;

    // Validate input
    if (!text || text.trim() === "") {
      return res.status(400).json({ error: "Message text is required" });
    }

    const lang = language || "en";

    // Save user message
    const userMessage = await Message.create({
      sender: "user",
      text: text.trim(),
      language: lang,
    });

    // Get bot response
    const botResponse = await getBotResponse(text, lang, history || []);

    // Save bot response
    const botMessage = await Message.create({
      sender: "bot",
      text: botResponse.response,
      language: lang,
    });

    // Return bot response text and quick replies
    res.json({ response: botMessage.text, quickReplies: botResponse.quickReplies });
  } catch (error) {
    console.error("ERROR in sendMessage:", error);
    res.status(500).json({ error: "Server error" });
  }
};
