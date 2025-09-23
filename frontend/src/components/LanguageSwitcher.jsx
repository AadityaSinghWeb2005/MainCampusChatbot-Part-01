import React, { useContext } from 'react';
import { ChatContext } from '../context/ChatContext';

export default function LanguageSwitcher() {
  const { currentLang, switchLanguage } = useContext(ChatContext);

  const handleLanguageChange = () => {
    const newLang = currentLang === 'en' ? 'hi' : 'en';
    switchLanguage(newLang);
  };

  return (
    <button
      onClick={handleLanguageChange}
      className="bg-white/20 hover:bg-white/30 text-white font-semibold py-1 px-3 rounded-full text-sm transition-colors"
      title={`Switch to ${currentLang === 'en' ? 'Hindi' : 'English'}`}
    >
      {currentLang === 'en' ? 'हिंदी' : 'English'}
    </button>
  );
}
