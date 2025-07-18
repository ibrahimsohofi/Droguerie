import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Calendar, Sun, Snowflake, Leaf, Flower, Star, Gift, ShoppingCart, Heart } from 'lucide-react';

const SeasonalRecommendations = () => {
  const { language, isRTL, formatCurrency } = useLanguage();
  const [currentSeason, setCurrentSeason] = useState('');
  const [seasonalProducts, setSeasonalProducts] = useState([]);
  const [specialEvents, setSpecialEvents] = useState([]);

  const translations = {
    ar: {
      title: 'توصيات موسمية',
      subtitle: 'منتجات مناسبة للموسم الحالي',
      currentSeason: 'الموسم الحالي',
      specialEvents: 'المناسبات الخاصة',
      viewAll: 'عرض الكل',
      addToCart: 'أضف للسلة',
      addToWishlist: 'أضف للمفضلة',
      seasons: {
        spring: 'الربيع',
        summer: 'الصيف',
        autumn: 'الخريف',
        winter: 'الشتاء'
      },
      events: {
        ramadan: 'شهر رمضان',
        eid: 'عيد الفطر',
        backToSchool: 'العودة للمدرسة',
        newYear: 'رأس السنة',
        summer_vacation: 'العطلة الصيفية',
        winter_prep: 'استعداد الشتاء'
      },
      recommendations: {
        ramadan: 'منتجات رمضان الأساسية',
        summer: 'مستلزمات الصيف',
        winter: 'منتجات الشتاء الدافئة',
        school: 'القرطاسية والمستلزمات المدرسية'
      }
    },
    fr: {
      title: 'Recommandations Saisonnières',
      subtitle: 'Produits adaptés à la saison actuelle',
      currentSeason: 'Saison Actuelle',
      specialEvents: 'Événements Spéciaux',
      viewAll: 'Voir Tout',
      addToCart: 'Ajouter au Panier',
      addToWishlist: 'Ajouter aux Favoris',
      seasons: {
        spring: 'Printemps',
        summer: 'Été',
        autumn: 'Automne',
        winter: 'Hiver'
      },
      events: {
        ramadan: 'Ramadan',
        eid: 'Aïd el-Fitr',
        backToSchool: 'Rentrée Scolaire',
        newYear: 'Nouvel An',
        summer_vacation: 'Vacances d\'Été',
        winter_prep: 'Préparation Hiver'
      },
      recommendations: {
        ramadan: 'Essentiels du Ramadan',
        summer: 'Produits d\'Été',
        winter: 'Produits Chauds d\'Hiver',
        school: 'Fournitures Scolaires'
      }
    },
    en: {
      title: 'Seasonal Recommendations',
      subtitle: 'Products perfect for the current season',
      currentSeason: 'Current Season',
      specialEvents: 'Special Events',
      viewAll: 'View All',
      addToCart: 'Add to Cart',
      addToWishlist: 'Add to Wishlist',
      seasons: {
        spring: 'Spring',
        summer: 'Summer',
        autumn: 'Autumn',
        winter: 'Winter'
      },
      events: {
        ramadan: 'Ramadan',
        eid: 'Eid al-Fitr',
        backToSchool: 'Back to School',
        newYear: 'New Year',
        summer_vacation: 'Summer Vacation',
        winter_prep: 'Winter Preparation'
      },
      recommendations: {
        ramadan: 'Ramadan Essentials',
        summer: 'Summer Essentials',
        winter: 'Winter Comfort Products',
        school: 'School Supplies'
      }
    }
  };

  const t = translations[language] || translations.ar;

  // Morocco's seasons and special times
  const getMoroccanSeason = () => {
    const now = new Date();
    const month = now.getMonth() + 1;

    if (month >= 3 && month <= 5) return 'spring';
    if (month >= 6 && month <= 8) return 'summer';
    if (month >= 9 && month <= 11) return 'autumn';
    return 'winter';
  };

  // Get current special events/periods
  const getCurrentEvents = () => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const events = [];

    // School periods
    if (month === 9 || month === 10) events.push('backToSchool');
    if (month === 7 || month === 8) events.push('summer_vacation');

    // Seasonal prep
    if (month === 11 || month === 12) events.push('winter_prep');

    // TODO: Add dynamic Ramadan dates based on Islamic calendar

    return events;
  };

  // Seasonal product recommendations
  const getSeasonalProducts = (season) => {
    const productsByseason = {
      spring: [
        {
          id: 'spring_1',
          name: language === 'ar' ? 'منظف الزجاج للربيع' : 'Spring Glass Cleaner',
          price: 25,
          image: '${import.meta.env.VITE_API_URL}/api/placeholder/200x200.jpg',
          category: language === 'ar' ? 'منتجات التنظيف' : 'Cleaning Products',
          description: language === 'ar' ? 'مثالي لتنظيف الربيع' : 'Perfect for spring cleaning'
        },
        {
          id: 'spring_2',
          name: language === 'ar' ? 'أكياس القمامة الكبيرة' : 'Large Garbage Bags',
          price: 35,
          image: '${import.meta.env.VITE_API_URL}/api/placeholder/200x200.jpg',
          category: language === 'ar' ? 'أدوات منزلية' : 'Household Items',
          description: language === 'ar' ? 'للتنظيف الشامل' : 'For thorough cleaning'
        }
      ],
      summer: [
        {
          id: 'summer_1',
          name: language === 'ar' ? 'واقي الشمس SPF 50' : 'Sunscreen SPF 50',
          price: 75,
          image: '${import.meta.env.VITE_API_URL}/api/placeholder/200x200.jpg',
          category: language === 'ar' ? 'العناية الشخصية' : 'Personal Care',
          description: language === 'ar' ? 'حماية قوية من الشمس' : 'Strong sun protection'
        },
        {
          id: 'summer_2',
          name: language === 'ar' ? 'مبرد مياه محمول' : 'Portable Water Cooler',
          price: 120,
          image: '${import.meta.env.VITE_API_URL}/api/placeholder/200x200.jpg',
          category: language === 'ar' ? 'أدوات منزلية' : 'Household Items',
          description: language === 'ar' ? 'للحفاظ على البرودة' : 'Stay cool and hydrated'
        }
      ],
      autumn: [
        {
          id: 'autumn_1',
          name: language === 'ar' ? 'فيتامينات تقوية المناعة' : 'Immunity Vitamins',
          price: 85,
          image: '${import.meta.env.VITE_API_URL}/api/placeholder/200x200.jpg',
          category: language === 'ar' ? 'صحة ودواء' : 'Health & Medicine',
          description: language === 'ar' ? 'لتقوية جهاز المناعة' : 'Boost your immune system'
        }
      ],
      winter: [
        {
          id: 'winter_1',
          name: language === 'ar' ? 'مرطب الجو' : 'Air Humidifier',
          price: 200,
          image: '${import.meta.env.VITE_API_URL}/api/placeholder/200x200.jpg',
          category: language === 'ar' ? 'أدوات منزلية' : 'Household Items',
          description: language === 'ar' ? 'للهواء الجاف في الشتاء' : 'Combat dry winter air'
        },
        {
          id: 'winter_2',
          name: language === 'ar' ? 'كريم مرطب للبشرة الجافة' : 'Moisturizing Cream',
          price: 45,
          image: '${import.meta.env.VITE_API_URL}/api/placeholder/200x200.jpg',
          category: language === 'ar' ? 'العناية الشخصية' : 'Personal Care',
          description: language === 'ar' ? 'لترطيب البشرة الجافة' : 'For dry winter skin'
        }
      ]
    };

    return productsByseason[season] || [];
  };

  // Event-specific recommendations
  const getEventProducts = (event) => {
    const eventProducts = {
      ramadan: [
        {
          id: 'ramadan_1',
          name: language === 'ar' ? 'قوارير مياه للإفطار' : 'Water Bottles for Iftar',
          price: 15,
          image: '${import.meta.env.VITE_API_URL}/api/placeholder/200x200.jpg',
          specialOffer: true
        }
      ],
      backToSchool: [
        {
          id: 'school_1',
          name: language === 'ar' ? 'حقيبة أقلام مدرسية' : 'School Pen Set',
          price: 40,
          image: '${import.meta.env.VITE_API_URL}/api/placeholder/200x200.jpg',
          specialOffer: true
        }
      ]
    };

    return eventProducts[event] || [];
  };

  useEffect(() => {
    const season = getMoroccanSeason();
    const events = getCurrentEvents();

    setCurrentSeason(season);
    setSeasonalProducts(getSeasonalProducts(season));
    setSpecialEvents(events);
  }, [language]);

  const SeasonIcon = ({ season }) => {
    const icons = {
      spring: <Flower className="w-6 h-6 text-green-500" />,
      summer: <Sun className="w-6 h-6 text-yellow-500" />,
      autumn: <Leaf className="w-6 h-6 text-orange-500" />,
      winter: <Snowflake className="w-6 h-6 text-blue-500" />
    };
    return icons[season] || <Calendar className="w-6 h-6" />;
  };

  return (
    <div className={`max-w-7xl mx-auto p-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{t.title}</h2>
        <p className="text-gray-600">{t.subtitle}</p>
      </div>

      {/* Current Season Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <SeasonIcon season={currentSeason} />
          <h3 className="text-xl font-semibold text-gray-800">
            {t.currentSeason}: {t.seasons[currentSeason]}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {seasonalProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg mb-3"
              />
              <h4 className="font-semibold text-gray-900 mb-2">{product.name}</h4>
              <p className="text-sm text-gray-600 mb-2">{product.description}</p>
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-bold text-green-600">
                  {formatCurrency(product.price)}
                </span>
                <span className="text-xs text-gray-500">{product.category}</span>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-1">
                  <ShoppingCart className="w-4 h-4" />
                  {t.addToCart}
                </button>
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Heart className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Special Events Section */}
      {specialEvents.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Star className="w-6 h-6 text-purple-500" />
            <h3 className="text-xl font-semibold text-gray-800">{t.specialEvents}</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {specialEvents.map((event) => (
              <div key={event} className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-6">
                <h4 className="font-semibold text-purple-900 mb-2">{t.events[event]}</h4>
                <p className="text-purple-700 text-sm mb-3">
                  {t.recommendations[event] || 'منتجات خاصة للمناسبة'}
                </p>
                <button className="bg-purple-600 text-white py-2 px-4 rounded-lg text-sm hover:bg-purple-700 transition-colors">
                  {t.viewAll}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Seasonal Tips */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          {language === 'ar' ? 'نصائح موسمية' : 'Conseils Saisonniers'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">
              {language === 'ar' ? 'نصائح التوفير' : 'Conseils d\'Économie'}
            </h4>
            <p className="text-sm text-gray-600">
              {language === 'ar'
                ? 'اشتري المنتجات الموسمية بكميات أكبر لتوفير المال'
                : 'Achetez les produits saisonniers en grandes quantités pour économiser'
              }
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">
              {language === 'ar' ? 'تخطيط مسبق' : 'Planification'}
            </h4>
            <p className="text-sm text-gray-600">
              {language === 'ar'
                ? 'احضر قائمة احتياجاتك للموسم القادم'
                : 'Préparez votre liste pour la prochaine saison'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeasonalRecommendations;
