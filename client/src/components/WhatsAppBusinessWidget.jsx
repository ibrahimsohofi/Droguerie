import React, { useState, useEffect } from 'react';
import { MessageCircle, Phone, Clock, MapPin, X, Send, Users, Package, Truck, CreditCard } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const WhatsAppBusinessWidget = ({
  showWidget = true,
  businessPhone = '+212522123456',
  autoOpen = false
}) => {
  const { language, isRTL, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(autoOpen);
  const [selectedOption, setSelectedOption] = useState(null);
  const [customMessage, setCustomMessage] = useState('');

  // Business information
  const businessInfo = {
    ar: {
      name: 'دروغري جمال',
      address: 'شارع الحسن الثاني، الدار البيضاء، المغرب',
      hours: 'الاثنين-السبت: 8:00-20:00، الأحد: 9:00-18:00',
      email: 'contact@drogueriejamal.ma'
    },
    fr: {
      name: 'Droguerie Jamal',
      address: 'Avenue Hassan II, Casablanca, Maroc',
      hours: 'Lun-Sam: 8h00-20h00, Dim: 9h00-18h00',
      email: 'contact@drogueriejamal.ma'
    },
    en: {
      name: 'Droguerie Jamal',
      address: 'Hassan II Street, Casablanca, Morocco',
      hours: 'Mon-Sat: 8:00-20:00, Sun: 9:00-18:00',
      email: 'contact@drogueriejamal.ma'
    }
  };

  // Quick service options
  const serviceOptions = {
    ar: [
      {
        id: 'products',
        icon: Package,
        title: 'تصفح المنتجات',
        description: 'استفسر عن منتجاتنا وأسعارها',
        message: 'مرحباً! أود الاستفسار عن المنتجات المتوفرة في دروغري جمال.'
      },
      {
        id: 'order',
        icon: Phone,
        title: 'الاستفسار عن طلب',
        description: 'تتبع طلبك أو استفسر عن حالته',
        message: 'مرحباً! أود الاستفسار عن حالة طلبي.'
      },
      {
        id: 'consultation',
        icon: Users,
        title: 'استشارة دوائية',
        description: 'احصل على استشارة مجانية',
        message: 'مرحباً! أحتاج لاستشارة دوائية من فضلكم.'
      },
      {
        id: 'delivery',
        icon: Truck,
        title: 'معلومات التوصيل',
        description: 'اسأل عن أوقات ورسوم التوصيل',
        message: 'مرحباً! أود الاستفسار عن خدمة التوصيل.'
      },
      {
        id: 'payment',
        icon: CreditCard,
        title: 'طرق الدفع',
        description: 'معرفة طرق الدفع المتاحة',
        message: 'مرحباً! أود معرفة طرق الدفع المتاحة.'
      }
    ],
    fr: [
      {
        id: 'products',
        icon: Package,
        title: 'Parcourir les produits',
        description: 'Renseignements sur nos produits et prix',
        message: 'Bonjour! Je souhaite me renseigner sur les produits disponibles chez Droguerie Jamal.'
      },
      {
        id: 'order',
        icon: Phone,
        title: 'Suivi de commande',
        description: 'Suivez votre commande ou demandez son statut',
        message: 'Bonjour! Je souhaite me renseigner sur le statut de ma commande.'
      },
      {
        id: 'consultation',
        icon: Users,
        title: 'Conseil pharmaceutique',
        description: 'Obtenez des conseils gratuits',
        message: 'Bonjour! J\'aurais besoin d\'un conseil pharmaceutique s\'il vous plaît.'
      },
      {
        id: 'delivery',
        icon: Truck,
        title: 'Informations livraison',
        description: 'Horaires et frais de livraison',
        message: 'Bonjour! Je souhaite me renseigner sur le service de livraison.'
      },
      {
        id: 'payment',
        icon: CreditCard,
        title: 'Modes de paiement',
        description: 'Découvrez les options de paiement',
        message: 'Bonjour! Je voudrais connaître les modes de paiement disponibles.'
      }
    ],
    en: [
      {
        id: 'products',
        icon: Package,
        title: 'Browse Products',
        description: 'Inquire about our products and prices',
        message: 'Hello! I would like to inquire about products available at Droguerie Jamal.'
      },
      {
        id: 'order',
        icon: Phone,
        title: 'Order Inquiry',
        description: 'Track your order or ask about its status',
        message: 'Hello! I would like to inquire about my order status.'
      },
      {
        id: 'consultation',
        icon: Users,
        title: 'Pharmaceutical Consultation',
        description: 'Get free consultation',
        message: 'Hello! I would need a pharmaceutical consultation please.'
      },
      {
        id: 'delivery',
        icon: Truck,
        title: 'Delivery Information',
        description: 'Ask about delivery times and fees',
        message: 'Hello! I would like to inquire about the delivery service.'
      },
      {
        id: 'payment',
        icon: CreditCard,
        title: 'Payment Methods',
        description: 'Learn about available payment options',
        message: 'Hello! I would like to know about available payment methods.'
      }
    ]
  };

  // Generate WhatsApp link
  const generateWhatsAppLink = (message) => {
    const cleanPhone = businessPhone.replace(/[^\d]/g, '');
    const fullPhone = cleanPhone.startsWith('212') ? cleanPhone : `212${cleanPhone.replace(/^0/, '')}`;
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${fullPhone}?text=${encodedMessage}`;
  };

  // Handle quick option selection
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    const whatsappLink = generateWhatsAppLink(option.message);
    window.open(whatsappLink, '_blank', 'noopener,noreferrer');
  };

  // Handle custom message
  const handleCustomMessage = () => {
    if (customMessage.trim()) {
      const whatsappLink = generateWhatsAppLink(customMessage);
      window.open(whatsappLink, '_blank', 'noopener,noreferrer');
      setCustomMessage('');
    }
  };

  // Get current business info
  const currentBusinessInfo = businessInfo[language] || businessInfo.ar;
  const currentOptions = serviceOptions[language] || serviceOptions.ar;

  // Check if currently open hours (Morocco timezone)
  const isOpenNow = () => {
    const now = new Date();
    const moroccoTime = new Date(now.toLocaleString("en-US", {timeZone: "Africa/Casablanca"}));
    const day = moroccoTime.getDay();
    const hour = moroccoTime.getHours();

    // Sunday = 0, Monday = 1, ..., Saturday = 6
    if (day === 0) { // Sunday
      return hour >= 9 && hour < 18;
    } else { // Monday to Saturday
      return hour >= 8 && hour < 20;
    }
  };

  const businessOpen = isOpenNow();

  if (!showWidget) return null;

  return (
    <div className={`fixed bottom-6 z-50 ${isRTL ? 'left-6' : 'right-6'}`}>
      {/* Chat Widget */}
      {isOpen && (
        <div className={`mb-4 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden ${isRTL ? 'text-right' : 'text-left'}`}>
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{currentBusinessInfo.name}</h3>
                  <div className="flex items-center gap-1 text-green-100 text-sm">
                    <div className={`w-2 h-2 rounded-full ${businessOpen ? 'bg-green-300' : 'bg-gray-300'}`}></div>
                    <span>
                      {businessOpen
                        ? (language === 'ar' ? 'متاح الآن' : language === 'fr' ? 'En ligne' : 'Online now')
                        : (language === 'ar' ? 'غير متاح' : language === 'fr' ? 'Hors ligne' : 'Offline')
                      }
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-green-100 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 max-h-96 overflow-y-auto">
            {/* Welcome Message */}
            <div className="mb-4 p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800 leading-relaxed">
                {language === 'ar'
                  ? '👋 مرحباً بك! كيف يمكننا مساعدتك اليوم؟'
                  : language === 'fr'
                  ? '👋 Bienvenue! Comment pouvons-nous vous aider?'
                  : '👋 Welcome! How can we help you today?'
                }
              </p>
            </div>

            {/* Quick Options */}
            <div className="space-y-2 mb-4">
              <h4 className="font-semibold text-gray-700 text-sm mb-3">
                {language === 'ar'
                  ? 'خدمات سريعة:'
                  : language === 'fr'
                  ? 'Services rapides:'
                  : 'Quick Services:'
                }
              </h4>

              {currentOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <button
                    key={option.id}
                    onClick={() => handleOptionSelect(option)}
                    className="w-full p-3 text-left rounded-lg border border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent className="w-5 h-5 text-green-600 group-hover:text-green-700" />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 text-sm">{option.title}</div>
                        <div className="text-xs text-gray-500">{option.description}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom Message */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-700 text-sm">
                {language === 'ar'
                  ? 'أو اكتب رسالتك:'
                  : language === 'fr'
                  ? 'Ou écrivez votre message:'
                  : 'Or write your message:'
                }
              </h4>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder={
                    language === 'ar'
                      ? 'اكتب رسالتك هنا...'
                      : language === 'fr'
                      ? 'Écrivez votre message...'
                      : 'Type your message...'
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && handleCustomMessage()}
                />
                <button
                  onClick={handleCustomMessage}
                  disabled={!customMessage.trim()}
                  className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Business Info */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{currentBusinessInfo.hours}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{currentBusinessInfo.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{businessPhone}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
        aria-label={language === 'ar' ? 'فتح الدردشة' : language === 'fr' ? 'Ouvrir le chat' : 'Open chat'}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
        )}

        {/* Online indicator */}
        {businessOpen && !isOpen && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
        )}

        {/* WhatsApp logo indicator */}
        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center">
          <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.108"/>
          </svg>
        </div>
      </button>
    </div>
  );
};

export default WhatsAppBusinessWidget;
