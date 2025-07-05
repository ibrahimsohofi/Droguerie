import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslations } from '../translations';

const LanguageContext = createContext();

export { LanguageContext };

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en'); // Default to English

  useEffect(() => {
    // Load language from localStorage or browser preference
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && ['ar', 'fr', 'en'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    } else {
      // Check browser language preference
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('ar')) {
        setLanguage('ar');
      } else if (browserLang.startsWith('fr')) {
        setLanguage('fr');
      }
    }
  }, []);

  const changeLanguage = (newLanguage) => {
    if (['ar', 'fr', 'en'].includes(newLanguage)) {
      setLanguage(newLanguage);
      localStorage.setItem('language', newLanguage);

      // Update document direction and lang attribute
      document.documentElement.dir = newLanguage === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = newLanguage;
    }
  };

  // Set initial document direction
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const translations = useTranslations(language);

  const t = (key) => {
    const keys = key.split('.');
    let value = translations;
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) break;
    }
    return value || key;
  };

  const value = {
    language,
    changeLanguage,
    isRTL: language === 'ar',
    t,
    translations
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
