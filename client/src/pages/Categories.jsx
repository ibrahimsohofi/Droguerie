import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const Categories = () => {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {language === 'ar' ? 'فئات المنتجات' : 'Catégories de produits'}
        </h1>
        <div className="bg-white rounded-lg shadow-md p-8">
          <p className="text-gray-600">
            {language === 'ar' ? 'صفحة الفئات قيد الإنشاء...' : 'Page des catégories en cours de développement...'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Categories;
