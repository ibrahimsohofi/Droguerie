import React, { useState, useContext, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { LanguageContext } from '../context/LanguageContext';
import { AuthContext } from '../context/AuthContext';

const OrderTracking = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useContext(LanguageContext);
  const { user } = useContext(AuthContext);

  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchForm, setSearchForm] = useState({
    identifier: searchParams.get('tracking') || '',
    email: searchParams.get('email') || (user ? user.email : '')
  });

  // Auto-search if parameters are provided
  useEffect(() => {
    if (searchParams.get('tracking')) {
      handleSearch();
    }
  }, []);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();

    if (!searchForm.identifier) {
      setError('Please enter an order ID or tracking number');
      return;
    }

    if (!user && !searchForm.email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError('');
    setTrackingData(null);

    try {
      const params = new URLSearchParams();
      if (!user && searchForm.email) {
        params.append('email', searchForm.email);
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/orders/tracking/${searchForm.identifier}?${params}`,
        {
          headers: user ? {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          } : {}
        }
      );

      const data = await response.json();

      if (data.success) {
        setTrackingData(data.data);
      } else {
        setError(data.message || 'Order not found');
      }
    } catch (error) {
      console.error('Error tracking order:', error);
      setError('Error tracking order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-indigo-100 text-indigo-800',
      shipped: 'bg-purple-100 text-purple-800',
      out_for_delivery: 'bg-orange-100 text-orange-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: '⏳',
      confirmed: '✅',
      processing: '🔄',
      shipped: '🚚',
      out_for_delivery: '🚛',
      delivered: '📦',
      cancelled: '❌'
    };
    return icons[status] || '❓';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const statusSteps = [
    { key: 'pending', label: 'Order Placed' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'processing', label: 'Processing' },
    { key: 'shipped', label: 'Shipped' },
    { key: 'out_for_delivery', label: 'Out for Delivery' },
    { key: 'delivered', label: 'Delivered' }
  ];

  const getCurrentStepIndex = (status) => {
    return statusSteps.findIndex(step => step.key === status);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Order</h1>
          <p className="text-gray-600">Enter your order details to track your shipment</p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order ID or Tracking Number
                </label>
                <input
                  type="text"
                  value={searchForm.identifier}
                  onChange={(e) => setSearchForm({ ...searchForm, identifier: e.target.value })}
                  placeholder="e.g., #123 or DJ12345678AB"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>

              {!user && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={searchForm.email}
                    onChange={(e) => setSearchForm({ ...searchForm, email: e.target.value })}
                    placeholder="your@email.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              <span>{loading ? 'Tracking...' : 'Track Order'}</span>
            </button>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-8 border border-red-200">
            {error}
          </div>
        )}

        {/* Tracking Results */}
        {trackingData && (
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Order #{trackingData.id}</h2>
                  {trackingData.trackingNumber && (
                    <p className="text-gray-600">Tracking: {trackingData.trackingNumber}</p>
                  )}
                </div>
                <div className="mt-2 md:mt-0">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(trackingData.status)}`}>
                    <span className="mr-1">{getStatusIcon(trackingData.status)}</span>
                    {trackingData.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Order Date</p>
                  <p className="font-medium">{formatDate(trackingData.createdAt)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Total Amount</p>
                  <p className="font-medium">{trackingData.totalAmount} MAD</p>
                </div>
                {trackingData.estimatedDelivery && (
                  <div>
                    <p className="text-gray-600">Estimated Delivery</p>
                    <p className="font-medium">{formatDate(trackingData.estimatedDelivery)}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Status Progress */}
            {trackingData.status !== 'cancelled' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Progress</h3>
                <div className="flex items-center justify-between">
                  {statusSteps.map((step, index) => {
                    const currentIndex = getCurrentStepIndex(trackingData.status);
                    const isCompleted = index <= currentIndex;
                    const isCurrent = index === currentIndex;

                    return (
                      <div key={step.key} className="flex flex-col items-center flex-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          isCompleted
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-600'
                        } ${isCurrent ? 'ring-2 ring-green-300' : ''}`}>
                          {isCompleted ? '✓' : index + 1}
                        </div>
                        <p className={`text-xs mt-1 text-center ${
                          isCompleted ? 'text-green-600 font-medium' : 'text-gray-500'
                        }`}>
                          {step.label}
                        </p>
                        {index < statusSteps.length - 1 && (
                          <div className={`absolute h-0.5 w-full top-4 ${
                            index < currentIndex ? 'bg-green-500' : 'bg-gray-200'
                          }`} style={{ left: '50%', width: 'calc(100% - 2rem)' }} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Shipping Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Customer</p>
                  <p className="font-medium">{trackingData.customerName}</p>
                  <p className="text-sm text-gray-600">{trackingData.customerEmail}</p>
                  {trackingData.customerPhone && (
                    <p className="text-sm text-gray-600">{trackingData.customerPhone}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-600">Shipping Address</p>
                  <p className="font-medium">{trackingData.shippingAddress.address}</p>
                  <p className="text-sm text-gray-600">
                    {trackingData.shippingAddress.city} {trackingData.shippingAddress.postalCode}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
              <div className="space-y-3">
                {trackingData.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-medium">{item.price * item.quantity} MAD</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Status History */}
            {trackingData.statusHistory.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Status History</h3>
                <div className="space-y-3">
                  {trackingData.statusHistory.map((history, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded">
                      <div className="flex-shrink-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(history.status)}`}>
                          {getStatusIcon(history.status)}
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium capitalize">{history.status.replace('_', ' ')}</p>
                        {history.notes && (
                          <p className="text-sm text-gray-600">{history.notes}</p>
                        )}
                        <p className="text-xs text-gray-500">
                          {formatDate(history.createdAt)}
                          {history.updatedBy && ` • Updated by ${history.updatedBy}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-2">Need help with your order?</p>
          <button
            onClick={() => navigate('/contact')}
            className="text-green-600 hover:text-green-700 font-medium"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
