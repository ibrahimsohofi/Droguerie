import React, { useState, useEffect } from 'react';
import { useTranslations, useLanguage } from '../context/LanguageContext';
import { MessageCircle, Send, X, Phone, ShoppingCart, Package, MapPin } from 'lucide-react';

const WhatsAppIntegration = ({
  businessPhone = '+212522123456',
  businessName = 'دروغيري جمال',
  isOpen = true
}) => {
  const t = useTranslations();
  const { isRTL, formatCurrency } = useLanguage();

  const [isMinimized, setIsMinimized] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [customMessage, setCustomMessage] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const isBusinessHours = () => {
    const hour = currentTime.getHours();
    // Business hours: 8 AM to 8 PM
    return hour >= 8 && hour < 20;
  };

  const quickTemplates = [
    {
      id: 'general_inquiry',
      icon: MessageCircle,
      title: isRTL ? 'استفسار عام' : 'General Inquiry',
      message: isRTL
        ? 'السلام عليكم، أود الاستفسار عن منتجاتكم'
        : 'Hello, I would like to inquire about your products'
    },
    {
      id: 'product_availability',
      icon: Package,
      title: isRTL ? 'توفر منتج' : 'Product Availability',
      message: isRTL
        ? 'مرحباً، هل هذا المنتج متوفر؟'
        : 'Hello, is this product available?'
    },
    {
      id: 'order_support',
      icon: ShoppingCart,
      title: isRTL ? 'مساعدة بالطلب' : 'Order Support',
      message: isRTL
        ? 'أحتاج مساعدة في إتمام طلبي'
        : 'I need help completing my order'
    },
    {
      id: 'delivery_inquiry',
      icon: MapPin,
      title: isRTL ? 'استفسار عن التوصيل' : 'Delivery Inquiry',
      message: isRTL
        ? 'أريد معرفة تفاصيل التوصيل لمنطقتي'
        : 'I want to know delivery details for my area'
    }
  ];

  const formatWhatsAppUrl = (message) => {
    const encodedMessage = encodeURIComponent(message);
    const cleanPhone = businessPhone.replace(/\s+/g, '').replace('+', '');
    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
  };

  const sendWhatsAppMessage = (message) => {
    window.open(formatWhatsAppUrl(message), '_blank');
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setCustomMessage(template.message);
  };

  const handleSendMessage = () => {
    if (customMessage.trim()) {
      sendWhatsAppMessage(customMessage);
      setIsMinimized(true);
      setCustomMessage('');
      setSelectedTemplate(null);
    }
  };

  // Floating WhatsApp Button
  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50 no-print">
        <div className="relative group">
          {/* Notification Badge */}
          <div className="absolute -top-2 -right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>

          {/* Main Button */}
          <button
            onClick={() => setIsMinimized(false)}
            className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
          >
            <MessageCircle className="w-6 h-6" />
          </button>

          {/* Tooltip */}
          <div className={`absolute bottom-full ${isRTL ? 'right-0' : 'left-0'} mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap`}>
            {isRTL ? 'تواصل معنا عبر واتساب' : 'Chat with us on WhatsApp'}
            <div className={`absolute top-full ${isRTL ? 'right-2' : 'left-2'} w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800`}></div>
          </div>
        </div>
      </div>
    );
  }

  // Expanded WhatsApp Chat Interface
  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 max-w-[calc(100vw-2rem)] no-print">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-green-500 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">{businessName}</h3>
                <p className="text-xs opacity-90">
                  {isBusinessHours()
                    ? (isRTL ? 'متصل الآن' : 'Online now')
                    : (isRTL ? 'غير متصل - سنرد قريباً' : 'Offline - We\'ll reply soon')
                  }
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsMinimized(true)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 max-h-96 overflow-y-auto">
          {/* Welcome Message */}
          <div className="mb-4">
            <div className="bg-gray-100 rounded-lg p-3 text-sm">
              <p className="text-gray-800">
                {isRTL
                  ? '👋 مرحباً! كيف يمكننا مساعدتك اليوم؟'
                  : '👋 Hello! How can we help you today?'
                }
              </p>
              {!isBusinessHours() && (
                <p className="text-gray-600 mt-2 text-xs">
                  {isRTL
                    ? 'نحن خارج ساعات العمل حالياً (8ص - 8م) لكن يمكنك ترك رسالة وسنرد عليك قريباً'
                    : 'We\'re currently outside business hours (8 AM - 8 PM) but you can leave a message and we\'ll reply soon'
                  }
                </p>
              )}
            </div>
          </div>

          {/* Quick Templates */}
          <div className="mb-4">
            <p className="text-sm font-semibold text-gray-700 mb-3">
              {isRTL ? 'رسائل سريعة:' : 'Quick messages:'}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {quickTemplates.map((template) => {
                const IconComponent = template.icon;
                return (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateSelect(template)}
                    className={`p-3 text-left border-2 rounded-lg transition-colors ${
                      selectedTemplate?.id === template.id
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <IconComponent className="w-4 h-4 mb-1" />
                    <p className="text-xs font-medium">{template.title}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Message Input */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {isRTL ? 'أو اكتب رسالتك:' : 'Or write your message:'}
            </label>
            <textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder={isRTL
                ? 'اكتب رسالتك هنا...'
                : 'Type your message here...'
              }
              rows={3}
              className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none text-sm ${
                isRTL ? 'text-right' : 'text-left'
              }`}
              dir={isRTL ? 'rtl' : 'ltr'}
            />
          </div>

          {/* Business Info */}
          <div className="bg-blue-50 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Phone className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-800">
                {isRTL ? 'معلومات التواصل:' : 'Contact Info:'}
              </span>
            </div>
            <p className="text-sm text-blue-700">{businessPhone}</p>
            <p className="text-xs text-blue-600 mt-1">
              {isRTL
                ? 'ساعات العمل: 8 صباحاً - 8 مساءً (من الاثنين إلى السبت)'
                : 'Business Hours: 8 AM - 8 PM (Monday to Saturday)'
              }
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <button
              onClick={() => {
                setIsMinimized(true);
                setCustomMessage('');
                setSelectedTemplate(null);
              }}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              {t.cancel || 'إلغاء'}
            </button>
            <button
              onClick={handleSendMessage}
              disabled={!customMessage.trim()}
              className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              {isRTL ? 'إرسال عبر واتساب' : 'Send via WhatsApp'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Order Tracking WhatsApp Component
export const WhatsAppOrderTracking = ({ orderNumber, trackingUrl }) => {
  const { isRTL } = useLanguage();

  const sendTrackingMessage = () => {
    const message = isRTL
      ? `مرحباً، أريد تتبع طلبي رقم: ${orderNumber}`
      : `Hello, I want to track my order number: ${orderNumber}`;

    const whatsappUrl = `https://wa.me/212522123456?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <button
      onClick={sendTrackingMessage}
      className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
    >
      <MessageCircle className="w-4 h-4" />
      {isRTL ? 'تتبع عبر واتساب' : 'Track via WhatsApp'}
    </button>
  );
};

// Product Inquiry WhatsApp Component
export const WhatsAppProductInquiry = ({ productName, productUrl, productPrice }) => {
  const { isRTL, formatCurrency } = useLanguage();

  const sendProductInquiry = () => {
    const message = isRTL
      ? `مرحباً، أود الاستفسار عن هذا المنتج:\n\n${productName}\nالسعر: ${formatCurrency(productPrice)}\n\n${productUrl}`
      : `Hello, I would like to inquire about this product:\n\n${productName}\nPrice: ${formatCurrency(productPrice)}\n\n${productUrl}`;

    const whatsappUrl = `https://wa.me/212522123456?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <button
      onClick={sendProductInquiry}
      className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg transition-colors text-sm"
    >
      <MessageCircle className="w-4 h-4" />
      {isRTL ? 'استفسار' : 'Inquire'}
    </button>
  );
};

export default WhatsAppIntegration;
