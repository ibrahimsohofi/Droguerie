import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

  // Google Login Handler
  const handleGoogleLogin = async () => {
    setIsLoading(prev => ({ ...prev, google: true }));

    try {
      // In a real implementation, you would integrate with Google OAuth
      // For demo purposes, this is a mock implementation

      // Mock Google OAuth response
      const mockGoogleResponse = {
        user: {
          id: 'google_' + Math.random().toString(36).substr(2, 9),
          email: 'user@gmail.com',
          name: 'John Doe',
          avatar: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
          provider: 'google'
        },
        token: 'mock_google_token_' + Date.now()
      };

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Send to backend for verification and account creation/login
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          googleToken: mockGoogleResponse.token,
          userInfo: mockGoogleResponse.user
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

  // Facebook Login Handler
  const handleFacebookLogin = async () => {
    setIsLoading(prev => ({ ...prev, facebook: true }));

    try {
      // In a real implementation, you would integrate with Facebook SDK
      // For demo purposes, this is a mock implementation

      // Mock Facebook OAuth response
      const mockFacebookResponse = {
        user: {
          id: 'facebook_' + Math.random().toString(36).substr(2, 9),
          email: 'user@facebook.com',
          name: 'Jane Smith',
          avatar: 'https://graph.facebook.com/v12.0/me/picture?type=large',
          provider: 'facebook'
        },
        token: 'mock_facebook_token_' + Date.now()
      };

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Send to backend for verification and account creation/login
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/facebook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          facebookToken: mockFacebookResponse.token,
          userInfo: mockFacebookResponse.user
        })
      });

      if (response.ok) {
        const data = await response.json();
        await login(data.user, data.token);
        onSuccess?.(data);
        navigate('/dashboard');
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Facebook login failed');
      }
    } catch (error) {
      console.error('Facebook login error:', error);
      onError?.(error.message || 'Facebook login failed. Please try again.');
    } finally {
      setIsLoading(prev => ({ ...prev, facebook: false }));
    }
  };

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-3">
        <button
          onClick={handleGoogleLogin}
          disabled={isLoading.google || isLoading.facebook}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:hover:bg-gray-800"
        >
          {isLoading.google ? (
            <div className="w-5 h-5 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin" />
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          )}
        </button>

        <button
          onClick={handleFacebookLogin}
          disabled={isLoading.google || isLoading.facebook}
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
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Google Login Button */}
      <button
        onClick={handleGoogleLogin}
        disabled={isLoading.google || isLoading.facebook}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] dark:border-gray-600 dark:hover:bg-gray-800"
      >
        {isLoading.google ? (
          <div className="w-5 h-5 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin" />
        ) : (
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        )}
        <span className="font-medium text-gray-700 dark:text-gray-200">
          {isLoading.google ? 'Connecting...' : t.googleLogin}
        </span>
      </button>

      {/* Facebook Login Button */}
      <button
        onClick={handleFacebookLogin}
        disabled={isLoading.google || isLoading.facebook}
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
