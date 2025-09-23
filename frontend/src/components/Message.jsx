import React from 'react';
import { BotIcon, UserIcon } from './icons';

export default function Message({ message }) {
  const { text, sender, timestamp } = message;
  const isBot = sender === 'bot';

  const formatTime = (date) => {
    if (!(date instanceof Date) || isNaN(date)) {
      return '';
    }
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex items-end gap-2 my-2 ${isBot ? 'justify-start' : 'justify-end'} animate-fade-in-up`}>
      {isBot && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
          <BotIcon />
        </div>
      )}
      <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${isBot ? 'bg-gray-100 text-gray-800 rounded-bl-none' : 'bg-blue-500 text-white rounded-br-none'}`}>
        <p className="text-sm">{text}</p>
        <div className={`text-xs mt-1 text-right ${isBot ? 'text-gray-500' : 'text-blue-200'}`}>
          {formatTime(timestamp)}
        </div>
      </div>
      {!isBot && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
          <UserIcon />
        </div>
      )}
    </div>
  );
}