import React, { createContext, useContext, useState, useEffect } from 'react';

const ComparisonContext = createContext();

export const useComparison = () => {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
};

export const ComparisonProvider = ({ children }) => {
  const [compareProducts, setCompareProducts] = useState([]);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);

  useEffect(() => {
    // Load comparison products from localStorage
    const stored = localStorage.getItem('compareProducts');
    if (stored) {
      try {
        setCompareProducts(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading comparison products:', error);
        localStorage.removeItem('compareProducts');
      }
    }
  }, []);

  useEffect(() => {
    // Save to localStorage whenever compareProducts changes
    localStorage.setItem('compareProducts', JSON.stringify(compareProducts));
  }, [compareProducts]);

  const addToComparison = (product) => {
    if (compareProducts.length >= 4) {
      return { success: false, message: 'You can compare up to 4 products at a time' };
    }

    if (compareProducts.find(p => p.id === product.id)) {
      return { success: false, message: 'Product is already in comparison' };
    }

    setCompareProducts(prev => [...prev, product]);
    return { success: true, message: 'Product added to comparison' };
  };

  const removeFromComparison = (productId) => {
    setCompareProducts(prev => prev.filter(p => p.id !== productId));
  };

  const clearComparison = () => {
    setCompareProducts([]);
    localStorage.removeItem('compareProducts');
  };

  const isInComparison = (productId) => {
    return compareProducts.some(p => p.id === productId);
  };

  const getComparisonCount = () => {
    return compareProducts.length;
  };

  const toggleComparison = () => {
    setIsComparisonOpen(!isComparisonOpen);
  };

  const value = {
    compareProducts,
    addToComparison,
    removeFromComparison,
    clearComparison,
    isInComparison,
    getComparisonCount,
    isComparisonOpen,
    toggleComparison,
    setIsComparisonOpen
  };

  return (
    <ComparisonContext.Provider value={value}>
      {children}
    </ComparisonContext.Provider>
  );
};

export default ComparisonContext;
