import React, { useState } from 'react';
import { Languages, ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
    { code: 'ar', name: 'العربية', nativeName: 'العربية', flag: '🇲🇦' },
    { code: 'fr', name: 'Français', nativeName: 'Français', flag: '🇫🇷' }
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  const handleLanguageChange = (langCode) => {
    setLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-xl text-white/90 hover:text-brand-amber-200 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm group"
        aria-label="Change Language"
      >
        <Languages className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
        <span className="hidden md:inline text-sm font-medium">
          {currentLanguage?.flag} {currentLanguage?.nativeName}
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Enhanced Dropdown */}
          <div className="absolute top-full right-0 mt-3 w-56 bg-white dark:bg-gray-800 border border-brand-neutral-100 dark:border-gray-700 rounded-2xl shadow-warm z-20 overflow-hidden animate-scale-in">
            <div className="py-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`w-full text-left px-4 py-3 text-sm hover:bg-brand-teal-50 dark:hover:bg-gray-700 transition-all duration-300 flex items-center space-x-3 group ${
                    language === lang.code
                      ? 'bg-brand-teal-50 dark:bg-gray-700 text-brand-teal-700 dark:text-brand-amber-400 shadow-sm'
                      : 'text-brand-neutral-700 dark:text-gray-300 hover:text-brand-teal-700 dark:hover:text-brand-amber-400'
                  }`}
                >
                  <span className="text-lg group-hover:scale-110 transition-transform duration-200">{lang.flag}</span>
                  <div className="flex-1">
                    <div className="font-medium">{lang.nativeName}</div>
                    <div className="text-xs text-brand-neutral-500 dark:text-gray-400">{lang.name}</div>
                  </div>
                  {language === lang.code && (
                    <span className="text-brand-teal-600 dark:text-brand-amber-400 font-bold text-lg">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSwitcher;
