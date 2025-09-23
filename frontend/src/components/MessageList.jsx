import React, { useContext, useEffect, useRef } from 'react';
import { ChatContext } from '../context/ChatContext';
import Message from './Message';
import TypingIndicator from './TypingIndicator';

export default function MessageList() {
  const { messages, typing } = useContext(ChatContext);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typing]);

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      {messages.map((msg, index) => (
        <Message key={index} message={msg} />
      ))}
      {typing && <TypingIndicator />}
      <div ref={messagesEndRef} />
    </div>
  );
}