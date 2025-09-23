import React, { useContext } from "react";
import { ChatContext } from "../context/ChatContext";

export default function QuickReplies() {
  const { quickReplies, sendMessage } = useContext(ChatContext);

  const handleClick = (reply) => {
    sendMessage(reply);
  };

  if (!quickReplies || quickReplies.length === 0) return null;

  return (
    <div className="p-4 flex flex-wrap gap-2 justify-center">
      {quickReplies.map((reply, idx) => (
        <button
          key={idx}
          className="quick-reply-btn bg-blue-100 text-blue-700 py-2 px-4 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors duration-200 shadow"
          onClick={() => handleClick(reply)}
        >
          {reply}
        </button>
      ))}
    </div>
  );
}
