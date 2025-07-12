import React, { useState } from 'react';
import {
  Home, ShoppingCart, Calculator, Lightbulb, Star,
  Users, Clock, Package, Sparkles, ChefHat
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import HouseholdShoppingListCreator from '../components/HouseholdShoppingListCreator';
import ProductUsageGuide from '../components/ProductUsageGuide';
import PrayerTimesWidget from '../components/PrayerTimesWidget';

const HouseholdHelper = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const { language, isRTL, t } = useLanguage();

  const messages = {
    ar: {
      householdHelper: 'مساعد المنزل',
      subtitle: 'أدوات ذكية لإدارة منزلك بكفاءة',
      shoppingLists: 'قوائم التسوق',
      usageGuide: 'دليل الاستخدام',
      prayerTimes: 'أوقات الصلاة',
      familyManagement: 'إدارة الأسرة',
      smartShopping: 'التسوق الذكي',
      productOptimization: 'تحسين استخدام المنتجات',
      moroccanLifestyle: 'أسلوب الحياة المغربي',
      createShoppingList: 'إنشاء قائمة تسوق',
      calculateUsage: 'حساب الاستهلاك',
      viewPrayerTimes: 'عرض أوقات الصلاة',
      features: 'الميزات',
      getStarted: 'ابدأ الآن',
      overview: 'نظرة عامة'
    },
    fr: {
      householdHelper: 'Assistant Ménager',
      subtitle: 'Outils intelligents pour gérer votre foyer efficacement',
      shoppingLists: 'Listes de courses',
      usageGuide: 'Guide d\'utilisation',
      prayerTimes: 'Heures de prière',
      familyManagement: 'Gestion familiale',
      smartShopping: 'Achat intelligent',
      productOptimization: 'Optimisation des produits',
      moroccanLifestyle: 'Style de vie marocain',
      createShoppingList: 'Créer une liste de courses',
      calculateUsage: 'Calculer l\'usage',
      viewPrayerTimes: 'Voir les heures de prière',
      features: 'Fonctionnalités',
      getStarted: 'Commencer',
      overview: 'Aperçu'
    },
    en: {
      householdHelper: 'Household Helper',
      subtitle: 'Smart tools to manage your home efficiently',
      shoppingLists: 'Shopping Lists',
      usageGuide: 'Usage Guide',
      prayerTimes: 'Prayer Times',
      familyManagement: 'Family Management',
      smartShopping: 'Smart Shopping',
      productOptimization: 'Product Optimization',
      moroccanLifestyle: 'Moroccan Lifestyle',
      createShoppingList: 'Create Shopping List',
      calculateUsage: 'Calculate Usage',
      viewPrayerTimes: 'View Prayer Times',
      features: 'Features',
      getStarted: 'Get Started',
      overview: 'Overview'
    }
  };

  const msg = messages[language] || messages.en;

  const features = [
    {
      id: 'shopping',
      title: msg.shoppingLists,
      description: {
        ar: 'إنشاء قوائم تسوق ذكية مع قوالب جاهزة للاحتياجات المختلفة',
        fr: 'Créez des listes de courses intelligentes avec des modèles prêts pour différents besoins',
        en: 'Create smart shopping lists with ready templates for different needs'
      },
      icon: ShoppingCart,
      color: 'blue',
      features: [
        'Pre-made templates for different occasions',
        'Cost estimation in MAD',
        'Family size consideration',
        'Category organization'
      ]
    },
    {
      id: 'usage',
      title: msg.usageGuide,
      description: {
        ar: 'احسب مدة استهلاك المنتجات وتعلم كيفية استخدامها بكفاءة',
        fr: 'Calculez la durée de consommation des produits et apprenez à les utiliser efficacement',
        en: 'Calculate product consumption duration and learn how to use them efficiently'
      },
      icon: Calculator,
      color: 'green',
      features: [
        'Usage duration calculator',
        'Proper usage instructions',
        'Money-saving tips',
        'Reorder reminders'
      ]
    },
    {
      id: 'prayer',
      title: msg.prayerTimes,
      description: {
        ar: 'أوقات الصلاة الدقيقة مع تنبيهات وساعات المتجر المحدثة',
        fr: 'Heures de prière précises avec alertes et heures de magasin mises à jour',
        en: 'Accurate prayer times with alerts and updated store hours'
      },
      icon: Clock,
      color: 'purple',
      features: [
        'Accurate prayer times for Morocco',
        'Store hours during prayer times',
        'Ramadan special features',
        'Location-based timings'
      ]
    }
  ];

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
        <div className="max-w-4xl">
          <h1 className="text-3xl font-bold mb-4 flex items-center">
            <Home className="h-8 w-8 mr-3" />
            {msg.householdHelper}
          </h1>
          <p className="text-xl text-blue-100 mb-6">
            {msg.subtitle}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <ShoppingCart className="h-8 w-8 mx-auto mb-2 text-blue-200" />
              <div className="text-sm">{msg.smartShopping}</div>
            </div>
            <div>
              <Calculator className="h-8 w-8 mx-auto mb-2 text-blue-200" />
              <div className="text-sm">{msg.productOptimization}</div>
            </div>
            <div>
              <Users className="h-8 w-8 mx-auto mb-2 text-blue-200" />
              <div className="text-sm">{msg.familyManagement}</div>
            </div>
            <div>
              <Star className="h-8 w-8 mx-auto mb-2 text-blue-200" />
              <div className="text-sm">{msg.moroccanLifestyle}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {features.map((feature) => {
          const IconComponent = feature.icon;
          const colorClasses = {
            blue: 'border-blue-200 bg-blue-50 text-blue-600',
            green: 'border-green-200 bg-green-50 text-green-600',
            purple: 'border-purple-200 bg-purple-50 text-purple-600'
          };

          return (
            <div
              key={feature.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setActiveSection(feature.id)}
            >
              <div className={`w-12 h-12 rounded-lg ${colorClasses[feature.color]} flex items-center justify-center mb-4`}>
                <IconComponent className="h-6 w-6" />
              </div>

              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {feature.title}
              </h3>

              <p className="text-gray-600 text-sm mb-4">
                {feature.description[language] || feature.description.en}
              </p>

              <div className="space-y-1">
                {feature.features.slice(0, 2).map((item, index) => (
                  <div key={index} className="flex items-center text-xs text-gray-500">
                    <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                    {item}
                  </div>
                ))}
              </div>

              <button className="mt-4 w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                {msg.getStarted}
              </button>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-orange-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-orange-900 mb-4 flex items-center">
          <Lightbulb className="h-5 w-5 mr-2" />
          Quick Actions
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setActiveSection('shopping')}
            className="flex items-center justify-center space-x-2 p-4 bg-white rounded-lg border border-orange-200 hover:border-orange-300 hover:bg-orange-50 transition-colors"
          >
            <ShoppingCart className="h-5 w-5 text-orange-600" />
            <span className="font-medium text-gray-700">{msg.createShoppingList}</span>
          </button>

          <button
            onClick={() => setActiveSection('usage')}
            className="flex items-center justify-center space-x-2 p-4 bg-white rounded-lg border border-orange-200 hover:border-orange-300 hover:bg-orange-50 transition-colors"
          >
            <Calculator className="h-5 w-5 text-orange-600" />
            <span className="font-medium text-gray-700">{msg.calculateUsage}</span>
          </button>

          <button
            onClick={() => setActiveSection('prayer')}
            className="flex items-center justify-center space-x-2 p-4 bg-white rounded-lg border border-orange-200 hover:border-orange-300 hover:bg-orange-50 transition-colors"
          >
            <Clock className="h-5 w-5 text-orange-600" />
            <span className="font-medium text-gray-700">{msg.viewPrayerTimes}</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">12+</div>
          <div className="text-sm text-gray-600">Ready Templates</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-green-600">50+</div>
          <div className="text-sm text-gray-600">Product Guides</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">5</div>
          <div className="text-sm text-gray-600">Prayer Times Daily</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">100%</div>
          <div className="text-sm text-gray-600">Moroccan Focused</div>
        </div>
      </div>
    </div>
  );

  const renderShoppingSectionNav = () => (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setActiveSection('overview')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
        >
          <Home className="h-4 w-4" />
          <span>Back to Overview</span>
        </button>
        <div className="text-gray-400">/</div>
        <div className="font-medium text-gray-800">{msg.shoppingLists}</div>
      </div>
    </div>
  );

  const renderUsageSectionNav = () => (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setActiveSection('overview')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
        >
          <Home className="h-4 w-4" />
          <span>Back to Overview</span>
        </button>
        <div className="text-gray-400">/</div>
        <div className="font-medium text-gray-800">{msg.usageGuide}</div>
      </div>
    </div>
  );

  const renderPrayerSectionNav = () => (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setActiveSection('overview')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
        >
          <Home className="h-4 w-4" />
          <span>Back to Overview</span>
        </button>
        <div className="text-gray-400">/</div>
        <div className="font-medium text-gray-800">{msg.prayerTimes}</div>
      </div>
    </div>
  );

  const renderPrayerSection = () => (
    <div className="space-y-6">
      {renderPrayerSectionNav()}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-purple-600" />
            Prayer Times - Casablanca
          </h3>
          <PrayerTimesWidget showInNavbar={false} city="Casablanca" country="MA" />
        </div>

        <div className="space-y-4">
          <div className="bg-purple-50 rounded-lg p-6">
            <h4 className="font-semibold text-purple-900 mb-3">Store Hours During Prayer Times</h4>
            <div className="space-y-2 text-sm text-purple-800">
              <p>• Store closes for 15 minutes during Dhuhr prayer</p>
              <p>• Store closes for 15 minutes during Maghrib prayer</p>
              <p>• Special Ramadan hours: 9:00 AM - 11:00 PM</p>
              <p>• Friday: Extended closure during Jumu'ah prayer</p>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-6">
            <h4 className="font-semibold text-green-900 mb-3">Features</h4>
            <div className="space-y-2 text-sm text-green-800">
              <p>• Accurate prayer times for all Moroccan cities</p>
              <p>• Automatic Ramadan adjustments</p>
              <p>• Store hour notifications</p>
              <p>• Islamic calendar integration</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`household-helper min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="container mx-auto px-4 py-8">
        {activeSection === 'overview' && renderOverview()}

        {activeSection === 'shopping' && (
          <div>
            {renderShoppingSectionNav()}
            <HouseholdShoppingListCreator />
          </div>
        )}

        {activeSection === 'usage' && (
          <div>
            {renderUsageSectionNav()}
            <ProductUsageGuide />
          </div>
        )}

        {activeSection === 'prayer' && renderPrayerSection()}
      </div>
    </div>
  );
};

export default HouseholdHelper;
