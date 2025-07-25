import React, { useState } from 'react';
import { Star, ShoppingCart, Eye, Zap, Scale, Calculator, Package, Heart, Link as LinkIcon, Share2, MessageCircle, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import QuickViewModal from './QuickViewModal';
import BulkOrderCalculator from './BulkOrderCalculator';
import ProductUsageCalculator from './ProductUsageCalculator';
import { useComparison } from '../context/ComparisonContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useLanguage } from '../context/LanguageContext';
import { useRecentlyViewed } from './RecentlyViewedProducts';
import { formatProductPrice, calculateDiscount } from '../utils/currency';
import Rating from './Rating';
import StockIndicator from './StockIndicator';

const ProductCard = ({ product, className = "" }) => {
  const [showQuickView, setShowQuickView] = useState(false);
  const [showBulkCalculator, setShowBulkCalculator] = useState(false);
  const [showUsageCalculator, setShowUsageCalculator] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const { addToComparison, isInComparison, getComparisonCount } = useComparison();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { trackProductView } = useRecentlyViewed();
  const { language, isRTL } = useLanguage();

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
    if (getComparisonCount() < 4) {
      addToComparison(product);
    }
  };

  // Get product name based on language
  const getProductName = () => {
    if (language === 'ar' && product.name_ar) {
      return product.name_ar;
    } else if (language === 'fr' && product.name_fr) {
      return product.name_fr;
    }
    return product.name;
  };

  // Get product description based on language
  const getProductDescription = () => {
    if (language === 'ar' && product.description_ar) {
      return product.description_ar;
    } else if (language === 'fr' && product.description_fr) {
      return product.description_fr;
    }
    return product.description;
  };

  // Calculate discount percentage
  const hasDiscount = product.original_price && product.original_price > product.price;
  const discountPercentage = hasDiscount ? Math.round(((product.original_price - product.price) / product.original_price) * 100) : 0;

  return (
    <>
      <div
        className={`group relative bg-white rounded-2xl card-elegant hover:shadow-warm transition-all duration-300 overflow-hidden ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Product Image */}
        <div className="relative overflow-hidden rounded-t-2xl bg-gray-100">
          <Link
            to={`/products/${product.id}`}
            onClick={() => trackProductView(product)}
            className="block aspect-square relative group-hover:scale-105 transition-transform duration-300"
          >
            {/* Discount Badge */}
            {hasDiscount && (
              <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-brand-terracotta-600 to-brand-terracotta-700 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                -{discountPercentage}%
              </div>
            )}

            {/* Stock Status Badge */}
            {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
              <div className="absolute top-3 right-3 z-10 bg-gradient-to-r from-brand-amber-500 to-brand-amber-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                {language === 'ar' ? 'كمية محدودة' : language === 'fr' ? 'Stock limité' : 'Limited Stock'}
              </div>
            )}

            {/* Out of Stock Badge */}
            {product.stock_quantity === 0 && (
              <div className="absolute top-3 right-3 z-10 bg-gray-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                {language === 'ar' ? 'نفدت الكمية' : language === 'fr' ? 'Rupture de stock' : 'Out of Stock'}
              </div>
            )}

            {/* Product Image */}
            <div className="relative w-full h-full">
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gray-200 loading-shimmer rounded-t-2xl" />
              )}
              <img
                src={product.image || '/placeholder-product.jpg'}
                alt={getProductName()}
                className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setImageLoaded(true)}
                loading="lazy"
              />
            </div>

            {/* Overlay with Quick Actions */}
            <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
              <div className="flex gap-2">
                <button
                  onClick={handleQuickView}
                  className="bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full transition-all duration-200 hover:scale-110 shadow-lg"
                  title={language === 'ar' ? 'عرض سريع' : language === 'fr' ? 'Vue rapide' : 'Quick View'}
                >
                  <Eye className="w-5 h-5" />
                </button>
                <button
                  onClick={handleWishlistClick}
                  className={`p-3 rounded-full transition-all duration-200 hover:scale-110 shadow-lg ${
                    isInWishlist(product.id)
                      ? 'bg-brand-terracotta-600 text-white'
                      : 'bg-white/90 hover:bg-white text-gray-800'
                  }`}
                  title={language === 'ar' ? 'قائمة الأمنيات' : language === 'fr' ? 'Liste de souhaits' : 'Wishlist'}
                >
                  <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={handleAddToComparison}
                  className={`p-3 rounded-full transition-all duration-200 hover:scale-110 shadow-lg ${
                    isInComparison(product.id)
                      ? 'bg-brand-teal-600 text-white'
                      : 'bg-white/90 hover:bg-white text-gray-800'
                  }`}
                  title={language === 'ar' ? 'مقارنة' : language === 'fr' ? 'Comparer' : 'Compare'}
                  disabled={getComparisonCount() >= 4 && !isInComparison(product.id)}
                >
                  <Scale className="w-5 h-5" />
                </button>
              </div>
            </div>
          </Link>
        </div>

        {/* Product Details */}
        <div className="p-6">
          {/* Category */}
          <div className="text-xs font-medium text-brand-teal-600 mb-2 uppercase tracking-wide">
            {product.category?.name || product.category_name || ''}
          </div>

          {/* Product Name */}
          <Link
            to={`/products/${product.id}`}
            onClick={() => trackProductView(product)}
            className="block"
          >
            <h3 className={`font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-brand-teal-700 transition-colors duration-200 ${
              language === 'ar' ? 'font-arabic text-lg' : 'text-lg'
            }`}>
              {getProductName()}
            </h3>
          </Link>

          {/* Product Description */}
          {getProductDescription() && (
            <p className={`text-gray-600 text-sm mb-3 line-clamp-2 ${language === 'ar' ? 'font-arabic' : ''}`}>
              {getProductDescription()}
            </p>
          )}

          {/* Rating and Reviews */}
          <div className="flex items-center gap-2 mb-4">
            <Rating value={product.rating || 4.2} size="sm" />
            <span className="text-sm text-gray-500">
              ({product.reviews_count || Math.floor(Math.random() * 50) + 5})
            </span>
          </div>

          {/* Stock Indicator */}
          <div className="mb-4">
            <StockIndicator stock={product.stock_quantity} />
          </div>

          {/* Price Section */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {hasDiscount ? (
                <>
                  <span className="text-xl font-bold text-brand-teal-700">
                    {formatProductPrice(product.price, language)}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    {formatProductPrice(product.original_price, language)}
                  </span>
                </>
              ) : (
                <span className="text-xl font-bold text-brand-teal-700">
                  {formatProductPrice(product.price, language)}
                </span>
              )}
            </div>
            {product.unit && (
              <span className="text-sm text-gray-500">/{product.unit}</span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleAddToCart}
              disabled={product.stock_quantity === 0}
              className={`flex-1 btn-primary group ${
                product.stock_quantity === 0
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:shadow-lg transform hover:scale-105'
              }`}
            >
              <ShoppingCart className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">
                {product.stock_quantity === 0
                  ? (language === 'ar' ? 'نفدت الكمية' : language === 'fr' ? 'Épuisé' : 'Out of Stock')
                  : (language === 'ar' ? 'أضف للسلة' : language === 'fr' ? 'Ajouter' : 'Add to Cart')
                }
              </span>
            </button>

            {/* Additional Actions */}
            <div className="flex gap-1">
              <button
                onClick={() => setShowBulkCalculator(true)}
                className="p-2 bg-gray-100 hover:bg-brand-amber-100 text-gray-600 hover:text-brand-amber-700 rounded-lg transition-all duration-200 hover:scale-105"
                title={language === 'ar' ? 'حاسبة الكمية' : language === 'fr' ? 'Calculateur de quantité' : 'Bulk Calculator'}
              >
                <Calculator className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowUsageCalculator(true)}
                className="p-2 bg-gray-100 hover:bg-brand-teal-100 text-gray-600 hover:text-brand-teal-700 rounded-lg transition-all duration-200 hover:scale-105"
                title={language === 'ar' ? 'دليل الاستخدام' : language === 'fr' ? 'Guide d\'utilisation' : 'Usage Guide'}
              >
                <Package className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Features/Benefits */}
          {product.features && product.features.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex flex-wrap gap-2">
                {product.features.slice(0, 2).map((feature, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-brand-teal-50 text-brand-teal-700"
                  >
                    <Zap className="w-3 h-3 mr-1" />
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Floating Action Button for WhatsApp */}
        <button
          onClick={() => {
            const message = `${language === 'ar' ? 'مرحبا، أريد الاستفسار عن' : language === 'fr' ? 'Bonjour, je voudrais me renseigner sur' : 'Hello, I would like to inquire about'} ${getProductName()}`;
            window.open(`https://wa.me/212123456789?text=${encodeURIComponent(message)}`, '_blank');
          }}
          className="absolute top-4 right-4 w-10 h-10 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg opacity-0 group-hover:opacity-100"
        >
          <MessageCircle className="w-5 h-5" />
        </button>
      </div>

      {/* Modals */}
      {showQuickView && (
        <QuickViewModal
          product={product}
          isOpen={showQuickView}
          onClose={() => setShowQuickView(false)}
        />
      )}

      {showBulkCalculator && (
        <BulkOrderCalculator
          product={product}
          isOpen={showBulkCalculator}
          onClose={() => setShowBulkCalculator(false)}
        />
      )}

      {showUsageCalculator && (
        <ProductUsageCalculator
          product={product}
          isOpen={showUsageCalculator}
          onClose={() => setShowUsageCalculator(false)}
        />
      )}
    </>
  );
};

export default ProductCard;
