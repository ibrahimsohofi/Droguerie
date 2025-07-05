import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const NotFound = () => {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-8">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-300 mb-4">404</h1>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {language === 'ar' ? 'الصفحة غير موجودة' : 'Page non trouvée'}
        </h2>
        <p className="text-gray-600 mb-8">
          {language === 'ar' ? 'الصفحة التي تبحث عنها غير موجودة' : 'La page que vous recherchez n\'existe pas'}
        </p>
        <Link
          to="/"
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors duration-300"
        >
          {language === 'ar' ? 'العودة إلى الرئيسية' : 'Retour à l\'accueil'}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
