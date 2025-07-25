import React, { useState, useEffect } from 'react';
import { X, Star, Check, ArrowRight, Scale, TrendingUp, Heart, ShoppingCart } from 'lucide-react';
import { useComparison } from '../context/ComparisonContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useLanguage } from '../context/LanguageContext';
import { useTranslations } from '../translations';
import Rating from './Rating';

const AdvancedProductComparison = ({ isOpen, onClose }) => {
  const { comparisonItems, removeFromComparison, clearComparison } = useComparison();
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();
  const { language } = useLanguage();
  const t = useTranslations(language);
  const [activeFeature, setActiveFeature] = useState(null);

  if (!isOpen || comparisonItems.length === 0) return null;

  const handleAddToCart = (product) => {
    addToCart(product.id, 1);
  };

  const handleWishlistToggle = (product) => {
    if (isInWishlist(product.id)) {
      // Remove logic would go here
    } else {
      addToWishlist(product);
    }
  };

  const getComparisonFeatures = () => {
    if (comparisonItems.length === 0) return [];

    return [
      { key: 'price', label: 'Price', type: 'currency' },
      { key: 'rating', label: 'Rating', type: 'rating' },
      { key: 'stock_quantity', label: 'Stock', type: 'number' },
      { key: 'category', label: 'Category', type: 'text' },
      { key: 'brand', label: 'Brand', type: 'text' },
      { key: 'description', label: 'Description', type: 'text' },
    ];
  };

  const getBestValue = (feature) => {
    if (feature.type === 'currency') {
      return Math.min(...comparisonItems.map(item => item.price || 0));
    }
    if (feature.type === 'rating') {
      return Math.max(...comparisonItems.map(item => item.rating || 0));
    }
    if (feature.type === 'number') {
      return Math.max(...comparisonItems.map(item => item[feature.key] || 0));
    }
    return null;
  };

  const isbestValue = (product, feature) => {
    const bestValue = getBestValue(feature);
    if (bestValue === null) return false;

    if (feature.type === 'currency') {
      return product.price === bestValue;
    }
    if (feature.type === 'rating') {
      return product.rating === bestValue;
    }
    if (feature.type === 'number') {
      return product[feature.key] === bestValue;
    }
    return false;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Scale className="w-6 h-6" />
                Product Comparison
              </h2>
              <p className="text-blue-100 mt-1">
                Compare {comparisonItems.length} products side by side
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={clearComparison}
                className="text-white hover:text-red-200 transition-colors px-3 py-1 bg-red-500 bg-opacity-20 rounded-lg"
              >
                Clear All
              </button>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors p-2"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6">
            {comparisonItems.map((product) => (
              <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Product Header */}
                <div className="relative">
                  <img
                    src={product.image_url || '/placeholder-product.jpg'}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={() => removeFromComparison(product.id)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                    ${product.price}
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                    {product.name}
                  </h3>

                  {/* Features Comparison */}
                  <div className="space-y-3">
                    {getComparisonFeatures().map((feature) => (
                      <div key={feature.key} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{feature.label}:</span>
                        <div className="flex items-center gap-1">
                          {isbestValue(product, feature) && (
                            <Check className="w-4 h-4 text-green-500" />
                          )}
                          <span className={`text-sm font-medium ${
                            isbestValue(product, feature) ? 'text-green-600' : 'text-gray-900'
                          }`}>
                            {feature.type === 'currency' ? `$${product[feature.key] || 0}` :
                             feature.type === 'rating' ? (
                               <Rating value={product[feature.key] || 0} size="sm" readonly />
                             ) :
                             product[feature.key] || 'N/A'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 space-y-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </button>
                    <button
                      onClick={() => handleWishlistToggle(product)}
                      className={`w-full py-2 px-4 rounded-lg border transition-colors flex items-center justify-center gap-2 ${
                        isInWishlist(product.id)
                          ? 'bg-red-50 border-red-200 text-red-600'
                          : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                      {isInWishlist(product.id) ? 'In Wishlist' : 'Add to Wishlist'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Best Value Recommendation */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 m-6 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-green-800">Best Value Recommendation</h3>
            </div>
            <p className="text-green-700 mb-4">
              Based on price, rating, and availability, here's our recommendation:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-800">Best Price</h4>
                <p className="text-sm text-green-600">
                  {comparisonItems.find(item =>
                    item.price === Math.min(...comparisonItems.map(i => i.price || 0))
                  )?.name}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-800">Highest Rated</h4>
                <p className="text-sm text-green-600">
                  {comparisonItems.find(item =>
                    item.rating === Math.max(...comparisonItems.map(i => i.rating || 0))
                  )?.name}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-800">Best Stock</h4>
                <p className="text-sm text-green-600">
                  {comparisonItems.find(item =>
                    item.stock_quantity === Math.max(...comparisonItems.map(i => i.stock_quantity || 0))
                  )?.name}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedProductComparison;
