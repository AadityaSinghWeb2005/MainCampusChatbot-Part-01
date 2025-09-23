import React from "react";
import ChatHeader from "./ChatHeader";
import Conversation from "./Conversation";
import QuickReplies from "./QuickReplies";
import UserInput from "./UserInput";
// import EmojiPicker from "./EmojiPicker";

export default function ChatContainer() {
  return (
    <div className="chat-container relative w-full h-screen max-w-full bg-white shadow-lg flex flex-col">
      <ChatHeader />
      <Conversation />
      <QuickReplies />
      <UserInput />
      {/* <EmojiPicker /> */}
    </div>
  );
}
