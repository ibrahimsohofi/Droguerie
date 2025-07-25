import React from 'react';

// Loading skeleton for form fields
export const FormFieldSkeleton = ({
  type = 'input',
  label = true,
  className = ''
}) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {label && (
        <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
      )}

      {type === 'input' && (
        <div className="h-12 bg-gray-300 rounded-lg"></div>
      )}

      {type === 'textarea' && (
        <div className="h-24 bg-gray-300 rounded-lg"></div>
      )}

      {type === 'select' && (
        <div className="h-12 bg-gray-300 rounded-lg relative">
          <div className="absolute right-3 top-4 w-4 h-4 bg-gray-400 rounded"></div>
        </div>
      )}

      {type === 'checkbox' && (
        <div className="flex items-center space-x-3">
          <div className="w-4 h-4 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3"></div>
        </div>
      )}
    </div>
  );
};

// Loading skeleton for entire forms
export const FormSkeleton = ({
  fields = 4,
  showSubmitButton = true,
  className = ''
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Form Fields */}
      {[...Array(fields)].map((_, index) => (
        <FormFieldSkeleton
          key={index}
          type={index === fields - 1 ? 'textarea' : 'input'}
        />
      ))}

      {/* Submit Button */}
      {showSubmitButton && (
        <div className="animate-pulse">
          <div className="h-12 bg-gray-300 rounded-lg w-full"></div>
        </div>
      )}
    </div>
  );
};

// Enhanced input component with loading and error states
export const EnhancedInput = ({
  label,
  error,
  loading = false,
  className = '',
  required = false,
  ...props
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          {...props}
          className={`
            w-full px-4 py-3 border rounded-lg transition-all duration-300
            focus:ring-2 focus:ring-offset-1 focus:outline-none
            ${error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
            }
            ${loading ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:border-gray-400'}
            placeholder-gray-400
          `}
          disabled={loading}
        />

        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600 animate-fadeIn">
          {error}
        </p>
      )}
    </div>
  );
};

// Enhanced button component with loading states
export const EnhancedButton = ({
  children,
  loading = false,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  ...props
}) => {
  const baseClasses = "font-medium rounded-lg transition-all duration-300 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 transform active:scale-95";

  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 shadow-lg hover:shadow-xl",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-500",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-lg hover:shadow-xl",
    success: "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 shadow-lg hover:shadow-xl",
    outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white focus:ring-blue-500"
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  const isDisabled = disabled || loading;

  return (
    <button
      {...props}
      disabled={isDisabled}
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${isDisabled ? 'opacity-50 cursor-not-allowed transform-none' : 'hover:scale-105'}
        ${className}
      `}
    >
      {loading && (
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-2"></div>
      )}
      {children}
    </button>
  );
};

// Animated notification component
export const AnimatedNotification = ({
  type = 'info',
  title,
  message,
  show = false,
  onClose,
  autoClose = 5000
}) => {
  React.useEffect(() => {
    if (show && autoClose && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoClose);

      return () => clearTimeout(timer);
    }
  }, [show, autoClose, onClose]);

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  if (!show) return null;

  return (
    <div className={`
      fixed top-4 right-4 z-50 p-4 border rounded-lg shadow-lg max-w-sm
      transform transition-all duration-500 ease-out
      ${show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      ${colors[type]}
    `}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-current bg-opacity-20">
            <span className="text-lg font-bold">{icons[type]}</span>
          </div>
        </div>

        <div className="ml-3 flex-1">
          {title && (
            <h3 className="text-sm font-medium">{title}</h3>
          )}
          {message && (
            <p className="mt-1 text-sm">{message}</p>
          )}
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="ml-4 flex-shrink-0 text-current hover:opacity-75 transition-opacity"
          >
            <span className="sr-only">Close</span>
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default FormSkeleton;
