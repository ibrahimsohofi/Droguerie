import React, { useState, useEffect } from 'react';
import {
  Bell, BellRing, X, Check, Settings, AlertCircle,
  ShoppingCart, Tag, Package, TrendingDown, Star,
  Volume2, VolumeX, Smartphone
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const PushNotifications = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState('default');
  const [isEnabled, setIsEnabled] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [preferences, setPreferences] = useState({
    priceDrops: true,
    backInStock: true,
    newProducts: false,
    promotions: true,
    orderUpdates: true
  });
  const [showSettings, setShowSettings] = useState(false);
  const { user } = useAuth();
  const { language, isRTL } = useLanguage();

  useEffect(() => {
    checkNotificationSupport();
    loadNotifications();
    loadPreferences();
  }, []);

  const checkNotificationSupport = () => {
    if ('Notification' in window && 'serviceWorker' in navigator) {
      setIsSupported(true);
      setPermission(Notification.permission);
      setIsEnabled(Notification.permission === 'granted');
    }
  };

  const loadNotifications = () => {
    // Sample notifications data
    const sampleNotifications = [
      {
        id: 1,
        type: 'price_drop',
        title: 'Price Drop Alert!',
        title_ar: 'تنبيه انخفاض السعر!',
        message: 'Ariel Detergent is now 25% off',
        message_ar: 'مسحوق أريال الآن بخصم 25%',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        read: false,
        actionUrl: '/products/1'
      },
      {
        id: 2,
        type: 'back_in_stock',
        title: 'Back in Stock',
        title_ar: 'متوفر مرة أخرى',
        message: 'Dove Beauty Bar is now available',
        message_ar: 'صابون دوف متوفر الآن',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        read: false,
        actionUrl: '/products/2'
      },
      {
        id: 3,
        type: 'promotion',
        title: 'Flash Sale Started!',
        title_ar: 'بدأ البيع السريع!',
        message: 'Up to 40% off household items',
        message_ar: 'خصم يصل إلى 40% على الأدوات المنزلية',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
        read: true,
        actionUrl: '/products?category=household'
      }
    ];
    setNotifications(sampleNotifications);
  };

  const loadPreferences = () => {
    const saved = localStorage.getItem('notificationPreferences');
    if (saved) {
      setPreferences(JSON.parse(saved));
    }
  };

  const requestPermission = async () => {
    if (!isSupported) return;

    try {
      const permission = await Notification.requestPermission();
      setPermission(permission);
      setIsEnabled(permission === 'granted');

      if (permission === 'granted') {
        // Register service worker for push notifications
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.register('/sw.js');
          console.log('Service Worker registered:', registration);
        }
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

  const updatePreferences = (key, value) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    localStorage.setItem('notificationPreferences', JSON.stringify(newPreferences));
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'price_drop': return TrendingDown;
      case 'back_in_stock': return Package;
      case 'promotion': return Tag;
      case 'new_product': return Star;
      case 'order_update': return ShoppingCart;
      default: return Bell;
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  const content = {
    ar: {
      title: 'الإشعارات',
      enableNotifications: 'تفعيل الإشعارات',
      notificationSettings: 'إعدادات الإشعارات',
      priceDrops: 'انخفاض الأسعار',
      backInStock: 'العودة للمخزون',
      newProducts: 'منتجات جديدة',
      promotions: 'العروض الترويجية',
      orderUpdates: 'تحديثات الطلبات',
      markAllRead: 'تحديد الكل كمقروء',
      noNotifications: 'لا توجد إشعارات',
      notSupported: 'المتصفح لا يدعم الإشعارات',
      permissionDenied: 'تم رفض إذن الإشعارات',
      enableInstructions: 'لتلقي الإشعارات، يرجى السماح بالإشعارات في إعدادات المتصفح',
      viewProduct: 'عرض المنتج'
    },
    fr: {
      title: 'Notifications',
      enableNotifications: 'Activer les Notifications',
      notificationSettings: 'Paramètres de Notification',
      priceDrops: 'Baisses de Prix',
      backInStock: 'Retour en Stock',
      newProducts: 'Nouveaux Produits',
      promotions: 'Promotions',
      orderUpdates: 'Mises à Jour de Commande',
      markAllRead: 'Marquer Tout comme Lu',
      noNotifications: 'Aucune notification',
      notSupported: 'Les notifications ne sont pas supportées',
      permissionDenied: 'Permission de notification refusée',
      enableInstructions: 'Pour recevoir des notifications, veuillez autoriser les notifications dans les paramètres du navigateur',
      viewProduct: 'Voir le Produit'
    },
    en: {
      title: 'Notifications',
      enableNotifications: 'Enable Notifications',
      notificationSettings: 'Notification Settings',
      priceDrops: 'Price Drops',
      backInStock: 'Back in Stock',
      newProducts: 'New Products',
      promotions: 'Promotions',
      orderUpdates: 'Order Updates',
      markAllRead: 'Mark All as Read',
      noNotifications: 'No notifications',
      notSupported: 'Notifications not supported',
      permissionDenied: 'Notification permission denied',
      enableInstructions: 'To receive notifications, please allow notifications in your browser settings',
      viewProduct: 'View Product'
    }
  };

  const t = content[language] || content.en;

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!isSupported) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <AlertCircle className="h-5 w-5 text-yellow-600" />
          <span className="text-yellow-800">{t.notSupported}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="relative">
              <Bell className="h-6 w-6 text-gray-700" />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
            <h2 className="text-xl font-semibold text-gray-900">{t.title}</h2>
          </div>

          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {permission !== 'granted' && (
              <button
                onClick={requestPermission}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                {t.enableNotifications}
              </button>
            )}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Permission Status */}
        {permission === 'denied' && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className={`flex items-start gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <VolumeX className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <p className="text-red-800 text-sm font-medium">{t.permissionDenied}</p>
                <p className="text-red-700 text-sm">{t.enableInstructions}</p>
              </div>
            </div>
          </div>
        )}

        {/* Settings Panel */}
        {showSettings && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-3">{t.notificationSettings}</h3>
            <div className="space-y-3">
              {[
                { key: 'priceDrops', label: t.priceDrops },
                { key: 'backInStock', label: t.backInStock },
                { key: 'newProducts', label: t.newProducts },
                { key: 'promotions', label: t.promotions },
                { key: 'orderUpdates', label: t.orderUpdates }
              ].map(({ key, label }) => (
                <div key={key} className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-gray-700">{label}</span>
                  <button
                    onClick={() => updatePreferences(key, !preferences[key])}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      preferences[key] ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        preferences[key] ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mark All Read */}
        {unreadCount > 0 && (
          <div className="mt-4">
            <button
              onClick={markAllAsRead}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              {t.markAllRead}
            </button>
          </div>
        )}
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">{t.noNotifications}</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {notifications.map((notification) => {
              const IconComponent = getNotificationIcon(notification.type);
              return (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-blue-50' : ''}`}
                >
                  <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      notification.type === 'price_drop' ? 'bg-green-100 text-green-600' :
                      notification.type === 'back_in_stock' ? 'bg-blue-100 text-blue-600' :
                      notification.type === 'promotion' ? 'bg-purple-100 text-purple-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      <IconComponent className="h-5 w-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className={`flex items-start justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {language === 'ar' ? notification.title_ar : notification.title}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {language === 'ar' ? notification.message_ar : notification.message}
                          </p>
                          <div className={`flex items-center gap-4 mt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <span className="text-xs text-gray-400">
                              {formatTime(notification.timestamp)}
                            </span>
                            {notification.actionUrl && (
                              <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                                {t.viewProduct}
                              </button>
                            )}
                          </div>
                        </div>

                        <div className={`flex items-center gap-2 ml-4 ${isRTL ? 'mr-4 ml-0' : ''}`}>
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-1 text-blue-600 hover:text-blue-700"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PushNotifications;
