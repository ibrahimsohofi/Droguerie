import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  Globe,
  Smartphone,
  Monitor,
  ShoppingCart,
  Star,
  Heart,
  Check,
  MapPin,
  Phone,
  Clock
} from 'lucide-react';

const LanguageTestComponent = () => {
  const { language, isRTL, formatCurrency, t, availableLanguages, changeLanguage } = useLanguage();

  // Sample product data for testing
  const sampleProduct = {
    name: {
      ar: 'مسحوق غسيل أريال 3 كيلو',
      en: 'Ariel Detergent Powder 3kg',
      fr: 'Poudre à laver Ariel 3kg'
    },
    price: 45.99,
    originalPrice: 52.00,
    rating: 4.5,
    inStock: true
  };

  // Sample categories for mobile menu testing
  const sampleCategories = [
    { ar: 'منتجات التنظيف', en: 'Cleaning Products', fr: 'Produits de nettoyage' },
    { ar: 'العناية الشخصية', en: 'Personal Care', fr: 'Soins personnels' },
    { ar: 'أدوات وعتاد', en: 'Hardware & Tools', fr: 'Outils et matériel' },
    { ar: 'مستحضرات التجميل', en: 'Cosmetics', fr: 'Cosmétiques' }
  ];

  return (
    <div className={`min-h-screen bg-gray-50 py-8 ${isRTL ? 'font-arabic' : 'font-sans'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {language === 'ar' ? 'اختبار متعدد اللغات والجوال' :
             language === 'fr' ? 'Test Multi-langues et Mobile' :
             'Multi-Language & Mobile Test'}
          </h1>
          <p className="text-lg text-gray-600">
            {language === 'ar' ? 'اختبار شامل لميزات اللغة والتصميم المتجاوب' :
             language === 'fr' ? 'Test complet des fonctionnalités linguistiques et du design responsive' :
             'Comprehensive test of language features and responsive design'}
          </p>
        </div>

        {/* Language Switcher Demo */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold">
              {language === 'ar' ? 'اختبار تبديل اللغة' :
               language === 'fr' ? 'Test de changement de langue' :
               'Language Switching Test'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {availableLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                  language === lang.code
                    ? 'border-blue-500 bg-blue-50 text-blue-900'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}
              >
                <div className="text-2xl mb-2">{lang.flag}</div>
                <div className="font-semibold">{lang.nativeName}</div>
                <div className="text-sm text-gray-600">
                  {language === 'ar' ? lang.name : lang.name}
                </div>
                {language === lang.code && (
                  <Check className="w-5 h-5 text-blue-600 mx-auto mt-2" />
                )}
              </button>
            ))}
          </div>

          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm">
              <strong>
                {language === 'ar' ? 'اللغة الحالية:' :
                 language === 'fr' ? 'Langue actuelle:' :
                 'Current Language:'}
              </strong> {availableLanguages.find(l => l.code === language)?.nativeName}
            </p>
            <p className="text-sm mt-1">
              <strong>
                {language === 'ar' ? 'الاتجاه:' :
                 language === 'fr' ? 'Direction:' :
                 'Direction:'}
              </strong> {isRTL ? 'RTL (يمين إلى يسار)' : 'LTR (Left to Right)'}
            </p>
          </div>
        </div>

        {/* Mobile Responsive Product Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Smartphone className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-semibold">
              {language === 'ar' ? 'بطاقة منتج متجاوبة' :
               language === 'fr' ? 'Carte produit responsive' :
               'Responsive Product Card'}
            </h2>
          </div>

          <div className="max-w-sm mx-auto">
            <div className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
              {/* Product Image */}
              <div className="aspect-square bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                <div className="text-blue-600 text-6xl">📦</div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                  {sampleProduct.name[language]}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(sampleProduct.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-1">
                    ({sampleProduct.rating})
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl font-bold text-blue-600">
                    {formatCurrency(sampleProduct.price)}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    {formatCurrency(sampleProduct.originalPrice)}
                  </span>
                </div>

                {/* Stock Status */}
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-2 h-2 rounded-full ${
                    sampleProduct.inStock ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <span className={`text-sm ${
                    sampleProduct.inStock ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {sampleProduct.inStock
                      ? (language === 'ar' ? 'متوفر' : language === 'fr' ? 'En stock' : 'In Stock')
                      : (language === 'ar' ? 'غير متوفر' : language === 'fr' ? 'Rupture de stock' : 'Out of Stock')
                    }
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {language === 'ar' ? 'أضف للسلة' :
                       language === 'fr' ? 'Ajouter au panier' :
                       'Add to Cart'}
                    </span>
                  </button>
                  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    <Heart className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu Demo */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Monitor className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-semibold">
              {language === 'ar' ? 'قائمة التنقل للجوال' :
               language === 'fr' ? 'Menu de navigation mobile' :
               'Mobile Navigation Menu'}
            </h2>
          </div>

          <div className="max-w-xs mx-auto bg-gray-50 rounded-lg p-4">
            <div className="space-y-2">
              {sampleCategories.map((category, index) => (
                <button
                  key={index}
                  className="w-full text-left p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex items-center justify-between"
                >
                  <span className="font-medium">{category[language]}</span>
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Business Info in Multiple Languages */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="w-6 h-6 text-red-600" />
            <h2 className="text-xl font-semibold">
              {language === 'ar' ? 'معلومات العمل' :
               language === 'fr' ? 'Informations commerciales' :
               'Business Information'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Address */}
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-red-500 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">
                  {language === 'ar' ? 'العنوان' :
                   language === 'fr' ? 'Adresse' :
                   'Address'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {language === 'ar' ? 'الدار البيضاء، المغرب' :
                   language === 'fr' ? 'Casablanca, Maroc' :
                   'Casablanca, Morocco'}
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-green-500 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">
                  {language === 'ar' ? 'الهاتف' :
                   language === 'fr' ? 'Téléphone' :
                   'Phone'}
                </h3>
                <p className="text-gray-600 text-sm">+212 522 123 456</p>
              </div>
            </div>

            {/* Hours */}
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-blue-500 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">
                  {language === 'ar' ? 'ساعات العمل' :
                   language === 'fr' ? 'Heures d\'ouverture' :
                   'Business Hours'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {language === 'ar' ? '8:00 - 20:00' :
                   language === 'fr' ? '8h00 - 20h00' :
                   '8:00 AM - 8:00 PM'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* PWA Features Info */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">
            {language === 'ar' ? 'ميزات تطبيق الويب التقدمي (PWA)' :
             language === 'fr' ? 'Fonctionnalités PWA' :
             'Progressive Web App (PWA) Features'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" />
              <span>
                {language === 'ar' ? 'تثبيت على الشاشة الرئيسية' :
                 language === 'fr' ? 'Installation sur l\'écran d\'accueil' :
                 'Install to Home Screen'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" />
              <span>
                {language === 'ar' ? 'عمل بدون اتصال' :
                 language === 'fr' ? 'Fonctionnement hors ligne' :
                 'Offline Functionality'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" />
              <span>
                {language === 'ar' ? 'إشعارات فورية' :
                 language === 'fr' ? 'Notifications push' :
                 'Push Notifications'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" />
              <span>
                {language === 'ar' ? 'تحديث تلقائي' :
                 language === 'fr' ? 'Mise à jour automatique' :
                 'Automatic Updates'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageTestComponent;
