import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const SocialLogin = ({ onSuccess, onError, variant = 'default' }) => {
  const [isLoading, setIsLoading] = useState({ google: false, facebook: false });
  const { login } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const translations = {
    en: {
      googleLogin: 'Continue with Google',
      facebookLogin: 'Continue with Facebook',
      or: 'or',
      loginWith: 'Login with',
      signupWith: 'Sign up with'
    },
    fr: {
      googleLogin: 'Continuer avec Google',
      facebookLogin: 'Continuer avec Facebook',
      or: 'ou',
      loginWith: 'Se connecter avec',
      signupWith: 'S\'inscrire avec'
    },
    ar: {
      googleLogin: 'المتابعة مع جوجل',
      facebookLogin: 'المتابعة مع فيسبوك',
      or: 'أو',
      loginWith: 'تسجيل الدخول مع',
      signupWith: 'إنشاء حساب مع'
    }
  };

  const t = translations[language] || translations.en;

  // Google Login Success Handler
  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(prev => ({ ...prev, google: true }));

    try {
      // Send the credential to backend for verification
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credential: credentialResponse.credential
        })
      });

      if (response.ok) {
        const data = await response.json();
        await login(data.user, data.token);
        onSuccess?.(data);
        navigate('/dashboard');
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Google login failed');
      }
    } catch (error) {
      console.error('Google login error:', error);
      onError?.(error.message || 'Google login failed. Please try again.');
    } finally {
      setIsLoading(prev => ({ ...prev, google: false }));
    }
  };

  // Google Login Error Handler
  const handleGoogleError = () => {
    console.error('Google login failed');
    onError?.('Google login failed. Please try again.');
    setIsLoading(prev => ({ ...prev, google: false }));
  };

  // Facebook Login Success Handler
  const handleFacebookSuccess = async (response) => {
    setIsLoading(prev => ({ ...prev, facebook: true }));

    try {
      // Send Facebook access token to backend for verification
      const backendResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/facebook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessToken: response.accessToken,
          userID: response.userID
        })
      });

      if (backendResponse.ok) {
        const data = await backendResponse.json();
        await login(data.user, data.token);
        onSuccess?.(data);
        navigate('/dashboard');
      } else {
        const error = await backendResponse.json();
        throw new Error(error.message || 'Facebook login failed');
      }
    } catch (error) {
      console.error('Facebook login error:', error);
      onError?.(error.message || 'Facebook login failed. Please try again.');
    } finally {
      setIsLoading(prev => ({ ...prev, facebook: false }));
    }
  };

  // Facebook Login Error Handler
  const handleFacebookError = (error) => {
    console.error('Facebook login failed:', error);
    onError?.('Facebook login failed. Please try again.');
    setIsLoading(prev => ({ ...prev, facebook: false }));
  };

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-3">
        {/* Google Login Button - Compact */}
        <div className="flex-1">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            size="medium"
            shape="rectangular"
            theme="outline"
            text="continue_with"
            locale={language}
          />
        </div>

        {/* Facebook Login Button - Compact */}
        <FacebookLogin
          appId={import.meta.env.VITE_FACEBOOK_APP_ID}
          autoLoad={false}
          fields="name,email,picture"
          callback={handleFacebookSuccess}
          onFailure={handleFacebookError}
          render={(renderProps) => (
            <button
              onClick={renderProps.onClick}
              disabled={isLoading.facebook || renderProps.disabled}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:hover:bg-gray-800"
            >
              {isLoading.facebook ? (
                <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              )}
            </button>
          )}
        />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Google Login Button */}
      <div className="w-full">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          size="large"
          shape="rectangular"
          theme="outline"
          text="continue_with"
          locale={language}
          width="100%"
        />
      </div>

      {/* Facebook Login Button */}
      <FacebookLogin
        appId={import.meta.env.VITE_FACEBOOK_APP_ID}
        autoLoad={false}
        fields="name,email,picture"
        callback={handleFacebookSuccess}
        onFailure={handleFacebookError}
        render={(renderProps) => (
          <button
            onClick={renderProps.onClick}
            disabled={isLoading.facebook || renderProps.disabled}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] dark:border-gray-600 dark:hover:bg-gray-800"
          >
            {isLoading.facebook ? (
              <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
            ) : (
              <svg className="w-6 h-6" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            )}
            <span className="font-medium text-gray-700 dark:text-gray-200">
              {isLoading.facebook ? 'Connecting...' : t.facebookLogin}
            </span>
          </button>
        )}
      />

      {/* Divider */}
      <div className="relative flex items-center justify-center py-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300 dark:border-gray-600" />
        </div>
        <div className="relative bg-white dark:bg-gray-900 px-4">
          <span className="text-sm text-gray-500 dark:text-gray-400">{t.or}</span>
        </div>
      </div>
    </div>
  );
};

export default SocialLogin;
