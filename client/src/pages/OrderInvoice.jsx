import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Download, Printer, Mail, Calendar, MapPin, Package, CreditCard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LoadingSpinner from '../components/LoadingSpinner';

const API_BASE = `${import.meta.env.VITE_API_URL}/api`;

const OrderInvoice = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const { language } = useLanguage();

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setIsLoading(true);
      // Mock order data - replace with actual API call
      const mockOrder = {
        id: orderId,
        orderNumber: `ORD-2025-${orderId.padStart(3, '0')}`,
        date: '2025-01-15T10:30:00Z',
        status: 'delivered',
        customer: {
          name: user?.firstName + ' ' + user?.lastName || 'John Doe',
          email: user?.email || 'john.doe@email.com',
          phone: '+1 (555) 123-4567'
        },
        billingAddress: {
          name: 'John Doe',
          street: '123 Main Street',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'United States'
        },
        shippingAddress: {
          name: 'John Doe',
          street: '123 Main Street',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'United States'
        },
        items: [
          {
            id: 1,
            name: 'Premium Wireless Headphones',
            sku: 'WHD-001',
            quantity: 1,
            unitPrice: 149.99,
            total: 149.99,
            image: '${import.meta.env.VITE_API_URL}/api/placeholder/60/60'
          },
          {
            id: 2,
            name: 'Bluetooth Speaker',
            sku: 'SPK-002',
            quantity: 2,
            unitPrice: 89.99,
            total: 179.98,
            image: '${import.meta.env.VITE_API_URL}/api/placeholder/60/60'
          }
        ],
        subtotal: 329.97,
        shipping: 9.99,
        tax: 23.10,
        total: 363.06,
        paymentMethod: {
          type: 'credit_card',
          last4: '4242',
          brand: 'Visa'
        },
        trackingNumber: 'TRK123456789'
      };

      setOrder(mockOrder);
    } catch (err) {
      setError('Failed to load order details');
      console.error('Error fetching order:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // Mock PDF download - replace with actual PDF generation
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent('Mock PDF content'));
    element.setAttribute('download', `invoice-${order.orderNumber}.pdf`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleEmailInvoice = () => {
    const subject = `Invoice for Order ${order.orderNumber}`;
    const body = `Please find your invoice for order ${order.orderNumber} attached.`;
    window.location.href = `mailto:${order.customer.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600">{error || 'The requested order could not be found.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 print:hidden">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Invoice</h1>
          <p className="text-gray-600">Order #{order.orderNumber}</p>
        </div>
        <div className="flex space-x-3 mt-4 md:mt-0">
          <button
            onClick={handlePrint}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Printer className="w-4 h-4 mr-2" />
            Print
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </button>
          <button
            onClick={handleEmailInvoice}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Mail className="w-4 h-4 mr-2" />
            Email
          </button>
        </div>
      </div>

      {/* Invoice Content */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden print:border-0 print:shadow-none">
        {/* Invoice Header */}
        <div className="bg-gray-50 px-6 py-8 print:bg-white">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Droguerie</h2>
              <div className="text-gray-600 space-y-1">
                <p>123 Business Street</p>
                <p>Casablanca, Morocco</p>
                <p>Phone: +212 5XX-XXXXXX</p>
                <p>Email: info@droguerie.com</p>
              </div>
            </div>
            <div className="mt-6 md:mt-0 text-right">
              <div className="text-2xl font-bold text-gray-900 mb-2">INVOICE</div>
              <div className="space-y-1 text-gray-600">
                <p><span className="font-medium">Invoice #:</span> {order.orderNumber}</p>
                <p><span className="font-medium">Date:</span> {new Date(order.date).toLocaleDateString()}</p>
                <p><span className="font-medium">Status:</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Customer & Address Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Bill To */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Bill To</h3>
              <div className="text-gray-600 space-y-1">
                <p className="font-medium">{order.billingAddress.name}</p>
                <p>{order.customer.email}</p>
                <p>{order.customer.phone}</p>
                <p>{order.billingAddress.street}</p>
                <p>{order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.zipCode}</p>
                <p>{order.billingAddress.country}</p>
              </div>
            </div>

            {/* Ship To */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Ship To</h3>
              <div className="text-gray-600 space-y-1">
                <p className="font-medium">{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                <p>{order.shippingAddress.country}</p>
                {order.trackingNumber && (
                  <p className="mt-2">
                    <span className="font-medium">Tracking:</span> {order.trackingNumber}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 font-medium text-gray-700">Item</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-700">SKU</th>
                    <th className="text-center py-3 px-2 font-medium text-gray-700">Qty</th>
                    <th className="text-right py-3 px-2 font-medium text-gray-700">Unit Price</th>
                    <th className="text-right py-3 px-2 font-medium text-gray-700">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100">
                      <td className="py-4 px-2">
                        <div className="flex items-center">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded mr-3"
                          />
                          <span className="font-medium text-gray-900">{item.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-2 text-gray-600">{item.sku}</td>
                      <td className="py-4 px-2 text-center text-gray-600">{item.quantity}</td>
                      <td className="py-4 px-2 text-right text-gray-600">${item.unitPrice.toFixed(2)}</td>
                      <td className="py-4 px-2 text-right font-medium text-gray-900">${item.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Order Summary */}
          <div className="flex justify-end">
            <div className="w-full max-w-sm">
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping:</span>
                  <span>${order.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax:</span>
                  <span>${order.tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total:</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Payment Information</h3>
            <div className="flex items-center text-gray-600">
              <CreditCard className="w-5 h-5 mr-2" />
              <span>{order.paymentMethod.brand} ending in {order.paymentMethod.last4}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm">
            <p>Thank you for your business!</p>
            <p className="mt-2">If you have any questions about this invoice, please contact us at support@droguerie.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderInvoice;
