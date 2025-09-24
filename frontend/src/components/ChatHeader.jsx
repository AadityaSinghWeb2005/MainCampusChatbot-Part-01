import React from "react";
import LanguageSwitcher from "./LanguageSwitcher";

export default function ChatHeader() {
  return (
    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-lg">
      <div className="flex items-center">
        <div className="p-2 bg-blue-800 rounded-full shadow flex items-center justify-center">
          {/* Bot Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="white" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5zm0-6c-1.66 0-3 1.34-3 3h-1.5c0-2.49 2.01-4.5 4.5-4.5s4.5 2.01 4.5 4.5h-1.5c0-1.66-1.34-3-3-3z"/>
          </svg>
        </div>
        <div className="ml-3">
          <div className="text-lg font-semibold">Campus Bot</div>
          <div className="text-xs text-green-200 flex items-center">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>Online
          </div>
        </div>
      </div>
      <LanguageSwitcher />
    </div>
  );
}
