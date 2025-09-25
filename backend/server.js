require('dotenv').config({ path: require('path').resolve(process.cwd(), '.env') });
const express = require('express');
const cors = require('cors');
const path = require('path');
const { getBotResponse } = require('./src/services/bot.service');

const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));

// --- API Routes ---

// Chat messages route
app.post('/api/chat', async (req, res) => {
  try {
    const { text, language, history } = req.body;
    const botResponse = await getBotResponse(text, language, history);
    res.json(botResponse);
  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({ response: 'Sorry, something went wrong on my end.' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
