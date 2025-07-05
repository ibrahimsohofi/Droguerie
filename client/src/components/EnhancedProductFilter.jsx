import React, { useState, useEffect } from 'react';
import { Search, Filter, X, Star, DollarSign, Package, Tag, Calendar, SlidersHorizontal } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTranslations } from '../translations';

const EnhancedProductFilter = ({
  onFiltersChange,
  products = [],
  categories = [],
  isOpen = false,
  onToggle = () => {},
  className = ""
}) => {
  const { language } = useLanguage();
  const t = useTranslations(language);

  const [filters, setFilters] = useState({
    search: '',
    categories: [],
    priceRange: { min: 0, max: 1000 },
    rating: 0,
    inStock: false,
    onSale: false,
    brands: [],
    sortBy: 'name',
    sortOrder: 'asc'
  });

  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [availableBrands, setAvailableBrands] = useState([]);

  // Calculate price range and brands from products
  useEffect(() => {
    if (products.length > 0) {
      const prices = products.map(p => p.price || 0).filter(p => p > 0);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);

      setPriceRange({ min: minPrice, max: maxPrice });

      // Update filters price range if it's the default
      if (filters.priceRange.min === 0 && filters.priceRange.max === 1000) {
        setFilters(prev => ({
          ...prev,
          priceRange: { min: minPrice, max: maxPrice }
        }));
      }

      // Extract unique brands
      const brands = [...new Set(products.map(p => p.brand).filter(Boolean))];
      setAvailableBrands(brands);
    }
  }, [products]);

  // Emit filter changes
  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleCategoryToggle = (categoryId) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId]
    }));
  };

  const handleBrandToggle = (brand) => {
    setFilters(prev => ({
      ...prev,
      brands: prev.brands.includes(brand)
        ? prev.brands.filter(b => b !== brand)
        : [...prev.brands, brand]
    }));
  };

  const handlePriceRangeChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      priceRange: {
        ...prev.priceRange,
        [key]: Number(value)
      }
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      categories: [],
      priceRange: { min: priceRange.min, max: priceRange.max },
      rating: 0,
      inStock: false,
      onSale: false,
      brands: [],
      sortBy: 'name',
      sortOrder: 'asc'
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.categories.length > 0) count++;
    if (filters.priceRange.min > priceRange.min || filters.priceRange.max < priceRange.max) count++;
    if (filters.rating > 0) count++;
    if (filters.inStock) count++;
    if (filters.onSale) count++;
    if (filters.brands.length > 0) count++;
    return count;
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
      {/* Filter Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Filters</h3>
            {getActiveFiltersCount() > 0 && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {getActiveFiltersCount()}
              </span>
            )}
          </div>
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Filter Content */}
      <div className="p-4 space-y-6">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Products
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Search by name or description..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Categories */}
        {categories.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categories
            </label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {categories.map((category) => (
                <label key={category.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(category.id)}
                    onChange={() => handleCategoryToggle(category.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{category.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price Range
          </label>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={filters.priceRange.min}
                onChange={(e) => handlePriceRangeChange('min', e.target.value)}
                min={priceRange.min}
                max={priceRange.max}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Min"
              />
              <span className="text-gray-500">to</span>
              <input
                type="number"
                value={filters.priceRange.max}
                onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                min={priceRange.min}
                max={priceRange.max}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Max"
              />
            </div>
            <div className="text-xs text-gray-500">
              Range: ${priceRange.min} - ${priceRange.max}
            </div>
          </div>
        </div>

        {/* Rating Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Minimum Rating
          </label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleFilterChange('rating', star === filters.rating ? 0 : star)}
                className={`p-1 rounded transition-colors ${
                  star <= filters.rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'
                }`}
              >
                <Star className="w-5 h-5 fill-current" />
              </button>
            ))}
            {filters.rating > 0 && (
              <span className="ml-2 text-sm text-gray-600">
                {filters.rating}+ stars
              </span>
            )}
          </div>
        </div>

        {/* Brands */}
        {availableBrands.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brands
            </label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {availableBrands.map((brand) => (
                <label key={brand} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.brands.includes(brand)}
                    onChange={() => handleBrandToggle(brand)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{brand}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Quick Filters */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quick Filters
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.inStock}
                onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">In Stock Only</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.onSale}
                onChange={(e) => handleFilterChange('onSale', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">On Sale</span>
            </label>
          </div>
        </div>

        {/* Sort Options */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <div className="grid grid-cols-2 gap-2">
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="name">Name</option>
              <option value="price">Price</option>
              <option value="rating">Rating</option>
              <option value="created_at">Date Added</option>
            </select>
            <select
              value={filters.sortOrder}
              onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedProductFilter;
