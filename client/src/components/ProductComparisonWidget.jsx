import React, { useState, useEffect } from 'react';
import {
  GitCompare,
  X,
  Star,
  ShoppingCart,
  Heart,
  Eye,
  Check,
  Minus,
  Plus,
  BarChart3,
  Filter,
  ArrowUpDown
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from './Toast';

const ProductComparisonWidget = ({
  isOpen,
  onClose,
  comparisonProducts = [],
  onRemoveProduct,
  maxProducts = 4
}) => {
  const [products, setProducts] = useState(comparisonProducts);
  const [viewMode, setViewMode] = useState('grid'); // 'grid', 'table'
  const [highlightDifferences, setHighlightDifferences] = useState(false);
  const [selectedAttributes, setSelectedAttributes] = useState([]);

  const { language } = useLanguage();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToast } = useToast();

  useEffect(() => {
    setProducts(comparisonProducts);
  }, [comparisonProducts]);

  const handleRemoveProduct = (productId) => {
    const updatedProducts = products.filter(p => p.id !== productId);
    setProducts(updatedProducts);
    if (onRemoveProduct) {
      onRemoveProduct(productId);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    addToast({
      type: 'success',
      title: 'Added to Cart',
      message: `${product.name} has been added to your cart.`
    });
  };

  const handleWishlistToggle = (product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      addToast({
        type: 'info',
        title: 'Removed from Wishlist',
        message: `${product.name} has been removed from your wishlist.`
      });
    } else {
      addToWishlist(product);
      addToast({
        type: 'success',
        title: 'Added to Wishlist',
        message: `${product.name} has been added to your wishlist.`
      });
    }
  };

  const getAllAttributes = () => {
    const attributeSet = new Set();
    products.forEach(product => {
      if (product.specifications) {
        Object.keys(product.specifications).forEach(attr => attributeSet.add(attr));
      }
    });
    return Array.from(attributeSet);
  };

  const getAttributeValue = (product, attribute) => {
    return product.specifications?.[attribute] || 'N/A';
  };

  const hasValueDifferences = (attribute) => {
    const values = products.map(product => getAttributeValue(product, attribute));
    return new Set(values).size > 1;
  };

  const calculateSimilarityScore = (product1, product2) => {
    const attributes = getAllAttributes();
    let matches = 0;
    let total = 0;

    attributes.forEach(attr => {
      const val1 = getAttributeValue(product1, attr);
      const val2 = getAttributeValue(product2, attr);
      if (val1 !== 'N/A' && val2 !== 'N/A') {
        total++;
        if (val1 === val2) matches++;
      }
    });

    return total > 0 ? Math.round((matches / total) * 100) : 0;
  };

  const getWinnerForAttribute = (attribute) => {
    // Simple logic to determine "winner" based on attribute type
    const values = products.map((product, index) => ({
      index,
      value: getAttributeValue(product, attribute),
      product
    }));

    // For price, lower is better
    if (attribute.toLowerCase().includes('price')) {
      const numericValues = values.filter(v => !isNaN(parseFloat(v.value)));
      if (numericValues.length > 0) {
        return numericValues.reduce((min, current) =>
          parseFloat(current.value) < parseFloat(min.value) ? current : min
        ).index;
      }
    }

    // For rating, higher is better
    if (attribute.toLowerCase().includes('rating')) {
      const numericValues = values.filter(v => !isNaN(parseFloat(v.value)));
      if (numericValues.length > 0) {
        return numericValues.reduce((max, current) =>
          parseFloat(current.value) > parseFloat(max.value) ? current : max
        ).index;
      }
    }

    return null;
  };

  const GridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <div key={product.id} className="bg-white rounded-lg border border-gray-200 p-4 relative">
          <button
            onClick={() => handleRemoveProduct(product.id)}
            className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="aspect-square mb-4 bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={product.image_url || '/placeholder-product.jpg'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          <h3 className="font-semibold text-gray-900 mb-2 text-sm">{product.name}</h3>

          <div className="flex items-center mb-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-3 h-3 ${i < product.rating ? 'fill-current' : ''}`} />
              ))}
            </div>
            <span className="text-xs text-gray-600 ml-1">({product.rating})</span>
          </div>

          <p className="text-lg font-bold text-blue-600 mb-4">${product.price}</p>

          <div className="space-y-2 mb-4">
            {getAllAttributes().slice(0, 5).map(attr => (
              <div key={attr} className="flex justify-between text-xs">
                <span className="text-gray-600">{attr}:</span>
                <span className="font-medium">{getAttributeValue(product, attr)}</span>
              </div>
            ))}
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => handleAddToCart(product)}
              className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-xs"
            >
              <ShoppingCart className="w-3 h-3 inline mr-1" />
              Add to Cart
            </button>
            <button
              onClick={() => handleWishlistToggle(product)}
              className={`p-2 rounded-lg transition-colors ${
                isInWishlist(product.id)
                  ? 'bg-red-100 text-red-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Heart className={`w-3 h-3 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const TableView = () => {
    const attributes = getAllAttributes();
    const filteredAttributes = selectedAttributes.length > 0
      ? attributes.filter(attr => selectedAttributes.includes(attr))
      : attributes;

    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left p-4 bg-gray-50 font-semibold">Specification</th>
              {products.map((product, index) => (
                <th key={product.id} className="text-center p-4 bg-gray-50 min-w-48">
                  <button
                    onClick={() => handleRemoveProduct(product.id)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="space-y-2">
                    <img
                      src={product.image_url || '/placeholder-product.jpg'}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-lg mx-auto"
                    />
                    <h4 className="font-semibold text-sm">{product.name}</h4>
                    <p className="text-blue-600 font-bold">${product.price}</p>
                    <div className="flex justify-center space-x-1">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="bg-blue-600 text-white p-1 rounded text-xs"
                      >
                        <ShoppingCart className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleWishlistToggle(product)}
                        className={`p-1 rounded text-xs ${
                          isInWishlist(product.id)
                            ? 'bg-red-100 text-red-600'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        <Heart className={`w-3 h-3 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Basic info rows */}
            <tr className="border-b border-gray-100">
              <td className="p-4 font-medium bg-gray-50">Rating</td>
              {products.map((product) => (
                <td key={product.id} className="p-4 text-center">
                  <div className="flex items-center justify-center">
                    <div className="flex text-yellow-400 mr-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < product.rating ? 'fill-current' : ''}`} />
                      ))}
                    </div>
                    <span className="text-sm">({product.rating})</span>
                  </div>
                </td>
              ))}
            </tr>

            {/* Attribute rows */}
            {filteredAttributes.map((attribute) => {
              const winnerIndex = getWinnerForAttribute(attribute);
              const hasDifferences = hasValueDifferences(attribute);

              return (
                <tr
                  key={attribute}
                  className={`border-b border-gray-100 ${
                    highlightDifferences && hasDifferences ? 'bg-yellow-50' : ''
                  }`}
                >
                  <td className="p-4 font-medium bg-gray-50">{attribute}</td>
                  {products.map((product, index) => {
                    const value = getAttributeValue(product, attribute);
                    const isWinner = winnerIndex === index;

                    return (
                      <td
                        key={product.id}
                        className={`p-4 text-center ${
                          isWinner ? 'bg-green-50 font-semibold text-green-700' : ''
                        }`}
                      >
                        {isWinner && <Check className="w-4 h-4 inline mr-1 text-green-600" />}
                        {value}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const SimilarityAnalysis = () => {
    if (products.length < 2) return null;

    return (
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
          <BarChart3 className="w-4 h-4 mr-2" />
          Similarity Analysis
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map((product1, i) =>
            products.slice(i + 1).map((product2, j) => {
              const similarity = calculateSimilarityScore(product1, product2);
              return (
                <div key={`${i}-${j}`} className="bg-white rounded p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">
                      {product1.name} vs {product2.name}
                    </span>
                    <span className="text-sm text-blue-600 font-bold">{similarity}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${similarity}%` }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="absolute inset-4 bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <GitCompare className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Product Comparison ({products.length}/{maxProducts})
                </h2>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-gray-600">View:</label>
                  <select
                    value={viewMode}
                    onChange={(e) => setViewMode(e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 text-sm"
                  >
                    <option value="grid">Grid</option>
                    <option value="table">Table</option>
                  </select>
                </div>
                <label className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={highlightDifferences}
                    onChange={(e) => setHighlightDifferences(e.target.checked)}
                    className="rounded"
                  />
                  <span>Highlight differences</span>
                </label>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-6">
            {products.length === 0 ? (
              <div className="text-center py-12">
                <GitCompare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Products to Compare</h3>
                <p className="text-gray-600">Add products to comparison to see detailed comparisons.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <SimilarityAnalysis />

                {viewMode === 'table' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Filter Attributes (optional):
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {getAllAttributes().map(attr => (
                        <label key={attr} className="flex items-center space-x-1 text-sm">
                          <input
                            type="checkbox"
                            checked={selectedAttributes.includes(attr)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedAttributes([...selectedAttributes, attr]);
                              } else {
                                setSelectedAttributes(selectedAttributes.filter(a => a !== attr));
                              }
                            }}
                            className="rounded"
                          />
                          <span>{attr}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {viewMode === 'grid' ? <GridView /> : <TableView />}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Comparison floating button
export const ComparisonButton = ({ comparisonProducts, onClick }) => {
  if (comparisonProducts.length === 0) return null;

  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 left-6 bg-blue-600 text-white px-4 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-200 z-40 flex items-center space-x-2"
    >
      <GitCompare className="w-5 h-5" />
      <span>Compare ({comparisonProducts.length})</span>
    </button>
  );
};

export default ProductComparisonWidget;
