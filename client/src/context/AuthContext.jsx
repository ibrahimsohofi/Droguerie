import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export { AuthContext };

const API_BASE = `${import.meta.env.VITE_API_URL}/api`;

// Real JWT token handling

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Verify token function
  const verifyToken = async (token) => {
    try {
      const response = await fetch(`${API_BASE}/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      return data.success ? data.data.user : null;
    } catch (error) {
      console.error('Token verification failed:', error);
      return null;
    }
  };

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem('auth_token');
      const savedUser = localStorage.getItem('auth_user');

      if (savedToken && savedUser) {
        try {
          // Verify token with backend
          const verifiedUser = await verifyToken(savedToken);
          if (verifiedUser) {
            setToken(savedToken);
            setUser(verifiedUser);
            // Update localStorage with verified user data
            localStorage.setItem('auth_user', JSON.stringify(verifiedUser));
          } else {
            // Token is invalid, clear localStorage
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
          }
        } catch (error) {
          console.error('Error verifying token:', error);
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Login failed');
      }

      const { user: userData, token: authToken } = data.data;

      setUser(userData);
      setToken(authToken);

      // Save to localStorage
      localStorage.setItem('auth_token', authToken);
      localStorage.setItem('auth_user', JSON.stringify(userData));

      return { success: true, user: userData };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: userData.username,
          email: userData.email,
          password: userData.password,
          role: 'customer'
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Registration failed');
      }

      const { user: newUser, token: authToken } = data.data;

      setUser(newUser);
      setToken(authToken);

      // Save to localStorage
      localStorage.setItem('auth_token', authToken);
      localStorage.setItem('auth_user', JSON.stringify(newUser));

      return { success: true, user: newUser };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    setError(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  };

  // Update profile function
  const updateProfile = async (updatedData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Mock update - replace with real API call
      const updatedUser = { ...user, ...updatedData };

      setUser(updatedUser);
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));

      return { success: true, user: updatedUser };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Change password function
  const changePassword = async (currentPassword, newPassword) => {
    setIsLoading(true);
    setError(null);

    try {
      // Mock password change - replace with real API call
      const userWithPassword = mockUsers.find(u => u.id === user.id);

      if (!userWithPassword || userWithPassword.password !== currentPassword) {
        throw new Error('Current password is incorrect');
      }

      // Update password in mock data
      userWithPassword.password = newPassword;

      return { success: true };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Reset password function
  const resetPassword = async (email) => {
    setIsLoading(true);
    setError(null);

    try {
      // Mock password reset - replace with real API call
      const userExists = mockUsers.find(u => u.email === email);

      if (!userExists) {
        throw new Error('No user found with this email address');
      }

      // In real app, would send reset email
      return { success: true, message: 'Password reset instructions sent to your email' };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!(user && token);
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return user?.role === role;
  };

  // Check if user is admin
  const isAdmin = () => {
    return hasRole('admin');
  };

  // Get user orders (mock data)
  const getUserOrders = async () => {
    if (!user) return { success: false, error: 'Not authenticated' };

    // Mock orders data
    const mockOrders = [
      {
        id: 1,
        userId: user.id,
        orderNumber: 'ORD-2024-001',
        status: 'delivered',
        total: 125.50,
        items: [
          { id: 1, name: 'Cleaning Product', quantity: 2, price: 25.50 },
          { id: 2, name: 'Hand Sanitizer', quantity: 3, price: 24.50 }
        ],
        shippingAddress: user.address,
        createdAt: '2024-01-15T10:00:00Z',
        deliveredAt: '2024-01-18T14:30:00Z'
      },
      {
        id: 2,
        userId: user.id,
        orderNumber: 'ORD-2024-002',
        status: 'processing',
        total: 89.99,
        items: [
          { id: 3, name: 'Vitamins', quantity: 1, price: 89.99 }
        ],
        shippingAddress: user.address,
        createdAt: '2024-01-20T09:15:00Z'
      }
    ];

    return { success: true, orders: mockOrders };
  };

  const value = {
    user,
    token,
    isLoading,
    error,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    resetPassword,
    isAuthenticated,
    hasRole,
    isAdmin,
    getUserOrders,
    setError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
