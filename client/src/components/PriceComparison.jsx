import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, AlertCircle, ExternalLink } from 'lucide-react';

const PriceComparison = ({
  currentPrice,
  originalPrice,
  productId,
  className = ''
}) => {
  const [priceHistory, setPriceHistory] = useState([]);
  const [competitors, setCompetitors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (productId) {
      fetchPriceData();
    }
  }, [productId]);

  const fetchPriceData = async () => {
    try {
      setIsLoading(true);
      // Mock data - replace with actual API calls
      const mockHistory = [
        { date: '2025-01-01', price: 120.00 },
        { date: '2025-01-05', price: 115.00 },
        { date: '2025-01-10', price: 110.00 },
        { date: '2025-01-15', price: currentPrice }
      ];

      const mockCompetitors = [
        {
          name: 'Competitor A',
          price: currentPrice + 5,
          url: '#',
          shipping: 'Free shipping',
          rating: 4.2
        },
        {
          name: 'Competitor B',
          price: currentPrice - 2,
          url: '#',
          shipping: '$5.99 shipping',
          rating: 4.0
        },
        {
          name: 'Competitor C',
          price: currentPrice + 10,
          url: '#',
          shipping: 'Free shipping',
          rating: 4.5
        }
      ];

      setPriceHistory(mockHistory);
      setCompetitors(mockCompetitors);
    } catch (error) {
      console.error('Error fetching price data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculatePriceChange = () => {
    if (priceHistory.length < 2) return { amount: 0, percentage: 0, trend: 'stable' };

    const oldest = priceHistory[0].price;
    const current = currentPrice;
    const amount = current - oldest;
    const percentage = ((amount / oldest) * 100);

    return {
      amount: Math.abs(amount),
      percentage: Math.abs(percentage),
      trend: amount > 0 ? 'up' : amount < 0 ? 'down' : 'stable'
    };
  };

  const getDiscountPercentage = () => {
    if (!originalPrice || originalPrice <= currentPrice) return 0;
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-red-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-green-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const priceChange = calculatePriceChange();
  const discountPercentage = getDiscountPercentage();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Current Price Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Information</h3>

        <div className="flex items-center space-x-4 mb-4">
          <div className="text-3xl font-bold text-gray-900">
            ${currentPrice}
          </div>

          {originalPrice && originalPrice > currentPrice && (
            <div className="flex items-center space-x-2">
              <span className="text-lg text-gray-500 line-through">
                ${originalPrice}
              </span>
              <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">
                {discountPercentage}% OFF
              </span>
            </div>
          )}
        </div>

        {/* Price Trend */}
        {priceHistory.length > 1 && (
          <div className="flex items-center space-x-2 text-sm">
            {getTrendIcon(priceChange.trend)}
            <span className={`font-medium ${
              priceChange.trend === 'up' ? 'text-red-600' :
              priceChange.trend === 'down' ? 'text-green-600' : 'text-gray-600'
            }`}>
              ${priceChange.amount.toFixed(2)} ({priceChange.percentage.toFixed(1)}%)
            </span>
            <span className="text-gray-500">from lowest price</span>
          </div>
        )}
      </div>

      {/* Price History Chart (Simplified) */}
      {priceHistory.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-md font-semibold text-gray-900 mb-4">Price History</h4>
          <div className="space-y-2">
            {priceHistory.map((entry, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                <span className="text-sm text-gray-600">
                  {new Date(entry.date).toLocaleDateString()}
                </span>
                <span className="font-medium text-gray-900">
                  ${entry.price.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Competitor Comparison */}
      {competitors.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-md font-semibold text-gray-900">Compare Prices</h4>
            <div className="flex items-center text-sm text-gray-500">
              <AlertCircle className="w-4 h-4 mr-1" />
              <span>Prices from other sellers</span>
            </div>
          </div>

          <div className="space-y-3">
            {/* Current Store */}
            <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div>
                <div className="font-medium text-blue-900">Our Store</div>
                <div className="text-sm text-blue-700">Free shipping • 4.8 ★</div>
              </div>
              <div className="text-lg font-bold text-blue-900">
                ${currentPrice}
              </div>
            </div>

            {/* Competitors */}
            {competitors.map((competitor, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{competitor.name}</div>
                  <div className="text-sm text-gray-600">
                    {competitor.shipping} • {competitor.rating} ★
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-lg font-bold text-gray-900">
                    ${competitor.price}
                  </div>
                  <a
                    href={competitor.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 text-xs text-gray-500 text-center">
            Prices are updated regularly and may vary. Click links to verify current prices.
          </div>
        </div>
      )}

      {/* Price Alert */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertCircle className="w-5 h-5 text-yellow-600 mr-3" />
          <div>
            <h5 className="font-medium text-yellow-900">Price Alert</h5>
            <p className="text-sm text-yellow-700">
              Get notified when the price drops below ${(currentPrice * 0.9).toFixed(2)}
            </p>
          </div>
          <button className="ml-auto bg-yellow-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-yellow-700 transition-colors">
            Set Alert
          </button>
        </div>
      </div>
    </div>
  );
};

export default PriceComparison;
