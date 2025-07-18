import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTranslations } from '../translations';
import { useCart } from '../context/CartContext';
import { PriceFormatter } from '../utils/currency';

const Cart = () => {
  const navigate = useNavigate();
  const { language, isRTL } = useLanguage();
  const t = useTranslations(language);
  const { cart, updateQuantity, removeFromCart, clearCart, getCartTotal, isLoading } = useCart();
  const [total, setTotal] = useState(0);

  useEffect(() => {
    calculateTotal();
  }, [cart]);

  const calculateTotal = async () => {
    const cartTotal = await getCartTotal();
    setTotal(cartTotal);
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      await removeFromCart(productId);
    } else {
      await updateQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = async (productId) => {
    await removeFromCart(productId);
  };

  const handleClearCart = async () => {
    if (window.confirm(language === 'ar' ? 'هل أنت متأكد من مسح السلة؟' : 'Êtes-vous sûr de vider le panier?')) {
      await clearCart();
    }
  };



  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-6"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="h-20 w-20 bg-gray-200 rounded"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="h-8 bg-gray-200 rounded w-24"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const cartItems = cart?.items || [];

  return (
    <div className="min-h-screen bg-gray-100" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className={`flex items-center justify-between mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
            <button
              onClick={() => navigate(-1)}
              className={`text-blue-600 hover:text-blue-800 transition-colors duration-300 ${isRTL ? 'ml-4' : 'mr-4'}`}
            >
              <ArrowLeft className={`h-6 w-6 ${isRTL ? 'rotate-180' : ''}`} />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">
              {language === 'ar' ? 'سلة التسوق' : 'Panier d\'achat'}
            </h1>
          </div>

          {cartItems.length > 0 && (
            <button
              onClick={handleClearCart}
              className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors duration-300"
            >
              {language === 'ar' ? 'إفراغ السلة' : 'Vider le panier'}
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
          /* Empty Cart */
          <div className="text-center py-24">
            <div className="bg-gray-200 rounded-full w-40 h-40 flex items-center justify-center mx-auto mb-8">
              <ShoppingBag className="h-20 w-20 text-gray-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              {language === 'ar' ? 'السلة فارغة' : 'Votre panier est vide'}
            </h2>
            <p className="text-gray-500 mb-12 max-w-md mx-auto text-lg leading-relaxed">
              {language === 'ar'
                ? 'لم تقم بإضافة أي منتجات إلى سلتك بعد. ابدأ التسوق الآن!'
                : 'Vous n\'avez pas encore ajouté de produits à votre panier. Commencez vos achats maintenant!'
              }
            </p>
            <Link
              to="/products"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 inline-flex items-center"
            >
              <ShoppingCart className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {language === 'ar' ? 'تسوق الآن' : 'Commencer les achats'}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {language === 'ar' ? 'عناصر السلة' : 'Articles du panier'} ({cartItems.length})
                  </h2>
                </div>

                <div className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <div key={item.productId} className="p-6">
                      <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} gap-4`}>
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <img
                            src={item.image_url || '${import.meta.env.VITE_API_URL}/api/placeholder/200/200'}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-lg"
                            onError={(e) => {
                              e.target.src = '${import.meta.env.VITE_API_URL}/api/placeholder/200/200';
                            }}
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-medium text-gray-900 mb-1">
                            {language === 'ar' ? item.name_ar || item.name : item.name_fr || item.name}
                          </h3>
                          <p className="text-gray-500 text-sm mb-2">
                            {item.category_name}
                          </p>
                          <p className="text-lg font-semibold text-gray-900">
                            {PriceFormatter.cart(item.price || 0, language)}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex flex-col items-center gap-2">
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                              className="p-2 hover:bg-gray-100 transition-colors duration-200"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                              className="p-2 hover:bg-gray-100 transition-colors duration-200"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>

                          <button
                            onClick={() => handleRemoveItem(item.productId)}
                            className="text-red-600 hover:text-red-800 p-2 transition-colors duration-200"
                            title={language === 'ar' ? 'حذف العنصر' : 'Supprimer l\'article'}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Item Total */}
                        <div className="text-right">
                          <p className="text-lg font-semibold text-gray-900">
                            {PriceFormatter.cart((item.price || 0) * item.quantity, language)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-4">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {language === 'ar' ? 'ملخص الطلب' : 'Résumé de la commande'}
                  </h2>
                </div>

                <div className="p-6 space-y-4">
                  {/* Subtotal */}
                  <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-gray-600">
                      {language === 'ar' ? 'المجموع الفرعي:' : 'Sous-total:'}
                    </span>
                    <span className="font-medium">
                      {PriceFormatter.cart(total, language)}
                    </span>
                  </div>

                  {/* Shipping */}
                  <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-gray-600">
                      {language === 'ar' ? 'الشحن:' : 'Livraison:'}
                    </span>
                    <span className="font-medium text-green-600">
                      {language === 'ar' ? 'مجاني' : 'Gratuite'}
                    </span>
                  </div>

                  {/* Tax */}
                  <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-gray-600">
                      {language === 'ar' ? 'الضريبة (20%):' : 'TVA (20%):'}
                    </span>
                    <span className="font-medium">
                      {PriceFormatter.tax(total * 0.2, language)}
                    </span>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className="text-lg font-semibold text-gray-900">
                        {language === 'ar' ? 'المجموع الكلي:' : 'Total:'}
                      </span>
                      <span className="text-lg font-semibold text-gray-900">
                        {PriceFormatter.orderTotal(total, total * 0.2, 0, language)}
                      </span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={() => navigate('/checkout')}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 px-6 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center"
                  >
                    <ShoppingCart className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {language === 'ar' ? 'إتمام الشراء' : 'Procéder au paiement'}
                  </button>

                  {/* Continue Shopping */}
                  <Link
                    to="/products"
                    className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 py-3 px-6 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center"
                  >
                    {language === 'ar' ? 'متابعة التسوق' : 'Continuer les achats'}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
