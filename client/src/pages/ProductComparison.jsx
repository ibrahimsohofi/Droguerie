import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { X, Plus } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const ProductComparison = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const { language } = useLanguage();

  const productIds = searchParams.get('products')?.split(',') || [];

  if (products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <Plus className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Products to Compare</h2>
          <p className="text-gray-600 mb-6">Add products to compare them here</p>
          <Link
            to="/products"
            className="inline-flex px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Product Comparison</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p>Product comparison feature coming soon...</p>
      </div>
    </div>
  );
};

export default ProductComparison;
