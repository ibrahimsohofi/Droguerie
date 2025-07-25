import React, { useState, useEffect, useContext } from 'react';
import { Calculator, Package, Truck, Info, AlertCircle, CheckCircle } from 'lucide-react';
import { CartContext } from '../context/CartContext';

const BulkOrderCalculator = ({ product, isOpen, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [calculationType, setCalculationType] = useState('volume'); // volume, coverage, duration
  const [specifications, setSpecifications] = useState({
    roomArea: '',
    frequency: 'daily',
    coverage: '',
    duration: ''
  });
  const [results, setResults] = useState(null);
  const { addToCart } = useContext(CartContext);

  const bulkTiers = [
    { min: 1, max: 4, discount: 0, label: 'Regular Price' },
    { min: 5, max: 9, discount: 5, label: '5% off (5-9 items)' },
    { min: 10, max: 19, discount: 10, label: '10% off (10-19 items)' },
    { min: 20, max: 49, discount: 15, label: '15% off (20-49 items)' },
    { min: 50, max: Infinity, discount: 20, label: '20% off (50+ items)' }
  ];

  const frequencyOptions = {
    daily: { multiplier: 365, label: 'Daily' },
    weekly: { multiplier: 52, label: 'Weekly' },
    monthly: { multiplier: 12, label: 'Monthly' },
    quarterly: { multiplier: 4, label: 'Quarterly' }
  };

  useEffect(() => {
    calculateBulkNeeds();
  }, [quantity, specifications, calculationType]);

  const calculateBulkNeeds = () => {
    if (!product) return;

    let calculatedQuantity = quantity;
    let recommendations = [];

    // Calculate based on type
    switch (calculationType) {
      case 'volume':
        if (specifications.roomArea && product.coverage) {
          calculatedQuantity = Math.ceil(specifications.roomArea / product.coverage);
          recommendations.push(`For ${specifications.roomArea}m², you need ${calculatedQuantity} units`);
        }
        break;

      case 'coverage':
        if (specifications.coverage) {
          const productCoverage = product.coverage || 10; // default coverage per unit
          calculatedQuantity = Math.ceil(specifications.coverage / productCoverage);
          recommendations.push(`To cover ${specifications.coverage}m², you need ${calculatedQuantity} units`);
        }
        break;

      case 'duration':
        if (specifications.duration && specifications.frequency) {
          const freq = frequencyOptions[specifications.frequency];
          const usagePerYear = freq.multiplier;
          const yearsNeeded = parseInt(specifications.duration) / 12; // duration in months
          calculatedQuantity = Math.ceil(usagePerYear * yearsNeeded);
          recommendations.push(`For ${specifications.duration} months of ${freq.label.toLowerCase()} use, you need ${calculatedQuantity} units`);
        }
        break;
    }

    // Find applicable bulk tier
    const tier = bulkTiers.find(t => calculatedQuantity >= t.min && calculatedQuantity <= t.max);
    const originalPrice = calculatedQuantity * product.price;
    const discountAmount = originalPrice * (tier.discount / 100);
    const finalPrice = originalPrice - discountAmount;

    // Calculate shipping
    const shippingCost = calculatedQuantity >= 10 ? 0 : 50; // Free shipping for 10+ items
    const totalWithShipping = finalPrice + shippingCost;

    // Environmental impact (for cleaning products)
    const environmentalImpact = getEnvironmentalImpact(calculatedQuantity);

    setResults({
      recommendedQuantity: calculatedQuantity,
      tier,
      originalPrice,
      discountAmount,
      finalPrice,
      shippingCost,
      totalWithShipping,
      savings: discountAmount + (shippingCost > 0 ? 0 : 50),
      recommendations,
      environmentalImpact
    });

    setQuantity(calculatedQuantity);
  };

  const getEnvironmentalImpact = (qty) => {
    const category = product.category?.toLowerCase() || '';

    if (category.includes('cleaning') || category.includes('detergent')) {
      const packagingReduction = Math.floor(qty / 5) * 0.2; // 0.2kg plastic saved per 5 items
      return {
        packagingReduction: packagingReduction.toFixed(1),
        co2Reduction: (packagingReduction * 3.2).toFixed(1), // 3.2kg CO2 per kg plastic
        message: `Bulk buying reduces packaging waste`
      };
    }

    return null;
  };

  const handleAddToBulkCart = () => {
    if (results) {
      addToCart(product, results.recommendedQuantity);
      onClose();
    }
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center space-x-2">
            <Calculator className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Bulk Order Calculator</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Product Info */}
          <div className="flex items-center space-x-4 bg-gray-50 rounded-lg p-4">
            <img
              src={product.image || '/placeholder-product.jpg'}
              alt={product.name}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div>
              <h3 className="font-semibold text-gray-900">{product.name}</h3>
              <p className="text-blue-600 font-medium">{product.price} MAD per unit</p>
            </div>
          </div>

          {/* Calculation Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Calculation Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setCalculationType('volume')}
                className={`p-3 text-sm font-medium rounded-lg border-2 transition-colors ${
                  calculationType === 'volume'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                By Area
              </button>
              <button
                onClick={() => setCalculationType('coverage')}
                className={`p-3 text-sm font-medium rounded-lg border-2 transition-colors ${
                  calculationType === 'coverage'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                By Coverage
              </button>
              <button
                onClick={() => setCalculationType('duration')}
                className={`p-3 text-sm font-medium rounded-lg border-2 transition-colors ${
                  calculationType === 'duration'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                By Duration
              </button>
            </div>
          </div>

          {/* Input Fields */}
          <div className="space-y-4">
            {calculationType === 'volume' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Room Area (m²)
                </label>
                <input
                  type="number"
                  value={specifications.roomArea}
                  onChange={(e) => setSpecifications(prev => ({ ...prev, roomArea: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter room area in square meters"
                />
              </div>
            )}

            {calculationType === 'coverage' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Coverage Needed (m²)
                </label>
                <input
                  type="number"
                  value={specifications.coverage}
                  onChange={(e) => setSpecifications(prev => ({ ...prev, coverage: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter total coverage needed"
                />
              </div>
            )}

            {calculationType === 'duration' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (months)
                  </label>
                  <input
                    type="number"
                    value={specifications.duration}
                    onChange={(e) => setSpecifications(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Number of months"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Usage Frequency
                  </label>
                  <select
                    value={specifications.frequency}
                    onChange={(e) => setSpecifications(prev => ({ ...prev, frequency: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {Object.entries(frequencyOptions).map(([key, option]) => (
                      <option key={key} value={key}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Results */}
          {results && (
            <div className="bg-blue-50 rounded-lg p-4 space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
                <Package className="h-5 w-5 text-blue-600" />
                <span>Bulk Order Recommendation</span>
              </h3>

              {/* Recommendations */}
              {results.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700">{rec}</p>
                </div>
              ))}

              {/* Pricing Breakdown */}
              <div className="bg-white rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span>Recommended Quantity:</span>
                  <span className="font-semibold">{results.recommendedQuantity} units</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Original Price:</span>
                  <span>{results.originalPrice.toFixed(2)} MAD</span>
                </div>
                {results.tier.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>{results.tier.label}:</span>
                    <span>-{results.discountAmount.toFixed(2)} MAD</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span>{results.finalPrice.toFixed(2)} MAD</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping:</span>
                  <span>{results.shippingCost === 0 ? 'FREE' : `${results.shippingCost} MAD`}</span>
                </div>
                <hr />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span>{results.totalWithShipping.toFixed(2)} MAD</span>
                </div>
                {results.savings > 0 && (
                  <div className="flex items-center space-x-1 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">You save {results.savings.toFixed(2)} MAD!</span>
                  </div>
                )}
              </div>

              {/* Environmental Impact */}
              {results.environmentalImpact && (
                <div className="bg-green-50 rounded-lg p-3">
                  <h4 className="font-medium text-green-800 mb-2">Environmental Impact</h4>
                  <div className="text-sm text-green-700 space-y-1">
                    <p>🌱 {results.environmentalImpact.message}</p>
                    <p>📦 Saves {results.environmentalImpact.packagingReduction}kg packaging waste</p>
                    <p>🌍 Reduces {results.environmentalImpact.co2Reduction}kg CO₂ emissions</p>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={handleAddToBulkCart}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Package className="h-5 w-5" />
                <span>Add {results.recommendedQuantity} items to Cart</span>
              </button>
            </div>
          )}

          {/* Bulk Discount Tiers Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Bulk Discount Tiers</h3>
            <div className="space-y-2">
              {bulkTiers.map((tier, index) => (
                <div
                  key={index}
                  className={`flex justify-between text-sm p-2 rounded ${
                    results && quantity >= tier.min && quantity <= tier.max
                      ? 'bg-blue-100 text-blue-800'
                      : 'text-gray-600'
                  }`}
                >
                  <span>{tier.label}</span>
                  <span>{tier.discount}% off</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkOrderCalculator;
