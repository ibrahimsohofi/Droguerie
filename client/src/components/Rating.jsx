import React, { useState } from 'react';
import { Star } from 'lucide-react';

const Rating = ({
  value = 0,
  onChange = null,
  readonly = false,
  size = 'md',
  showValue = false,
  precision = 1,
  className = ''
}) => {
  const [hoverValue, setHoverValue] = useState(0);
  const [currentValue, setCurrentValue] = useState(value);

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-4 h-4';
      case 'md':
        return 'w-5 h-5';
      case 'lg':
        return 'w-6 h-6';
      case 'xl':
        return 'w-8 h-8';
      default:
        return 'w-5 h-5';
    }
  };

  const handleClick = (rating) => {
    if (!readonly && onChange) {
      const newValue = precision === 0.5 ? rating : Math.ceil(rating);
      setCurrentValue(newValue);
      onChange(newValue);
    }
  };

  const handleMouseEnter = (rating) => {
    if (!readonly) {
      setHoverValue(rating);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverValue(0);
    }
  };

  const displayValue = hoverValue || currentValue;

  const getStarFill = (starIndex) => {
    const fillValue = displayValue - starIndex;
    if (fillValue >= 1) return 'full';
    if (fillValue >= 0.5) return 'half';
    return 'empty';
  };

  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const fill = getStarFill(star - 1);
          return (
            <button
              key={star}
              type="button"
              className={`${!readonly ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform duration-150`}
              onClick={() => handleClick(star)}
              onMouseEnter={() => handleMouseEnter(star)}
              onMouseLeave={handleMouseLeave}
              disabled={readonly}
            >
              <div className="relative">
                <Star
                  className={`${getSizeClasses()} text-gray-300`}
                  fill="currentColor"
                />
                {fill === 'full' && (
                  <Star
                    className={`${getSizeClasses()} text-yellow-400 absolute inset-0`}
                    fill="currentColor"
                  />
                )}
                {fill === 'half' && (
                  <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
                    <Star
                      className={`${getSizeClasses()} text-yellow-400`}
                      fill="currentColor"
                    />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {showValue && (
        <span className="ml-2 text-sm text-gray-600">
          {displayValue.toFixed(1)} / 5
        </span>
      )}
    </div>
  );
};

export const StarRating = ({ rating, reviews, className = '' }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <Rating value={rating} readonly showValue />
      {reviews && (
        <span className="ml-2 text-sm text-gray-500">
          ({reviews} reviews)
        </span>
      )}
    </div>
  );
};

export default Rating;
