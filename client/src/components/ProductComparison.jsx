import React, { useState, useEffect, useContext } from 'react';
import { X, Plus, Minus, ShoppingCart, Heart, Star, Scale, Check } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import Rating from './Rating';

const ProductComparisonWidget = ({ isOpen, onClose, initialProducts = [] }) => {
  const [compareProducts, setCompareProducts] = useState(initialProducts);
  const [showAddProducts, setShowAddProducts] = useState(false);
  const { addToCart } = useContext(CartContext);
  const { addToWishlist, isInWishlist } = useContext(WishlistContext);

  useEffect(() => {
    // Load comparison products from localStorage
    const stored = localStorage.getItem('compareProducts');
    if (stored) {
      setCompareProducts(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    // Save to localStorage whenever compareProducts changes
    localStorage.setItem('compareProducts', JSON.stringify(compareProducts));
  }, [compareProducts]);

  const addToComparison = (product) => {
    if (compareProducts.length >= 4) {
      alert('You can compare up to 4 products at a time');
      return;
    }

    if (!compareProducts.find(p => p.id === product.id)) {
      setCompareProducts(prev => [...prev, product]);
    }
  };

  const removeFromComparison = (productId) => {
    setCompareProducts(prev => prev.filter(p => p.id !== productId));
  };

  const clearComparison = () => {
    setCompareProducts([]);
    localStorage.removeItem('compareProducts');
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  const handleAddToWishlist = (product) => {
    addToWishlist(product);
  };

  if (!isOpen) return null;

  const getComparisonAttributes = () => {
    if (compareProducts.length === 0) return [];

    const allAttributes = new Set();
    compareProducts.forEach(product => {
      allAttributes.add('price');
      allAttributes.add('category');
      allAttributes.add('rating');
      allAttributes.add('stock');
      allAttributes.add('brand');

      if (product.specifications) {
        Object.keys(product.specifications).forEach(key => {
          allAttributes.add(key);
        });
      }

      if (product.features) {
        allAttributes.add('features');
      }
    });

    return Array.from(allAttributes);
  };

  const getAttributeValue = (product, attribute) => {
    switch (attribute) {
      case 'price':
        return `${product.price} MAD`;
      case 'category':
        return product.category || 'N/A';
      case 'rating':
        return (
          <div className="flex items-center space-x-1">
            <Rating value={product.rating || 0} readOnly size="sm" />
            <span className="text-sm text-gray-500">({product.rating || 0})</span>
          </div>
        );
      case 'stock':
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            product.stock > 10 ? 'bg-green-100 text-green-800' :
            product.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {product.stock > 10 ? 'In Stock' :
             product.stock > 0 ? `${product.stock} left` : 'Out of Stock'}
          </span>
        );
      case 'brand':
        return product.brand || 'N/A';
      case 'features':
        return (
          <ul className="text-sm space-y-1">
            {(product.features || []).slice(0, 3).map((feature, index) => (
              <li key={index} className="flex items-start space-x-1">
                <Check className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        );
      default:
        return product.specifications?.[attribute] || 'N/A';
    }
  };

  const attributes = getComparisonAttributes();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-7xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-2">
            <Scale className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Compare Products</h2>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
              {compareProducts.length}/4
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {compareProducts.length > 0 && (
              <button
                onClick={clearComparison}
                className="text-sm text-red-600 hover:text-red-700 transition-colors"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {compareProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <Scale className="h-16 w-16 mb-4 text-gray-300" />
              <h3 className="text-xl font-medium mb-2">No products to compare</h3>
              <p className="text-center">Add products to comparison to see them side by side</p>
            </div>
          ) : (
            <div className="p-6">
              {/* Product Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {compareProducts.map((product) => (
                  <div key={product.id} className="bg-gray-50 rounded-lg p-4 relative">
                    <button
                      onClick={() => removeFromComparison(product.id)}
                      className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors"
                    >
                      <X className="h-4 w-4 text-gray-500" />
                    </button>

                    <div className="aspect-square bg-white rounded-lg mb-4 overflow-hidden">
                      <img
                        src={product.image || '/placeholder-product.jpg'}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {product.name}
                    </h3>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-blue-600">
                          {product.price} MAD
                        </span>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleAddToCart(product)}
                          disabled={product.stock === 0}
                          className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                          <ShoppingCart className="h-4 w-4 inline mr-1" />
                          Add to Cart
                        </button>

                        <button
                          onClick={() => handleAddToWishlist(product)}
                          className={`p-2 rounded-lg border-2 transition-colors ${
                            isInWishlist(product.id)
                              ? 'bg-red-50 border-red-200 text-red-600'
                              : 'border-gray-300 text-gray-700 hover:border-gray-400'
                          }`}
                        >
                          <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add Product Slot */}
                {compareProducts.length < 4 && (
                  <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center min-h-[300px]">
                    <Plus className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500 text-center mb-4">Add another product to compare</p>
                    <button
                      onClick={() => setShowAddProducts(true)}
                      className="bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      Browse Products
                    </button>
                  </div>
                )}
              </div>

              {/* Comparison Table */}
              {compareProducts.length > 1 && (
                <div className="bg-white rounded-lg border overflow-hidden">
                  <div className="bg-gray-50 px-6 py-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-900">Detailed Comparison</h3>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-6 font-medium text-gray-900 bg-gray-50">
                            Features
                          </th>
                          {compareProducts.map((product) => (
                            <th key={product.id} className="text-center py-3 px-4 min-w-[200px]">
                              <div className="flex flex-col items-center">
                                <img
                                  src={product.image || '/placeholder-product.jpg'}
                                  alt={product.name}
                                  className="w-12 h-12 object-cover rounded-lg mb-2"
                                />
                                <span className="text-sm font-medium text-gray-900 line-clamp-2">
                                  {product.name}
                                </span>
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {attributes.map((attribute, index) => (
                          <tr key={attribute} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                            <td className="py-3 px-6 font-medium text-gray-900 capitalize">
                              {attribute.replace(/([A-Z])/g, ' $1').trim()}
                            </td>
                            {compareProducts.map((product) => (
                              <td key={product.id} className="py-3 px-4 text-center">
                                {getAttributeValue(product, attribute)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Hook for managing product comparison
export const useProductComparison = () => {
  const [compareProducts, setCompareProducts] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('compareProducts');
    if (stored) {
      setCompareProducts(JSON.parse(stored));
    }
  }, []);

  const addToComparison = (product) => {
    setCompareProducts(prev => {
      if (prev.length >= 4) {
        alert('You can compare up to 4 products at a time');
        return prev;
      }

      if (prev.find(p => p.id === product.id)) {
        return prev;
      }

      const updated = [...prev, product];
      localStorage.setItem('compareProducts', JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromComparison = (productId) => {
    setCompareProducts(prev => {
      const updated = prev.filter(p => p.id !== productId);
      localStorage.setItem('compareProducts', JSON.stringify(updated));
      return updated;
    });
  };

  const isInComparison = (productId) => {
    return compareProducts.some(p => p.id === productId);
  };

  const getComparisonCount = () => {
    return compareProducts.length;
  };

  return {
    compareProducts,
    addToComparison,
    removeFromComparison,
    isInComparison,
    getComparisonCount
  };
};

export default ProductComparisonWidget;
