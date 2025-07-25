import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import LoadingSpinner from '../components/LoadingSpinner';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(null);
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [errors, setErrors] = useState({});
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { language, isRTL } = useLanguage();

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const content = {
    ar: {
      title: 'إعادة تعيين كلمة المرور',
      subtitle: 'أدخل كلمة المرور الجديدة',
      passwordLabel: 'كلمة المرور الجديدة',
      confirmPasswordLabel: 'تأكيد كلمة المرور',
      passwordPlaceholder: 'أدخل كلمة المرور الجديدة',
      confirmPasswordPlaceholder: 'أكد كلمة المرور الجديدة',
      resetButton: 'إعادة تعيين كلمة المرور',
      backToLogin: 'العودة لتسجيل الدخول',
      successTitle: 'تم تغيير كلمة المرور!',
      successMessage: 'تم تغيير كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة.',
      invalidTokenTitle: 'الرابط غير صالح',
      invalidTokenMessage: 'رابط إعادة تعيين كلمة المرور غير صالح أو منتهي الصلاحية.',
      requestNewLink: 'طلب رابط جديد',
      requirements: {
        title: 'متطلبات كلمة المرور:',
        minLength: 'على الأقل 8 أحرف',
        uppercase: 'حرف كبير واحد على الأقل',
        lowercase: 'حرف صغير واحد على الأقل',
        number: 'رقم واحد على الأقل',
        special: 'رمز خاص واحد على الأقل'
      },
      errors: {
        required: 'كلمة المرور مطلوبة',
        minLength: 'كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل',
        uppercase: 'كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل',
        lowercase: 'كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل',
        number: 'كلمة المرور يجب أن تحتوي على رقم واحد على الأقل',
        special: 'كلمة المرور يجب أن تحتوي على رمز خاص واحد على الأقل',
        confirmRequired: 'تأكيد كلمة المرور مطلوب',
        mismatch: 'كلمات المرور غير متطابقة',
        serverError: 'حدث خطأ في الخادم. يرجى المحاولة لاحقاً'
      }
    },
    fr: {
      title: 'Réinitialisation du mot de passe',
      subtitle: 'Entrez votre nouveau mot de passe',
      passwordLabel: 'Nouveau mot de passe',
      confirmPasswordLabel: 'Confirmer le mot de passe',
      passwordPlaceholder: 'Entrez votre nouveau mot de passe',
      confirmPasswordPlaceholder: 'Confirmez votre nouveau mot de passe',
      resetButton: 'Réinitialiser le mot de passe',
      backToLogin: 'Retour à la connexion',
      successTitle: 'Mot de passe modifié !',
      successMessage: 'Votre mot de passe a été modifié avec succès. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.',
      invalidTokenTitle: 'Lien invalide',
      invalidTokenMessage: 'Le lien de réinitialisation est invalide ou a expiré.',
      requestNewLink: 'Demander un nouveau lien',
      requirements: {
        title: 'Exigences du mot de passe :',
        minLength: 'Au moins 8 caractères',
        uppercase: 'Au moins une lettre majuscule',
        lowercase: 'Au moins une lettre minuscule',
        number: 'Au moins un chiffre',
        special: 'Au moins un caractère spécial'
      },
      errors: {
        required: 'Le mot de passe est requis',
        minLength: 'Le mot de passe doit contenir au moins 8 caractères',
        uppercase: 'Le mot de passe doit contenir au moins une lettre majuscule',
        lowercase: 'Le mot de passe doit contenir au moins une lettre minuscule',
        number: 'Le mot de passe doit contenir au moins un chiffre',
        special: 'Le mot de passe doit contenir au moins un caractère spécial',
        confirmRequired: 'La confirmation du mot de passe est requise',
        mismatch: 'Les mots de passe ne correspondent pas',
        serverError: 'Erreur serveur. Veuillez réessayer plus tard'
      }
    }
  };

  const t = content[language] || content.fr;

  useEffect(() => {
    if (!token || !email) {
      setIsTokenValid(false);
      return;
    }

    // Validate token with backend
    const validateToken = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/verify-reset-token/${token}`);
        const data = await response.json();

        setIsTokenValid(data.success);
      } catch (error) {
        console.error('Token validation error:', error);
        setIsTokenValid(false);
      }
    };

    validateToken();
  }, [token, email]);

  const validatePassword = (password) => {
    const errors = {};

    if (!password) {
      errors.password = t.errors.required;
    } else {
      if (password.length < 8) {
        errors.password = t.errors.minLength;
      } else if (!/[A-Z]/.test(password)) {
        errors.password = t.errors.uppercase;
      } else if (!/[a-z]/.test(password)) {
        errors.password = t.errors.lowercase;
      } else if (!/\d/.test(password)) {
        errors.password = t.errors.number;
      } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.password = t.errors.special;
      }
    }

    if (!confirmPassword) {
      errors.confirmPassword = t.errors.confirmRequired;
    } else if (password !== confirmPassword) {
      errors.confirmPassword = t.errors.mismatch;
    }

    return errors;
  };

  const getPasswordStrength = (password) => {
    const requirements = [
      password.length >= 8,
      /[A-Z]/.test(password),
      /[a-z]/.test(password),
      /\d/.test(password),
      /[!@#$%^&*(),.?":{}|<>]/.test(password)
    ];

    return requirements.filter(Boolean).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validatePassword(password);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/reset-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          email,
          password,
        }),
      });

      if (response.ok) {
        setIsPasswordReset(true);
      } else {
        const errorData = await response.json();
        setErrors({ general: errorData.message || t.errors.serverError });
      }
    } catch (error) {
      console.error('Password reset error:', error);
      setErrors({ general: t.errors.serverError });
    } finally {
      setIsLoading(false);
    }
  };

  if (isTokenValid === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow rounded-lg sm:px-10 text-center">
            <LoadingSpinner size="lg" className="mx-auto mb-4" />
            <p className="text-gray-600">
              {language === 'ar' ? 'جاري التحقق من الرابط...' : 'Vérification du lien...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!isTokenValid) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow rounded-lg sm:px-10">
            <div className="text-center">
              <AlertCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t.invalidTokenTitle}
              </h2>
              <p className="text-gray-600 mb-6">
                {t.invalidTokenMessage}
              </p>
              <div className="space-y-4">
                <Link
                  to="/forgot-password"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
                >
                  {t.requestNewLink}
                </Link>
                <Link
                  to="/login"
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
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

  if (isPasswordReset) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow rounded-lg sm:px-10">
            <div className="text-center">
              <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t.successTitle}
              </h2>
              <p className="text-gray-600 mb-6">
                {t.successMessage}
              </p>
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
    );
  }

  const passwordStrength = getPasswordStrength(password);
  const strengthColors = ['bg-red-500', 'bg-red-400', 'bg-yellow-500', 'bg-yellow-400', 'bg-green-500'];
  const strengthLabels = [
    language === 'ar' ? 'ضعيف جداً' : 'Très faible',
    language === 'ar' ? 'ضعيف' : 'Faible',
    language === 'ar' ? 'متوسط' : 'Moyen',
    language === 'ar' ? 'جيد' : 'Bon',
    language === 'ar' ? 'قوي' : 'Fort'
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow rounded-lg sm:px-10">
          <div className={`text-center mb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
            <Lock className="mx-auto h-12 w-12 text-blue-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t.title}
            </h2>
            <p className="text-gray-600">
              {t.subtitle}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{errors.general}</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                {t.passwordLabel}
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.passwordPlaceholder}
                  className={`appearance-none block w-full px-3 py-2 pr-10 border ${errors.password ? 'border-red-300' : 'border-gray-300'} rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300 ${isRTL ? 'text-right' : 'text-left'}`}
                  dir={isRTL ? 'rtl' : 'ltr'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}

              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-2">
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-2 flex-1 rounded ${
                          level <= passwordStrength
                            ? strengthColors[passwordStrength - 1]
                            : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="mt-1 text-xs text-gray-600">
                    {strengthLabels[passwordStrength - 1] || strengthLabels[0]}
                  </p>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                {t.confirmPasswordLabel}
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t.confirmPasswordPlaceholder}
                  className={`appearance-none block w-full px-3 py-2 pr-10 border ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'} rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300 ${isRTL ? 'text-right' : 'text-left'}`}
                  dir={isRTL ? 'rtl' : 'ltr'}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Password Requirements */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                {t.requirements.title}
              </h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li className={password.length >= 8 ? 'text-green-600' : ''}>
                  • {t.requirements.minLength}
                </li>
                <li className={/[A-Z]/.test(password) ? 'text-green-600' : ''}>
                  • {t.requirements.uppercase}
                </li>
                <li className={/[a-z]/.test(password) ? 'text-green-600' : ''}>
                  • {t.requirements.lowercase}
                </li>
                <li className={/\d/.test(password) ? 'text-green-600' : ''}>
                  • {t.requirements.number}
                </li>
                <li className={/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'text-green-600' : ''}>
                  • {t.requirements.special}
                </li>
              </ul>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading || passwordStrength < 4}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" color="white" />
                ) : (
                  t.resetButton
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

export default ResetPassword;
