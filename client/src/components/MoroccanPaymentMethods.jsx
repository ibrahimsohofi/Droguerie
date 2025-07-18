import React, { useState } from 'react';
import { CreditCard, Banknote, Building2, Smartphone, Truck, DollarSign, Check, AlertCircle, Info } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const MoroccanPaymentMethods = ({
  selectedMethod,
  onMethodSelect,
  orderTotal,
  shippingAddress,
  className = ""
}) => {
  const { language, isRTL } = useLanguage();
  const [showBankDetails, setShowBankDetails] = useState(false);

  // Get text based on language
  const getText = () => {
    return {
      title: language === 'ar' ? 'طرق الدفع المتاحة' : language === 'fr' ? 'Méthodes de paiement disponibles' : 'Available Payment Methods',

      // Cash on Delivery
      cod: language === 'ar' ? 'الدفع عند الاستلام' : language === 'fr' ? 'Paiement à la livraison' : 'Cash on Delivery',
      codDesc: language === 'ar' ? 'ادفع نقداً عند وصول طلبك' : language === 'fr' ? 'Payez en espèces à la réception' : 'Pay in cash when your order arrives',
      codFee: language === 'ar' ? 'رسوم التوصيل' : language === 'fr' ? 'Frais de livraison' : 'Delivery fee',

      // Bank Transfer
      bankTransfer: language === 'ar' ? 'تحويل بنكي' : language === 'fr' ? 'Virement bancaire' : 'Bank Transfer',
      bankTransferDesc: language === 'ar' ? 'حوّل المبلغ إلى حسابنا البنكي' : language === 'fr' ? 'Transférez le montant sur notre compte' : 'Transfer the amount to our bank account',
      showBankDetails: language === 'ar' ? 'عرض التفاصيل البنكية' : language === 'fr' ? 'Afficher les détails bancaires' : 'Show bank details',
      hideBankDetails: language === 'ar' ? 'إخفاء التفاصيل' : language === 'fr' ? 'Masquer les détails' : 'Hide details',

      // Local Cards (CMI)
      localCards: language === 'ar' ? 'البطاقات المغربية' : language === 'fr' ? 'Cartes marocaines' : 'Moroccan Cards',
      localCardsDesc: language === 'ar' ? 'البطاقات البنكية المغربية المحلية' : language === 'fr' ? 'Cartes bancaires marocaines locales' : 'Local Moroccan bank cards',

      // International Cards
      intlCards: language === 'ar' ? 'البطاقات الدولية' : language === 'fr' ? 'Cartes internationales' : 'International Cards',
      intlCardsDesc: language === 'ar' ? 'فيزا، ماستركارد، أمريكان إكسبرس' : language === 'fr' ? 'Visa, Mastercard, American Express' : 'Visa, Mastercard, American Express',

      // PayPal
      paypalDesc: language === 'ar' ? 'ادفع بأمان باستخدام PayPal' : language === 'fr' ? 'Payez en sécurité avec PayPal' : 'Pay securely with PayPal',

      // Mobile Payment
      mobilePayment: language === 'ar' ? 'الدفع المحمول' : language === 'fr' ? 'Paiement mobile' : 'Mobile Payment',
      mobilePaymentDesc: language === 'ar' ? 'ادفع عبر هاتفك المحمول' : language === 'fr' ? 'Payez via votre mobile' : 'Pay via your mobile phone',

      // Bank Details
      bankName: language === 'ar' ? 'اسم البنك' : language === 'fr' ? 'Nom de la banque' : 'Bank Name',
      accountNumber: language === 'ar' ? 'رقم الحساب' : language === 'fr' ? 'Numéro de compte' : 'Account Number',
      iban: language === 'ar' ? 'الآيبان' : language === 'fr' ? 'IBAN' : 'IBAN',
      swift: language === 'ar' ? 'سويفت' : language === 'fr' ? 'SWIFT' : 'SWIFT',
      accountHolder: language === 'ar' ? 'صاحب الحساب' : language === 'fr' ? 'Titulaire du compte' : 'Account Holder',

      // Info Messages
      freeShipping: language === 'ar' ? 'شحن مجاني' : language === 'fr' ? 'Livraison gratuite' : 'Free shipping',
      securePayment: language === 'ar' ? 'دفع آمن' : language === 'fr' ? 'Paiement sécurisé' : 'Secure payment',
      instantProcessing: language === 'ar' ? 'معالجة فورية' : language === 'fr' ? 'Traitement instantané' : 'Instant processing',
      verificationRequired: language === 'ar' ? 'التحقق مطلوب' : language === 'fr' ? 'Vérification requise' : 'Verification required',
    };
  };

  const text = getText();

  // Check if Cash on Delivery is available for the shipping address
  const isCODAvailable = () => {
    const availableCities = ['Casablanca', 'Rabat', 'Marrakech', 'Fes', 'Tangier', 'Agadir', 'Meknes', 'Oujda', 'Kenitra', 'Tetouan'];
    return shippingAddress && availableCities.some(city =>
      shippingAddress.city?.toLowerCase().includes(city.toLowerCase())
    );
  };

  // Check if order qualifies for free shipping
  const isFreeShipping = orderTotal >= 300;
  const deliveryFee = isFreeShipping ? 0 : 25;

  const paymentMethods = [
    // Cash on Delivery
    {
      id: 'cod',
      name: text.cod,
      description: text.codDesc,
      icon: <Truck className="w-6 h-6" />,
      available: isCODAvailable(),
      fee: deliveryFee,
      badges: [
        { text: text.verificationRequired, color: 'amber' },
        deliveryFee === 0 ? { text: text.freeShipping, color: 'green' } : null
      ].filter(Boolean),
      bgColor: 'bg-gradient-to-br from-amber-50 to-orange-50',
      borderColor: 'border-amber-200',
      iconColor: 'text-amber-600'
    },

    // Moroccan Local Cards (CMI)
    {
      id: 'cmi',
      name: text.localCards,
      description: text.localCardsDesc,
      icon: <CreditCard className="w-6 h-6" />,
      available: true,
      fee: 0,
      badges: [
        { text: text.securePayment, color: 'green' },
        { text: text.instantProcessing, color: 'blue' }
      ],
      bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50',
      borderColor: 'border-green-200',
      iconColor: 'text-green-600',
      logos: ['🇲🇦']
    },

    // International Cards (Stripe)
    {
      id: 'stripe',
      name: text.intlCards,
      description: text.intlCardsDesc,
      icon: <CreditCard className="w-6 h-6" />,
      available: true,
      fee: 0,
      badges: [
        { text: text.securePayment, color: 'blue' },
        { text: text.instantProcessing, color: 'green' }
      ],
      bgColor: 'bg-gradient-to-br from-blue-50 to-indigo-50',
      borderColor: 'border-blue-200',
      iconColor: 'text-blue-600',
      logos: ['💳', '💰']
    },

    // PayPal
    {
      id: 'paypal',
      name: 'PayPal',
      description: text.paypalDesc,
      icon: <DollarSign className="w-6 h-6" />,
      available: true,
      fee: 0,
      badges: [
        { text: text.securePayment, color: 'blue' },
        { text: 'PayPal', color: 'indigo' }
      ],
      bgColor: 'bg-gradient-to-br from-indigo-50 to-purple-50',
      borderColor: 'border-indigo-200',
      iconColor: 'text-indigo-600',
      logos: ['🅿️']
    },

    // Bank Transfer
    {
      id: 'bank_transfer',
      name: text.bankTransfer,
      description: text.bankTransferDesc,
      icon: <Building2 className="w-6 h-6" />,
      available: true,
      fee: 0,
      badges: [
        { text: text.securePayment, color: 'gray' }
      ],
      bgColor: 'bg-gradient-to-br from-gray-50 to-slate-50',
      borderColor: 'border-gray-200',
      iconColor: 'text-gray-600',
      logos: ['🏦']
    },

    // Mobile Payment
    {
      id: 'mobile_payment',
      name: text.mobilePayment,
      description: text.mobilePaymentDesc,
      icon: <Smartphone className="w-6 h-6" />,
      available: true,
      fee: 0,
      badges: [
        { text: text.securePayment, color: 'purple' },
        { text: 'SMS', color: 'orange' }
      ],
      bgColor: 'bg-gradient-to-br from-purple-50 to-pink-50',
      borderColor: 'border-purple-200',
      iconColor: 'text-purple-600',
      logos: ['📱']
    }
  ];

  const getBadgeColor = (color) => {
    const colors = {
      green: 'bg-green-100 text-green-700',
      blue: 'bg-blue-100 text-blue-700',
      amber: 'bg-amber-100 text-amber-700',
      orange: 'bg-orange-100 text-orange-700',
      purple: 'bg-purple-100 text-purple-700',
      indigo: 'bg-indigo-100 text-indigo-700',
      gray: 'bg-gray-100 text-gray-700'
    };
    return colors[color] || colors.gray;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className={`text-xl font-semibold text-gray-900 mb-6 ${language === 'ar' ? 'font-arabic' : ''}`}>
        {text.title}
      </h3>

      <div className="grid gap-4">
        {paymentMethods.map((method) => (
          <div key={method.id} className="relative">
            <div
              onClick={() => method.available && onMethodSelect(method.id)}
              className={`
                relative p-6 rounded-xl border-2 transition-all duration-200 cursor-pointer
                ${method.available ? 'hover:shadow-lg' : 'opacity-50 cursor-not-allowed'}
                ${selectedMethod === method.id
                  ? `${method.borderColor} shadow-lg scale-[1.02]`
                  : 'border-gray-200 hover:border-gray-300'
                }
                ${method.bgColor}
              `}
            >
              {/* Selection Indicator */}
              {selectedMethod === method.id && (
                <div className="absolute top-4 right-4 w-6 h-6 bg-brand-teal-600 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}

              {/* Unavailable Overlay */}
              {!method.available && (
                <div className="absolute inset-0 bg-gray-100/50 rounded-xl flex items-center justify-center">
                  <div className="bg-white px-4 py-2 rounded-lg shadow-md">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <AlertCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">
                        {language === 'ar' ? 'غير متاح' : language === 'fr' ? 'Non disponible' : 'Not Available'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-start space-x-4">
                {/* Icon */}
                <div className={`p-3 rounded-lg ${method.iconColor} ${method.bgColor}`}>
                  {method.icon}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className={`font-semibold text-gray-900 ${language === 'ar' ? 'font-arabic' : ''}`}>
                      {method.name}
                    </h4>

                    {/* Logos */}
                    {method.logos && (
                      <div className="flex space-x-1">
                        {method.logos.map((logo, index) => (
                          <span key={index} className="text-lg">{logo}</span>
                        ))}
                      </div>
                    )}

                    {/* Fee */}
                    {method.fee > 0 && (
                      <span className="text-sm text-gray-600 ml-auto">
                        +{method.fee} {language === 'ar' ? 'درهم' : 'DH'}
                      </span>
                    )}
                  </div>

                  <p className={`text-gray-600 text-sm mb-3 ${language === 'ar' ? 'font-arabic' : ''}`}>
                    {method.description}
                  </p>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2">
                    {method.badges.map((badge, index) => (
                      <span
                        key={index}
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getBadgeColor(badge.color)}`}
                      >
                        {badge.text}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bank Transfer Details */}
            {method.id === 'bank_transfer' && selectedMethod === 'bank_transfer' && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <button
                  onClick={() => setShowBankDetails(!showBankDetails)}
                  className="flex items-center space-x-2 text-brand-teal-600 hover:text-brand-teal-700 transition-colors mb-3"
                >
                  <Info className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {showBankDetails ? text.hideBankDetails : text.showBankDetails}
                  </span>
                </button>

                {showBankDetails && (
                  <div className="space-y-3 text-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="font-medium text-gray-700">{text.bankName}:</label>
                        <p className="text-gray-600">Banque Populaire du Maroc</p>
                      </div>
                      <div>
                        <label className="font-medium text-gray-700">{text.accountHolder}:</label>
                        <p className="text-gray-600">Droguerie Jamal SARL</p>
                      </div>
                      <div>
                        <label className="font-medium text-gray-700">{text.accountNumber}:</label>
                        <p className="text-gray-600 font-mono">123456789012345</p>
                      </div>
                      <div>
                        <label className="font-medium text-gray-700">RIB:</label>
                        <p className="text-gray-600 font-mono">230110000123456789012345</p>
                      </div>
                      <div>
                        <label className="font-medium text-gray-700">{text.iban}:</label>
                        <p className="text-gray-600 font-mono">MA64230110000123456789012345</p>
                      </div>
                      <div>
                        <label className="font-medium text-gray-700">{text.swift}:</label>
                        <p className="text-gray-600 font-mono">BMCEMAMC</p>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-blue-800 text-sm">
                        {language === 'ar'
                          ? 'يرجى إرسال إثبات التحويل عبر الواتساب أو البريد الإلكتروني بعد إتمام التحويل'
                          : language === 'fr'
                          ? 'Veuillez envoyer la preuve de virement par WhatsApp ou email après le transfert'
                          : 'Please send transfer proof via WhatsApp or email after completing the transfer'
                        }
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Security Notice */}
      <div className="mt-6 p-4 bg-brand-teal-50 rounded-lg border border-brand-teal-200">
        <div className="flex items-center space-x-2 text-brand-teal-800">
          <Check className="w-5 h-5" />
          <span className={`text-sm font-medium ${language === 'ar' ? 'font-arabic' : ''}`}>
            {language === 'ar'
              ? 'جميع المدفوعات محمية بتشفير SSL وتتم معالجتها بأمان تام'
              : language === 'fr'
              ? 'Tous les paiements sont protégés par cryptage SSL et traités en toute sécurité'
              : 'All payments are SSL encrypted and processed securely'
            }
          </span>
        </div>
      </div>
    </div>
  );
};

export default MoroccanPaymentMethods;
