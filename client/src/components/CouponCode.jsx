import React, { useState, useContext } from 'react';
import { Tag, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { LanguageContext } from '../context/LanguageContext';

const CouponCode = ({ onCouponApplied, orderAmount, appliedCoupon }) => {
  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { t, language, isRTL } = useContext(LanguageContext);

  const content = {
    ar: {
      title: 'كوبون الخصم',
      placeholder: 'أدخل كود الكوبون',
      apply: 'تطبيق',
      remove: 'إزالة',
      applied: 'تم تطبيق الكوبون',
      discount: 'خصم',
      savings: 'توفير',
      invalidCode: 'كود الكوبون غير صحيح',
      expired: 'انتهت صلاحية الكوبون',
      alreadyUsed: 'تم استخدام هذا الكوبون من قبل',
      minimumAmount: 'الحد الأدنى للطلب غير مُحقق',
      networkError: 'خطأ في الشبكة، يرجى المحاولة مرة أخرى'
    },
    fr: {
      title: 'Code Promo',
      placeholder: 'Entrez le code promo',
      apply: 'Appliquer',
      remove: 'Supprimer',
      applied: 'Code promo appliqué',
      discount: 'Remise',
      savings: 'Économie',
      invalidCode: 'Code promo invalide',
      expired: 'Code promo expiré',
      alreadyUsed: 'Code promo déjà utilisé',
      minimumAmount: 'Montant minimum non atteint',
      networkError: 'Erreur réseau, veuillez réessayer'
    },
    en: {
      title: 'Coupon Code',
      placeholder: 'Enter coupon code',
      apply: 'Apply',
      remove: 'Remove',
      applied: 'Coupon applied',
      discount: 'Discount',
      savings: 'You save',
      invalidCode: 'Invalid coupon code',
      expired: 'Coupon has expired',
      alreadyUsed: 'Coupon already used',
      minimumAmount: 'Minimum order amount not met',
      networkError: 'Network error, please try again'
    }
  };

  const currentContent = content[language];

  const validateCoupon = async (code) => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/coupons/validate/${code}?orderAmount=${orderAmount}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      const data = await response.json();

      if (data.success) {
        setSuccess(currentContent.applied);
        onCouponApplied({
          code: data.data.coupon.code,
          name: data.data.coupon.name,
          discountAmount: data.data.discountAmount,
          finalAmount: data.data.finalAmount,
          type: data.data.coupon.type,
          value: data.data.coupon.value
        });
      } else {
        setError(data.message || currentContent.invalidCode);
      }
    } catch (error) {
      console.error('Error validating coupon:', error);
      setError(currentContent.networkError);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();

    if (!couponCode.trim()) {
      setError('Please enter a coupon code');
      return;
    }

    validateCoupon(couponCode.trim().toUpperCase());
  };

  const handleRemoveCoupon = () => {
    setCouponCode('');
    setError('');
    setSuccess('');
    onCouponApplied(null);
  };

  return (
    <div className={`bg-gray-50 rounded-lg p-4 ${isRTL ? 'text-right' : 'text-left'}`}>
      <div className="flex items-center gap-2 mb-3">
        <Tag className="h-5 w-5 text-green-600" />
        <h3 className="font-semibold text-gray-900">{currentContent.title}</h3>
      </div>

      {appliedCoupon ? (
        // Applied coupon display
        <div className="space-y-3">
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-green-800">
                {appliedCoupon.code} - {appliedCoupon.name}
              </p>
              <p className="text-sm text-green-700">
                {currentContent.discount}: {
                  appliedCoupon.type === 'percentage'
                    ? `${appliedCoupon.value}%`
                    : `${appliedCoupon.value} MAD`
                }
              </p>
            </div>
            <button
              onClick={handleRemoveCoupon}
              className="text-sm text-red-600 hover:text-red-800 font-medium"
            >
              {currentContent.remove}
            </button>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">{currentContent.savings}:</span>
            <span className="font-semibold text-green-600">
              -{appliedCoupon.discountAmount.toFixed(2)} MAD
            </span>
          </div>
        </div>
      ) : (
        // Coupon input form
        <form onSubmit={handleApplyCoupon} className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder={currentContent.placeholder}
              className={`flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                isRTL ? 'text-right' : 'text-left'
              }`}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !couponCode.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {loading && <Loader className="h-4 w-4 animate-spin" />}
              {currentContent.apply}
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
              <CheckCircle className="h-4 w-4 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}
        </form>
      )}
    </div>
  );
};

export default CouponCode;
