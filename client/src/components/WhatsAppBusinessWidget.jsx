import React, { useState, useEffect } from 'react';
import { MessageCircle, Phone, Clock, Users, Send, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const WhatsAppBusinessWidget = ({
  isOpen = false,
  onToggle = () => {},
  className = ""
}) => {
  const { language, isRTL, formatCurrency } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [customMessage, setCustomMessage] = useState('');

  // WhatsApp Business phone number (from environment)
  const whatsappNumber = "+212522123456"; // Droguerie Jamal WhatsApp number

  // Get text translations
  const getText = () => {
    return {
      title: language === 'ar' ? 'تواصل معنا عبر واتساب' : language === 'fr' ? 'Contactez-nous via WhatsApp' : 'Contact us via WhatsApp',
      subtitle: language === 'ar' ? 'نحن هنا لمساعدتك' : language === 'fr' ? 'Nous sommes là pour vous aider' : 'We are here to help you',
      businessHours: language === 'ar' ? 'ساعات العمل' : language === 'fr' ? 'Heures d\'ouverture' : 'Business Hours',
      weekdays: language === 'ar' ? 'الإثنين - السبت: 8:00 - 20:00' : language === 'fr' ? 'Lun - Sam: 8:00 - 20:00' : 'Mon - Sat: 8:00 - 20:00',
      sunday: language === 'ar' ? 'الأحد: 9:00 - 18:00' : language === 'fr' ? 'Dim: 9:00 - 18:00' : 'Sun: 9:00 - 18:00',
      quickOptions: language === 'ar' ? 'خيارات سريعة' : language === 'fr' ? 'Options rapides' : 'Quick Options',
      customMessage: language === 'ar' ? 'رسالة مخصصة' : language === 'fr' ? 'Message personnalisé' : 'Custom Message',
      typeMessage: language === 'ar' ? 'اكتب رسالتك هنا...' : language === 'fr' ? 'Tapez votre message ici...' : 'Type your message here...',
      sendMessage: language === 'ar' ? 'إرسال الرسالة' : language === 'fr' ? 'Envoyer le message' : 'Send Message',
      callUs: language === 'ar' ? 'اتصل بنا' : language === 'fr' ? 'Appelez-nous' : 'Call Us',
      close: language === 'ar' ? 'إغلاق' : language === 'fr' ? 'Fermer' : 'Close',
      onlineNow: language === 'ar' ? 'متصل الآن' : language === 'fr' ? 'En ligne maintenant' : 'Online now',
      typicallyResponds: language === 'ar' ? 'يرد عادة خلال دقائق قليلة' : language === 'fr' ? 'Répond généralement en quelques minutes' : 'Typically responds in a few minutes',
    };
  };

  // Quick message options
  const getQuickOptions = () => {
    return [
      {
        id: 'product_inquiry',
        icon: '🛒',
        title: language === 'ar' ? 'استفسار عن منتج' : language === 'fr' ? 'Demande de produit' : 'Product Inquiry',
        message: language === 'ar' ? 'مرحباً، أريد الاستفسار عن منتج معين في دروغيري جمال.' : language === 'fr' ? 'Bonjour, je voudrais me renseigner sur un produit spécifique chez Droguerie Jamal.' : 'Hello, I would like to inquire about a specific product at Droguerie Jamal.'
      },
      {
        id: 'order_status',
        icon: '📦',
        title: language === 'ar' ? 'حالة الطلب' : language === 'fr' ? 'Statut de commande' : 'Order Status',
        message: language === 'ar' ? 'مرحباً، أريد التحقق من حالة طلبي.' : language === 'fr' ? 'Bonjour, je voudrais vérifier le statut de ma commande.' : 'Hello, I would like to check my order status.'
      },
      {
        id: 'store_location',
        icon: '📍',
        title: language === 'ar' ? 'موقع المتجر' : language === 'fr' ? 'Localisation du magasin' : 'Store Location',
        message: language === 'ar' ? 'مرحباً، أريد معرفة عنوان المتجر وساعات العمل.' : language === 'fr' ? 'Bonjour, je voudrais connaître l\'adresse du magasin et les heures d\'ouverture.' : 'Hello, I would like to know the store address and opening hours.'
      },
      {
        id: 'delivery_info',
        icon: '🚚',
        title: language === 'ar' ? 'معلومات التوصيل' : language === 'fr' ? 'Informations de livraison' : 'Delivery Information',
        message: language === 'ar' ? 'مرحباً، أريد الاستفسار عن خدمة التوصيل.' : language === 'fr' ? 'Bonjour, je voudrais me renseigner sur le service de livraison.' : 'Hello, I would like to inquire about delivery service.'
      },
      {
        id: 'bulk_order',
        icon: '🏢',
        title: language === 'ar' ? 'طلب بالجملة' : language === 'fr' ? 'Commande en gros' : 'Bulk Order',
        message: language === 'ar' ? 'مرحباً، أريد عمل طلب بالجملة لشركتي/مؤسستي.' : language === 'fr' ? 'Bonjour, je voudrais passer une commande en gros pour mon entreprise.' : 'Hello, I would like to place a bulk order for my business.'
      },
      {
        id: 'complaint',
        icon: '⚠️',
        title: language === 'ar' ? 'شكوى أو مشكلة' : language === 'fr' ? 'Plainte ou problème' : 'Complaint or Issue',
        message: language === 'ar' ? 'مرحباً، لدي شكوى أو مشكلة أريد حلها.' : language === 'fr' ? 'Bonjour, j\'ai une plainte ou un problème que je voudrais résoudre.' : 'Hello, I have a complaint or issue I would like to resolve.'
      }
    ];
  };

  const text = getText();
  const quickOptions = getQuickOptions();

  // Check if currently within business hours
  const isBusinessHours = () => {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay(); // 0 = Sunday, 1 = Monday, etc.

    if (day === 0) { // Sunday
      return hour >= 9 && hour < 18;
    } else { // Monday - Saturday
      return hour >= 8 && hour < 20;
    }
  };

  // Handle sending WhatsApp message
  const sendWhatsAppMessage = (message) => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace('+', '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  // Handle quick option selection
  const handleQuickOption = (option) => {
    sendWhatsAppMessage(option.message);
    setIsExpanded(false);
  };

  // Handle custom message
  const handleCustomMessage = () => {
    if (customMessage.trim()) {
      sendWhatsAppMessage(customMessage);
      setCustomMessage('');
      setIsExpanded(false);
    }
  };

  // Handle direct call
  const handleDirectCall = () => {
    window.open(`tel:${whatsappNumber}`, '_self');
  };

  if (!isExpanded) {
    return (
      <div className={`fixed bottom-6 ${isRTL ? 'left-6' : 'right-6'} z-50 ${className}`}>
        <button
          onClick={() => setIsExpanded(true)}
          className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
        >
          <MessageCircle className="w-6 h-6" />
          <div className="absolute -top-2 -right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>

          {/* Tooltip */}
          <div className={`absolute bottom-full mb-2 ${isRTL ? 'right-0' : 'left-0'} bg-gray-900 text-white text-sm px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap`}>
            {text.title}
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-6 ${isRTL ? 'left-6' : 'right-6'} z-50 ${className}`}>
      <div className="bg-white rounded-lg shadow-2xl w-80 max-w-[calc(100vw-3rem)] overflow-hidden">
        {/* Header */}
        <div className="bg-green-500 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="relative">
                <MessageCircle className="w-8 h-8" />
                {isBusinessHours() && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-300 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div>
                <h3 className={`font-semibold ${language === 'ar' ? 'font-arabic' : ''}`}>
                  دروغيري جمال
                </h3>
                <p className={`text-xs text-green-100 ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {isBusinessHours() ? text.onlineNow : text.typicallyResponds}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-white hover:text-green-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 max-h-96 overflow-y-auto">
          {/* Business Hours */}
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
              <Clock className="w-4 h-4 text-gray-600" />
              <span className={`text-sm font-medium text-gray-800 ${language === 'ar' ? 'font-arabic' : ''}`}>
                {text.businessHours}
              </span>
            </div>
            <div className={`text-xs text-gray-600 space-y-1 ${language === 'ar' ? 'font-arabic' : ''}`}>
              <div>{text.weekdays}</div>
              <div>{text.sunday}</div>
            </div>
          </div>

          {/* Quick Options */}
          <div className="space-y-3">
            <h4 className={`text-sm font-semibold text-gray-800 ${language === 'ar' ? 'font-arabic' : ''}`}>
              {text.quickOptions}
            </h4>

            <div className="grid grid-cols-2 gap-2">
              {quickOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleQuickOption(option)}
                  className="p-3 bg-gray-50 hover:bg-green-50 border border-gray-200 hover:border-green-200 rounded-lg transition-colors text-left rtl:text-right group"
                >
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span className="text-lg">{option.icon}</span>
                    <span className={`text-xs font-medium text-gray-700 group-hover:text-green-700 ${language === 'ar' ? 'font-arabic' : ''}`}>
                      {option.title}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Message */}
          <div className="mt-4 space-y-3">
            <h4 className={`text-sm font-semibold text-gray-800 ${language === 'ar' ? 'font-arabic' : ''}`}>
              {text.customMessage}
            </h4>

            <div className="space-y-2">
              <textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder={text.typeMessage}
                className={`w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${language === 'ar' ? 'font-arabic text-right' : ''}`}
                rows={3}
              />

              <button
                onClick={handleCustomMessage}
                disabled={!customMessage.trim()}
                className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 rtl:space-x-reverse disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                <span className={language === 'ar' ? 'font-arabic' : ''}>
                  {text.sendMessage}
                </span>
              </button>
            </div>
          </div>

          {/* Direct Call Button */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={handleDirectCall}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 rtl:space-x-reverse"
            >
              <Phone className="w-4 h-4" />
              <span className={language === 'ar' ? 'font-arabic' : ''}>
                {text.callUs}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppBusinessWidget;
