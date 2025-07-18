import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { School, Calendar, Check, Plus, Minus, ShoppingCart, Calculator, BookOpen, Users, Clock, Star } from 'lucide-react';

const SchoolSuppliesChecklist = () => {
  const { language, isRTL, formatCurrency } = useLanguage();
  const [selectedGrade, setSelectedGrade] = useState('primary');
  const [checklist, setChecklist] = useState({});
  const [totalCost, setTotalCost] = useState(0);
  const [academicEvents, setAcademicEvents] = useState([]);

  const translations = {
    ar: {
      title: 'قائمة المستلزمات المدرسية',
      subtitle: 'قائمة شاملة للمستلزمات المدرسية حسب المنهج المغربي',
      grades: {
        primary: 'التعليم الابتدائي',
        middle: 'التعليم الإعدادي',
        high: 'التعليم الثانوي'
      },
      categories: {
        stationery: 'أدوات القرطاسية',
        notebooks: 'الكراسات والدفاتر',
        bags: 'الحقائب والمحافظ',
        art: 'أدوات الرسم والفنون',
        science: 'أدوات العلوم',
        sports: 'الرياضة',
        tech: 'التكنولوجيا'
      },
      required: 'مطلوب',
      optional: 'اختياري',
      recommended: 'موصى به',
      addToCart: 'أضف للسلة',
      totalCost: 'التكلفة الإجمالية',
      estimatedBudget: 'الميزانية المقدرة',
      checkAll: 'تحديد الكل',
      uncheckAll: 'إلغاء تحديد الكل',
      academicCalendar: 'التقويم الدراسي',
      upcomingEvents: 'الأحداث القادمة',
      prepareFor: 'التحضير لـ',
      shoppingTips: 'نصائح التسوق',
      budgetPlanner: 'مخطط الميزانية',
      quantity: 'الكمية',
      priceRange: 'نطاق السعر',
      saveList: 'احفظ القائمة',
      printList: 'اطبع القائمة'
    },
    fr: {
      title: 'Liste de Fournitures Scolaires',
      subtitle: 'Liste complète des fournitures selon le curriculum marocain',
      grades: {
        primary: 'Enseignement Primaire',
        middle: 'Enseignement Collégial',
        high: 'Enseignement Secondaire'
      },
      categories: {
        stationery: 'Papeterie',
        notebooks: 'Cahiers et Carnets',
        bags: 'Sacs et Cartables',
        art: 'Matériel d\'Art',
        science: 'Matériel Scientifique',
        sports: 'Sport',
        tech: 'Technologie'
      },
      required: 'Requis',
      optional: 'Optionnel',
      recommended: 'Recommandé',
      addToCart: 'Ajouter au Panier',
      totalCost: 'Coût Total',
      estimatedBudget: 'Budget Estimé',
      checkAll: 'Tout Sélectionner',
      uncheckAll: 'Tout Désélectionner',
      academicCalendar: 'Calendrier Académique',
      upcomingEvents: 'Événements à Venir',
      prepareFor: 'Préparer pour',
      shoppingTips: 'Conseils d\'Achat',
      budgetPlanner: 'Planificateur de Budget',
      quantity: 'Quantité',
      priceRange: 'Gamme de Prix',
      saveList: 'Sauvegarder la Liste',
      printList: 'Imprimer la Liste'
    },
    en: {
      title: 'School Supplies Checklist',
      subtitle: 'Comprehensive supplies list according to Moroccan curriculum',
      grades: {
        primary: 'Primary Education',
        middle: 'Middle School',
        high: 'High School'
      },
      categories: {
        stationery: 'Stationery',
        notebooks: 'Notebooks & Journals',
        bags: 'Bags & Backpacks',
        art: 'Art Supplies',
        science: 'Science Equipment',
        sports: 'Sports',
        tech: 'Technology'
      },
      required: 'Required',
      optional: 'Optional',
      recommended: 'Recommended',
      addToCart: 'Add to Cart',
      totalCost: 'Total Cost',
      estimatedBudget: 'Estimated Budget',
      checkAll: 'Check All',
      uncheckAll: 'Uncheck All',
      academicCalendar: 'Academic Calendar',
      upcomingEvents: 'Upcoming Events',
      prepareFor: 'Prepare for',
      shoppingTips: 'Shopping Tips',
      budgetPlanner: 'Budget Planner',
      quantity: 'Quantity',
      priceRange: 'Price Range',
      saveList: 'Save List',
      printList: 'Print List'
    }
  };

  const t = translations[language] || translations.ar;

  // Moroccan Academic Calendar Events
  const getAcademicEvents = () => {
    const currentYear = new Date().getFullYear();
    return [
      {
        id: 'rentrée',
        name: language === 'ar' ? 'العودة المدرسية' : 'Rentrée Scolaire',
        date: new Date(currentYear, 8, 5), // September 5
        type: 'major',
        preparation: language === 'ar' ? '4 أسابيع قبل' : '4 semaines avant'
      },
      {
        id: 'midterm',
        name: language === 'ar' ? 'امتحانات نصف السنة' : 'Examens Semestriels',
        date: new Date(currentYear, 11, 15), // December 15
        type: 'exams',
        preparation: language === 'ar' ? '2 أسابيع قبل' : '2 semaines avant'
      },
      {
        id: 'secondSemester',
        name: language === 'ar' ? 'بداية الفصل الثاني' : 'Deuxième Semestre',
        date: new Date(currentYear + 1, 1, 5), // February 5
        type: 'semester',
        preparation: language === 'ar' ? '1 أسبوع قبل' : '1 semaine avant'
      },
      {
        id: 'finalExams',
        name: language === 'ar' ? 'الامتحانات النهائية' : 'Examens Finaux',
        date: new Date(currentYear + 1, 5, 10), // June 10
        type: 'exams',
        preparation: language === 'ar' ? '3 أسابيع قبل' : '3 semaines avant'
      }
    ];
  };

  // School supplies data by grade
  const suppliesData = {
    primary: {
      stationery: [
        {
          id: 'pen_set',
          name: language === 'ar' ? 'مجموعة أقلام جاف (أزرق، أحمر، أسود)' : 'Ensemble de stylos (bleu, rouge, noir)',
          quantity: 1,
          price: 25,
          type: 'required',
          checked: false
        },
        {
          id: 'pencils',
          name: language === 'ar' ? 'أقلام رصاص HB' : 'Crayons HB',
          quantity: 10,
          price: 15,
          type: 'required',
          checked: false
        },
        {
          id: 'eraser',
          name: language === 'ar' ? 'ممحاة' : 'Gomme',
          quantity: 3,
          price: 8,
          type: 'required',
          checked: false
        },
        {
          id: 'ruler',
          name: language === 'ar' ? 'مسطرة 30 سم' : 'Règle 30cm',
          quantity: 1,
          price: 12,
          type: 'required',
          checked: false
        },
        {
          id: 'scissors',
          name: language === 'ar' ? 'مقص للأطفال' : 'Ciseaux pour enfants',
          quantity: 1,
          price: 18,
          type: 'recommended',
          checked: false
        }
      ],
      notebooks: [
        {
          id: 'arabic_notebook',
          name: language === 'ar' ? 'كراسة عربية (أسطر)' : 'Cahier arabe (lignes)',
          quantity: 5,
          price: 12,
          type: 'required',
          checked: false
        },
        {
          id: 'math_notebook',
          name: language === 'ar' ? 'كراسة رياضيات (مربعات)' : 'Cahier maths (carreaux)',
          quantity: 3,
          price: 12,
          type: 'required',
          checked: false
        },
        {
          id: 'french_notebook',
          name: language === 'ar' ? 'كراسة فرنسية' : 'Cahier français',
          quantity: 3,
          price: 12,
          type: 'required',
          checked: false
        }
      ],
      art: [
        {
          id: 'colored_pencils',
          name: language === 'ar' ? 'أقلام ملونة (12 لون)' : 'Crayons de couleur (12 couleurs)',
          quantity: 1,
          price: 35,
          type: 'required',
          checked: false
        },
        {
          id: 'watercolors',
          name: language === 'ar' ? 'ألوان مائية' : 'Aquarelles',
          quantity: 1,
          price: 45,
          type: 'optional',
          checked: false
        }
      ]
    },
    middle: {
      stationery: [
        {
          id: 'pen_set_middle',
          name: language === 'ar' ? 'مجموعة أقلام جاف متنوعة' : 'Ensemble de stylos variés',
          quantity: 1,
          price: 35,
          type: 'required',
          checked: false
        },
        {
          id: 'mechanical_pencil',
          name: language === 'ar' ? 'قلم رصاص ميكانيكي' : 'Porte-mine',
          quantity: 2,
          price: 20,
          type: 'recommended',
          checked: false
        },
        {
          id: 'compass',
          name: language === 'ar' ? 'بركار رياضي' : 'Compas',
          quantity: 1,
          price: 45,
          type: 'required',
          checked: false
        },
        {
          id: 'protractor',
          name: language === 'ar' ? 'منقلة' : 'Rapporteur',
          quantity: 1,
          price: 15,
          type: 'required',
          checked: false
        }
      ],
      notebooks: [
        {
          id: 'subject_notebooks',
          name: language === 'ar' ? 'كراسات المواد (96 ورقة)' : 'Cahiers matières (96 pages)',
          quantity: 8,
          price: 18,
          type: 'required',
          checked: false
        },
        {
          id: 'homework_diary',
          name: language === 'ar' ? 'مفكرة الواجبات' : 'Agenda scolaire',
          quantity: 1,
          price: 25,
          type: 'required',
          checked: false
        }
      ],
      science: [
        {
          id: 'calculator',
          name: language === 'ar' ? 'آلة حاسبة علمية' : 'Calculatrice scientifique',
          quantity: 1,
          price: 85,
          type: 'required',
          checked: false
        }
      ]
    },
    high: {
      stationery: [
        {
          id: 'advanced_pen_set',
          name: language === 'ar' ? 'مجموعة أقلام احترافية' : 'Ensemble de stylos professionnels',
          quantity: 1,
          price: 65,
          type: 'required',
          checked: false
        },
        {
          id: 'highlighters',
          name: language === 'ar' ? 'أقلام تلوين (فلوماستر)' : 'Surligneurs',
          quantity: 4,
          price: 28,
          type: 'recommended',
          checked: false
        }
      ],
      notebooks: [
        {
          id: 'specialized_notebooks',
          name: language === 'ar' ? 'كراسات متخصصة (120 ورقة)' : 'Cahiers spécialisés (120 pages)',
          quantity: 10,
          price: 22,
          type: 'required',
          checked: false
        }
      ],
      tech: [
        {
          id: 'usb_drive',
          name: language === 'ar' ? 'مفتاح USB' : 'Clé USB',
          quantity: 1,
          price: 45,
          type: 'recommended',
          checked: false
        },
        {
          id: 'graphing_calculator',
          name: language === 'ar' ? 'آلة حاسبة رسوميات' : 'Calculatrice graphique',
          quantity: 1,
          price: 350,
          type: 'required',
          checked: false
        }
      ]
    }
  };

  useEffect(() => {
    setChecklist(suppliesData[selectedGrade] || {});
    setAcademicEvents(getAcademicEvents());
  }, [selectedGrade, language]);

  useEffect(() => {
    calculateTotal();
  }, [checklist]);

  const calculateTotal = () => {
    let total = 0;
    Object.values(checklist).forEach(category => {
      category.forEach(item => {
        if (item.checked) {
          total += item.price * item.quantity;
        }
      });
    });
    setTotalCost(total);
  };

  const toggleItem = (categoryKey, itemId) => {
    setChecklist(prev => ({
      ...prev,
      [categoryKey]: prev[categoryKey].map(item =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      )
    }));
  };

  const updateQuantity = (categoryKey, itemId, newQuantity) => {
    if (newQuantity < 1) return;
    setChecklist(prev => ({
      ...prev,
      [categoryKey]: prev[categoryKey].map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    }));
  };

  const toggleAllCategory = (categoryKey, checked) => {
    setChecklist(prev => ({
      ...prev,
      [categoryKey]: prev[categoryKey].map(item => ({ ...item, checked }))
    }));
  };

  const getTypeColor = (type) => {
    const colors = {
      required: 'text-red-600 bg-red-50 border-red-200',
      recommended: 'text-blue-600 bg-blue-50 border-blue-200',
      optional: 'text-gray-600 bg-gray-50 border-gray-200'
    };
    return colors[type] || colors.optional;
  };

  const getUpcomingEvent = () => {
    const now = new Date();
    return academicEvents.find(event => event.date > now);
  };

  const upcomingEvent = getUpcomingEvent();

  return (
    <div className={`max-w-7xl mx-auto p-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{t.title}</h2>
        <p className="text-gray-600">{t.subtitle}</p>
      </div>

      {/* Academic Calendar Alert */}
      {upcomingEvent && (
        <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="font-semibold text-blue-900">{upcomingEvent.name}</h3>
              <p className="text-sm text-blue-700">
                {t.prepareFor} {upcomingEvent.date.toLocaleDateString()} - {upcomingEvent.preparation}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Grade Selection */}
      <div className="mb-8">
        <div className="flex justify-center">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {Object.keys(suppliesData).map((grade) => (
              <button
                key={grade}
                onClick={() => setSelectedGrade(grade)}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  selectedGrade === grade
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {t.grades[grade]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checklist */}
        <div className="lg:col-span-2">
          {Object.entries(checklist).map(([categoryKey, items]) => (
            <div key={categoryKey} className="bg-white rounded-lg shadow-md mb-6">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <School className="w-5 h-5 text-blue-600" />
                    {t.categories[categoryKey]}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleAllCategory(categoryKey, true)}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      {t.checkAll}
                    </button>
                    <button
                      onClick={() => toggleAllCategory(categoryKey, false)}
                      className="text-sm text-gray-600 hover:text-gray-700"
                    >
                      {t.uncheckAll}
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => toggleItem(categoryKey, item.id)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs px-2 py-1 rounded-full border font-medium ${getTypeColor(item.type)}`}>
                            {t[item.type]}
                          </span>
                        </div>
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <div className="text-sm text-gray-600">
                          {formatCurrency(item.price)} × {item.quantity} = {formatCurrency(item.price * item.quantity)}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(categoryKey, item.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(categoryKey, item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Budget Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-green-600" />
              {t.budgetPlanner}
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">{t.totalCost}:</span>
                <span className="text-2xl font-bold text-green-600">
                  {formatCurrency(totalCost)}
                </span>
              </div>

              <div className="text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>{t.required}:</span>
                  <span>{formatCurrency(totalCost * 0.7)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t.recommended}:</span>
                  <span>{formatCurrency(totalCost * 0.25)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t.optional}:</span>
                  <span>{formatCurrency(totalCost * 0.05)}</span>
                </div>
              </div>
            </div>

            <button className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              {t.addToCart}
            </button>
          </div>

          {/* Academic Events */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              {t.academicCalendar}
            </h3>

            <div className="space-y-3">
              {academicEvents.slice(0, 3).map((event) => (
                <div key={event.id} className="p-3 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900">{event.name}</h4>
                  <p className="text-sm text-gray-600">{event.date.toLocaleDateString()}</p>
                  <p className="text-xs text-purple-600">{event.preparation}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Shopping Tips */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-600" />
              {t.shoppingTips}
            </h3>

            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2"></div>
                <span>
                  {language === 'ar'
                    ? 'اشتري في وقت مبكر لتجنب الازدحام'
                    : 'Achetez tôt pour éviter la foule'
                  }
                </span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2"></div>
                <span>
                  {language === 'ar'
                    ? 'قارن الأسعار بين المتاجر المختلفة'
                    : 'Comparez les prix entre différents magasins'
                  }
                </span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2"></div>
                <span>
                  {language === 'ar'
                    ? 'ابحث عن العروض والخصومات'
                    : 'Cherchez les offres et promotions'
                  }
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolSuppliesChecklist;
