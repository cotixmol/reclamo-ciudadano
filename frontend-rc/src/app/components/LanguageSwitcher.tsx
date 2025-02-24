'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FiChevronDown } from 'react-icons/fi'; // Import Chevron icon from React Icons

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setCurrentLang(i18n.language);
  }, [i18n.language]);

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const getFlag = (lang: string) => {
    switch (lang) {
      case 'en':
        return '🇺🇸';
      case 'es':
        return '🇪🇸';
      default:
        return '🌐';
    }
  };

  return (
    <div className="relative inline-block">
      {/* Toggle Button */}
      <button
        onClick={toggleDropdown}
        className="inline-flex items-center px-4 py-2 hover:bg-RCColors-700 text-xs font-medium rounded-md"
      >
        <div className="flex items-center gap-2">
          <span className="">{getFlag(currentLang)}</span>
          <span>{currentLang.toUpperCase()}</span>
        </div>
        <FiChevronDown className="ml-1 h-4 w-4" />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 font-medium rounded-md bg-RCColors-800 z-10">
          <ul>
            <li
              onClick={() => handleLanguageChange('en')}
              className={`block px-4 py-2 text-xs rounded-t-md cursor-pointer hover:bg-RCColors-700 ${
                currentLang === 'en' ? 'bg-primary' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <span>🇺🇸</span>
                <span>EN</span>
              </div>
            </li>
            <li
              onClick={() => handleLanguageChange('es')}
              className={`block px-4 py-2 text-xs rounded-b-md cursor-pointer hover:bg-RCColors-700 ${
                currentLang === 'es' ? 'bg-primary' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <span>🇪🇸</span>
                <span>ES</span>
              </div>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
