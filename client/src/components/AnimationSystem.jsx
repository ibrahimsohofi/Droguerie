import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';

// Enhanced Fade In Animation Component with micro-interactions
export const FadeIn = ({
  children,
  delay = 0,
  duration = 500,
  className = '',
  trigger = 'immediate', // 'immediate', 'scroll', 'hover'
  direction = 'up', // 'up', 'down', 'left', 'right', 'scale'
  distance = 30
}) => {
  const [isVisible, setIsVisible] = useState(trigger === 'immediate');
  const [isHovered, setIsHovered] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    if (trigger === 'scroll') {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => setIsVisible(true), delay);
          }
        },
        { threshold: 0.1, rootMargin: '50px' }
      );

      if (elementRef.current) {
        observer.observe(elementRef.current);
      }

      return () => observer.disconnect();
    } else if (trigger === 'immediate') {
      setTimeout(() => setIsVisible(true), delay);
    }
  }, [delay, trigger]);

  const getTransformClasses = () => {
    if (!isVisible) {
      switch (direction) {
        case 'up': return `translate-y-${distance}`;
        case 'down': return `-translate-y-${distance}`;
        case 'left': return `translate-x-${distance}`;
        case 'right': return `-translate-x-${distance}`;
        case 'scale': return 'scale-95';
        default: return `translate-y-${distance}`;
      }
    }
    return 'translate-y-0 translate-x-0 scale-100';
  };

  return (
    <div
      ref={elementRef}
      className={`
        transition-all ease-out mobile-optimized
        ${duration <= 300 ? 'duration-300' : duration <= 500 ? 'duration-500' : 'duration-700'}
        ${isVisible ? 'opacity-100' : 'opacity-0'}
        ${getTransformClasses()}
        ${isHovered ? 'scale-105' : ''}
        ${className}
      `}
      style={{
        transitionDelay: `${delay}ms`,
        transformOrigin: 'center'
      }}
      onMouseEnter={() => {
        if (trigger === 'hover') setIsVisible(true);
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        if (trigger === 'hover') setIsVisible(false);
        setIsHovered(false);
      }}
    >
      {children}
    </div>
  );
};

// Slide In Animation Component
export const SlideIn = ({
  children,
  direction = 'left', // 'left', 'right', 'up', 'down'
  delay = 0,
  duration = 500,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  const getTransform = () => {
    if (!isVisible) {
      switch (direction) {
        case 'left': return '-translate-x-8';
        case 'right': return 'translate-x-8';
        case 'up': return '-translate-y-8';
        case 'down': return 'translate-y-8';
        default: return '-translate-x-8';
      }
    }
    return 'translate-x-0 translate-y-0';
  };

  return (
    <div
      ref={elementRef}
      className={`
        transition-all duration-${duration} ease-out
        ${isVisible ? 'opacity-100' : 'opacity-0'}
        ${getTransform()}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

// Bounce Animation Component
export const Bounce = ({ children, active = false, className = '' }) => {
  return (
    <div
      className={`
        transition-transform duration-300 ease-out
        ${active ? 'animate-bounce' : 'hover:animate-bounce'}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

// Pulse Animation Component
export const Pulse = ({ children, active = false, className = '' }) => {
  return (
    <div
      className={`
        transition-all duration-1000
        ${active ? 'animate-pulse' : 'hover:animate-pulse'}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

// Scale on Hover Component
export const ScaleOnHover = ({
  children,
  scale = 'scale-105',
  duration = 300,
  className = ''
}) => {
  return (
    <div
      className={`
        transition-transform duration-${duration} ease-out cursor-pointer
        hover:${scale} active:scale-95
        ${className}
      `}
    >
      {children}
    </div>
  );
};

// Float Animation Component
export const Float = ({ children, className = '' }) => {
  return (
    <div
      className={`
        animate-float
        ${className}
      `}
      style={{
        animation: 'float 3s ease-in-out infinite'
      }}
    >
      {children}
    </div>
  );
};

// Progress Ring Component
export const ProgressRing = ({
  percentage = 0,
  size = 120,
  strokeWidth = 8,
  color = '#3B82F6',
  className = ''
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={`relative ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-semibold">{percentage}%</span>
      </div>
    </div>
  );
};

// Loading Dots Component
export const LoadingDots = ({ color = '#3B82F6', className = '' }) => {
  return (
    <div className={`flex space-x-1 ${className}`}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-2 h-2 rounded-full animate-pulse"
          style={{
            backgroundColor: color,
            animationDelay: `${i * 0.2}s`,
            animationDuration: '1s'
          }}
        />
      ))}
    </div>
  );
};

// Typing Effect Component
export const TypingEffect = ({
  text,
  speed = 100,
  className = '',
  onComplete
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, speed, onComplete]);

  return (
    <span className={className}>
      {displayedText}
      <span className="animate-ping">|</span>
    </span>
  );
};

// Parallax Scroll Component
export const ParallaxScroll = ({
  children,
  speed = 0.5,
  className = ''
}) => {
  const [offset, setOffset] = useState(0);
  const elementRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (elementRef.current) {
        const rect = elementRef.current.getBoundingClientRect();
        const scrollTop = window.pageYOffset;
        const elementTop = rect.top + scrollTop;
        const windowHeight = window.innerHeight;

        if (rect.top < windowHeight && rect.bottom > 0) {
          setOffset((scrollTop - elementTop) * speed);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return (
    <div
      ref={elementRef}
      className={className}
      style={{
        transform: `translateY(${offset}px)`
      }}
    >
      {children}
    </div>
  );
};

// Stagger Animation Container
export const StaggerContainer = ({
  children,
  staggerDelay = 100,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={className}>
      {React.Children.map(children, (child, index) => (
        <div
          className={`
            transition-all duration-500 ease-out
            ${isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4'
            }
          `}
          style={{
            transitionDelay: `${index * staggerDelay}ms`
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

// Hover Reveal Component
export const HoverReveal = ({ children, revealContent, className = '' }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`
          transition-transform duration-300 ease-out
          ${isHovered ? 'scale-110' : 'scale-100'}
        `}
      >
        {children}
      </div>

      <div
        className={`
          absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center
          transition-opacity duration-300 ease-out
          ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
      >
        <div className="text-white text-center p-4">
          {revealContent}
        </div>
      </div>
    </div>
  );
};

// Micro Interaction Button
export const MicroButton = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  loading = false,
  className = ''
}) => {
  const [isClicked, setIsClicked] = useState(false);
  const { isRTL } = useLanguage();

  const handleClick = (e) => {
    if (!disabled && !loading) {
      setIsClicked(true);
      setTimeout(() => setIsClicked(false), 200);
      onClick && onClick(e);
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl';
      case 'secondary':
        return 'bg-gray-200 hover:bg-gray-300 text-gray-800 shadow-md hover:shadow-lg';
      case 'success':
        return 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl';
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl';
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl';
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || loading}
      className={`
        relative overflow-hidden px-6 py-3 rounded-lg font-medium
        transition-all duration-300 ease-out
        ${getVariantClasses()}
        ${disabled || loading
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:scale-105 active:scale-95'
        }
        ${isClicked ? 'animate-pulse' : ''}
        ${isRTL ? 'text-right' : 'text-left'}
        ${className}
      `}
    >
      {/* Ripple Effect */}
      {isClicked && (
        <div className="absolute inset-0 bg-white bg-opacity-30 animate-ping rounded-lg" />
      )}

      {/* Loading Spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Button Content */}
      <span className={loading ? 'opacity-0' : 'opacity-100'}>
        {children}
      </span>
    </button>
  );
};

// Notification Toast with Animation
export const AnimatedToast = ({
  message,
  type = 'info',
  isVisible = false,
  onClose,
  duration = 3000
}) => {
  const { isRTL } = useLanguage();

  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const getTypeClasses = () => {
    switch (type) {
      case 'success': return 'bg-green-500 text-white';
      case 'error': return 'bg-red-500 text-white';
      case 'warning': return 'bg-yellow-500 text-white';
      default: return 'bg-blue-500 text-white';
    }
  };

  return (
    <div
      className={`
        fixed top-4 ${isRTL ? 'left-4' : 'right-4'} z-50
        transform transition-all duration-500 ease-out
        ${isVisible
          ? 'translate-y-0 opacity-100 scale-100'
          : '-translate-y-full opacity-0 scale-95'
        }
      `}
    >
      <div
        className={`
          p-4 rounded-lg shadow-xl min-w-64 max-w-sm
          ${getTypeClasses()}
          animate-slide-in-from-top
        `}
      >
        <div className="flex items-center justify-between">
          <span className="font-medium">{message}</span>
          <button
            onClick={onClose}
            className="ml-2 text-white hover:text-gray-200 transition-colors"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

// CSS Animations (to be added to your CSS file)
export const animationStyles = `
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }

  @keyframes slide-in-from-top {
    from { transform: translateY(-100%); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  .animate-float {
    animation: float 3s ease-in-out infinite;
  }

  .animate-slide-in-from-top {
    animation: slide-in-from-top 0.5s ease-out;
  }
`;

// Enhanced Shopping Cart Animation
export const CartBounce = ({ isActive, children, className = '' }) => {
  return (
    <div
      className={`
        transition-all duration-300 mobile-optimized
        ${isActive ? 'animate-bounce scale-110' : 'scale-100'}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

// Wishlist Heart Animation
export const HeartPulse = ({ isActive, children, className = '' }) => {
  return (
    <div
      className={`
        transition-all duration-300 mobile-optimized
        ${isActive ? 'animate-pulse-soft scale-110 text-red-500' : 'scale-100'}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

// Advanced Loading Spinner
export const ModernSpinner = ({ size = 'md', color = 'blue', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorClasses = {
    blue: 'border-blue-500',
    orange: 'border-orange-500',
    teal: 'border-teal-500',
    white: 'border-white'
  };

  return (
    <div
      className={`
        ${sizeClasses[size]}
        border-4 border-gray-200 rounded-full
        border-t-4 ${colorClasses[color]}
        animate-spin mobile-optimized
        ${className}
      `}
    />
  );
};

// Page Transition Animation
export const PageTransition = ({ children, className = '' }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div
      className={`
        transition-all duration-700 ease-out mobile-optimized
        ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

// Interactive Button with Ripple Effect
export const RippleButton = ({
  children,
  onClick,
  className = '',
  variant = 'primary',
  size = 'md',
  disabled = false
}) => {
  const [ripples, setRipples] = useState([]);

  const variants = {
    primary: 'gradient-modern-primary text-white shadow-elegant-lg',
    secondary: 'bg-white text-gray-900 border-2 border-gray-200 hover:border-gray-300',
    success: 'gradient-modern-teal text-white shadow-glow-teal',
    warning: 'gradient-modern-warm text-white shadow-glow-blue'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const createRipple = (event) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(button.clientWidth, button.clientHeight);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const newRipple = {
      x,
      y,
      size,
      id: Date.now()
    };

    setRipples(prev => [...prev, newRipple]);

    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);

    if (onClick && !disabled) {
      onClick(event);
    }
  };

  return (
    <button
      onClick={createRipple}
      disabled={disabled}
      className={`
        relative overflow-hidden rounded-2xl font-semibold
        transition-all duration-300 mobile-optimized
        btn-modern focus-modern touch-target
        ${variants[variant]}
        ${sizes[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-2xl active:scale-95'}
        ${className}
      `}
    >
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute bg-white/30 rounded-full animate-ping"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
            animation: 'ripple 0.6s linear'
          }}
        />
      ))}
      {children}
    </button>
  );
};

// Notification Toast Animation
export const AnimatedNotification = ({
  message,
  type = 'info',
  isVisible,
  onClose,
  duration = 4000
}) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const typeStyles = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    warning: 'bg-orange-500 text-white',
    info: 'gradient-modern-primary text-white'
  };

  return (
    <div
      className={`
        fixed top-4 right-4 z-50 p-4 rounded-2xl shadow-elegant-lg
        transition-all duration-500 mobile-optimized
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        ${typeStyles[type]}
        notification-slide-in
      `}
    >
      <div className="flex items-center justify-between min-w-0">
        <span className="text-sm font-medium">{message}</span>
        <button
          onClick={onClose}
          className="ml-4 text-white/80 hover:text-white transition-colors duration-200"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default {
  FadeIn,
  SlideIn,
  Bounce,
  Pulse,
  ScaleOnHover,
  Float,
  ProgressRing,
  LoadingDots,
  TypingEffect,
  ParallaxScroll,
  StaggerContainer,
  HoverReveal,
  MicroButton,
  AnimatedToast,
  CartBounce,
  HeartPulse,
  ModernSpinner,
  PageTransition,
  RippleButton,
  AnimatedNotification,
  animationStyles
};
