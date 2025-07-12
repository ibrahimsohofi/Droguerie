import React, { useState, useEffect } from 'react';
import { CreditCard, Truck, Phone, Building2, Banknote, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const MoroccanPaymentMethods = ({
  selectedMethod,
  onMethodChange,
  orderAmount = 0,
  shippingCity = '',
  onDeliveryFeeChange
}) => {
  const { language, isRTL, t } = useLanguage();
  const [deliveryFee, setDeliveryFee] = useState(0);

  // Moroccan city delivery zones with fees
  const deliveryZones = {
    'Casablanca': { fee: 25, zone: 'metro' },
    'الدار البيضاء': { fee: 25, zone: 'metro' },
    'Rabat': { fee: 30, zone: 'metro' },
    'الرباط': { fee: 30, zone: 'metro' },
    'Salé': { fee: 30, zone: 'metro' },
    'سلا': { fee: 30, zone: 'metro' },
    'Fès': { fee: 35, zone: 'major' },
    'فاس': { fee: 35, zone: 'major' },
    'Marrakech': { fee: 35, zone: 'major' },
    'مراكش': { fee: 35, zone: 'major' },
    'Agadir': { fee: 40, zone: 'major' },
    'أكادير': { fee: 40, zone: 'major' },
    'Tanger': { fee: 40, zone: 'major' },
    'طنجة': { fee: 40, zone: 'major' },
    'Meknès': { fee: 35, zone: 'major' },
    'مكناس': { fee: 35, zone: 'major' },
    'Oujda': { fee: 45, zone: 'regional' },
    'وجدة': { fee: 45, zone: 'regional' },
    'Kenitra': { fee: 35, zone: 'major' },
    'القنيطرة': { fee: 35, zone: 'major' },
    'Tétouan': { fee: 40, zone: 'major' },
    'تطوان': { fee: 40, zone: 'major' }
  };

  // Calculate delivery fee based on city and payment method
  useEffect(() => {
    let fee = 0;

    if (selectedMethod === 'cod' && shippingCity) {
      const cityInfo = deliveryZones[shippingCity] || { fee: 50 }; // Default for other cities
      fee = cityInfo.fee;

      // Free delivery for orders over 300 MAD
      if (orderAmount >= 300) {
        fee = 0;
      }
    }

    setDeliveryFee(fee);
    if (onDeliveryFeeChange) {
      onDeliveryFeeChange(fee);
    }
  }, [selectedMethod, shippingCity, orderAmount, onDeliveryFeeChange]);

  const paymentMethods = [
    {
      id: 'cod',
      nameAr: 'الدفع عند التوصيل',
      nameFr: 'Paiement à la livraison',
      nameEn: 'Cash on Delivery',
      icon: Truck,
      description: {
        ar: 'ادفع نقداً عند استلام طلبك. الطريقة الأكثر أماناً وشعبية في المغرب',
        fr: 'Payez en espèces à la réception de votre commande. Méthode la plus sûre et populaire au Maroc',
        en: 'Pay in cash when you receive your order. Most safe and popular method in Morocco'
      },
      features: {
        ar: ['توصيل مجاني للطلبات أكثر من 300 درهم', 'فحص المنتج قبل الدفع', 'لا توجد رسوم إضافية'],
        fr: ['Livraison gratuite pour les commandes de plus de 300 DH', 'Inspection du produit avant paiement', 'Aucun frais supplémentaire'],
        en: ['Free delivery for orders over 300 MAD', 'Product inspection before payment', 'No additional fees']
      },
      popular: true
    },
    {
      id: 'cih_bank',
      nameAr: 'البنك التجاري وفا المغرب - CIH',
      nameFr: 'CIH Bank Maroc',
      nameEn: 'CIH Bank Morocco',
      icon: Building2,
      description: {
        ar: 'الدفع الآمن عبر البنك التجاري وفا المغرب. دفع فوري وآمن',
        fr: 'Paiement sécurisé via CIH Bank Maroc. Paiement instantané et sécurisé',
        en: 'Secure payment via CIH Bank Morocco. Instant and secure payment'
      },
      features: {
        ar: ['دفع فوري', 'حماية مصرفية كاملة', 'بدون رسوم إضافية'],
        fr: ['Paiement instantané', 'Protection bancaire complète', 'Sans frais supplémentaires'],
        en: ['Instant payment', 'Full banking protection', 'No additional fees']
      }
    },
    {
      id: 'bmce_bank',
      nameAr: 'بنك المغرب الخارجي - BMCE',
      nameFr: 'BMCE Bank of Africa',
      nameEn: 'BMCE Bank of Africa',
      icon: Building2,
      description: {
        ar: 'الدفع عبر بنك المغرب الخارجي. حلول دفع متطورة وآمنة',
        fr: 'Paiement via BMCE Bank of Africa. Solutions de paiement avancées et sécurisées',
        en: 'Payment via BMCE Bank of Africa. Advanced and secure payment solutions'
      },
      features: {
        ar: ['تقنية مصرفية متقدمة', 'حماية من الاحتيال', 'معالجة سريعة'],
        fr: ['Technologie bancaire avancée', 'Protection contre la fraude', 'Traitement rapide'],
        en: ['Advanced banking technology', 'Fraud protection', 'Fast processing']
      }
    },
    {
      id: 'wafacash',
      nameAr: 'وفا كاش - Wafacash',
      nameFr: 'Wafacash Mobile',
      nameEn: 'Wafacash Mobile',
      icon: Phone,
      description: {
        ar: 'الدفع عبر الهاتف المحمول مع وفا كاش. سريع وسهل ومريح',
        fr: 'Paiement mobile avec Wafacash. Rapide, facile et pratique',
        en: 'Mobile payment with Wafacash. Fast, easy and convenient'
      },
      features: {
        ar: ['دفع عبر الهاتف', 'متوفر في جميع أنحاء المغرب', 'معاملات آمنة'],
        fr: ['Paiement par téléphone', 'Disponible partout au Maroc', 'Transactions sécurisées'],
        en: ['Phone payment', 'Available throughout Morocco', 'Secure transactions']
      }
    },
    {
      id: 'card',
      nameAr: 'بطاقة ائتمانية / خصم',
      nameFr: 'Carte de crédit/débit',
      nameEn: 'Credit/Debit Card',
      icon: CreditCard,
      description: {
        ar: 'ادفع بأمان باستخدام بطاقتك الائتمانية أو بطاقة الخصم',
        fr: 'Payez en toute sécurité avec votre carte de crédit ou de débit',
        en: 'Pay securely with your credit or debit card'
      },
      features: {
        ar: ['حماية SSL', 'قبول دولي', 'معالجة فورية'],
        fr: ['Protection SSL', 'Acceptation internationale', 'Traitement instantané'],
        en: ['SSL Protection', 'International acceptance', 'Instant processing']
      }
    }
  ];

  const formatPrice = (amount) => {
    return new Intl.NumberFormat(language === 'ar' ? 'ar-MA' : 'fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getMethodName = (method) => {
    switch (language) {
      case 'ar': return method.nameAr;
      case 'fr': return method.nameFr;
      default: return method.nameEn;
    }
  };

  const getMethodDescription = (method) => {
    return method.description[language] || method.description.en;
  };

  const getMethodFeatures = (method) => {
    return method.features[language] || method.features.en;
  };

  return (
    <div className="space-y-4">
      <h3 className={`text-lg font-semibold mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
        {t('payment.methods')} 💳
      </h3>

      {/* Free delivery notice */}
      {orderAmount > 0 && (
        <div className={`bg-green-50 border border-green-200 rounded-lg p-4 mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
          <div className="flex items-center">
            <MapPin className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-sm text-green-800 font-medium">
              {orderAmount >= 300
                ? (language === 'ar'
                  ? '🎉 توصيل مجاني! طلبك أكثر من 300 درهم'
                  : '🎉 Livraison gratuite! Votre commande dépasse 300 DH')
                : (language === 'ar'
                  ? `أضف ${formatPrice(300 - orderAmount)} للحصول على توصيل مجاني`
                  : `Ajoutez ${formatPrice(300 - orderAmount)} pour la livraison gratuite`)
              }
            </span>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {paymentMethods.map((method) => {
          const IconComponent = method.icon;
          const isSelected = selectedMethod === method.id;

          return (
            <div
              key={method.id}
              className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
                isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              } ${isRTL ? 'text-right' : 'text-left'}`}
              onClick={() => onMethodChange(method.id)}
            >
              {/* Popular badge */}
              {method.popular && (
                <div className={`absolute top-2 ${isRTL ? 'left-2' : 'right-2'} bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium`}>
                  {language === 'ar' ? 'الأكثر شعبية' : 'Le plus populaire'}
                </div>
              )}

              <div className="flex items-start space-x-3">
                <input
                  type="radio"
                  name="payment_method"
                  value={method.id}
                  checked={isSelected}
                  onChange={() => onMethodChange(method.id)}
                  className={`mt-1 ${isRTL ? 'ml-3' : 'mr-3'}`}
                />

                <IconComponent className={`h-6 w-6 text-blue-600 mt-1 flex-shrink-0 ${isRTL ? 'ml-3' : 'mr-3'}`} />

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-900">
                      {getMethodName(method)}
                    </h4>
                    {method.id === 'cod' && deliveryFee > 0 && (
                      <span className="text-sm text-orange-600 font-medium">
                        + {formatPrice(deliveryFee)} {language === 'ar' ? 'توصيل' : 'livraison'}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mt-1">
                    {getMethodDescription(method)}
                  </p>

                  {/* Features */}
                  <div className="mt-2">
                    <ul className="text-xs text-gray-500 space-y-1">
                      {getMethodFeatures(method).map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <span className={`w-1.5 h-1.5 bg-green-500 rounded-full ${isRTL ? 'ml-2' : 'mr-2'}`}></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Delivery zone info for COD */}
              {method.id === 'cod' && isSelected && shippingCity && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    <MapPin className="h-4 w-4 inline mr-1" />
                    {language === 'ar'
                      ? `منطقة التوصيل: ${shippingCity}`
                      : `Zone de livraison: ${shippingCity}`
                    }
                  </div>
                  {deliveryFee === 0 && orderAmount >= 300 && (
                    <div className="text-sm text-green-600 font-medium mt-1">
                      ✅ {language === 'ar' ? 'توصيل مجاني' : 'Livraison gratuite'}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Payment method specific info */}
      {selectedMethod === 'cih_bank' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h5 className="font-semibold text-blue-900 mb-2">
            {language === 'ar' ? 'معلومات الدفع - CIH Bank' : 'Informations de paiement - CIH Bank'}
          </h5>
          <p className="text-sm text-blue-800">
            {language === 'ar'
              ? 'سيتم توجيهك إلى منصة CIH Bank الآمنة لإتمام عملية الدفع.'
              : 'Vous serez redirigé vers la plateforme sécurisée de CIH Bank pour finaliser le paiement.'
            }
          </p>
        </div>
      )}

      {selectedMethod === 'bmce_bank' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h5 className="font-semibold text-green-900 mb-2">
            {language === 'ar' ? 'معلومات الدفع - BMCE Bank' : 'Informations de paiement - BMCE Bank'}
          </h5>
          <p className="text-sm text-green-800">
            {language === 'ar'
              ? 'سيتم توجيهك إلى منصة BMCE Bank الآمنة لإتمام عملية الدفع.'
              : 'Vous serez redirigé vers la plateforme sécurisée de BMCE Bank pour finaliser le paiement.'
            }
          </p>
        </div>
      )}

      {selectedMethod === 'wafacash' && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h5 className="font-semibold text-purple-900 mb-2">
            {language === 'ar' ? 'معلومات الدفع - Wafacash' : 'Informations de paiement - Wafacash'}
          </h5>
          <p className="text-sm text-purple-800">
            {language === 'ar'
              ? 'سيتم إرسال كود التأكيد إلى هاتفك لإتمام الدفع عبر Wafacash.'
              : 'Un code de confirmation sera envoyé à votre téléphone pour finaliser le paiement via Wafacash.'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default MoroccanPaymentMethods;
