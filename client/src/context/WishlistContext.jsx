import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export { WishlistContext };

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

const API_BASE = `${import.meta.env.VITE_API_URL}/api`;

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, token } = useAuth();

  // Fetch wishlist when user logs in
  useEffect(() => {
    if (user && token) {
      fetchWishlist();
      fetchWishlistCount();
    } else {
      // Clear wishlist when user logs out
      setWishlistItems([]);
      setWishlistCount(0);
    }
  }, [user, token]);

  // API headers with authentication
  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  });

  // Fetch user's wishlist
  const fetchWishlist = async () => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/wishlist`, {
        headers: getHeaders()
      });

      const data = await response.json();

      if (data.success) {
        setWishlistItems(data.data || []);
        setWishlistCount(data.data?.length || 0);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch wishlist');
      console.error('Error fetching wishlist:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch wishlist count
  const fetchWishlistCount = async () => {
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE}/wishlist/count`, {
        headers: getHeaders()
      });

      const data = await response.json();

      if (data.success) {
        setWishlistCount(data.data.count || 0);
      }
    } catch (err) {
      console.error('Error fetching wishlist count:', err);
    }
  };

  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.product_id === productId || item.id === productId);
  };

  // Add product to wishlist
  const addToWishlist = async (productId) => {
    if (!token) {
      setError('Please login to add items to wishlist');
      return false;
    }

    setError(null);

    try {
      const response = await fetch(`${API_BASE}/wishlist/add`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ productId })
      });

      const data = await response.json();

      if (data.success) {
        // Refresh wishlist data
        await fetchWishlist();
        return true;
      } else {
        setError(data.message);
        return false;
      }
    } catch (err) {
      setError('Failed to add to wishlist');
      console.error('Error adding to wishlist:', err);
      return false;
    }
  };

  // Remove product from wishlist
  const removeFromWishlist = async (productId) => {
    if (!token) return false;

    setError(null);

    try {
      const response = await fetch(`${API_BASE}/wishlist/remove/${productId}`, {
        method: 'DELETE',
        headers: getHeaders()
      });

      const data = await response.json();

      if (data.success) {
        // Update local state immediately for better UX
        setWishlistItems(prev => prev.filter(item =>
          item.product_id !== productId && item.id !== productId
        ));
        setWishlistCount(prev => Math.max(0, prev - 1));
        return true;
      } else {
        setError(data.message);
        return false;
      }
    } catch (err) {
      setError('Failed to remove from wishlist');
      console.error('Error removing from wishlist:', err);
      return false;
    }
  };

  // Toggle product in wishlist
  const toggleWishlist = async (productId) => {
    if (!token) {
      setError('Please login to manage your wishlist');
      return false;
    }

    setError(null);

    try {
      const response = await fetch(`${API_BASE}/wishlist/toggle`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ productId })
      });

      const data = await response.json();

      if (data.success) {
        // Refresh wishlist data
        await fetchWishlist();
        return data.data.action; // 'added' or 'removed'
      } else {
        setError(data.message);
        return false;
      }
    } catch (err) {
      setError('Failed to update wishlist');
      console.error('Error toggling wishlist:', err);
      return false;
    }
  };

  // Clear entire wishlist
  const clearWishlist = async () => {
    if (!token) return false;

    setError(null);

    try {
      const response = await fetch(`${API_BASE}/wishlist/clear`, {
        method: 'DELETE',
        headers: getHeaders()
      });

      const data = await response.json();

      if (data.success) {
        setWishlistItems([]);
        setWishlistCount(0);
        return true;
      } else {
        setError(data.message);
        return false;
      }
    } catch (err) {
      setError('Failed to clear wishlist');
      console.error('Error clearing wishlist:', err);
      return false;
    }
  };

  // Get wishlist item by product ID
  const getWishlistItem = (productId) => {
    return wishlistItems.find(item =>
      item.product_id === productId || item.id === productId
    );
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  const value = {
    // State
    wishlistItems,
    wishlistCount,
    isLoading,
    error,

    // Methods
    fetchWishlist,
    fetchWishlistCount,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    clearWishlist,
    isInWishlist,
    getWishlistItem,
    clearError,

    // Computed values
    isEmpty: wishlistCount === 0,
    hasItems: wishlistCount > 0
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistProvider;
