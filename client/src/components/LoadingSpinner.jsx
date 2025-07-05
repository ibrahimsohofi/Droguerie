import React from 'react';

const LoadingSpinner = ({
  size = 'md',
  color = 'blue',
  text = null,
  fullScreen = false,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorClasses = {
    blue: 'border-blue-600',
    green: 'border-green-600',
    red: 'border-red-600',
    gray: 'border-gray-600',
    white: 'border-white'
  };

  const spinner = (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className={`
          ${sizeClasses[size]}
          ${colorClasses[color]}
          border-4 border-solid border-t-transparent
          rounded-full animate-spin
        `}
      />
      {text && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

// Loading skeleton for cards
export const LoadingSkeleton = ({
  lines = 3,
  className = '',
  showImage = false
}) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {showImage && (
        <div className="w-full h-48 bg-gray-300 dark:bg-gray-700 rounded-lg mb-4"></div>
      )}
      {[...Array(lines)].map((_, i) => (
        <div
          key={i}
          className={`
            h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2
            ${i === lines - 1 ? 'w-2/3' : 'w-full'}
          `}
        />
      ))}
    </div>
  );
};

// Loading for product cards
export const ProductCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="w-full h-48 bg-gray-300 dark:bg-gray-700"></div>
      <div className="p-4">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3 mb-2"></div>
        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>
    </div>
  );
};

// Loading overlay for existing content
export const LoadingOverlay = ({ isLoading, children, text = "Loading..." }) => {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 flex items-center justify-center z-10">
          <LoadingSpinner text={text} />
        </div>
      )}
    </div>
  );
};

// Button loading state
export const LoadingButton = ({
  isLoading,
  children,
  disabled,
  className = '',
  ...props
}) => {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={`
        relative flex items-center justify-center
        ${isLoading ? 'cursor-not-allowed opacity-75' : ''}
        ${className}
      `}
    >
      {isLoading && (
        <LoadingSpinner
          size="sm"
          color="white"
          className="mr-2"
        />
      )}
      {children}
    </button>
  );
};

export default LoadingSpinner;
