import React from 'react';
import { Scale, X, Eye } from 'lucide-react';
import { useComparison } from '../context/ComparisonContext';

const FloatingComparisonWidget = () => {
  const {
    compareProducts,
    getComparisonCount,
    removeFromComparison,
    clearComparison,
    toggleComparison
  } = useComparison();

  if (getComparisonCount() === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 p-4 max-w-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Scale className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">
              Compare ({getComparisonCount()}/4)
            </h3>
          </div>
          <button
            onClick={clearComparison}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="Clear all"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Product Preview */}
        <div className="space-y-2 mb-4 max-h-32 overflow-y-auto">
          {compareProducts.map((product) => (
            <div key={product.id} className="flex items-center space-x-3 bg-gray-50 rounded-lg p-2">
              <img
                src={product.image || '/placeholder-product.jpg'}
                alt={product.name}
                className="w-10 h-10 object-cover rounded"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {product.name}
                </p>
                <p className="text-xs text-gray-500">
                  {product.price} MAD
                </p>
              </div>
              <button
                onClick={() => removeFromComparison(product.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
                title="Remove"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={toggleComparison}
            disabled={getComparisonCount() < 2}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <Eye className="h-4 w-4" />
            <span>Compare Products</span>
          </button>

          {getComparisonCount() < 2 && (
            <p className="text-xs text-gray-500 text-center">
              Add at least 2 products to compare
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FloatingComparisonWidget;
