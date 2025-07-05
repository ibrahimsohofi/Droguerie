import React, { useState, useEffect, createContext, useContext } from 'react';
import { Clock, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

// Context for Recently Viewed Products
const RecentlyViewedContext = createContext();

export const RecentlyViewedProvider = ({ children }) => {
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('recentlyViewed');
    if (stored) {
      try {
        setRecentlyViewed(JSON.parse(stored));
      } catch (error) {
        console.error('Error parsing recently viewed:', error);
      }
    }
  }, []);

  const addToRecentlyViewed = (product) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(item => item.id !== product.id);
      const updated = [product, ...filtered].slice(0, 12); // Keep max 12 items
      localStorage.setItem('recentlyViewed', JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromRecentlyViewed = (productId) => {
    setRecentlyViewed(prev => {
      const updated = prev.filter(item => item.id !== productId);
      localStorage.setItem('recentlyViewed', JSON.stringify(updated));
      return updated;
    });
  };

  const clearRecentlyViewed = () => {
    setRecentlyViewed([]);
    localStorage.removeItem('recentlyViewed');
  };

  const value = {
    recentlyViewed,
    addToRecentlyViewed,
    removeFromRecentlyViewed,
    clearRecentlyViewed
  };

  return (
    <RecentlyViewedContext.Provider value={value}>
      {children}
    </RecentlyViewedContext.Provider>
  );
};

export const useRecentlyViewed = () => {
  const context = useContext(RecentlyViewedContext);
  if (!context) {
    throw new Error('useRecentlyViewed must be used within a RecentlyViewedProvider');
  }
  return context;
};

const RecentlyViewed = ({ limit = 6, className = '' }) => {
  const { recentlyViewed, removeFromRecentlyViewed, clearRecentlyViewed } = useRecentlyViewed();
  const { language } = useLanguage();

  if (recentlyViewed.length === 0) return null;

  const displayedProducts = recentlyViewed.slice(0, limit);

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Recently Viewed</h3>
        </div>
        <button
          onClick={clearRecentlyViewed}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {displayedProducts.map((product) => (
          <div key={product.id} className="group relative">
            <Link to={`/products/${product.id}`}>
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={product.image_url || '/placeholder-product.jpg'}
                  alt={product[`name_${language}`] || product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="mt-2">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {product[`name_${language}`] || product.name}
                </p>
                <p className="text-sm text-gray-500">${product.price}</p>
              </div>
            </Link>

            <button
              onClick={() => removeFromRecentlyViewed(product.id)}
              className="absolute top-1 right-1 bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3 text-gray-600" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentlyViewed;
