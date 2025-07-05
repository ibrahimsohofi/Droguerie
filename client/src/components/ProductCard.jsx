import React, { useState } from 'react';
import { Star, ShoppingCart, Eye, Zap, Scale, Calculator, Package, Heart, Link } from 'lucide-react';
import QuickViewModal from './QuickViewModal';
import BulkOrderCalculator from './BulkOrderCalculator';
import ProductUsageCalculator from './ProductUsageCalculator';
import { useComparison } from '../context/ComparisonContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useRecentlyViewed } from './RecentlyViewedProducts';
import Rating from './Rating';
import StockIndicator from './StockIndicator';

const ProductCard = ({ product, className = "" }) => {
  const [showQuickView, setShowQuickView] = useState(false);
  const [showBulkCalculator, setShowBulkCalculator] = useState(false);
  const [showUsageCalculator, setShowUsageCalculator] = useState(false);

  const { addToComparison, isInComparison, getComparisonCount } = useComparison();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { trackProductView } = useRecentlyViewed();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    trackProductView(product);
    setShowQuickView(true);
  };

  const handleAddToComparison = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const result = addToComparison(product);
    if (!result.success) {
      // You could show a toast notification here
      console.log(result.message);
    }
  };

  const handleBulkCalculator = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowBulkCalculator(true);
  };

  const handleUsageCalculator = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowUsageCalculator(true);
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl shadow-md overflow-hidden animate-pulse card-modern">
        <div className="w-full h-56 bg-gradient-to-br from-gray-200 to-gray-300 skeleton"></div>
        <div className="p-6">
          <div className="h-4 bg-gray-300 rounded-full mb-2 w-1/3 skeleton"></div>
          <div className="h-6 bg-gray-300 rounded-full mb-3 w-3/4 skeleton"></div>
          <div className="h-4 bg-gray-300 rounded mb-4 w-full"></div>
          <div className="h-8 bg-gray-300 rounded mb-4 w-1/2"></div>
          <div className="h-4 bg-gray-300 rounded mb-4 w-2/3"></div>
          <div className="flex gap-3">
            <div className="flex-1 h-10 bg-gray-300 rounded"></div>
            <div className="flex-1 h-10 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`group relative bg-white rounded-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-gray-300 ${className}`}>
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Link to={`/products/${product.id}`}>
            <img
              src={product.image || '/placeholder-product.jpg'}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          </Link>

          {/* Overlay buttons - visible on hover */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300">
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 space-y-2">
              <button
                onClick={handleQuickView}
                className="bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
                title="Quick View"
              >
                <Eye className="h-4 w-4 text-gray-700" />
              </button>

              <button
                onClick={handleAddToComparison}
                className={`bg-white rounded-full p-2 shadow-lg transition-colors ${
                  isInComparison(product.id)
                    ? 'bg-blue-50 text-blue-600'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
                title={isInComparison(product.id) ? 'Remove from comparison' : 'Add to comparison'}
                disabled={!isInComparison(product.id) && getComparisonCount() >= 4}
              >
                <Scale className="h-4 w-4" />
              </button>

              <button
                onClick={handleUsageCalculator}
                className="bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
                title="Usage Calculator"
              >
                <Calculator className="h-4 w-4 text-gray-700" />
              </button>

              <button
                onClick={handleBulkCalculator}
                className="bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
                title="Bulk Order Calculator"
              >
                <Package className="h-4 w-4 text-gray-700" />
              </button>
            </div>
          </div>

          {/* Discount Badge */}
          {product.discount && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              -{product.discount}%
            </div>
          )}

          {/* Stock Badge */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm font-medium">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-gray-900 line-clamp-2 flex-1">
              <Link to={`/products/${product.id}`} className="hover:text-blue-600 transition-colors">
                {product.name}
              </Link>
            </h3>
            <button
              onClick={handleWishlistClick}
              className={`ml-2 p-1 rounded-full transition-colors ${
                isInWishlist(product.id)
                  ? 'text-red-500 hover:text-red-600'
                  : 'text-gray-400 hover:text-red-500'
              }`}
            >
              <Heart className={`h-5 w-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
            </button>
          </div>

          <p className="text-sm text-gray-500 mb-2">{product.category}</p>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center mb-2">
              <Rating value={product.rating} readOnly size="sm" />
              <span className="ml-1 text-xs text-gray-500">({product.reviewCount || 0})</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-blue-600">
                {product.price} MAD
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  {product.originalPrice} MAD
                </span>
              )}
            </div>
            <StockIndicator stock={product.stock} />
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
            </button>

            {/* Quick Action Row */}
            <div className="grid grid-cols-3 gap-1">
              <button
                onClick={handleQuickView}
                className="text-xs py-1 px-2 bg-gray-100 hover:bg-gray-200 rounded transition-colors flex items-center justify-center space-x-1"
              >
                <Eye className="h-3 w-3" />
                <span>View</span>
              </button>

              <button
                onClick={handleAddToComparison}
                className={`text-xs py-1 px-2 rounded transition-colors flex items-center justify-center space-x-1 ${
                  isInComparison(product.id)
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                disabled={!isInComparison(product.id) && getComparisonCount() >= 4}
              >
                <Scale className="h-3 w-3" />
                <span>Compare</span>
              </button>

              <button
                onClick={handleUsageCalculator}
                className="text-xs py-1 px-2 bg-gray-100 hover:bg-gray-200 rounded transition-colors flex items-center justify-center space-x-1"
              >
                <Calculator className="h-3 w-3" />
                <span>Calc</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <QuickViewModal
        product={product}
        isOpen={showQuickView}
        onClose={() => setShowQuickView(false)}
      />

      <BulkOrderCalculator
        product={product}
        isOpen={showBulkCalculator}
        onClose={() => setShowBulkCalculator(false)}
      />

      <ProductUsageCalculator
        product={product}
        isOpen={showUsageCalculator}
        onClose={() => setShowUsageCalculator(false)}
      />
    </>
  );
};

export default ProductCard;
