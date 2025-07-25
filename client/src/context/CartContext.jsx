import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export { CartContext };

const API_BASE = `${import.meta.env.VITE_API_URL}${import.meta.env.VITE_API_URL}/api`;
const DEFAULT_USER_ID = 1; // For now, use default user

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const [isLoading, setIsLoading] = useState(false);

  // Fetch cart from API
  const fetchCart = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE}/cart/${DEFAULT_USER_ID}`);
      const data = await response.json();
      if (data.success) {
        setCart(data.data);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (productId, quantity = 1) => {
    try {
      const response = await fetch(`${API_BASE}/cart/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: DEFAULT_USER_ID, productId, quantity })
      });
      const data = await response.json();
      if (data.success) {
        setCart(data.data);
        return true;
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
    return false;
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const response = await fetch(`${API_BASE}/cart/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: DEFAULT_USER_ID, productId, quantity })
      });
      const data = await response.json();
      if (data.success) {
        setCart(data.data);
        return true;
      }
    } catch (error) {
      console.error('Error updating cart:', error);
    }
    return false;
  };

  const removeFromCart = async (productId) => {
    try {
      const response = await fetch(`${API_BASE}/cart/remove`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: DEFAULT_USER_ID, productId })
      });
      const data = await response.json();
      if (data.success) {
        setCart(data.data);
        return true;
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
    return false;
  };

  const clearCart = async () => {
    try {
      const response = await fetch(`${API_BASE}/cart/clear`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: DEFAULT_USER_ID })
      });
      const data = await response.json();
      if (data.success) {
        setCart(data.data);
        return true;
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
    return false;
  };

  const getCartTotal = () => {
    if (!cart.items || cart.items.length === 0) return 0;

    // Cart items now include price information from the updated Cart model
    return cart.items.reduce((total, item) => {
      return total + (item.price || 0) * item.quantity;
    }, 0);
  };

  const getCartItemCount = () => {
    return cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  };

  const value = {
    cart,
    isLoading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartItemCount,
    fetchCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
