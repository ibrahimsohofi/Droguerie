import React, { useState } from 'react';
import { useTranslations, useLanguage } from '../context/LanguageContext';
import { Truck, MapPin, Phone, CreditCard, AlertCircle, CheckCircle } from 'lucide-react';

const CashOnDeliveryPayment = ({
  orderTotal,
  shippingAddress,
  onConfirm,
  onCancel,
  deliveryFee = 25,
  freeDeliveryThreshold = 500
}) => {
  const t = useTranslations();
  const { isRTL, formatCurrency } = useLanguage();

  const [verificationPhone, setVerificationPhone] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [confirmationMethod, setConfirmationMethod] = useState('phone'); // phone, whatsapp
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const totalAmount = orderTotal + (orderTotal < freeDeliveryThreshold ? deliveryFee : 0);
  const isFreeDelivery = orderTotal >= freeDeliveryThreshold;

  const handleConfirmOrder = async () => {
    if (!verificationPhone || !acceptedTerms) {
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate API call for order confirmation
      await new Promise(resolve => setTimeout(resolve, 2000));

      const orderData = {
        paymentMethod: 'cash_on_delivery',
        verificationPhone,
        deliveryNotes,
        confirmationMethod,
        totalAmount,
        deliveryFee: isFreeDelivery ? 0 : deliveryFee,
        shippingAddress
      };

      onConfirm(orderData);
    } catch (error) {
      console.error('Order confirmation failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatPhoneNumber = (phone) => {
    // Format for Moroccan phone numbers
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('212')) {
      return `+${cleaned}`;
    } else if (cleaned.startsWith('0')) {
      return `+212${cleaned.substring(1)}`;
    } else if (cleaned.length === 9) {
      return `+212${cleaned}`;
    }
    return phone;
  };

  const moroccancities = [
    'الدار البيضاء', 'الرباط', 'فاس', 'مراكش', 'طنجة', 'أكادير',
    'مكناس', 'وجدة', 'القنيطرة', 'تطوان', 'سلا', 'تمارة'
  ];

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-moroccan p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-emerald-100 rounded-full">
          <Truck className="w-6 h-6 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800 arabic-text">
            {t.cashOnDelivery || 'الدفع عند التسليم'}
          </h2>
          <p className="text-sm text-gray-600">
            {isRTL ? 'طريقة الدفع الأكثر أماناً في المغرب' : 'Most secure payment method in Morocco'}
          </p>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-gray-800 mb-3">
          {t.orderSummary || 'ملخص الطلب'}
        </h3>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span>{isRTL ? 'إجمالي المنتجات' : 'Products Total'}</span>
            <span className="font-semibold">{formatCurrency(orderTotal)}</span>
          </div>

          <div className="flex justify-between">
            <span>{isRTL ? 'رسوم التوصيل' : 'Delivery Fee'}</span>
            {isFreeDelivery ? (
              <span className="text-emerald-600 font-semibold">
                {isRTL ? 'مجاني' : 'Free'}
              </span>
            ) : (
              <span className="font-semibold">{formatCurrency(deliveryFee)}</span>
            )}
          </div>

          {isFreeDelivery && (
            <div className="flex items-center gap-2 text-emerald-600 text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>
                {isRTL
                  ? `توصيل مجاني للطلبات أكثر من ${formatCurrency(freeDeliveryThreshold)}`
                  : `Free delivery for orders over ${formatCurrency(freeDeliveryThreshold)}`
                }
              </span>
            </div>
          )}

          <div className="border-t pt-2 flex justify-between text-lg font-bold">
            <span>{t.total || 'المجموع'}</span>
            <span className="text-emerald-600">{formatCurrency(totalAmount)}</span>
          </div>
        </div>
      </div>

      {/* Delivery Address Verification */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          {t.shippingAddress || 'عنوان التوصيل'}
        </h3>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-gray-700">
            {shippingAddress?.fullAddress ||
             (isRTL ? 'لم يتم تحديد العنوان بعد' : 'Address not specified')}
          </p>
          {shippingAddress?.city && (
            <p className="text-sm text-gray-600 mt-1">
              {shippingAddress.city}, {shippingAddress.postalCode}
            </p>
          )}
        </div>
      </div>

      {/* Phone Verification */}
      <div className="mb-6">
        <label className="block font-semibold text-gray-800 mb-2">
          {isRTL ? 'رقم الهاتف للتأكيد *' : 'Verification Phone Number *'}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Phone className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="tel"
            value={verificationPhone}
            onChange={(e) => setVerificationPhone(e.target.value)}
            placeholder={isRTL ? '+212 6XX XXX XXX' : '+212 6XX XXX XXX'}
            className={`form-input pl-10 ${isRTL ? 'text-right' : 'text-left'}`}
            dir={isRTL ? 'rtl' : 'ltr'}
          />
        </div>
        <p className="text-sm text-gray-600 mt-1">
          {isRTL
            ? 'سيتم الاتصال بك لتأكيد الطلب قبل التوصيل'
            : 'We will call you to confirm the order before delivery'
          }
        </p>
      </div>

      {/* Confirmation Method */}
      <div className="mb-6">
        <label className="block font-semibold text-gray-800 mb-3">
          {isRTL ? 'طريقة التأكيد المفضلة' : 'Preferred Confirmation Method'}
        </label>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setConfirmationMethod('phone')}
            className={`p-3 border-2 rounded-lg transition-colors ${
              confirmationMethod === 'phone'
                ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Phone className="w-5 h-5 mx-auto mb-2" />
            <span className="text-sm font-medium">
              {isRTL ? 'مكالمة هاتفية' : 'Phone Call'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setConfirmationMethod('whatsapp')}
            className={`p-3 border-2 rounded-lg transition-colors ${
              confirmationMethod === 'whatsapp'
                ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <svg className="w-5 h-5 mx-auto mb-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.886 3.75"/>
            </svg>
            <span className="text-sm font-medium">WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Delivery Notes */}
      <div className="mb-6">
        <label className="block font-semibold text-gray-800 mb-2">
          {isRTL ? 'ملاحظات التوصيل (اختياري)' : 'Delivery Notes (Optional)'}
        </label>
        <textarea
          value={deliveryNotes}
          onChange={(e) => setDeliveryNotes(e.target.value)}
          placeholder={isRTL
            ? 'معلومات إضافية لتسهيل التوصيل (رقم الطابق، ملاحظات خاصة...)'
            : 'Additional information to facilitate delivery (floor number, special notes...)'
          }
          rows={3}
          className={`form-input resize-none ${isRTL ? 'text-right' : 'text-left'}`}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </div>

      {/* Important Notes */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-yellow-800">
            <p className="font-semibold mb-2">
              {isRTL ? 'ملاحظات مهمة:' : 'Important Notes:'}
            </p>
            <ul className="space-y-1">
              <li>
                {isRTL
                  ? '• يرجى التأكد من توفر المبلغ الكامل عند التسليم'
                  : '• Please ensure you have the full amount ready upon delivery'
                }
              </li>
              <li>
                {isRTL
                  ? '• سيتم تأكيد الطلب خلال 24 ساعة'
                  : '• Order will be confirmed within 24 hours'
                }
              </li>
              <li>
                {isRTL
                  ? '• التوصيل خلال 2-3 أيام عمل'
                  : '• Delivery within 2-3 business days'
                }
              </li>
              <li>
                {isRTL
                  ? '• يمكن إلغاء الطلب قبل الشحن'
                  : '• Order can be cancelled before shipping'
                }
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Terms Acceptance */}
      <div className="mb-6">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            className="mt-1 w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
          />
          <span className="text-sm text-gray-700">
            {isRTL
              ? 'أوافق على شروط وأحكام الخدمة وسياسة الإرجاع'
              : 'I agree to the terms of service and return policy'
            }
          </span>
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="btn-secondary flex-1"
          disabled={isProcessing}
        >
          {t.cancel || 'إلغاء'}
        </button>

        <button
          onClick={handleConfirmOrder}
          disabled={!verificationPhone || !acceptedTerms || isProcessing}
          className="btn-primary flex-1 flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <div className="spinner w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
              {isRTL ? 'جاري المعالجة...' : 'Processing...'}
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5" />
              {isRTL ? 'تأكيد الطلب' : 'Confirm Order'}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CashOnDeliveryPayment;
