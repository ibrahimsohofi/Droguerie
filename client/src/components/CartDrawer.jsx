import React, { useContext } from 'react';
import { X, Plus, Minus, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { PriceFormatter } from '../utils/currency';

const CartDrawer = ({ isOpen, onClose }) => {
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, getTotalItems } = useContext(CartContext);
  const { t, language } = useLanguage();

  const handleQuantityChange = (itemId, action) => {
    const item = cartItems.find(item => item.id === itemId);
    if (!item) return;

    if (action === 'increase') {
      updateQuantity(itemId, item.quantity + 1);
    } else if (action === 'decrease') {
      if (item.quantity > 1) {
        updateQuantity(itemId, item.quantity - 1);
      } else {
        removeFromCart(itemId);
      }
    }
  };

  const shippingThreshold = 200;
  const currentTotal = getTotalPrice();
  const shippingNeeded = shippingThreshold - currentTotal;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <ShoppingBag className="w-5 h-5 mr-2" />
              {t('cart')} ({getTotalItems()})
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress */}
          {shippingNeeded > 0 && (
            <div className="p-4 bg-blue-50 border-b">
              <div className="text-sm text-blue-800 mb-2">
                {t('freeShippingProgress', { amount: shippingNeeded.toFixed(2) })}
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((currentTotal / shippingThreshold) * 100, 100)}%` }}
                />
              </div>
            </div>
          )}

          {cartItems.length === 0 ? (
            /* Empty Cart */
            <div className="flex-1 flex flex-col items-center justify-center p-8">
              <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">{t('emptyCart')}</h3>
              <p className="text-gray-500 text-center mb-6">{t('emptyCartMessage')}</p>
              <Link
                to="/products"
                onClick={onClose}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                {t('startShopping')}
              </Link>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={`${item.id}-${item.variant?.id || ''}`} className="flex space-x-3 bg-gray-50 rounded-lg p-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {item.name}
                        </h4>
                        {item.variant && (
                          <p className="text-xs text-gray-500">{item.variant.name}</p>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleQuantityChange(item.id, 'decrease')}
                              className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-200"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-medium w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.id, 'increase')}
                              className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-200"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm font-semibold text-gray-900">
                            {PriceFormatter.cart(item.price * item.quantity, language)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="border-t bg-white p-4 space-y-4">
                {/* Subtotal */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{t('subtotal')}</span>
                    <span className="font-medium">{PriceFormatter.cart(currentTotal, language)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{t('shipping')}</span>
                    <span className="font-medium">
                      {PriceFormatter.shipping(currentTotal >= shippingThreshold ? 0 : 20, language)}
                    </span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>{t('total')}</span>
                    <span>
                      {PriceFormatter.orderTotal(currentTotal, 0, currentTotal >= shippingThreshold ? 0 : 20, language)}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Link
                    to="/cart"
                    onClick={onClose}
                    className="w-full bg-gray-100 text-gray-900 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors text-center block"
                  >
                    {t('viewCart')}
                  </Link>
                  <Link
                    to="/checkout"
                    onClick={onClose}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>{t('checkout')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Security Badge */}
                <div className="text-center">
                  <p className="text-xs text-gray-500">{t('secureCheckout')}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
