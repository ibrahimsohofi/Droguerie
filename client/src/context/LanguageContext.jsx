import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../translations/index.js';

const LanguageContext = createContext();

// Export the context as well for direct use
export { LanguageContext };

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Hook to use translations
export const useTranslations = () => {
  const { language } = useLanguage();
  return translations[language] || translations.ar; // Default to Arabic
};

export const LanguageProvider = ({ children }) => {
  // Default to Arabic for Moroccan market
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('language');
    return saved || 'ar'; // Arabic as default
  });

  // Check if current language is RTL
  const isRTL = language === 'ar';

  // Direction for CSS
  const direction = isRTL ? 'rtl' : 'ltr';

  useEffect(() => {
    localStorage.setItem('language', language);

    // Set HTML attributes for proper RTL support
    document.documentElement.lang = language;
    document.documentElement.dir = direction;

    // Add RTL class to body for CSS styling
    if (isRTL) {
      document.body.classList.add('rtl');
      document.body.classList.remove('ltr');
    } else {
      document.body.classList.add('ltr');
      document.body.classList.remove('rtl');
    }

    // Update page title in current language
    const t = translations[language] || translations.ar;
    document.title = t.businessName || 'دروغيري جمال';
  }, [language, direction, isRTL]);

  const switchLanguage = (newLanguage) => {
    if (translations[newLanguage]) {
      setLanguage(newLanguage);
    }
  };

  // Get language info
  const getLanguageInfo = (lang) => {
    const languageInfo = {
      ar: { name: 'العربية', nativeName: 'العربية', flag: '🇲🇦', dir: 'rtl' },
      en: { name: 'English', nativeName: 'English', flag: '🇺🇸', dir: 'ltr' },
      fr: { name: 'Français', nativeName: 'Français', flag: '🇫🇷', dir: 'ltr' }
    };
    return languageInfo[lang] || languageInfo.ar;
  };

  // Get current language display name
  const getCurrentLanguageName = () => {
    return getLanguageInfo(language).nativeName;
  };

  // Get available languages
  const availableLanguages = [
    { code: 'ar', ...getLanguageInfo('ar') },
    { code: 'en', ...getLanguageInfo('en') },
    { code: 'fr', ...getLanguageInfo('fr') }
  ];

  // Format currency for Moroccan Dirham
  const formatCurrency = (amount) => {
    const t = translations[language] || translations.ar;
    const formattedAmount = new Intl.NumberFormat(
      language === 'ar' ? 'ar-MA' :
      language === 'fr' ? 'fr-MA' : 'en-US',
      {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      }
    ).format(amount);

    return isRTL ?
      `${formattedAmount} ${t.currency}` :
      `${t.currency} ${formattedAmount}`;
  };

  // Format numbers according to language
  const formatNumber = (number) => {
    return new Intl.NumberFormat(
      language === 'ar' ? 'ar-MA' :
      language === 'fr' ? 'fr-MA' : 'en-US'
    ).format(number);
  };

  // Translation function to get nested values
  const t = (key) => {
    const currentTranslations = translations[language] || translations.ar;
    return key.split('.').reduce((obj, k) => obj && obj[k], currentTranslations) || key;
  };

  const value = {
    language,
    setLanguage: switchLanguage,
    changeLanguage: switchLanguage,
    isRTL,
    direction,
    translations: translations[language] || translations.ar,
    availableLanguages,
    getCurrentLanguageName,
    getLanguageInfo,
    formatCurrency,
    formatNumber,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
