import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const { language } = useLanguage();

  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);
  const [message] = useState(location.state?.message || '');

  useEffect(() => {
    if (!order && orderId) {
      fetchOrder();
    }
  }, [orderId, order]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/${orderId}`);
      const data = await response.json();
      if (data.success) {
        setOrder(data.data);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'confirmed': return 'text-blue-600 bg-blue-100';
      case 'shipped': return 'text-purple-600 bg-purple-100';
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status) => {
    const statusTexts = {
      pending: language === 'ar' ? 'قيد الانتظار' : 'En attente',
      confirmed: language === 'ar' ? 'مؤكد' : 'Confirmé',
      shipped: language === 'ar' ? 'تم الشحن' : 'Expédié',
      delivered: language === 'ar' ? 'تم التوصيل' : 'Livré',
      cancelled: language === 'ar' ? 'ملغي' : 'Annulé'
    };
    return statusTexts[status] || status;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4">
            {language === 'ar' ? 'جاري التحميل...' : 'Chargement...'}
          </p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          {language === 'ar' ? 'الطلب غير موجود' : 'Commande introuvable'}
        </h1>
        <Link to="/order-history" className="text-green-600 hover:text-green-700">
          {language === 'ar' ? 'العودة إلى الطلبات' : 'Retour aux commandes'}
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-green-600 mb-2">
            {language === 'ar' ? 'تم تأكيد طلبك!' : 'Commande confirmée !'}
          </h1>
          {message && (
            <p className="text-gray-600">{message}</p>
          )}
          <p className="text-gray-600">
            {language === 'ar'
              ? 'شكراً لك على ثقتك بنا. سيتم التواصل معك قريباً لتأكيد التفاصيل.'
              : 'Merci pour votre confiance. Nous vous contacterons bientôt pour confirmer les détails.'
            }
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">
                {language === 'ar' ? 'رقم الطلب' : 'Numéro de commande'}: #{order.id}
              </h2>
              <p className="text-gray-600">
                {language === 'ar' ? 'تاريخ الطلب' : 'Date de commande'}: {new Date(order.created_at).toLocaleDateString()}
              </p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
              {getStatusText(order.status)}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold mb-2">
                {language === 'ar' ? 'عنوان التوصيل' : 'Adresse de livraison'}
              </h3>
              <div className="text-gray-600">
                <p>{order.customer_name}</p>
                <p>{order.shipping_address}</p>
                <p>{order.shipping_city}{order.shipping_postal_code && `, ${order.shipping_postal_code}`}</p>
                <p>{order.customer_phone}</p>
                <p>{order.customer_email}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">
                {language === 'ar' ? 'طريقة الدفع' : 'Mode de paiement'}
              </h3>
              <p className="text-gray-600">
                {order.payment_method === 'cash'
                  ? (language === 'ar' ? 'الدفع عند الاستلام' : 'Paiement à la livraison')
                  : (language === 'ar' ? 'بطاقة ائتمان' : 'Carte de crédit')
                }
              </p>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">
              {language === 'ar' ? 'المنتجات المطلوبة' : 'Articles commandés'}
            </h3>
            <div className="space-y-4">
              {order.items?.map((item, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                      <span className="text-xs text-gray-500">IMG</span>
                    </div>
                    <div>
                      <h4 className="font-medium">{item.product_name}</h4>
                      <p className="text-gray-600">
                        {language === 'ar' ? 'الكمية' : 'Quantité'}: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{(item.price * item.quantity).toFixed(2)} DH</p>
                    <p className="text-sm text-gray-600">
                      {item.price.toFixed(2)} DH {language === 'ar' ? 'للقطعة' : 'chacun'}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>{language === 'ar' ? 'المجموع الإجمالي' : 'Total'}</span>
                <span>{order.total_amount?.toFixed(2)} DH</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center space-x-4">
          <Link
            to="/order-history"
            className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 transition-colors"
          >
            {language === 'ar' ? 'عرض جميع الطلبات' : 'Voir toutes les commandes'}
          </Link>
          <Link
            to="/products"
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors"
          >
            {language === 'ar' ? 'متابعة التسوق' : 'Continuer les achats'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
