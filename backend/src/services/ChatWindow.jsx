import React from 'react';
import MessageList from './MessageList';
import UserInput from './UserInput';
import QuickReplies from './QuickReplies';

export default function ChatWindow() {
  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto bg-white shadow-2xl rounded-lg">
      <header className="p-4 border-b border-gray-200 bg-blue-500 text-white rounded-t-lg">
        <h1 className="text-xl font-semibold text-center">CampusBot</h1>
      </header>
      <MessageList />
      <QuickReplies />
      <UserInput />
    </div>
  );
}