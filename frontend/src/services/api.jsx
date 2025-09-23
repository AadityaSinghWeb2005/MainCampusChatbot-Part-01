import axios from "axios";

export const sendChatRequest = async (text, language = "en", history = []) => {
  try {
    const response = await axios.post("http://localhost:5000/api/chat", {
      text,
      language,
      history,
    });
    // Backend now sends: { response: "...", quickReplies: [...] }
    return response.data;
  } catch (error) {
    console.error("API error:", error);
    return {
      response: "Sorry, I could not process that.",
      quickReplies: [],
    }; // fallback
  }
};
