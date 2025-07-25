import React from 'react';
import SeasonalRecommendations from '../components/SeasonalRecommendations';
import { useLanguage } from '../context/LanguageContext';

const SeasonalDeals = () => {
  const { language } = useLanguage();

  const pageTitle = {
    ar: 'العروض الموسمية',
    fr: 'Offres Saisonnières',
    en: 'Seasonal Deals'
  };

  React.useEffect(() => {
    document.title = `${pageTitle[language] || pageTitle.ar} - دروغيري جمال`;
  }, [language]);

  return (
    <div className="min-h-screen bg-gray-50">
      <SeasonalRecommendations />
    </div>
  );
};

export default SeasonalDeals;
