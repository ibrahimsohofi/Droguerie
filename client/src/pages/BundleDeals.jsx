import React from 'react';
import EnhancedBundleDeals from '../components/EnhancedBundleDeals';
import { useLanguage } from '../context/LanguageContext';

const BundleDeals = () => {
  const { language } = useLanguage();

  const pageTitle = {
    ar: 'عروض الحزم',
    fr: 'Offres de Packs',
    en: 'Bundle Deals'
  };

  React.useEffect(() => {
    document.title = `${pageTitle[language] || pageTitle.ar} - دروغيري جمال`;
  }, [language]);

  return (
    <div className="min-h-screen bg-gray-50">
      <EnhancedBundleDeals />
    </div>
  );
};

export default BundleDeals;
