import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTranslations } from '../translations';
import SocialLogin from '../components/SocialLogin';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');

  const { login, resetPassword, isAuthenticated, error: authError } = useAuth();
  const { language, isRTL } = useLanguage();
  const t = useTranslations(language);
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = language === 'ar' ? 'البريد الإلكتروني مطلوب' : 'Email requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = language === 'ar' ? 'البريد الإلكتروني غير صحيح' : 'Email invalide';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = language === 'ar' ? 'كلمة المرور مطلوبة' : 'Mot de passe requis';
    } else if (formData.password.length < 6) {
      newErrors.password = language === 'ar' ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' : 'Le mot de passe doit contenir au moins 6 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const result = await login(formData.email, formData.password);

      if (result.success) {
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
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

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    if (!resetEmail) {
      setResetMessage(language === 'ar' ? 'الرجاء إدخال البريد الإلكتروني' : 'Veuillez entrer votre email');
      return;
    }

    try {
      const result = await resetPassword(resetEmail);
      if (result.success) {
        setResetMessage(result.message);
        setTimeout(() => {
          setShowResetForm(false);
          setResetMessage('');
          setResetEmail('');
        }, 3000);
      }
    } catch (error) {
      setResetMessage(error.message);
    }
  };

  // Demo credentials helper
  const fillDemoCredentials = (role) => {
    if (role === 'admin') {
      setFormData({
        email: 'admin@drogueriejamal.ma',
        password: 'admin123'
      });
    } else {
      setFormData({
        email: 'user@example.com',
        password: 'user123'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {language === 'ar' ? 'تسجيل الدخول' : 'Connexion'}
          </h1>
          <p className="text-gray-600">
            {language === 'ar' ? 'مرحباً بك في دروغري جمال' : 'Bienvenue chez Droguerie Jamal'}
          </p>
        </div>

        {/* Demo Credentials Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">
            {language === 'ar' ? 'حسابات تجريبية:' : 'Comptes de démonstration:'}
          </h3>
          <div className="space-y-2">
            <button
              onClick={() => fillDemoCredentials('admin')}
              className="w-full text-left bg-blue-100 hover:bg-blue-200 px-3 py-2 rounded text-sm transition-colors duration-200"
            >
              <strong>{language === 'ar' ? 'مدير:' : 'Admin:'}</strong> admin@drogueriejamal.ma / admin123
            </button>
            <button
              onClick={() => fillDemoCredentials('user')}
              className="w-full text-left bg-green-100 hover:bg-green-200 px-3 py-2 rounded text-sm transition-colors duration-200"
            >
              <strong>{language === 'ar' ? 'مستخدم:' : 'Utilisateur:'}</strong> user@example.com / user123
            </button>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-8">
            {/* Display auth errors */}
            {authError && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
                <span className="text-red-700">{authError}</span>
              </div>
            )}

            {!showResetForm ? (
              <>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'البريد الإلكتروني' : 'Adresse email'}
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder={language === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Entrez votre email'}
                      dir={isRTL ? 'rtl' : 'ltr'}
                    />
                    <Mail className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-3.5 h-5 w-5 text-gray-400`} />
                  </div>
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'كلمة المرور' : 'Mot de passe'}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 ${isRTL ? 'pr-12 pl-12' : 'pl-12 pr-12'} border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 ${
                        errors.password ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder={language === 'ar' ? 'أدخل كلمة المرور' : 'Entrez votre mot de passe'}
                    />
                    <Lock className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-3.5 h-5 w-5 text-gray-400`} />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute ${isRTL ? 'left-4' : 'right-4'} top-3.5 text-gray-400 hover:text-gray-600 transition-colors duration-200`}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Remember & Forgot Password */}
                <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <span className={`text-sm text-gray-600 ${isRTL ? 'mr-2' : 'ml-2'}`}>
                      {language === 'ar' ? 'تذكرني' : 'Se souvenir de moi'}
                    </span>
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-orange-600 hover:text-orange-800 transition-colors duration-200"
                  >
                    {language === 'ar' ? 'نسيت كلمة المرور؟' : 'Mot de passe oublié?'}
                  </Link>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      {language === 'ar' ? 'جاري تسجيل الدخول...' : 'Connexion en cours...'}
                    </>
                  ) : (
                    language === 'ar' ? 'تسجيل الدخول' : 'Se connecter'
                  )}
                </button>
              </form>

              {/* Social Login Section */}
              <div className="mt-6">
                <SocialLogin
                  onSuccess={(data) => {
                    console.log('Social login successful:', data);
                  }}
                  onError={(error) => {
                    console.error('Social login error:', error);
                  }}
                />
              </div>
              </>
            ) : (
              /* Password Reset Form */
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {language === 'ar' ? 'إعادة تعيين كلمة المرور' : 'Réinitialiser le mot de passe'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {language === 'ar'
                    ? 'أدخل بريدك الإلكتروني وسنرسل لك تعليمات إعادة تعيين كلمة المرور'
                    : 'Entrez votre email et nous vous enverrons les instructions pour réinitialiser votre mot de passe'
                  }
                </p>

                <form onSubmit={handlePasswordReset} className="space-y-4">
                  <div>
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder={language === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Entrez votre email'}
                    />
                  </div>

                  {resetMessage && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-green-700">{resetMessage}</span>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-300"
                    >
                      {language === 'ar' ? 'إرسال' : 'Envoyer'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowResetForm(false);
                        setResetMessage('');
                        setResetEmail('');
                      }}
                      className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 py-3 px-4 rounded-lg font-medium transition-colors duration-300"
                    >
                      {language === 'ar' ? 'إلغاء' : 'Annuler'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Register Link */}
          {!showResetForm && (
            <div className="px-8 py-4 bg-gray-50 border-t border-gray-200">
              <p className="text-center text-sm text-gray-600">
                {language === 'ar' ? 'ليس لديك حساب؟' : 'Vous n\'avez pas de compte?'}{' '}
                <Link
                  to="/register"
                  className="text-orange-600 hover:text-orange-800 font-medium transition-colors duration-200"
                >
                  {language === 'ar' ? 'إنشاء حساب جديد' : 'Créer un compte'}
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
