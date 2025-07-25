import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const WishlistButton = ({
  productId,
  product,
  size = 'md',
  variant = 'icon', // 'icon', 'button', 'card'
  className = '',
  showTooltip = true,
  children
}) => {
  const { isInWishlist, toggleWishlist, error } = useWishlist();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);

  const inWishlist = isInWishlist(productId);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8'
  };

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    setIsLoading(true);
    try {
      const result = await toggleWishlist(productId);
      if (!result) {
        setShowError(true);
        setTimeout(() => setShowError(false), 3000);
      }
    } catch (err) {
      console.error('Error toggling wishlist:', err);
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonContent = () => {
    if (isLoading) {
      return <LoadingSpinner size="sm" color={inWishlist ? "white" : "gray"} />;
    }

    return (
      <>
        <Heart
          className={`
            ${sizeClasses[size]}
            transition-all duration-300 ease-in-out
            ${inWishlist
              ? 'fill-red-500 text-red-500 animate-pulse'
              : 'text-gray-400 hover:text-red-500'
            }
          `}
        />
        {children}
      </>
    );
  };

  if (variant === 'icon') {
    return (
      <div className="relative">
        <button
          onClick={handleWishlistToggle}
          disabled={isLoading}
          className={`
            relative p-2 rounded-full transition-all duration-300
            ${inWishlist
              ? 'bg-red-50 hover:bg-red-100 text-red-500'
              : 'bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-red-500'
            }
            ${isLoading ? 'cursor-not-allowed opacity-75' : 'hover:scale-110'}
            ${className}
          `}
          title={user ? (inWishlist ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة') : 'يجب تسجيل الدخول'}
        >
          {getButtonContent()}
        </button>

        {/* Error tooltip */}
        {showError && (
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-red-600 text-white text-xs rounded-lg shadow-lg z-50 whitespace-nowrap">
            {!user ? 'يجب تسجيل الدخول' : 'حدث خطأ، حاول مرة أخرى'}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-red-600"></div>
          </div>
        )}
      </div>
    );
  }

  if (variant === 'button') {
    return (
      <button
        onClick={handleWishlistToggle}
        disabled={isLoading}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300
          ${inWishlist
            ? 'bg-red-500 hover:bg-red-600 text-white'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-red-500'
          }
          ${isLoading ? 'cursor-not-allowed opacity-75' : ''}
          ${className}
        `}
      >
        {getButtonContent()}
        <span className="text-sm">
          {inWishlist ? 'في المفضلة' : 'إضافة للمفضلة'}
        </span>
      </button>
    );
  }

  if (variant === 'card') {
    return (
      <button
        onClick={handleWishlistToggle}
        disabled={isLoading}
        className={`
          absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full
          shadow-md transition-all duration-300 hover:scale-110 hover:bg-white
          ${inWishlist ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}
          ${isLoading ? 'cursor-not-allowed opacity-75' : ''}
          ${className}
        `}
        title={user ? (inWishlist ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة') : 'يجب تسجيل الدخول'}
      >
        {getButtonContent()}
      </button>
    );
  }

  return null;
};

// Wishlist counter component for navbar
export const WishlistCounter = ({ className = '' }) => {
  const { wishlistCount, isLoading } = useWishlist();
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className={`relative ${className}`}>
      <Heart className="w-6 h-6 text-gray-600" />
      {isLoading ? (
        <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
          <LoadingSpinner size="sm" color="white" />
        </div>
      ) : wishlistCount > 0 ? (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
          {wishlistCount > 99 ? '99+' : wishlistCount}
        </span>
      ) : null}
    </div>
  );
};

// Wishlist status indicator
export const WishlistStatus = ({ productId, className = '' }) => {
  const { isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(productId);

  if (!inWishlist) return null;

  return (
    <div className={`flex items-center gap-1 text-red-500 text-sm ${className}`}>
      <Heart className="w-4 h-4 fill-current" />
      <span>في المفضلة</span>
    </div>
  );
};

export default WishlistButton;
