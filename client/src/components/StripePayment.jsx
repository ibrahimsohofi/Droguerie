import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { CreditCard, Lock, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

// Initialize Stripe with environment variable
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const StripePayment = ({ amount, orderData, onSuccess, onError, isLoading, setIsLoading }) => {
  const [stripe, setStripe] = useState(null);
  const [clientSecret, setClientSecret] = useState('');
  const [paymentError, setPaymentError] = useState(null);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardholderName, setCardholderName] = useState('');

  const { language } = useLanguage();

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        const stripeInstance = await stripePromise;
        setStripe(stripeInstance);
      } catch (error) {
        console.warn('Stripe failed to load:', error);
        setPaymentError('Payment service temporarily unavailable. Please try again later.');
      }
    };

    initializeStripe();
  }, []);

  useEffect(() => {
    if (amount && orderData) {
      createPaymentIntent();
    }
  }, [amount, orderData]);

  const createPaymentIntent = async () => {
    try {
      const response = await fetch('${import.meta.env.VITE_API_URL}/api/payments/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          currency: 'mad',
          orderData: orderData
        })
      });

      const data = await response.json();

      if (data.success) {
        setClientSecret(data.data.client_secret);
      } else {
        setPaymentError(data.message || 'Failed to initialize payment');
      }
    } catch (error) {
      setPaymentError('Failed to initialize payment');
      console.error('Error creating payment intent:', error);
    }
  };

  const formatCardNumber = (value) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    // Add spaces every 4 digits
    const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted;
  };

  const formatExpiryDate = (value) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    // Add slash after 2 digits
    if (digits.length >= 2) {
      return digits.slice(0, 2) + '/' + digits.slice(2, 4);
    }
    return digits;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !clientSecret) {
      setPaymentError('Payment system not ready');
      return;
    }

    setIsLoading(true);
    setPaymentError(null);

    try {
      // Create a simplified payment method for demo purposes
      // In production, you'd use Stripe Elements for better security
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: {
            number: cardNumber.replace(/\s/g, ''),
            exp_month: parseInt(expiryDate.split('/')[0]),
            exp_year: parseInt('20' + expiryDate.split('/')[1]),
            cvc: cvc
          },
          billing_details: {
            name: cardholderName || orderData.customer_name,
            email: orderData.customer_email
          }
        }
      });

      if (error) {
        setPaymentError(error.message);
        onError && onError(error.message);
      } else if (paymentIntent.status === 'succeeded') {
        // Confirm payment on our backend
        const confirmResponse = await fetch('${import.meta.env.VITE_API_URL}/api/payments/confirm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            payment_intent_id: paymentIntent.id,
            orderData: orderData
          })
        });

        const confirmData = await confirmResponse.json();

        if (confirmData.success) {
          onSuccess && onSuccess(confirmData.data);
        } else {
          setPaymentError(confirmData.message || 'Payment confirmation failed');
          onError && onError(confirmData.message);
        }
      }
    } catch (error) {
      setPaymentError('Payment processing failed');
      onError && onError('Payment processing failed');
      console.error('Payment error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    return cardNumber.replace(/\s/g, '').length >= 13 &&
           expiryDate.length === 5 &&
           cvc.length >= 3 &&
           cardholderName.trim().length > 0;
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex items-center mb-4">
        <CreditCard className="h-5 w-5 text-blue-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">
          {language === 'ar' ? 'بيانات البطاقة' : 'Informations de carte'}
        </h3>
        <Lock className="h-4 w-4 text-green-600 ml-2" />
      </div>

      {paymentError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
          <span className="text-red-700 text-sm">{paymentError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {language === 'ar' ? 'اسم حامل البطاقة' : 'Nom du titulaire'}
          </label>
          <input
            type="text"
            value={cardholderName}
            onChange={(e) => setCardholderName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={language === 'ar' ? 'الاسم كما هو مكتوب على البطاقة' : 'Nom tel qu\'il apparaît sur la carte'}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {language === 'ar' ? 'رقم البطاقة' : 'Numéro de carte'}
          </label>
          <input
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
            maxLength="19"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="1234 5678 9012 3456"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'ar' ? 'تاريخ الانتهاء' : 'Date d\'expiration'}
            </label>
            <input
              type="text"
              value={expiryDate}
              onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
              maxLength="5"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="MM/YY"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CVC
            </label>
            <input
              type="text"
              value={cvc}
              onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
              maxLength="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="123"
              required
            />
          </div>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600">
          <div className="flex items-center">
            <Lock className="h-4 w-4 mr-2" />
            {language === 'ar'
              ? 'جميع معلومات البطاقة محمية ومشفرة بتقنية SSL'
              : 'Toutes les informations de carte sont protégées et cryptées SSL'
            }
          </div>
        </div>

        <button
          type="submit"
          disabled={!isFormValid() || isLoading || !clientSecret}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading
            ? (language === 'ar' ? 'جاري المعالجة...' : 'Traitement en cours...')
            : (language === 'ar' ? `دفع ${amount?.toFixed(2)} درهم` : `Payer ${amount?.toFixed(2)} DH`)
          }
        </button>
      </form>

      <div className="mt-4 text-xs text-gray-500 text-center">
        {language === 'ar'
          ? 'يتم تشغيل هذا النموذج بواسطة Stripe للحصول على أقصى قدر من الأمان'
          : 'Ce formulaire est alimenté par Stripe pour un maximum de sécurité'
        }
      </div>
    </div>
  );
};

export default StripePayment;
