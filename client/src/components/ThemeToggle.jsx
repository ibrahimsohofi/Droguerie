import React, { useState } from 'react';
import { Sun, Moon, Monitor, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const ThemeToggle = ({ variant = 'button', showLabel = false }) => {
  const { theme, isDark, toggleTheme, setLightTheme, setDarkTheme, setSystemTheme } = useTheme();
  const { language } = useLanguage();
  const [showOptions, setShowOptions] = useState(false);

  const themes = {
    en: {
      light: 'Light',
      dark: 'Dark',
      system: 'System',
      theme: 'Theme'
    },
    fr: {
      light: 'Clair',
      dark: 'Sombre',
      system: 'Système',
      theme: 'Thème'
    },
    ar: {
      light: 'فاتح',
      dark: 'داكن',
      system: 'النظام',
      theme: 'المظهر'
    }
  };

  const t = themes[language] || themes.en;

  if (variant === 'simple') {
    return (
      <button
        onClick={toggleTheme}
        className={`
          relative p-2 rounded-lg transition-all duration-300 ease-in-out
          ${isDark
            ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          transform hover:scale-105 active:scale-95
        `}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        <div className="relative w-5 h-5">
          <Sun className={`
            absolute inset-0 transition-all duration-300 transform
            ${isDark ? 'opacity-0 rotate-90 scale-75' : 'opacity-100 rotate-0 scale-100'}
          `} size={20} />
          <Moon className={`
            absolute inset-0 transition-all duration-300 transform
            ${isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-75'}
          `} size={20} />
        </div>
      </button>
    );
  }

  if (variant === 'dropdown') {
    return (
      <div className="relative">
        <button
          onClick={() => setShowOptions(!showOptions)}
          className={`
            flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200
            ${isDark
              ? 'bg-gray-800 text-gray-200 hover:bg-gray-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          `}
          aria-label="Theme options"
        >
          {theme === 'light' && <Sun size={16} />}
          {theme === 'dark' && <Moon size={16} />}
          {theme === 'system' && <Monitor size={16} />}
          {showLabel && <span className="text-sm font-medium">{t.theme}</span>}
        </button>

        {showOptions && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowOptions(false)}
            />
            <div className={`
              absolute right-0 mt-2 w-48 py-2 z-20 rounded-lg shadow-lg border
              ${isDark
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-gray-200'
              }
              animate-in slide-in-from-top-2 duration-200
            `}>
              <ThemeOption
                icon={<Sun size={16} />}
                label={t.light}
                active={theme === 'light'}
                onClick={() => {
                  setLightTheme();
                  setShowOptions(false);
                }}
                isDark={isDark}
              />
              <ThemeOption
                icon={<Moon size={16} />}
                label={t.dark}
                active={theme === 'dark'}
                onClick={() => {
                  setDarkTheme();
                  setShowOptions(false);
                }}
                isDark={isDark}
              />
              <ThemeOption
                icon={<Monitor size={16} />}
                label={t.system}
                active={theme === 'system'}
                onClick={() => {
                  setSystemTheme();
                  setShowOptions(false);
                }}
                isDark={isDark}
              />
            </div>
          </>
        )}
      </div>
    );
  }

  // Default toggle switch variant
  return (
    <div className="flex items-center gap-3">
      {showLabel && (
        <span className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
          {t.theme}
        </span>
      )}

      <button
        onClick={toggleTheme}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          ${isDark ? 'bg-blue-600' : 'bg-gray-300'}
        `}
        role="switch"
        aria-checked={isDark}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        <span className="sr-only">Toggle theme</span>
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white transition-all duration-300 ease-in-out
            shadow-sm ring-0 flex items-center justify-center
            ${isDark ? 'translate-x-6' : 'translate-x-1'}
          `}
        >
          {isDark ? (
            <Moon size={10} className="text-blue-600" />
          ) : (
            <Sun size={10} className="text-yellow-500" />
          )}
        </span>
      </button>
    </div>
  );
};

const ThemeOption = ({ icon, label, active, onClick, isDark }) => (
  <button
    onClick={onClick}
    className={`
      w-full flex items-center justify-between px-4 py-2 text-sm transition-colors duration-150
      ${isDark
        ? 'text-gray-200 hover:bg-gray-700'
        : 'text-gray-700 hover:bg-gray-100'
      }
      ${active ? (isDark ? 'bg-gray-700' : 'bg-gray-100') : ''}
      focus:outline-none focus:bg-opacity-50
    `}
  >
    <div className="flex items-center gap-3">
      {icon}
      <span>{label}</span>
    </div>
    {active && <Check size={14} className="text-blue-500" />}
  </button>
);

export default ThemeToggle;
