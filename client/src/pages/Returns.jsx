import React, { useState, useEffect } from 'react';
import { ArrowLeft, Package, RefreshCw, AlertCircle, CheckCircle, Clock, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';

const API_BASE = `${import.meta.env.VITE_API_URL}/api`;

const Returns = () => {
  const [orders, setOrders] = useState([]);
  const [returns, setReturns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [returnForm, setReturnForm] = useState({
    items: [],
    reason: '',
    condition: '',
    description: '',
    refundMethod: 'original'
  });
  const { user } = useAuth();
  const { language } = useLanguage();

  useEffect(() => {
    fetchOrdersAndReturns();
  }, []);

  const fetchOrdersAndReturns = async () => {
    try {
      setIsLoading(true);
      // Mock data - replace with actual API calls
      const mockOrders = [
        {
          id: 1,
          orderNumber: 'ORD-2025-001',
          date: '2025-01-10',
          total: 299.99,
          status: 'delivered',
          deliveredDate: '2025-01-15',
          items: [
            {
              id: 1,
              name: 'Premium Wireless Headphones',
              quantity: 1,
              price: 149.99,
              image: '${import.meta.env.VITE_API_URL}/api/placeholder/60/60',
              returnable: true,
              returnWindow: 30
            },
            {
              id: 2,
              name: 'Phone Case',
              quantity: 2,
              price: 75.00,
              image: '${import.meta.env.VITE_API_URL}/api/placeholder/60/60',
              returnable: true,
              returnWindow: 30
            }
          ]
        }
      ];

      const mockReturns = [
        {
          id: 1,
          returnNumber: 'RET-2025-001',
          orderNumber: 'ORD-2025-002',
          date: '2025-01-12',
          status: 'processing',
          items: [
            {
              name: 'Bluetooth Speaker',
              quantity: 1,
              refundAmount: 89.99
            }
          ],
          reason: 'defective',
          totalRefund: 89.99,
          estimatedRefundDate: '2025-01-20'
        }
      ];

      setOrders(mockOrders);
      setReturns(mockReturns);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const returnReasons = [
    { value: 'defective', label: 'Defective/Damaged' },
    { value: 'wrong_item', label: 'Wrong item received' },
    { value: 'not_as_described', label: 'Not as described' },
    { value: 'no_longer_needed', label: 'No longer needed' },
    { value: 'size_fit', label: 'Size/Fit issues' },
    { value: 'other', label: 'Other reason' }
  ];

  const itemConditions = [
    { value: 'unopened', label: 'Unopened/New' },
    { value: 'opened_unused', label: 'Opened but unused' },
    { value: 'used_good', label: 'Used - Good condition' },
    { value: 'used_fair', label: 'Used - Fair condition' },
    { value: 'damaged', label: 'Damaged' }
  ];

  const isReturnEligible = (order) => {
    if (order.status !== 'delivered') return false;
    const deliveredDate = new Date(order.deliveredDate);
    const today = new Date();
    const daysSinceDelivery = Math.floor((today - deliveredDate) / (1000 * 60 * 60 * 24));
    return daysSinceDelivery <= 30; // 30-day return window
  };

  const initializeReturn = (order) => {
    setSelectedOrder(order);
    setReturnForm({
      items: order.items.map(item => ({ ...item, selected: false, returnQuantity: 0 })),
      reason: '',
      condition: '',
      description: '',
      refundMethod: 'original'
    });
    setShowReturnModal(true);
  };

  const handleItemSelection = (itemId, selected) => {
    setReturnForm(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === itemId
          ? { ...item, selected, returnQuantity: selected ? 1 : 0 }
          : item
      )
    }));
  };

  const handleQuantityChange = (itemId, quantity) => {
    setReturnForm(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === itemId
          ? { ...item, returnQuantity: Math.min(quantity, item.quantity) }
          : item
      )
    }));
  };

  const calculateRefundTotal = () => {
    return returnForm.items
      .filter(item => item.selected)
      .reduce((total, item) => total + (item.price * item.returnQuantity), 0);
  };

  const submitReturn = async () => {
    try {
      const selectedItems = returnForm.items.filter(item => item.selected);
      if (selectedItems.length === 0) {
        alert('Please select at least one item to return');
        return;
      }

      // Mock API call
      console.log('Submitting return:', {
        orderId: selectedOrder.id,
        items: selectedItems,
        reason: returnForm.reason,
        condition: returnForm.condition,
        description: returnForm.description,
        refundMethod: returnForm.refundMethod
      });

      // Close modal and refresh data
      setShowReturnModal(false);
      fetchOrdersAndReturns();

      alert('Return request submitted successfully!');
    } catch (error) {
      console.error('Error submitting return:', error);
      alert('Failed to submit return request. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center mb-8">
        <Link to="/orders" className="mr-4">
          <ArrowLeft className="w-6 h-6 text-gray-600 hover:text-gray-900" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Returns & Refunds</h1>
          <p className="text-gray-600">Manage your returns and track refund status</p>
        </div>
      </div>

      {/* Return Policy Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <div className="flex items-start">
          <AlertCircle className="w-6 h-6 text-blue-600 mr-3 mt-1" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">Return Policy</h3>
            <ul className="text-blue-800 space-y-1 text-sm">
              <li>• Items can be returned within 30 days of delivery</li>
              <li>• Items must be in original condition with tags attached</li>
              <li>• Digital products and personalized items are non-returnable</li>
              <li>• Refunds are processed within 5-7 business days</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Eligible Orders for Return */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Eligible for Return</h2>

          {orders.filter(order => isReturnEligible(order)).length > 0 ? (
            <div className="space-y-4">
              {orders.filter(order => isReturnEligible(order)).map(order => (
                <div key={order.id} className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-medium text-gray-900">Order #{order.orderNumber}</h3>
                      <p className="text-sm text-gray-600">
                        Delivered on {new Date(order.deliveredDate).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => initializeReturn(order)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      Start Return
                    </button>
                  </div>

                  <div className="space-y-3">
                    {order.items.map(item => (
                      <div key={item.id} className="flex items-center space-x-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-600">Qty: {item.quantity} • ${item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No eligible orders</h3>
              <p className="text-gray-600">You don't have any orders eligible for return at this time.</p>
            </div>
          )}
        </div>

        {/* Return Status */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Return Status</h2>

          {returns.length > 0 ? (
            <div className="space-y-4">
              {returns.map(returnItem => (
                <div key={returnItem.id} className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-medium text-gray-900">Return #{returnItem.returnNumber}</h3>
                      <p className="text-sm text-gray-600">
                        Order #{returnItem.orderNumber}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(returnItem.status)}`}>
                      {returnItem.status.charAt(0).toUpperCase() + returnItem.status.slice(1)}
                    </span>
                  </div>

                  <div className="space-y-3 mb-4">
                    {returnItem.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-gray-900">{item.name} (Qty: {item.quantity})</span>
                        <span className="font-medium">${item.refundAmount}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total Refund:</span>
                      <span>${returnItem.totalRefund}</span>
                    </div>
                    {returnItem.estimatedRefundDate && (
                      <p className="text-sm text-gray-600 mt-2">
                        <Clock className="w-4 h-4 inline mr-1" />
                        Estimated refund: {new Date(returnItem.estimatedRefundDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <RefreshCw className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No returns yet</h3>
              <p className="text-gray-600">Your return requests will appear here.</p>
            </div>
          )}
        </div>
      </div>

      {/* Return Modal */}
      <Modal
        isOpen={showReturnModal}
        onClose={() => setShowReturnModal(false)}
        title={`Return Items - Order #${selectedOrder?.orderNumber}`}
        size="lg"
      >
        <div className="space-y-6">
          {/* Select Items */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Select items to return</h4>
            <div className="space-y-3">
              {returnForm.items.map(item => (
                <div key={item.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                  <input
                    type="checkbox"
                    checked={item.selected}
                    onChange={(e) => handleItemSelection(item.id, e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">${item.price}</p>
                  </div>
                  {item.selected && (
                    <div className="flex items-center space-x-2">
                      <label className="text-sm text-gray-600">Qty:</label>
                      <input
                        type="number"
                        min="1"
                        max={item.quantity}
                        value={item.returnQuantity}
                        onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                        className="w-16 px-2 py-1 border border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-600">of {item.quantity}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Return Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for return *
            </label>
            <select
              value={returnForm.reason}
              onChange={(e) => setReturnForm(prev => ({ ...prev, reason: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a reason</option>
              {returnReasons.map(reason => (
                <option key={reason.value} value={reason.value}>
                  {reason.label}
                </option>
              ))}
            </select>
          </div>

          {/* Item Condition */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Item condition *
            </label>
            <select
              value={returnForm.condition}
              onChange={(e) => setReturnForm(prev => ({ ...prev, condition: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select condition</option>
              {itemConditions.map(condition => (
                <option key={condition.value} value={condition.value}>
                  {condition.label}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional details (optional)
            </label>
            <textarea
              value={returnForm.description}
              onChange={(e) => setReturnForm(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Please provide any additional details about the return..."
            />
          </div>

          {/* Refund Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Refund method
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="original"
                  checked={returnForm.refundMethod === 'original'}
                  onChange={(e) => setReturnForm(prev => ({ ...prev, refundMethod: e.target.value }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Original payment method</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="store_credit"
                  checked={returnForm.refundMethod === 'store_credit'}
                  onChange={(e) => setReturnForm(prev => ({ ...prev, refundMethod: e.target.value }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Store credit (10% bonus)</span>
              </label>
            </div>
          </div>

          {/* Total Refund */}
          {calculateRefundTotal() > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Estimated Refund:</span>
                <span>${calculateRefundTotal().toFixed(2)}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Shipping costs are not refunded unless the return is due to our error.
              </p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowReturnModal(false)}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={submitReturn}
              disabled={!returnForm.reason || !returnForm.condition || calculateRefundTotal() === 0}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Submit Return Request
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Returns;
