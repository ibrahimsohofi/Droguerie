import React, { useState, useContext } from 'react';
import { X, ShoppingCart, Heart, Minus, Plus, Star, Truck, Shield, RotateCcw } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { useLanguage } from '../context/LanguageContext';
import { formatProductPrice } from '../utils/currency';

const ProductQuickView = ({ product, isOpen, onClose }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const { addToCart } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useContext(WishlistContext);
  const { t, language } = useLanguage();

  if (!isOpen || !product) return null;

  const images = product.images || [product.image];
  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart({
      ...product,
      quantity,
      variant: selectedVariant
    });
    onClose();
  };

  const handleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleQuantityChange = (action) => {
    if (action === 'increase') {
      setQuantity(prev => Math.min(prev + 1, product.stock || 99));
    } else if (action === 'decrease') {
      setQuantity(prev => Math.max(prev - 1, 1));
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        <div className="inline-block w-full max-w-4xl p-0 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          <div className="flex">
            {/* Image Section */}
            <div className="flex-1 p-6">
              <div className="relative">
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="w-full h-80 object-cover rounded-lg"
                />
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {images.length > 1 && (
                <div className="flex mt-4 space-x-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-16 h-16 rounded-md overflow-hidden border-2 ${
                        selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                      }`}
                    >
                      <img src={image} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details Section */}
            <div className="flex-1 p-6 border-l">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
                  <p className="text-sm text-gray-500 mt-1">{product.category}</p>
                </div>
                <button
                  onClick={handleWishlist}
                  className={`p-2 rounded-full ${
                    isWishlisted ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating || 4) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  ({product.reviewCount || 23} {t('reviews')})
                </span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-center space-x-2">
                  <span className="text-3xl font-bold text-gray-900">
                    {formatProductPrice(product.price, language)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-lg text-gray-500 line-through">
                      {formatProductPrice(product.originalPrice, language)}
                    </span>
                  )}
                </div>
                {product.originalPrice && (
                  <span className="inline-block px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                )}
              </div>

              {/* Product Variants */}
              {product.variants && product.variants.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">{t('size')}:</h4>
                  <div className="flex space-x-2">
                    {product.variants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        className={`px-3 py-2 text-sm border rounded-md ${
                          selectedVariant?.id === variant.id
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {variant.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-2">{t('quantity')}:</h4>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleQuantityChange('decrease')}
                    className="p-1 rounded-md border border-gray-300 hover:bg-gray-50"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-3 py-1 border rounded-md text-center min-w-[50px]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange('increase')}
                    className="p-1 rounded-md border border-gray-300 hover:bg-gray-50"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-gray-500">
                    ({product.stock || 10} {t('inStock')})
                  </span>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 mb-4"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>{t('addToCart')}</span>
              </button>

              {/* Product Features */}
              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <Truck className="w-4 h-4" />
                  <span>{t('freeShipping')} (Orders over 200 MAD)</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <Shield className="w-4 h-4" />
                  <span>{t('securePayment')}</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <RotateCcw className="w-4 h-4" />
                  <span>{t('returnPolicy')} (30 days)</span>
                </div>
              </div>

              {/* Short Description */}
              {product.description && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {product.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductQuickView;
