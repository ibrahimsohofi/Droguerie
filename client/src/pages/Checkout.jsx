import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import StripePayment from '../components/StripePayment';
import CouponCode from '../components/CouponCode';

const Checkout = () => {
  const { language } = useLanguage();
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [finalTotal, setFinalTotal] = useState(0);
  const [formData, setFormData] = useState({
    customer_name: user?.name || '',
    customer_email: user?.email || '',
    customer_phone: user?.phone || '',
    shipping_address: user?.address || '',
    shipping_city: '',
    shipping_postal_code: '',
    payment_method: 'cash'
  });
  const [errors, setErrors] = useState({});

  // Fetch cart details
  useEffect(() => {
    const fetchCartDetails = async () => {
      if (cart.items?.length > 0) {
        let total = 0;
        const itemsWithDetails = cart.items.map(item => {
          total += (item.price || 0) * item.quantity;
          return item;
        });
        setCartItems(itemsWithDetails);
        setCartTotal(total);
        setFinalTotal(total);
      }
    };
    fetchCartDetails();
  }, [cart]);

  // Update final total when coupon is applied or removed
  useEffect(() => {
    if (appliedCoupon) {
      setFinalTotal(appliedCoupon.finalAmount);
    } else {
      setFinalTotal(cartTotal);
    }
  }, [appliedCoupon, cartTotal]);

  const handleCouponApplied = (couponData) => {
    setAppliedCoupon(couponData);
  };

  // Redirect if cart is empty
  useEffect(() => {
    if (!cart.items || cart.items.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.customer_name.trim()) {
      newErrors.customer_name = language === 'ar' ? 'الاسم مطلوب' : 'Nom requis';
    }
    if (!formData.customer_email.trim()) {
      newErrors.customer_email = language === 'ar' ? 'البريد الإلكتروني مطلوب' : 'Email requis';
    }
    if (!formData.customer_phone.trim()) {
      newErrors.customer_phone = language === 'ar' ? 'رقم الهاتف مطلوب' : 'Téléphone requis';
    }
    if (!formData.shipping_address.trim()) {
      newErrors.shipping_address = language === 'ar' ? 'العنوان مطلوب' : 'Adresse requise';
    }
    if (!formData.shipping_city.trim()) {
      newErrors.shipping_city = language === 'ar' ? 'المدينة مطلوبة' : 'Ville requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const processPayment = async (orderData) => {
    // For cash payments, simulate processing
    if (orderData.payment_method === 'cash') {
      return new Promise((resolve) => {
        setTimeout(() => {
          // Simulate 95% success rate
          const success = Math.random() > 0.05;
          resolve({
            success,
            transaction_id: success ? `CASH_${Date.now()}` : null,
            message: success
              ? (language === 'ar' ? 'تم الدفع بنجاح' : 'Paiement réussi')
              : (language === 'ar' ? 'فشل في معالجة الدفع' : 'Échec du paiement')
          });
        }, 1500);
      });
    }

    // For card payments, return success as payment is handled by Stripe component
    return {
      success: true,
      transaction_id: `CARD_${Date.now()}`,
      message: language === 'ar' ? 'تم الدفع بالبطاقة' : 'Paiement par carte'
    };
  };

  const handlePaymentSuccess = async (paymentData) => {
    // Clear cart after successful payment
    await clearCart();

    // Redirect to order confirmation
    navigate(`/order-confirmation/${paymentData.id}`, {
      state: {
        order: paymentData,
        message: language === 'ar' ? 'تم إنشاء طلبك بنجاح!' : 'Votre commande a été créée avec succès!'
      }
    });
  };

  const handlePaymentError = (error) => {
    alert(error || (language === 'ar' ? 'حدث خطأ في معالجة الدفع' : 'Erreur de paiement'));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Prepare order data
      const orderData = {
        ...formData,
        items: cartItems.map(item => ({
          productId: item.productId,
          product_name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        total: cartTotal
      };

      // Process payment
      const paymentResult = await processPayment(orderData);

      if (!paymentResult.success) {
        alert(paymentResult.message);
        return;
      }

      // Create order
      const response = await fetch('${import.meta.env.VITE_API_URL}/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id || 1,
          orderData: {
            ...orderData,
            transaction_id: paymentResult.transaction_id
          }
        })
      });

      const result = await response.json();

      if (result.success) {
        // Clear cart after successful order
        await clearCart();

        // Redirect to order confirmation
        navigate(`/order-confirmation/${result.data.id}`, {
          state: {
            order: result.data,
            message: language === 'ar' ? 'تم إنشاء طلبك بنجاح!' : 'Votre commande a été créée avec succès!'
          }
        });
      } else {
        alert(result.message || (language === 'ar' ? 'حدث خطأ في إنشاء الطلب' : 'Erreur lors de la création de la commande'));
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert(language === 'ar' ? 'حدث خطأ أثناء معالجة طلبك' : 'Une erreur est survenue lors du traitement de votre commande');
    } finally {
      setIsLoading(false);
    }
  };

  if (!cart.items || cart.items.length === 0) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {language === 'ar' ? 'إتمام الشراء' : 'Finaliser la commande'}
        </h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">
              {language === 'ar' ? 'معلومات الفوترة والشحن' : 'Informations de facturation et livraison'}
            </h2>

            <form onSubmit={handleSubmit}>
              {/* Customer Information */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'ar' ? 'الاسم الكامل' : 'Nom complet'}
                  </label>
                  <input
                    type="text"
                    name="customer_name"
                    value={formData.customer_name}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.customer_name ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder={language === 'ar' ? 'أدخل اسمك الكامل' : 'Entrez votre nom complet'}
                  />
                  {errors.customer_name && <p className="text-red-500 text-sm mt-1">{errors.customer_name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                  </label>
                  <input
                    type="email"
                    name="customer_email"
                    value={formData.customer_email}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.customer_email ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder={language === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Entrez votre email'}
                  />
                  {errors.customer_email && <p className="text-red-500 text-sm mt-1">{errors.customer_email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'ar' ? 'رقم الهاتف' : 'Téléphone'}
                  </label>
                  <input
                    type="tel"
                    name="customer_phone"
                    value={formData.customer_phone}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.customer_phone ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder={language === 'ar' ? 'أدخل رقم هاتفك' : 'Entrez votre numéro de téléphone'}
                  />
                  {errors.customer_phone && <p className="text-red-500 text-sm mt-1">{errors.customer_phone}</p>}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="space-y-4 mb-6">
                <h3 className="text-lg font-medium">
                  {language === 'ar' ? 'عنوان الشحن' : 'Adresse de livraison'}
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'ar' ? 'العنوان' : 'Adresse'}
                  </label>
                  <textarea
                    name="shipping_address"
                    value={formData.shipping_address}
                    onChange={handleInputChange}
                    rows="2"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.shipping_address ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder={language === 'ar' ? 'أدخل عنوانك الكامل' : 'Entrez votre adresse complète'}
                  />
                  {errors.shipping_address && <p className="text-red-500 text-sm mt-1">{errors.shipping_address}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {language === 'ar' ? 'المدينة' : 'Ville'}
                    </label>
                    <input
                      type="text"
                      name="shipping_city"
                      value={formData.shipping_city}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.shipping_city ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder={language === 'ar' ? 'المدينة' : 'Ville'}
                    />
                    {errors.shipping_city && <p className="text-red-500 text-sm mt-1">{errors.shipping_city}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {language === 'ar' ? 'الرمز البريدي' : 'Code postal'}
                    </label>
                    <input
                      type="text"
                      name="shipping_postal_code"
                      value={formData.shipping_postal_code}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={language === 'ar' ? 'الرمز البريدي' : 'Code postal'}
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">
                  {language === 'ar' ? 'طريقة الدفع' : 'Mode de paiement'}
                </h3>

                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="payment_method"
                      value="cash"
                      checked={formData.payment_method === 'cash'}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <span>{language === 'ar' ? 'الدفع عند الاستلام' : 'Paiement à la livraison'}</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="payment_method"
                      value="card"
                      checked={formData.payment_method === 'card'}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <span>{language === 'ar' ? 'بطاقة ائتمان' : 'Carte de crédit'}</span>
                  </label>
                </div>
              </div>

              {/* Stripe Payment Form */}
              {formData.payment_method === 'card' && (
                <div className="mb-6">
                  <StripePayment
                    amount={finalTotal}
                    orderData={formData}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                  />
                </div>
              )}

              {formData.payment_method === 'cash' && (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading
                    ? (language === 'ar' ? 'جاري المعالجة...' : 'Traitement en cours...')
                    : (language === 'ar' ? 'تأكيد الطلب' : 'Confirmer la commande')
                  }
                </button>
              )}

              {formData.payment_method === 'card' && (
                <div className="text-center text-sm text-gray-600">
                  {language === 'ar'
                    ? 'يرجى ملء معلومات البطاقة أعلاه لإتمام الطلب'
                    : 'Veuillez remplir les informations de carte ci-dessus pour finaliser la commande'
                  }
                </div>
              )}
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">
              {language === 'ar' ? 'ملخص الطلب' : 'Résumé de la commande'}
            </h2>

            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.productId} className="flex justify-between items-center border-b pb-4">
                  <div className="flex items-center space-x-4">
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <div>
                      <h3 className="font-medium">
                        {language === 'ar' ? item.name_ar || item.name : item.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {language === 'ar' ? 'الكمية' : 'Quantité'}: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{item.price?.toFixed(2)} DH</p>
                    <p className="text-sm text-gray-500">
                      {(item.price * item.quantity).toFixed(2)} DH
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon Code Section */}
            <div className="border-t pt-4 mt-4">
              <CouponCode
                onCouponApplied={handleCouponApplied}
                orderAmount={cartTotal}
                appliedCoupon={appliedCoupon}
              />
            </div>

            <div className="border-t pt-4 mt-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>{language === 'ar' ? 'المجموع الفرعي' : 'Sous-total'}</span>
                  <span>{cartTotal.toFixed(2)} DH</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between items-center text-green-600">
                    <span>{language === 'ar' ? 'خصم الكوبون' : 'Remise coupon'} ({appliedCoupon.code})</span>
                    <span>-{appliedCoupon.discountAmount.toFixed(2)} DH</span>
                  </div>
                )}

                <div className="flex justify-between items-center text-lg font-semibold border-t pt-2">
                  <span>{language === 'ar' ? 'المجموع النهائي' : 'Total final'}</span>
                  <span>{finalTotal.toFixed(2)} DH</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
