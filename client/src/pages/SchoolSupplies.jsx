import React from 'react';
import SchoolSuppliesChecklist from '../components/SchoolSuppliesChecklist';
import { useLanguage } from '../context/LanguageContext';

const SchoolSupplies = () => {
  const { language } = useLanguage();

  const pageTitle = {
    ar: 'المستلزمات المدرسية',
    fr: 'Fournitures Scolaires',
    en: 'School Supplies'
  };

  React.useEffect(() => {
    document.title = `${pageTitle[language] || pageTitle.ar} - دروغيري جمال`;
  }, [language]);

  return (
    <div className="min-h-screen bg-gray-50">
      <SchoolSuppliesChecklist />
    </div>
  );
};

export default SchoolSupplies;
