import React, { useState, useEffect } from 'react';
import { Truck, Clock, MapPin, Calculator, CheckCircle, AlertCircle } from 'lucide-react';

const ShippingCalculator = ({
  productWeight = 1,
  productDimensions = { length: 10, width: 10, height: 5 },
  productValue = 0,
  className = ''
}) => {
  const [zipCode, setZipCode] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [shippingOptions, setShippingOptions] = useState([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState('');

  const countries = [
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'FR', name: 'France' },
    { code: 'DE', name: 'Germany' },
    { code: 'AU', name: 'Australia' }
  ];

  const calculateShipping = async () => {
    if (!zipCode.trim()) {
      setError('Please enter a valid zip code');
      return;
    }

    setIsCalculating(true);
    setError('');

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock shipping calculation based on weight, dimensions, and location
      const baseRate = productWeight * 2.5;
      const dimensionFactor = (productDimensions.length * productDimensions.width * productDimensions.height) / 1000;
      const countryMultiplier = selectedCountry === 'US' ? 1 : selectedCountry === 'CA' ? 1.3 : 2.0;

      const mockOptions = [
        {
          id: 'standard',
          name: 'Standard Shipping',
          description: 'Delivered in 5-7 business days',
          price: Math.round((baseRate + dimensionFactor) * countryMultiplier * 100) / 100,
          estimatedDays: '5-7',
          icon: Truck,
          color: 'text-blue-600',
          features: ['Tracking included', 'Insurance up to $100']
        },
        {
          id: 'express',
          name: 'Express Shipping',
          description: 'Delivered in 2-3 business days',
          price: Math.round((baseRate + dimensionFactor) * countryMultiplier * 1.8 * 100) / 100,
          estimatedDays: '2-3',
          icon: Clock,
          color: 'text-orange-600',
          features: ['Priority handling', 'Tracking included', 'Insurance up to $500']
        },
        {
          id: 'overnight',
          name: 'Overnight Shipping',
          description: 'Delivered next business day',
          price: Math.round((baseRate + dimensionFactor) * countryMultiplier * 3.5 * 100) / 100,
          estimatedDays: '1',
          icon: MapPin,
          color: 'text-red-600',
          features: ['Next day delivery', 'Signature required', 'Full insurance coverage']
        }
      ];

      // Add free shipping option for orders over $50
      if (productValue >= 50) {
        mockOptions.unshift({
          id: 'free',
          name: 'Free Standard Shipping',
          description: 'Delivered in 5-7 business days',
          price: 0,
          estimatedDays: '5-7',
          icon: CheckCircle,
          color: 'text-green-600',
          features: ['Free for orders over $50', 'Tracking included']
        });
      }

      setShippingOptions(mockOptions);
    } catch (err) {
      setError('Unable to calculate shipping. Please try again.');
    } finally {
      setIsCalculating(false);
    }
  };

  const formatDeliveryDate = (days) => {
    const today = new Date();
    const deliveryDate = new Date();

    if (days.includes('-')) {
      const maxDays = parseInt(days.split('-')[1]);
      deliveryDate.setDate(today.getDate() + maxDays);
    } else {
      deliveryDate.setDate(today.getDate() + parseInt(days));
    }

    return deliveryDate.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-6 ${className}`}>
      <div className="flex items-center mb-4">
        <Calculator className="w-5 h-5 text-gray-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">Shipping Calculator</h3>
      </div>

      {/* Input Form */}
      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country
            </label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {countries.map(country => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {selectedCountry === 'US' ? 'ZIP Code' : 'Postal Code'}
            </label>
            <input
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              placeholder={selectedCountry === 'US' ? '12345' : 'Enter postal code'}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {error && (
          <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}

        <button
          onClick={calculateShipping}
          disabled={isCalculating || !zipCode.trim()}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isCalculating ? 'Calculating...' : 'Calculate Shipping'}
        </button>
      </div>

      {/* Shipping Options */}
      {shippingOptions.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 mb-3">Available Shipping Options</h4>

          {shippingOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <div key={option.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg bg-gray-100 ${option.color}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h5 className="font-medium text-gray-900">{option.name}</h5>
                        {option.price === 0 && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                            FREE
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Estimated delivery: {formatDeliveryDate(option.estimatedDays)}
                      </p>

                      {/* Features */}
                      <div className="mt-2 space-y-1">
                        {option.features.map((feature, index) => (
                          <div key={index} className="flex items-center text-xs text-gray-500">
                            <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">
                      {option.price === 0 ? 'FREE' : `$${option.price.toFixed(2)}`}
                    </div>
                    <div className="text-sm text-gray-500">
                      {option.estimatedDays} {option.estimatedDays === '1' ? 'day' : 'days'}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Product Details */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h5 className="text-sm font-medium text-gray-700 mb-2">Package Details</h5>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div>Weight: {productWeight} lbs</div>
          <div>Value: ${productValue}</div>
          <div>
            Dimensions: {productDimensions.length}" × {productDimensions.width}" × {productDimensions.height}"
          </div>
          <div>Origin: United States</div>
        </div>
      </div>
    </div>
  );
};

export default ShippingCalculator;
