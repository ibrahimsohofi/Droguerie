import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

// Enhanced Language Direction Component
export const LanguageDirection = ({ children, className = '' }) => {
  const { isRTL } = useLanguage();

  useEffect(() => {
    // Set document direction and lang attribute
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = isRTL ? 'ar' : 'fr';

    // Add CSS classes for RTL support
    if (isRTL) {
      document.body.classList.add('rtl');
      document.body.classList.remove('ltr');
    } else {
      document.body.classList.add('ltr');
      document.body.classList.remove('rtl');
    }
  }, [isRTL]);

  return (
    <div
      className={`${isRTL ? 'rtl' : 'ltr'} ${className}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {children}
    </div>
  );
};

// Smart Text Component with automatic translation
export const SmartText = ({
  keyPath,
  fallback = '',
  className = '',
  as: Component = 'span',
  interpolations = {},
  ...props
}) => {
  const { t } = useLanguage();

  const getText = () => {
    let text = t(keyPath) || fallback || keyPath;

    // Handle interpolations like {{name}}, {{count}}, etc.
    Object.keys(interpolations).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      text = text.replace(regex, interpolations[key]);
    });

    return text;
  };

  return (
    <Component className={className} {...props}>
      {getText()}
    </Component>
  );
};

// Currency Formatter with locale support
export const CurrencyFormatter = ({ amount, className = '' }) => {
  const { language } = useLanguage();

  const formatCurrency = (value) => {
    const numValue = parseFloat(value) || 0;

    if (language === 'ar') {
      return `${numValue.toFixed(2)} درهم`;
    } else {
      return `${numValue.toFixed(2)} DH`;
    }
  };

  return (
    <span className={className}>
      {formatCurrency(amount)}
    </span>
  );
};

// Date Formatter with locale support
export const DateFormatter = ({ date, className = '', format = 'short' }) => {
  const { language } = useLanguage();

  const formatDate = (dateValue) => {
    const dateObj = new Date(dateValue);

    if (language === 'ar') {
      return dateObj.toLocaleDateString('ar', {
        year: 'numeric',
        month: format === 'long' ? 'long' : 'short',
        day: 'numeric'
      });
    } else {
      return dateObj.toLocaleDateString('fr', {
        year: 'numeric',
        month: format === 'long' ? 'long' : 'short',
        day: 'numeric'
      });
    }
  };

  return (
    <span className={className}>
      {formatDate(date)}
    </span>
  );
};

// Number Formatter with locale support
export const NumberFormatter = ({ number, className = '' }) => {
  const { language } = useLanguage();

  const formatNumber = (value) => {
    const numValue = parseFloat(value) || 0;

    if (language === 'ar') {
      return numValue.toLocaleString('ar');
    } else {
      return numValue.toLocaleString('fr');
    }
  };

  return (
    <span className={className}>
      {formatNumber(number)}
    </span>
  );
};

// Language Aware Input Component
export const LanguageInput = ({
  placeholder,
  className = '',
  inputMode = 'text',
  ...props
}) => {
  const { isRTL, language } = useLanguage();

  const getInputMode = () => {
    if (language === 'ar') {
      return 'text'; // Arabic text input
    }
    return inputMode;
  };

  return (
    <input
      {...props}
      placeholder={placeholder}
      className={`${className} ${isRTL ? 'text-right' : 'text-left'}`}
      dir={isRTL ? 'rtl' : 'ltr'}
      inputMode={getInputMode()}
      style={{
        fontFamily: language === 'ar' ? 'Arial, sans-serif' : 'inherit'
      }}
    />
  );
};

// Language Aware Button with proper text alignment
export const LanguageButton = ({
  children,
  className = '',
  variant = 'primary',
  ...props
}) => {
  const { isRTL } = useLanguage();

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 hover:bg-blue-700 text-white';
      case 'secondary':
        return 'bg-gray-200 hover:bg-gray-300 text-gray-800';
      case 'success':
        return 'bg-green-600 hover:bg-green-700 text-white';
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white';
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white';
    }
  };

  return (
    <button
      {...props}
      className={`
        ${getVariantClasses()}
        px-4 py-2 rounded-lg font-medium transition-all duration-300
        ${isRTL ? 'text-right' : 'text-left'}
        hover:shadow-lg hover:scale-105 active:scale-95
        ${className}
      `}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {children}
    </button>
  );
};

// Responsive Text Size Component
export const ResponsiveText = ({
  children,
  size = 'base',
  className = '',
  ...props
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'xs':
        return 'text-xs sm:text-sm';
      case 'sm':
        return 'text-sm sm:text-base';
      case 'base':
        return 'text-base sm:text-lg';
      case 'lg':
        return 'text-lg sm:text-xl';
      case 'xl':
        return 'text-xl sm:text-2xl';
      case '2xl':
        return 'text-2xl sm:text-3xl';
      case '3xl':
        return 'text-3xl sm:text-4xl';
      default:
        return 'text-base sm:text-lg';
    }
  };

  return (
    <div className={`${getSizeClasses()} ${className}`} {...props}>
      {children}
    </div>
  );
};

// Enhanced Language Badge
export const LanguageBadge = ({ language, isActive = false, onClick, className = '' }) => {
  const flags = {
    ar: '🇲🇦',
    fr: '🇫🇷'
  };

  const names = {
    ar: 'العربية',
    fr: 'Français'
  };

  return (
    <button
      onClick={() => onClick && onClick(language)}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300
        ${isActive
          ? 'bg-blue-100 text-blue-800 border-2 border-blue-300'
          : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
        }
        hover:shadow-md hover:scale-105 active:scale-95
        ${className}
      `}
    >
      <span className="text-lg">{flags[language]}</span>
      <span className="text-sm font-medium">{names[language]}</span>
    </button>
  );
};

// Language Detection Hook
export const useLanguageDetection = () => {
  const { changeLanguage } = useLanguage();
  const [detectedLanguage, setDetectedLanguage] = useState(null);

  useEffect(() => {
    // Detect browser language
    const browserLang = navigator.language.toLowerCase();
    let detected = 'fr'; // default

    if (browserLang.startsWith('ar')) {
      detected = 'ar';
    } else if (browserLang.startsWith('fr')) {
      detected = 'fr';
    }

    setDetectedLanguage(detected);

    // Check if user hasn't set a preference
    const savedLanguage = localStorage.getItem('language');
    if (!savedLanguage) {
      changeLanguage(detected);
    }
  }, [changeLanguage]);

  const suggestLanguageChange = (newLang) => {
    if (window.confirm(`Switch to ${newLang === 'ar' ? 'العربية' : 'Français'}?`)) {
      changeLanguage(newLang);
    }
  };

  return {
    detectedLanguage,
    suggestLanguageChange
  };
};

// Language Performance Monitor
export const LanguagePerformanceMonitor = () => {
  const { language } = useLanguage();
  const [loadTime, setLoadTime] = useState(0);

  useEffect(() => {
    const startTime = performance.now();

    // Simulate language loading
    setTimeout(() => {
      const endTime = performance.now();
      setLoadTime(endTime - startTime);
    }, 100);
  }, [language]);

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white p-2 rounded text-xs">
      Language Load: {loadTime.toFixed(2)}ms
    </div>
  );
};

export default {
  LanguageDirection,
  SmartText,
  CurrencyFormatter,
  DateFormatter,
  NumberFormatter,
  LanguageInput,
  LanguageButton,
  ResponsiveText,
  LanguageBadge,
  useLanguageDetection,
  LanguagePerformanceMonitor
};
