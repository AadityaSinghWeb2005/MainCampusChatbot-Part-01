import React, { createContext, useState } from "react";
import { sendChatRequest } from "../services/api.jsx";

export const ChatContext = createContext();

const welcomeMessages = {
  en: "Hello! I'm the CampusBot. How can I help you with admissions, courses, or campus life today?",
  hi: "नमस्ते! मैं कैंपस-बॉट हूँ। मैं आज प्रवेश, पाठ्यक्रम, या कैंपस जीवन में आपकी कैसे मदद कर सकता हूँ?",
};

const quickRepliesByLang = {
  en: ['Admissions', 'Courses', 'Campus Life'],
  hi: ['प्रवेश', 'कोर्स', 'कैंपस जीवन'],
};

export const ChatProvider = ({ children }) => {
  const [currentLang, setCurrentLang] = useState("en");
  const [messages, setMessages] = useState([
    {
      text: welcomeMessages[currentLang],
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [typing, setTyping] = useState(false);
  const [quickReplies, setQuickReplies] = useState(quickRepliesByLang[currentLang]);

  const addMessage = (messageData) => {
    const newMessage = { ...messageData, timestamp: new Date() };
    setMessages((prev) => [...prev, newMessage]);
  };

  const sendMessage = async (userMessage) => {
    if (!userMessage.trim()) return;

    const userMsgObject = { text: userMessage, sender: "user" };
    const updatedMessages = [...messages, userMsgObject];
    setMessages(updatedMessages);
    setTyping(true);
    setQuickReplies([]); // Clear replies while waiting for new ones

    // We'll time the API request and calculate a dynamic delay
    // to make the bot's typing feel more natural.
    const startTime = Date.now();
    const { response, quickReplies: newQuickReplies } = await sendChatRequest(
      userMessage,
      currentLang,
      updatedMessages // Pass the most up-to-date history
    );
    const apiDuration = Date.now() - startTime;

    // Calculate a typing delay based on the length of the response.
    // ~60ms per word, with a min of 500ms and a max of 2.5s.
    const typingDelay = Math.max(500, Math.min((response || '').split(' ').length * 60, 2500));

    if (apiDuration < typingDelay) {
      await new Promise(resolve => setTimeout(resolve, typingDelay - apiDuration));
    }

    addMessage({ text: response, sender: "bot" });
    setQuickReplies(newQuickReplies || []);
    setTyping(false);
  };

  const switchLanguage = (lang) => {
    if (lang === currentLang) return;

    setCurrentLang(lang);
    setMessages([
      {
        text: welcomeMessages[lang],
        sender: 'bot',
        timestamp: new Date(),
      }
    ]);
    setQuickReplies(quickRepliesByLang[lang]);
  };

  return (
    <ChatContext.Provider value={{ messages, addMessage, currentLang, switchLanguage, typing, setTyping, sendMessage, quickReplies, setQuickReplies }}>
      {children}
    </ChatContext.Provider>
  );
};
