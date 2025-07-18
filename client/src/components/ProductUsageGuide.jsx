import React, { useState, useEffect } from 'react';
import {
  Calculator, Clock, Users, Droplets, Sparkles, Baby,
  Home, ChefHat, Wrench, AlertCircle, CheckCircle,
  Info, Star, Lightbulb, Calendar, TrendingUp, Package
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const ProductUsageGuide = ({ productId, productName, productCategory }) => {
  const [activeTab, setActiveTab] = useState('calculator');
  const [familySize, setFamilySize] = useState(4);
  const [usageFrequency, setUsageFrequency] = useState('normal');
  const [productSize, setProductSize] = useState('');
  const [calculationResult, setCalculationResult] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState('');

  const { language, isRTL, t } = useLanguage();

  const messages = {
    ar: {
      productUsageGuide: 'دليل استخدام المنتجات',
      usageCalculator: 'حاسبة الاستهلاك',
      usageInstructions: 'تعليمات الاستخدام',
      tips: 'نصائح وحيل',
      safety: 'معلومات السلامة',
      familySize: 'عدد أفراد الأسرة',
      usageFrequency: 'معدل الاستخدام',
      productSize: 'حجم المنتج',
      estimatedDuration: 'المدة المتوقعة',
      dailyUsage: 'الاستهلاك اليومي',
      monthlyUsage: 'الاستهلاك الشهري',
      costPerDay: 'التكلفة اليومية',
      costPerMonth: 'التكلفة الشهرية',
      reorderDate: 'تاريخ إعادة الطلب',
      light: 'خفيف',
      normal: 'عادي',
      heavy: 'كثيف',
      veryHeavy: 'كثيف جداً',
      days: 'أيام',
      weeks: 'أسابيع',
      months: 'أشهر',
      calculate: 'احسب',
      instructions: 'التعليمات',
      dosage: 'الجرعة المناسبة',
      frequency: 'التكرار',
      precautions: 'احتياطات',
      storage: 'التخزين',
      generalTips: 'نصائح',
      efficiency: 'نصائح للكفاءة',
      savings: 'نصائح للتوفير',
      alternatives: 'بدائل',
      warning: 'تحذير',
      info: 'معلومة',
      tip: 'نصيحة'
    },
    fr: {
      productUsageGuide: 'Guide d\'utilisation des produits',
      usageCalculator: 'Calculateur d\'usage',
      usageInstructions: 'Instructions d\'utilisation',
      tips: 'Conseils et astuces',
      safety: 'Informations de sécurité',
      familySize: 'Taille de la famille',
      usageFrequency: 'Fréquence d\'utilisation',
      productSize: 'Taille du produit',
      estimatedDuration: 'Durée estimée',
      dailyUsage: 'Usage quotidien',
      monthlyUsage: 'Usage mensuel',
      costPerDay: 'Coût par jour',
      costPerMonth: 'Coût par mois',
      reorderDate: 'Date de recommande',
      light: 'Léger',
      normal: 'Normal',
      heavy: 'Intensif',
      veryHeavy: 'Très intensif',
      days: 'jours',
      weeks: 'semaines',
      months: 'mois',
      calculate: 'Calculer',
      instructions: 'Instructions',
      dosage: 'Dosage approprié',
      frequency: 'Fréquence',
      precautions: 'Précautions',
      storage: 'Stockage',
      generalTips: 'Conseils',
      efficiency: 'Conseils d\'efficacité',
      savings: 'Conseils d\'économie',
      alternatives: 'Alternatives',
      warning: 'Attention',
      info: 'Information',
      tip: 'Conseil'
    },
    en: {
      productUsageGuide: 'Product Usage Guide',
      usageCalculator: 'Usage Calculator',
      usageInstructions: 'Usage Instructions',
      tips: 'Tips & Tricks',
      safety: 'Safety Information',
      familySize: 'Family Size',
      usageFrequency: 'Usage Frequency',
      productSize: 'Product Size',
      estimatedDuration: 'Estimated Duration',
      dailyUsage: 'Daily Usage',
      monthlyUsage: 'Monthly Usage',
      costPerDay: 'Cost per Day',
      costPerMonth: 'Cost per Month',
      reorderDate: 'Reorder Date',
      light: 'Light',
      normal: 'Normal',
      heavy: 'Heavy',
      veryHeavy: 'Very Heavy',
      days: 'days',
      weeks: 'weeks',
      months: 'months',
      calculate: 'Calculate',
      instructions: 'Instructions',
      dosage: 'Proper Dosage',
      frequency: 'Frequency',
      precautions: 'Precautions',
      storage: 'Storage',
      generalTips: 'Tips',
      efficiency: 'Efficiency Tips',
      savings: 'Money-Saving Tips',
      alternatives: 'Alternatives',
      warning: 'Warning',
      info: 'Information',
      tip: 'Tip'
    }
  };

  const msg = messages[language] || messages.en;

  // Product database with usage information
  const productGuides = {
    'cleaning': {
      'Ariel Detergent Powder': {
        usagePerLoad: 50, // grams
        averageLoadsPerWeek: { 1: 2, 2: 3, 3: 5, 4: 7, 5: 9, 6: 11, 7: 13, 8: 15 },
        instructions: {
          ar: {
            dosage: 'استخدم 50-75 جرام لكل حمولة غسيل عادية',
            frequency: 'حسب عدد أفراد الأسرة واحتياجات الغسيل',
            precautions: 'احفظ بعيداً عن متناول الأطفال، تجنب ملامسة العينين',
            storage: 'يُحفظ في مكان جاف وبارد بعيداً عن أشعة الشمس المباشرة'
          },
          fr: {
            dosage: 'Utilisez 50-75g par charge de lavage normale',
            frequency: 'Selon la taille de la famille et les besoins de lavage',
            precautions: 'Garder hors de portée des enfants, éviter le contact avec les yeux',
            storage: 'Conserver dans un endroit sec et frais, à l\'abri du soleil'
          },
          en: {
            dosage: 'Use 50-75g per normal washing load',
            frequency: 'Based on family size and washing needs',
            precautions: 'Keep away from children, avoid eye contact',
            storage: 'Store in a cool, dry place away from direct sunlight'
          }
        },
        tips: {
          ar: [
            'استخدم الماء البارد للأقمشة الحساسة لتوفير الطاقة',
            'انقع البقع الصعبة قبل الغسيل لنتائج أفضل',
            'لا تفرط في استخدام المسحوق - الكمية الزائدة لا تعني نظافة أكثر'
          ],
          fr: [
            'Utilisez l\'eau froide pour les tissus délicats et économiser l\'énergie',
            'Pré-traitez les taches tenaces avant le lavage pour de meilleurs résultats',
            'N\'utilisez pas trop de poudre - plus ne signifie pas plus propre'
          ],
          en: [
            'Use cold water for delicate fabrics to save energy',
            'Pre-treat tough stains before washing for better results',
            'Don\'t overuse powder - more doesn\'t mean cleaner'
          ]
        }
      },
      'Ajax Floor Cleaner': {
        usagePerClean: 30, // ml per square meter
        averageCleaningFrequency: { light: 2, normal: 3, heavy: 5, veryHeavy: 7 }, // times per week
        instructions: {
          ar: {
            dosage: 'اخلط 30 مل لكل لتر ماء للتنظيف العادي',
            frequency: '2-3 مرات في الأسبوع حسب الاستخدام',
            precautions: 'ارتد قفازات، تأكد من التهوية الجيدة',
            storage: 'يُحفظ في مكان بارد وجاف بعيداً عن الأطفال'
          },
          fr: {
            dosage: 'Mélangez 30ml par litre d\'eau pour un nettoyage normal',
            frequency: '2-3 fois par semaine selon l\'usage',
            precautions: 'Portez des gants, assurez une bonne ventilation',
            storage: 'Conserver dans un endroit frais et sec, loin des enfants'
          },
          en: {
            dosage: 'Mix 30ml per liter of water for normal cleaning',
            frequency: '2-3 times per week depending on usage',
            precautions: 'Wear gloves, ensure good ventilation',
            storage: 'Store in cool, dry place away from children'
          }
        }
      }
    },
    'personal': {
      'Head & Shoulders Shampoo': {
        usagePerWash: 10, // ml
        averageWashesPerWeek: { 1: 3, 2: 5, 3: 8, 4: 12, 5: 15, 6: 18, 7: 21, 8: 24 },
        instructions: {
          ar: {
            dosage: 'استخدم كمية بحجم العملة المعدنية للشعر القصير',
            frequency: 'يومياً أو حسب نوع الشعر',
            precautions: 'تجنب ملامسة العينين، اشطف جيداً',
            storage: 'يُحفظ في مكان بارد وجاف'
          }
        }
      },
      'Colgate Toothpaste': {
        usagePerBrush: 1, // grams
        averageBrushesPerDay: { 1: 2, 2: 4, 3: 6, 4: 8, 5: 10, 6: 12, 7: 14, 8: 16 },
        instructions: {
          ar: {
            dosage: 'كمية بحجم حبة البازلاء للبالغين، أقل للأطفال',
            frequency: 'مرتين يومياً على الأقل بعد الوجبات',
            precautions: 'لا تبلع، اشطف الفم جيداً بعد الاستخدام',
            storage: 'يُحفظ في مكان بارد وجاف'
          }
        }
      }
    },
    'beauty': {
      'L\'Oréal Face Cream': {
        usagePerApplication: 2, // grams
        averageApplicationsPerDay: 2,
        instructions: {
          ar: {
            dosage: 'كمية صغيرة بحجم حبة البازلاء للوجه كاملاً',
            frequency: 'صباحاً ومساءً على بشرة نظيفة',
            precautions: 'اختبر على منطقة صغيرة أولاً، تجنب منطقة العينين',
            storage: 'يُحفظ في مكان بارد وجاف، أغلق الغطاء جيداً'
          }
        }
      }
    },
    'baby': {
      'Baby Diapers': {
        usagePerDay: { 1: 8, 2: 6, 3: 5, 4: 4 }, // by age in years
        instructions: {
          ar: {
            frequency: 'غيّر الحفاض كل 2-3 ساعات أو عند الحاجة',
            precautions: 'تأكد من النظافة، استخدم كريم الحماية',
            storage: 'يُحفظ في مكان جاف ونظيف'
          }
        }
      }
    }
  };

  const calculateUsage = () => {
    if (!selectedProduct || !productSize) return;

    const guide = getProductGuide(selectedProduct);
    if (!guide) return;

    let dailyUsage = 0;
    let duration = 0;

    // Calculate based on product type
    if (selectedProduct.includes('Detergent')) {
      const loadsPerWeek = guide.averageLoadsPerWeek[familySize] || 7;
      const usagePerWeek = loadsPerWeek * guide.usagePerLoad;
      dailyUsage = usagePerWeek / 7;
      duration = parseFloat(productSize) / dailyUsage;
    } else if (selectedProduct.includes('Floor Cleaner')) {
      const frequency = guide.averageCleaningFrequency[usageFrequency] || 3;
      const usagePerWeek = frequency * guide.usagePerClean * 50; // assuming 50 sqm house
      dailyUsage = usagePerWeek / 7;
      duration = parseFloat(productSize) / dailyUsage;
    } else if (selectedProduct.includes('Shampoo')) {
      const washesPerWeek = guide.averageWashesPerWeek[familySize] || 12;
      const usagePerWeek = washesPerWeek * guide.usagePerWash;
      dailyUsage = usagePerWeek / 7;
      duration = parseFloat(productSize) / dailyUsage;
    } else if (selectedProduct.includes('Toothpaste')) {
      const brushesPerDay = guide.averageBrushesPerDay[familySize] || 8;
      dailyUsage = brushesPerDay * guide.usagePerBrush;
      duration = parseFloat(productSize) / dailyUsage;
    } else if (selectedProduct.includes('Face Cream')) {
      dailyUsage = guide.usagePerApplication * guide.averageApplicationsPerDay;
      duration = parseFloat(productSize) / dailyUsage;
    }

    // Calculate costs (assuming we have product price)
    const estimatedPrice = getEstimatedPrice(selectedProduct);
    const costPerDay = (estimatedPrice / duration) || 0;
    const costPerMonth = costPerDay * 30;

    // Calculate reorder date
    const reorderDate = new Date();
    reorderDate.setDate(reorderDate.getDate() + Math.floor(duration * 0.9)); // Reorder at 90% usage

    setCalculationResult({
      dailyUsage: dailyUsage.toFixed(2),
      duration: Math.floor(duration),
      costPerDay: costPerDay.toFixed(2),
      costPerMonth: costPerMonth.toFixed(2),
      reorderDate: reorderDate.toLocaleDateString(),
      unit: getProductUnit(selectedProduct)
    });
  };

  const getProductGuide = (productName) => {
    for (const category of Object.values(productGuides)) {
      if (category[productName]) {
        return category[productName];
      }
    }
    return null;
  };

  const getEstimatedPrice = (productName) => {
    const prices = {
      'Ariel Detergent Powder': 49.99,
      'Ajax Floor Cleaner': 15.50,
      'Head & Shoulders Shampoo': 32.00,
      'Colgate Toothpaste': 15.25,
      'L\'Oréal Face Cream': 85.00,
      'Baby Diapers': 65.00
    };
    return prices[productName] || 20.00;
  };

  const getProductUnit = (productName) => {
    if (productName.includes('Detergent')) return 'g';
    if (productName.includes('Cleaner') || productName.includes('Shampoo')) return 'ml';
    if (productName.includes('Toothpaste') || productName.includes('Cream')) return 'g';
    if (productName.includes('Diapers')) return 'pieces';
    return 'units';
  };

  const renderCalculatorTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Product
          </label>
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Choose a product...</option>
            <optgroup label="Cleaning Products">
              <option value="Ariel Detergent Powder">Ariel Detergent Powder 3kg</option>
              <option value="Ajax Floor Cleaner">Ajax Floor Cleaner 1L</option>
            </optgroup>
            <optgroup label="Personal Care">
              <option value="Head & Shoulders Shampoo">Head & Shoulders Shampoo 400ml</option>
              <option value="Colgate Toothpaste">Colgate Toothpaste 100ml</option>
            </optgroup>
            <optgroup label="Beauty">
              <option value="L'Oréal Face Cream">L'Oréal Face Cream 50ml</option>
            </optgroup>
            <optgroup label="Baby Products">
              <option value="Baby Diapers">Baby Diapers (Pack)</option>
            </optgroup>
          </select>
        </div>

        {/* Product Size */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {msg.productSize} ({getProductUnit(selectedProduct)})
          </label>
          <input
            type="number"
            value={productSize}
            onChange={(e) => setProductSize(e.target.value)}
            placeholder={`Enter size in ${getProductUnit(selectedProduct)}`}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Family Size */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {msg.familySize}
          </label>
          <select
            value={familySize}
            onChange={(e) => setFamilySize(parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map(size => (
              <option key={size} value={size}>{size} {size === 1 ? 'person' : 'people'}</option>
            ))}
          </select>
        </div>

        {/* Usage Frequency */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {msg.usageFrequency}
          </label>
          <select
            value={usageFrequency}
            onChange={(e) => setUsageFrequency(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="light">{msg.light}</option>
            <option value="normal">{msg.normal}</option>
            <option value="heavy">{msg.heavy}</option>
            <option value="veryHeavy">{msg.veryHeavy}</option>
          </select>
        </div>
      </div>

      <button
        onClick={calculateUsage}
        disabled={!selectedProduct || !productSize}
        className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Calculator className="h-5 w-5 mr-2" />
        {msg.calculate}
      </button>

      {/* Results */}
      {calculationResult && (
        <div className="bg-blue-50 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Usage Estimation Results
          </h4>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {calculationResult.dailyUsage}
              </div>
              <div className="text-sm text-gray-600">
                {msg.dailyUsage} ({calculationResult.unit}/day)
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {calculationResult.duration}
              </div>
              <div className="text-sm text-gray-600">
                {msg.days}
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {calculationResult.costPerDay}
              </div>
              <div className="text-sm text-gray-600">
                MAD per day
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {calculationResult.costPerMonth}
              </div>
              <div className="text-sm text-gray-600">
                MAD per month
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center text-yellow-800">
              <Calendar className="h-5 w-5 mr-2" />
              <span className="font-medium">Recommended reorder date: {calculationResult.reorderDate}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderInstructionsTab = () => {
    if (!selectedProduct) {
      return (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-600 mb-2">
            Select a product to view instructions
          </h4>
          <p className="text-gray-500">
            Choose a product from the calculator tab to see detailed usage instructions
          </p>
        </div>
      );
    }

    const guide = getProductGuide(selectedProduct);
    if (!guide || !guide.instructions) {
      return (
        <div className="text-center py-12">
          <Info className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-600 mb-2">
            Instructions not available
          </h4>
          <p className="text-gray-500">
            Detailed instructions for this product are not available yet
          </p>
        </div>
      );
    }

    const instructions = guide.instructions[language] || guide.instructions.en;

    return (
      <div className="space-y-6">
        <div className="bg-blue-50 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
            <Package className="h-5 w-5 mr-2" />
            {selectedProduct}
          </h4>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4">
                <h5 className="font-semibold text-gray-800 mb-2 flex items-center">
                  <Droplets className="h-4 w-4 mr-2 text-blue-500" />
                  {msg.dosage}
                </h5>
                <p className="text-gray-600 text-sm">{instructions.dosage}</p>
              </div>

              <div className="bg-white rounded-lg p-4">
                <h5 className="font-semibold text-gray-800 mb-2 flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-green-500" />
                  {msg.frequency}
                </h5>
                <p className="text-gray-600 text-sm">{instructions.frequency}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4">
                <h5 className="font-semibold text-gray-800 mb-2 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
                  {msg.precautions}
                </h5>
                <p className="text-gray-600 text-sm">{instructions.precautions}</p>
              </div>

              <div className="bg-white rounded-lg p-4">
                <h5 className="font-semibold text-gray-800 mb-2 flex items-center">
                  <Home className="h-4 w-4 mr-2 text-purple-500" />
                  {msg.storage}
                </h5>
                <p className="text-gray-600 text-sm">{instructions.storage}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTipsTab = () => {
    if (!selectedProduct) {
      return (
        <div className="text-center py-12">
          <Lightbulb className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-600 mb-2">
            Select a product to view tips
          </h4>
          <p className="text-gray-500">
            Choose a product to see helpful tips and tricks
          </p>
        </div>
      );
    }

    const guide = getProductGuide(selectedProduct);
    if (!guide || !guide.tips) {
      return (
        <div className="text-center py-12">
          <Lightbulb className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-600 mb-2">
            Tips not available
          </h4>
          <p className="text-gray-500">
            Tips for this product are not available yet
          </p>
        </div>
      );
    }

    const tips = guide.tips[language] || guide.tips.en || [];

    return (
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-orange-900 mb-4 flex items-center">
            <Lightbulb className="h-5 w-5 mr-2" />
            {msg.tips} - {selectedProduct}
          </h4>

          <div className="space-y-3">
            {tips.map((tip, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border-l-4 border-yellow-400">
                <div className="flex items-start">
                  <Star className="h-5 w-5 text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-gray-700">{tip}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* General household tips */}
        <div className="bg-green-50 rounded-lg p-6">
          <h5 className="font-semibold text-green-900 mb-3 flex items-center">
            <CheckCircle className="h-4 w-4 mr-2" />
            General Household Tips
          </h5>
          <div className="space-y-2 text-sm text-green-800">
            <p>• Buy household products in bulk during sales to save money</p>
            <p>• Keep a usage log to better predict when you'll need to restock</p>
            <p>• Store products properly to extend their shelf life</p>
            <p>• Consider eco-friendly alternatives for a greener household</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`product-usage-guide ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('calculator')}
            className={`flex-1 px-6 py-4 text-sm font-medium text-center border-b-2 transition-colors ${
              activeTab === 'calculator'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Calculator className="h-5 w-5 mx-auto mb-1" />
            {msg.usageCalculator}
          </button>

          <button
            onClick={() => setActiveTab('instructions')}
            className={`flex-1 px-6 py-4 text-sm font-medium text-center border-b-2 transition-colors ${
              activeTab === 'instructions'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Info className="h-5 w-5 mx-auto mb-1" />
            {msg.instructions}
          </button>

          <button
            onClick={() => setActiveTab('tips')}
            className={`flex-1 px-6 py-4 text-sm font-medium text-center border-b-2 transition-colors ${
              activeTab === 'tips'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Lightbulb className="h-5 w-5 mx-auto mb-1" />
            {msg.tips}
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {activeTab === 'calculator' && renderCalculatorTab()}
        {activeTab === 'instructions' && renderInstructionsTab()}
        {activeTab === 'tips' && renderTipsTab()}
      </div>
    </div>
  );
};

export default ProductUsageGuide;
