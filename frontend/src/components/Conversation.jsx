import React, { useContext, useEffect, useRef } from "react";
import { ChatContext } from "../context/ChatContext";
import Message from "./Message";
import TypingIndicator from "./TypingIndicator";
import { BotIcon } from "./icons";

export default function Conversation() {
  const { messages, typing } = useContext(ChatContext);
  const convRef = useRef();

  useEffect(() => {
    convRef.current.scrollTop = convRef.current.scrollHeight;
  }, [messages, typing]);

  return (
    <div ref={convRef} className="conversation flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
      {messages.map((msg, idx) => (
        <Message key={idx} message={msg} />
      ))}
      {typing && (
        <div className="flex items-end gap-2 my-2 justify-start">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
            <BotIcon />
          </div>
          <div className="max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl bg-gray-100 text-gray-800 rounded-bl-none">
            <TypingIndicator />
          </div>
        </div>
      )}
    </div>
  );
}
