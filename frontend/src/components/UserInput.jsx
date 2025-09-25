import React, { useContext, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { SendIcon } from "./icons";

export default function UserInput() {
  const { sendMessage } = useContext(ChatContext);
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage(text);
    setText("");
  };

  return (
    <div className="p-4 border-t border-gray-200 flex items-center relative">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && handleSend()}
        placeholder="Type your message..."
        className="flex-1 py-2 px-4 rounded-full bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
      />
      <button
        onClick={handleSend}
        disabled={!text.trim()}
        className="ml-2 bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition-all duration-200 disabled:bg-blue-300"
      >
        <SendIcon />
      </button>
    </div>
  );
}
