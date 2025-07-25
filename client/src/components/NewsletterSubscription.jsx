import React, { useState } from 'react';
import { Mail, Check, X, Gift } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from './ToastProvider';

const NewsletterSubscription = ({
  variant = 'default', // 'default', 'modal', 'inline', 'footer'
  showDiscount = true,
  onClose
}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { language } = useLanguage();
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          language,
          source: variant
        }),
      });

      if (response.ok) {
        setIsSubscribed(true);
        addToast({
          type: 'success',
          title: 'Successfully subscribed!',
          message: showDiscount ? 'Check your email for a 10% discount code.' : 'Thank you for subscribing to our newsletter.',
        });

        setTimeout(() => {
          onClose && onClose();
        }, 2000);
      } else {
        const data = await response.json();
        addToast({
          type: 'error',
          title: 'Subscription failed',
          message: data.message || 'Please try again later.',
        });
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Network error',
        message: 'Please check your connection and try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'modal':
        return {
          container: 'bg-white rounded-xl shadow-2xl max-w-md mx-auto overflow-hidden',
          content: 'p-8 text-center',
          background: 'bg-gradient-to-br from-blue-50 to-indigo-100'
        };
      case 'inline':
        return {
          container: 'bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg',
          content: 'p-6 text-white',
          background: ''
        };
      case 'footer':
        return {
          container: 'bg-gray-900 rounded-lg',
          content: 'p-6 text-white',
          background: ''
        };
      default:
        return {
          container: 'bg-white border border-gray-200 rounded-lg shadow-sm',
          content: 'p-6',
          background: ''
        };
    }
  };

  const styles = getVariantStyles();

  if (isSubscribed) {
    return (
      <div className={`${styles.container} ${styles.background}`}>
        <div className={styles.content}>
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Welcome aboard!</h3>
          <p className="text-gray-600 mb-4">
            You've successfully joined our newsletter.
          </p>
          {showDiscount && (
            <div className="flex items-center justify-center space-x-2 text-green-600 font-medium">
              <Gift className="w-5 h-5" />
              <span>10% discount code sent to your email!</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${styles.background} relative`}>
      {variant === 'modal' && onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>
      )}

      <div className={styles.content}>
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full">
          <Mail className="w-8 h-8 text-blue-600" />
        </div>

        <h3 className="text-xl font-semibold mb-2 text-center">
          {variant === 'modal' ? 'Stay Updated!' : 'Join Our Newsletter'}
        </h3>

        <p className={`text-center mb-6 ${variant === 'inline' || variant === 'footer' ? 'text-gray-100' : 'text-gray-600'}`}>
          Get the latest updates on new products, exclusive offers, and health tips delivered to your inbox.
        </p>

        {showDiscount && (
          <div className={`flex items-center justify-center space-x-2 mb-4 p-3 rounded-lg ${
            variant === 'inline' || variant === 'footer'
              ? 'bg-white/20 text-yellow-100'
              : 'bg-yellow-50 text-yellow-800'
          }`}>
            <Gift className="w-5 h-5" />
            <span className="font-medium">Get 10% off your first order!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                variant === 'inline' || variant === 'footer'
                  ? 'bg-white/90 border-white/30 placeholder-gray-500'
                  : 'border-gray-300 placeholder-gray-400'
              }`}
              disabled={isLoading}
            />
            {isLoading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={!email || isLoading}
            className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
              variant === 'inline' || variant === 'footer'
                ? 'bg-white text-blue-600 hover:bg-gray-100'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoading ? 'Subscribing...' : 'Subscribe Now'}
          </button>
        </form>

        <p className={`text-xs text-center mt-4 ${
          variant === 'inline' || variant === 'footer' ? 'text-gray-200' : 'text-gray-500'
        }`}>
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </div>
  );
};

// Modal wrapper component
export const NewsletterModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md mx-4">
        <NewsletterSubscription variant="modal" onClose={onClose} />
      </div>
    </div>
  );
};

// Hook for newsletter popup logic
export const useNewsletterPopup = () => {
  const [showPopup, setShowPopup] = useState(false);

  React.useEffect(() => {
    const hasSeenPopup = localStorage.getItem('newsletter-popup-seen');
    const lastShown = localStorage.getItem('newsletter-popup-last-shown');
    const now = Date.now();
    const dayInMs = 24 * 60 * 60 * 1000;

    if (!hasSeenPopup || (lastShown && now - parseInt(lastShown) > dayInMs * 7)) {
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 30000); // Show after 30 seconds

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setShowPopup(false);
    localStorage.setItem('newsletter-popup-seen', 'true');
    localStorage.setItem('newsletter-popup-last-shown', Date.now().toString());
  };

  return { showPopup, handleClose };
};

export default NewsletterSubscription;
