import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Package, Users, Baby, Home, School, Heart, ShoppingCart, Star, Tag, Clock, Percent } from 'lucide-react';

const EnhancedBundleDeals = () => {
  const { language, isRTL, formatCurrency } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('family');
  const [bundles, setBundles] = useState([]);
  const [timeLeft, setTimeLeft] = useState({});

  const translations = {
    ar: {
      title: 'عروض الحزم المميزة',
      subtitle: 'حزم منتجات مصممة خصيصاً للعائلات المغربية',
      categories: {
        family: 'العائلة',
        baby: 'الأطفال',
        cleaning: 'التنظيف',
        personal: 'العناية الشخصية',
        school: 'المدرسة',
        seasonal: 'موسمية'
      },
      savings: 'توفير',
      originalPrice: 'السعر الأصلي',
      bundlePrice: 'سعر الحزمة',
      addToCart: 'أضف للسلة',
      addToWishlist: 'أضف للمفضلة',
      itemsIncluded: 'عنصر مدرج',
      limitedTime: 'لوقت محدود',
      popular: 'الأكثر شعبية',
      bestValue: 'أفضل قيمة',
      familySize: 'مناسب للعائلة',
      timeRemaining: 'الوقت المتبقي',
      viewDetails: 'عرض التفاصيل',
      perfectFor: 'مثالي لـ',
      features: 'المميزات'
    },
    fr: {
      title: 'Offres de Packs Premium',
      subtitle: 'Packs de produits conçus spécialement pour les familles marocaines',
      categories: {
        family: 'Famille',
        baby: 'Bébé',
        cleaning: 'Nettoyage',
        personal: 'Soins Personnels',
        school: 'École',
        seasonal: 'Saisonnier'
      },
      savings: 'Économie',
      originalPrice: 'Prix Original',
      bundlePrice: 'Prix du Pack',
      addToCart: 'Ajouter au Panier',
      addToWishlist: 'Ajouter aux Favoris',
      itemsIncluded: 'article inclus',
      limitedTime: 'Temps Limité',
      popular: 'Populaire',
      bestValue: 'Meilleur Rapport',
      familySize: 'Taille Famille',
      timeRemaining: 'Temps Restant',
      viewDetails: 'Voir Détails',
      perfectFor: 'Parfait pour',
      features: 'Caractéristiques'
    },
    en: {
      title: 'Premium Bundle Deals',
      subtitle: 'Product bundles designed specifically for Moroccan families',
      categories: {
        family: 'Family',
        baby: 'Baby',
        cleaning: 'Cleaning',
        personal: 'Personal Care',
        school: 'School',
        seasonal: 'Seasonal'
      },
      savings: 'Savings',
      originalPrice: 'Original Price',
      bundlePrice: 'Bundle Price',
      addToCart: 'Add to Cart',
      addToWishlist: 'Add to Wishlist',
      itemsIncluded: 'items included',
      limitedTime: 'Limited Time',
      popular: 'Popular',
      bestValue: 'Best Value',
      familySize: 'Family Size',
      timeRemaining: 'Time Remaining',
      viewDetails: 'View Details',
      perfectFor: 'Perfect for',
      features: 'Features'
    }
  };

  const t = translations[language] || translations.ar;

  // Bundle data
  const bundleData = {
    family: [
      {
        id: 'family_1',
        name: language === 'ar' ? 'حزمة العائلة الكاملة' : 'Complete Family Bundle',
        description: language === 'ar' ? 'كل ما تحتاجه العائلة لشهر كامل' : 'Everything your family needs for a month',
        originalPrice: 450,
        bundlePrice: 320,
        savings: 130,
        image: '${import.meta.env.VITE_API_URL}/api/placeholder/300x200.jpg',
        items: [
          { name: language === 'ar' ? 'مسحوق غسيل 5 كيلو' : 'Detergent Powder 5kg', quantity: 2 },
          { name: language === 'ar' ? 'منظف أرضيات' : 'Floor Cleaner', quantity: 3 },
          { name: language === 'ar' ? 'صابون الحمام' : 'Bath Soap', quantity: 6 },
          { name: language === 'ar' ? 'شامبو العائلة' : 'Family Shampoo', quantity: 2 },
          { name: language === 'ar' ? 'معجون أسنان' : 'Toothpaste', quantity: 4 }
        ],
        tags: ['popular', 'familySize'],
        perfectFor: language === 'ar' ? 'العائلات الكبيرة (5-8 أفراد)' : 'Large families (5-8 members)',
        features: [
          language === 'ar' ? 'يكفي لشهر كامل' : 'Lasts for a full month',
          language === 'ar' ? 'منتجات عالية الجودة' : 'High quality products',
          language === 'ar' ? 'توفير 29%' : '29% savings'
        ],
        timeLimit: true,
        endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days
      },
      {
        id: 'family_2',
        name: language === 'ar' ? 'حزمة التنظيف الأساسية' : 'Essential Cleaning Bundle',
        description: language === 'ar' ? 'منتجات التنظيف الأساسية للمنزل' : 'Essential cleaning products for home',
        originalPrice: 180,
        bundlePrice: 140,
        savings: 40,
        image: '${import.meta.env.VITE_API_URL}/api/placeholder/300x200.jpg',
        items: [
          { name: language === 'ar' ? 'منظف متعدد الاستخدامات' : 'Multi-purpose cleaner', quantity: 2 },
          { name: language === 'ar' ? 'منظف الحمام' : 'Bathroom cleaner', quantity: 1 },
          { name: language === 'ar' ? 'منظف المطبخ' : 'Kitchen cleaner', quantity: 1 },
          { name: language === 'ar' ? 'إسفنج التنظيف' : 'Cleaning sponges', quantity: 1 }
        ],
        tags: ['bestValue'],
        perfectFor: language === 'ar' ? 'التنظيف الأسبوعي' : 'Weekly cleaning',
        features: [
          language === 'ar' ? 'منتجات فعالة' : 'Effective products',
          language === 'ar' ? 'صديقة للبيئة' : 'Eco-friendly',
          language === 'ar' ? 'سهلة الاستخدام' : 'Easy to use'
        ]
      }
    ],
    baby: [
      {
        id: 'baby_1',
        name: language === 'ar' ? 'حزمة العناية بالطفل' : 'Baby Care Bundle',
        description: language === 'ar' ? 'كل مستلزمات العناية بطفلك' : 'All your baby care essentials',
        originalPrice: 280,
        bundlePrice: 210,
        savings: 70,
        image: '${import.meta.env.VITE_API_URL}/api/placeholder/300x200.jpg',
        items: [
          { name: language === 'ar' ? 'حفاضات (حجم 3)' : 'Diapers (Size 3)', quantity: 2 },
          { name: language === 'ar' ? 'شامبو الأطفال' : 'Baby Shampoo', quantity: 1 },
          { name: language === 'ar' ? 'لوشن الأطفال' : 'Baby Lotion', quantity: 1 },
          { name: language === 'ar' ? 'مناديل مبللة' : 'Baby Wipes', quantity: 4 }
        ],
        tags: ['popular'],
        perfectFor: language === 'ar' ? 'الأطفال 6-18 شهر' : 'Babies 6-18 months',
        features: [
          language === 'ar' ? 'منتجات آمنة للأطفال' : 'Baby-safe products',
          language === 'ar' ? 'مختبرة طبياً' : 'Medically tested',
          language === 'ar' ? 'لطيفة على البشرة' : 'Gentle on skin'
        ]
      }
    ],
    cleaning: [
      {
        id: 'cleaning_1',
        name: language === 'ar' ? 'حزمة التنظيف الشامل' : 'Complete Cleaning Bundle',
        description: language === 'ar' ? 'تنظيف شامل لكل أجزاء المنزل' : 'Complete cleaning for every part of home',
        originalPrice: 250,
        bundlePrice: 180,
        savings: 70,
        image: '${import.meta.env.VITE_API_URL}/api/placeholder/300x200.jpg',
        items: [
          { name: language === 'ar' ? 'منظف الزجاج' : 'Glass Cleaner', quantity: 2 },
          { name: language === 'ar' ? 'منظف الأرضيات' : 'Floor Cleaner', quantity: 2 },
          { name: language === 'ar' ? 'مطهر الحمام' : 'Bathroom Disinfectant', quantity: 1 },
          { name: language === 'ar' ? 'قفازات التنظيف' : 'Cleaning Gloves', quantity: 2 }
        ],
        tags: ['bestValue'],
        perfectFor: language === 'ar' ? 'التنظيف الشهري الكامل' : 'Monthly deep cleaning',
        features: [
          language === 'ar' ? 'يغطي كل الغرف' : 'Covers all rooms',
          language === 'ar' ? 'نتائج احترافية' : 'Professional results',
          language === 'ar' ? 'يوفر الوقت' : 'Saves time'
        ]
      }
    ]
  };

  useEffect(() => {
    setBundles(bundleData[selectedCategory] || []);
  }, [selectedCategory, language]);

  // Timer effect for limited time offers
  useEffect(() => {
    const timer = setInterval(() => {
      setBundles(current =>
        current.map(bundle => {
          if (bundle.timeLimit && bundle.endTime) {
            const now = new Date();
            const timeDiff = bundle.endTime - now;
            if (timeDiff > 0) {
              const hours = Math.floor(timeDiff / (1000 * 60 * 60));
              const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
              return {
                ...bundle,
                timeRemaining: { hours, minutes }
              };
            }
          }
          return bundle;
        })
      );
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const calculateSavingsPercentage = (original, bundle) => {
    return Math.round(((original - bundle) / original) * 100);
  };

  const getCategoryIcon = (category) => {
    const icons = {
      family: <Users className="w-5 h-5" />,
      baby: <Baby className="w-5 h-5" />,
      cleaning: <Home className="w-5 h-5" />,
      personal: <Heart className="w-5 h-5" />,
      school: <School className="w-5 h-5" />,
      seasonal: <Star className="w-5 h-5" />
    };
    return icons[category] || <Package className="w-5 h-5" />;
  };

  const getTagColor = (tag) => {
    const colors = {
      popular: 'bg-red-100 text-red-800 border-red-200',
      bestValue: 'bg-green-100 text-green-800 border-green-200',
      familySize: 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return colors[tag] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getTagText = (tag) => {
    const texts = {
      popular: t.popular,
      bestValue: t.bestValue,
      familySize: t.familySize
    };
    return texts[tag] || tag;
  };

  return (
    <div className={`max-w-7xl mx-auto p-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{t.title}</h2>
        <p className="text-gray-600">{t.subtitle}</p>
      </div>

      {/* Category Navigation */}
      <div className="mb-8">
        <div className="flex flex-wrap justify-center gap-2">
          {Object.keys(bundleData).map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {getCategoryIcon(category)}
              {t.categories[category]}
            </button>
          ))}
        </div>
      </div>

      {/* Bundle Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {bundles.map((bundle) => (
          <div key={bundle.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            {/* Bundle Image */}
            <div className="relative">
              <img
                src={bundle.image}
                alt={bundle.name}
                className="w-full h-48 object-cover"
              />

              {/* Tags */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                {bundle.tags?.map((tag) => (
                  <span
                    key={tag}
                    className={`px-2 py-1 text-xs font-medium rounded-full border ${getTagColor(tag)}`}
                  >
                    {getTagText(tag)}
                  </span>
                ))}
              </div>

              {/* Savings Badge */}
              <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full">
                <span className="text-sm font-bold">
                  -{calculateSavingsPercentage(bundle.originalPrice, bundle.bundlePrice)}%
                </span>
              </div>
            </div>

            {/* Bundle Content */}
            <div className="p-6">
              {/* Title and Description */}
              <h3 className="text-xl font-bold text-gray-900 mb-2">{bundle.name}</h3>
              <p className="text-gray-600 mb-4">{bundle.description}</p>

              {/* Perfect For */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">{t.perfectFor}:</span>
                </div>
                <p className="text-sm text-gray-600">{bundle.perfectFor}</p>
              </div>

              {/* Items Included */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  {bundle.items.length} {t.itemsIncluded}
                </h4>
                <div className="grid grid-cols-1 gap-1">
                  {bundle.items.slice(0, 3).map((item, index) => (
                    <div key={index} className="flex justify-between text-sm text-gray-600">
                      <span>{item.name}</span>
                      <span>x{item.quantity}</span>
                    </div>
                  ))}
                  {bundle.items.length > 3 && (
                    <div className="text-sm text-blue-600 font-medium">
                      +{bundle.items.length - 3} {language === 'ar' ? 'منتجات أخرى' : 'autres produits'}
                    </div>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">{t.features}:</h4>
                <ul className="space-y-1">
                  {bundle.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Time Remaining */}
              {bundle.timeLimit && bundle.timeRemaining && (
                <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-medium text-red-800">{t.limitedTime}</span>
                  </div>
                  <div className="text-lg font-bold text-red-600">
                    {bundle.timeRemaining.hours}h {bundle.timeRemaining.minutes}m
                  </div>
                </div>
              )}

              {/* Pricing */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm text-gray-500 line-through">
                    {formatCurrency(bundle.originalPrice)}
                  </span>
                  <span className="text-2xl font-bold text-green-600">
                    {formatCurrency(bundle.bundlePrice)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Percent className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-600">
                    {t.savings}: {formatCurrency(bundle.savings)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  {t.addToCart}
                </button>
                <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Heart className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Why Choose Bundles Section */}
      <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          {language === 'ar' ? 'لماذا تختار حزم المنتجات؟' : 'Pourquoi choisir nos packs?'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Tag className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              {language === 'ar' ? 'توفير في المال' : 'Économies'}
            </h4>
            <p className="text-sm text-gray-600">
              {language === 'ar'
                ? 'وفر حتى 30% مقارنة بالشراء المنفصل'
                : 'Économisez jusqu\'à 30% par rapport aux achats séparés'
              }
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              {language === 'ar' ? 'مصمم للعائلات' : 'Conçu pour les Familles'}
            </h4>
            <p className="text-sm text-gray-600">
              {language === 'ar'
                ? 'حزم مختارة بعناية لتناسب الأسر المغربية'
                : 'Packs soigneusement sélectionnés pour les familles marocaines'
              }
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              {language === 'ar' ? 'راحة وسهولة' : 'Commodité'}
            </h4>
            <p className="text-sm text-gray-600">
              {language === 'ar'
                ? 'كل ما تحتاجه في مكان واحد'
                : 'Tout ce dont vous avez besoin en un seul achat'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedBundleDeals;
