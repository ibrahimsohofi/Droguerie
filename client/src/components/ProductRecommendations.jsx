import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';
import LoadingSpinner from './LoadingSpinner';
import { useLanguage } from '../context/LanguageContext';
import { useTranslations } from '../translations';

const API_BASE = `${import.meta.env.VITE_API_URL}/api`;

const ProductRecommendations = ({
  productId,
  categoryId,
  title = '',
  limit = 8,
  className = ''
}) => {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { language } = useLanguage();
  const t = useTranslations(language);

  const itemsPerPage = 4;
  const maxIndex = Math.max(0, recommendations.length - itemsPerPage);

  useEffect(() => {
    fetchRecommendations();
  }, [productId, categoryId]);

  const fetchRecommendations = async () => {
    try {
      setIsLoading(true);
      let url = `${API_BASE}/products`;

      if (categoryId) {
        url += `?category=${categoryId}&limit=${limit}`;
      } else {
        url += `?limit=${limit}`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch recommendations');

      const data = await response.json();

      // Filter out current product if viewing product details
      const filteredProducts = productId
        ? data.filter(product => product.id !== parseInt(productId))
        : data;

      setRecommendations(filteredProducts.slice(0, limit));
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setRecommendations([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrevious = () => {
    setCurrentIndex(prev => Math.max(0, prev - itemsPerPage));
  };

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(maxIndex, prev + itemsPerPage));
  };

  const visibleProducts = recommendations.slice(currentIndex, currentIndex + itemsPerPage);

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <h2 className="text-2xl font-bold text-gray-900">
          {title || t.recommendedProducts}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          {title || t.recommendedProducts}
        </h2>

        {/* Navigation controls */}
        {recommendations.length > itemsPerPage && (
          <div className="flex space-x-2">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex >= maxIndex}
              className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Products grid */}
      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(0)` }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                showQuickActions={true}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Dots indicator */}
      {recommendations.length > itemsPerPage && (
        <div className="flex justify-center space-x-2">
          {Array.from({ length: Math.ceil(recommendations.length / itemsPerPage) }).map((_, index) => {
            const isActive = Math.floor(currentIndex / itemsPerPage) === index;
            return (
              <button
                key={index}
                onClick={() => setCurrentIndex(index * itemsPerPage)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  isActive ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductRecommendations;
