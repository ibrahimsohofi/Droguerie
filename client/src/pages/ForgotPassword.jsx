import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import LoadingSpinner from '../components/LoadingSpinner';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState('');
  const { language, isRTL } = useLanguage();

  const content = {
    ar: {
      title: 'استعادة كلمة المرور',
      subtitle: 'أدخل بريدك الإلكتروني لاستعادة كلمة المرور',
      emailLabel: 'البريد الإلكتروني',
      emailPlaceholder: 'أدخل بريدك الإلكتروني',
      sendButton: 'إرسال رابط الاستعادة',
      backToLogin: 'العودة لتسجيل الدخول',
      successTitle: 'تم إرسال البريد الإلكتروني!',
      successMessage: 'تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني. يرجى فتح البريد واتباع التعليمات.',
      successNote: 'إذا لم تجد البريد، تحقق من مجلد الرسائل غير المرغوب فيها.',
      resendButton: 'إعادة الإرسال',
      errors: {
        required: 'البريد الإلكتروني مطلوب',
        invalid: 'البريد الإلكتروني غير صحيح',
        notFound: 'البريد الإلكتروني غير مسجل في النظام',
        serverError: 'حدث خطأ في الخادم. يرجى المحاولة لاحقاً'
      }
    },
    fr: {
      title: 'Récupération du mot de passe',
      subtitle: 'Entrez votre email pour récupérer votre mot de passe',
      emailLabel: 'Adresse email',
      emailPlaceholder: 'Entrez votre adresse email',
      sendButton: 'Envoyer le lien de récupération',
      backToLogin: 'Retour à la connexion',
      successTitle: 'Email envoyé !',
      successMessage: 'Un lien de récupération a été envoyé à votre adresse email. Veuillez ouvrir votre email et suivre les instructions.',
      successNote: 'Si vous ne trouvez pas l\'email, vérifiez votre dossier spam.',
      resendButton: 'Renvoyer',
      errors: {
        required: 'L\'adresse email est requise',
        invalid: 'L\'adresse email n\'est pas valide',
        notFound: 'Cette adresse email n\'est pas enregistrée',
        serverError: 'Erreur serveur. Veuillez réessayer plus tard'
      }
    }
  };

  const t = content[language] || content.fr;

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError(t.errors.required);
      return;
    }

    if (!validateEmail(email)) {
      setError(t.errors.invalid);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setIsEmailSent(true);
      } else {
        const errorData = await response.json();
        if (response.status === 404) {
          setError(t.errors.notFound);
        } else {
          setError(errorData.message || t.errors.serverError);
        }
      }
    } catch (error) {
      console.error('Password reset error:', error);
      setError(t.errors.serverError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    setIsEmailSent(false);
    setEmail('');
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow rounded-lg sm:px-10">
            <div className="text-center">
              <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t.successTitle}
              </h2>
              <p className="text-gray-600 mb-4">
                {t.successMessage}
              </p>
              <p className="text-sm text-gray-500 mb-6">
                {t.successNote}
              </p>
              <div className="space-y-4">
                <button
                  onClick={handleResend}
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
                >
                  {t.resendButton}
                </button>
                <Link
                  to="/login"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
                >
                  {t.backToLogin}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow rounded-lg sm:px-10">
          <div className={`text-center mb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
            <Mail className="mx-auto h-12 w-12 text-blue-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t.title}
            </h2>
            <p className="text-gray-600">
              {t.subtitle}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                {t.emailLabel}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.emailPlaceholder}
                className={`appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300 ${isRTL ? 'text-right' : 'text-left'}`}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" color="white" />
                ) : (
                  t.sendButton
                )}
              </button>
            </div>

            <div className="text-center">
              <Link
                to="/login"
                className={`inline-flex items-center text-sm text-blue-600 hover:text-blue-500 transition-colors duration-300 ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                <ArrowLeft className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {t.backToLogin}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
