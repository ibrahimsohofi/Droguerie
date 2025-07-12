import React, { useState, useEffect } from 'react';
import { Clock, Eye, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { formatProductPrice } from '../utils/currency';

const RecentlyViewedProducts = ({ currentProductId, limit = 6 }) => {
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const { language } = useLanguage();

  useEffect(() => {
    const stored = localStorage.getItem('recentlyViewed');
    if (stored) {
      setRecentlyViewed(JSON.parse(stored));
    }
  }, []);

  const addToRecentlyViewed = (product) => {
    if (!product || product.id === currentProductId) return;

    setRecentlyViewed(prev => {
      // Remove the product if it already exists
      const filtered = prev.filter(item => item.id !== product.id);

      // Add to beginning and limit the array
      const updated = [product, ...filtered].slice(0, limit);

      // Save to localStorage
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

  // Function to be called from product pages
  const trackProductView = (product) => {
    addToRecentlyViewed(product);
  };

  // Filter out current product if viewing a product page
  const displayProducts = recentlyViewed.filter(
    product => product.id !== currentProductId
  );

  if (displayProducts.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900">Recently Viewed</h3>
        </div>
        <button
          onClick={clearRecentlyViewed}
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {displayProducts.map((product) => (
          <div key={product.id} className="group relative">
            <Link
              to={`/products/${product.id}`}
              className="block bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors"
            >
              <div className="aspect-square mb-2 rounded-lg overflow-hidden">
                <img
                  src={product.image || '/placeholder-product.jpg'}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              <h4 className="font-medium text-sm text-gray-900 line-clamp-2 mb-1">
                {product.name}
              </h4>
              <p className="text-sm font-semibold text-blue-600">
                {formatProductPrice(product.price, language)}
              </p>
            </Link>

            <button
              onClick={(e) => {
                e.preventDefault();
                removeFromRecentlyViewed(product.id);
              }}
              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition-all"
              title="Remove from recently viewed"
            >
              <X className="h-3 w-3 text-gray-500" />
            </button>
          </div>
        ))}
      </div>

      {displayProducts.length >= limit - 1 && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            Showing {displayProducts.length} most recent items
          </p>
        </div>
      )}
    </div>
  );
};

// Hook for easy integration with product pages
export const useRecentlyViewed = () => {
  const trackProductView = (product) => {
    const stored = localStorage.getItem('recentlyViewed');
    const current = stored ? JSON.parse(stored) : [];

    // Remove if already exists
    const filtered = current.filter(item => item.id !== product.id);

    // Add to beginning and limit
    const updated = [product, ...filtered].slice(0, 6);

    localStorage.setItem('recentlyViewed', JSON.stringify(updated));
  };

  const getRecentlyViewed = () => {
    const stored = localStorage.getItem('recentlyViewed');
    return stored ? JSON.parse(stored) : [];
  };

  return { trackProductView, getRecentlyViewed };
};

export default RecentlyViewedProducts;
