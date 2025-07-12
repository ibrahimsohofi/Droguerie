import React from 'react';
import CommunityBulletinBoard from '../components/CommunityBulletinBoard';
import { useLanguage } from '../context/LanguageContext';

const Community = () => {
  const { language } = useLanguage();

  const pageTitle = {
    ar: 'مجتمع الحي',
    fr: 'Communauté',
    en: 'Community'
  };

  React.useEffect(() => {
    document.title = `${pageTitle[language] || pageTitle.ar} - دروغيري جمال`;
  }, [language]);

  return (
    <div className="min-h-screen bg-gray-50">
      <CommunityBulletinBoard />
    </div>
  );
};

export default Community;
