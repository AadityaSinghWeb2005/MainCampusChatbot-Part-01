const express = require("express");
const cors = require("cors");
const chatRoutes = require("./api/routes/chat.routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", chatRoutes);

module.exports = app;
