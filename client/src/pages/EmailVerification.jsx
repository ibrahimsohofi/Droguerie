import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { LanguageContext } from '../context/LanguageContext';
import { AuthContext } from '../context/AuthContext';

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useContext(LanguageContext);
  const { user, login } = useContext(AuthContext);

  const [status, setStatus] = useState('verifying'); // verifying, success, error, not_found
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    } else {
      setStatus('not_found');
      setMessage('Invalid verification link');
    }
  }, [token]);

  // Cooldown timer for resend button
  useEffect(() => {
    let interval;
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const verifyEmail = async (verificationToken) => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/verify-email/${verificationToken}`);
      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setMessage('Your email has been verified successfully!');

        // Auto-redirect to login if not logged in
        if (!user) {
          setTimeout(() => {
            navigate('/login', {
              state: {
                message: 'Email verified successfully! You can now log in.',
                email: data.data.email
              }
            });
          }, 3000);
        }
      } else {
        setStatus('error');
        setMessage(data.message || 'Email verification failed');
      }
    } catch (error) {
      console.error('Error verifying email:', error);
      setStatus('error');
      setMessage('Error verifying email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async () => {
    if (!user) {
      navigate('/login', { state: { message: 'Please log in to resend verification email' } });
      return;
    }

    try {
      setResendLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Verification email sent! Please check your inbox.');
        setResendCooldown(60); // 60 second cooldown
      } else {
        setMessage(data.message || 'Failed to send verification email');
      }
    } catch (error) {
      console.error('Error resending verification:', error);
      setMessage('Error sending verification email. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  const renderIcon = () => {
    switch (status) {
      case 'verifying':
        return (
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        );
      case 'success':
        return (
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'error':
        return (
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        );
    }
  };

  const getTitle = () => {
    switch (status) {
      case 'verifying':
        return 'Verifying Email...';
      case 'success':
        return 'Email Verified!';
      case 'error':
        return 'Verification Failed';
      default:
        return 'Email Verification';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      case 'verifying':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Icon */}
          {renderIcon()}

          {/* Title */}
          <h2 className={`text-center text-3xl font-extrabold ${getStatusColor()}`}>
            {getTitle()}
          </h2>

          {/* Message */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">{message}</p>
          </div>

          {/* Success Actions */}
          {status === 'success' && (
            <div className="mt-6 space-y-4">
              {!user ? (
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-4">
                    Redirecting to login page in 3 seconds...
                  </p>
                  <Link
                    to="/login"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Continue to Login
                  </Link>
                </div>
              ) : (
                <div className="text-center">
                  <Link
                    to="/"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Continue Shopping
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Error Actions */}
          {status === 'error' && (
            <div className="mt-6 space-y-4">
              {user && (
                <button
                  onClick={resendVerification}
                  disabled={resendLoading || resendCooldown > 0}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resendLoading && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  )}
                  {resendCooldown > 0
                    ? `Resend in ${resendCooldown}s`
                    : resendLoading
                      ? 'Sending...'
                      : 'Resend Verification Email'
                  }
                </button>
              )}

              <Link
                to="/contact"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Contact Support
              </Link>
            </div>
          )}

          {/* Not Found Actions */}
          {status === 'not_found' && (
            <div className="mt-6 space-y-4">
              <div className="text-center text-sm text-gray-600">
                <p className="mb-4">The verification link appears to be invalid or expired.</p>

                {user ? (
                  <button
                    onClick={resendVerification}
                    disabled={resendLoading || resendCooldown > 0}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed mb-3"
                  >
                    {resendLoading && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    )}
                    {resendCooldown > 0
                      ? `Resend in ${resendCooldown}s`
                      : resendLoading
                        ? 'Sending...'
                        : 'Request New Verification Email'
                    }
                  </button>
                ) : (
                  <p className="mb-4">
                    Please <Link to="/login" className="text-blue-600 hover:text-blue-500">log in</Link> to request a new verification email.
                  </p>
                )}
              </div>

              <Link
                to="/"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back to Home
              </Link>
            </div>
          )}

          {/* Help Section */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              Need help? Visit our{' '}
              <Link to="/faq" className="text-blue-600 hover:text-blue-500">
                FAQ page
              </Link>{' '}
              or{' '}
              <Link to="/contact" className="text-blue-600 hover:text-blue-500">
                contact support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
