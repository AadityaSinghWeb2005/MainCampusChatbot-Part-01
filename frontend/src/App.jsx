import React from "react";
import ChatContainer from "./components/ChatContainer";
import { ChatProvider } from "./context/ChatContext";

export default function App() {
  return (
    <ChatProvider>
      <ChatContainer />
    </ChatProvider>
  );
}
