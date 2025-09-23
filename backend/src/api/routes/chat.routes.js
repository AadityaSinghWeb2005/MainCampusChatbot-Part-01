const express = require("express");
const router = express.Router();
const { sendMessage } = require("../controllers/chat.controller");

router.post("/chat", sendMessage);

module.exports = router;
