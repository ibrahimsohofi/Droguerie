import React, { useState } from 'react';
import { Phone, CheckCircle, AlertCircle, MessageCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const PhoneVerification = ({
  onVerified,
  onPhoneChange,
  required = false,
  initialPhone = '',
  className = ''
}) => {
  const { language, t } = useLanguage();
  const [phone, setPhone] = useState(initialPhone);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerification, setShowVerification] = useState(false);

  // Moroccan phone number patterns and formatting
  const formatMoroccanPhone = (value) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');

    // Format based on length
    if (digits.length <= 3) {
      return digits;
    } else if (digits.length <= 6) {
      return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    } else if (digits.length <= 8) {
      return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
    } else if (digits.length <= 10) {
      return `${digits.slice(0, 4)} ${digits.slice(4, 6)} ${digits.slice(6, 8)} ${digits.slice(8)}`;
    }

    // For longer numbers, assume international format
    return `+${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 8)} ${digits.slice(8, 10)} ${digits.slice(10)}`;
  };

  const validatePhoneNumber = async (phoneNumber) => {
    if (!phoneNumber || phoneNumber.length < 9) {
      return { isValid: false, error: 'Phone number too short' };
    }

    setIsValidating(true);

    try {
      const response = await fetch('${import.meta.env.VITE_API_URL}/api/whatsapp/validate-phone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: phoneNumber }),
      });

      const data = await response.json();

      if (data.success) {
        return {
          isValid: data.isValid,
          formattedPhone: data.formattedPhone,
          whatsappLink: data.whatsappLink,
          originalPhone: data.originalPhone
        };
      } else {
        return { isValid: false, error: 'Validation failed' };
      }
    } catch (error) {
      console.error('Phone validation error:', error);
      return { isValid: false, error: 'Validation service unavailable' };
    } finally {
      setIsValidating(false);
    }
  };

  const handlePhoneChange = async (e) => {
    const rawValue = e.target.value;
    const formattedValue = formatMoroccanPhone(rawValue);

    setPhone(formattedValue);
    onPhoneChange?.(formattedValue);

    // Reset previous validation
    setValidationResult(null);
    setShowVerification(false);

    // Auto-validate when we have enough digits
    const digitsOnly = rawValue.replace(/\D/g, '');
    if (digitsOnly.length >= 9) {
      const result = await validatePhoneNumber(rawValue);
      setValidationResult(result);

      if (result.isValid && onVerified) {
        onVerified(result.formattedPhone);
      }
    }
  };

  const handleManualValidation = async () => {
    const result = await validatePhoneNumber(phone);
    setValidationResult(result);

    if (result.isValid && onVerified) {
      onVerified(result.formattedPhone);
    }
  };

  const sendWhatsAppVerification = () => {
    if (validationResult?.whatsappLink) {
      window.open(validationResult.whatsappLink, '_blank', 'noopener,noreferrer');
      setShowVerification(true);
    }
  };

  const getPlaceholder = () => {
    switch (language) {
      case 'ar':
        return 'مثال: 0612345678';
      case 'fr':
        return 'Ex: 0612345678';
      default:
        return 'Ex: 0612345678';
    }
  };

  const getLabels = () => {
    switch (language) {
      case 'ar':
        return {
          label: 'رقم الهاتف',
          validate: 'تحقق',
          validPhone: 'رقم صحيح',
          invalidPhone: 'رقم غير صحيح',
          verifyWhatsApp: 'تحقق عبر واتساب',
          validating: 'جاري التحقق...',
          enterCode: 'أدخل رمز التحقق',
          codeFromWhatsApp: 'الرمز المرسل عبر واتساب',
          required: 'مطلوب'
        };
      case 'fr':
        return {
          label: 'Numéro de téléphone',
          validate: 'Vérifier',
          validPhone: 'Numéro valide',
          invalidPhone: 'Numéro invalide',
          verifyWhatsApp: 'Vérifier via WhatsApp',
          validating: 'Vérification...',
          enterCode: 'Entrez le code de vérification',
          codeFromWhatsApp: 'Code reçu par WhatsApp',
          required: 'Requis'
        };
      default:
        return {
          label: 'Phone Number',
          validate: 'Verify',
          validPhone: 'Valid number',
          invalidPhone: 'Invalid number',
          verifyWhatsApp: 'Verify via WhatsApp',
          validating: 'Validating...',
          enterCode: 'Enter verification code',
          codeFromWhatsApp: 'Code from WhatsApp',
          required: 'Required'
        };
    }
  };

  const labels = getLabels();

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Phone Number Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {labels.label} {required && <span className="text-red-500">*</span>}
        </label>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Phone className="h-5 w-5 text-gray-400" />
          </div>

          <input
            type="tel"
            value={phone}
            onChange={handlePhoneChange}
            placeholder={getPlaceholder()}
            className={`block w-full pl-10 pr-12 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              validationResult?.isValid === true
                ? 'border-green-500 bg-green-50'
                : validationResult?.isValid === false
                ? 'border-red-500 bg-red-50'
                : 'border-gray-300'
            }`}
            dir="ltr"
          />

          {/* Validation Status Icon */}
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {isValidating ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            ) : validationResult?.isValid === true ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : validationResult?.isValid === false ? (
              <AlertCircle className="h-5 w-5 text-red-500" />
            ) : null}
          </div>
        </div>

        {/* Validation Message */}
        {validationResult && (
          <div className={`mt-1 text-sm ${
            validationResult.isValid ? 'text-green-600' : 'text-red-600'
          }`}>
            {validationResult.isValid ? labels.validPhone : labels.invalidPhone}
            {validationResult.error && `: ${validationResult.error}`}
          </div>
        )}
      </div>

      {/* WhatsApp Verification Button */}
      {validationResult?.isValid && (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={sendWhatsAppVerification}
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <MessageCircle className="h-4 w-4" />
            {labels.verifyWhatsApp}
          </button>
        </div>
      )}

      {/* Verification Code Input */}
      {showVerification && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">{labels.enterCode}</h4>
          <p className="text-sm text-blue-700 mb-3">{labels.codeFromWhatsApp}</p>

          <div className="flex gap-2">
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="1234"
              className="flex-1 px-3 py-2 border border-blue-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={6}
            />
            <button
              type="button"
              onClick={() => {
                // Here you would verify the code with your backend
                console.log('Verifying code:', verificationCode);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {labels.validate}
            </button>
          </div>
        </div>
      )}

      {/* Phone Format Help */}
      <div className="text-xs text-gray-500">
        {language === 'ar' ? (
          <>
            📱 الأرقام المقبولة: 06xxxxxxxx, 07xxxxxxxx, +212xxxxxxxxx
            <br />
            🇲🇦 أرقام مغربية فقط
          </>
        ) : language === 'fr' ? (
          <>
            📱 Formats acceptés: 06xxxxxxxx, 07xxxxxxxx, +212xxxxxxxxx
            <br />
            🇲🇦 Numéros marocains uniquement
          </>
        ) : (
          <>
            📱 Accepted formats: 06xxxxxxxx, 07xxxxxxxx, +212xxxxxxxxx
            <br />
            🇲🇦 Moroccan numbers only
          </>
        )}
      </div>
    </div>
  );
};

export default PhoneVerification;
