import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, X, Star, DollarSign, Package, Tag } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const AdvancedFilter = ({ onFilterChange, categories = [], brands = [] }) => {
  const { t } = useLanguage();
  const [filters, setFilters] = useState({
    categories: [],
    brands: [],
    priceRange: { min: '', max: '' },
    rating: 0,
    inStock: false,
    onSale: false,
    sortBy: 'name'
  });

  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    brands: false,
    price: true,
    rating: true,
    stock: true
  });

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const updateFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const toggleCategory = (categoryId) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId]
    }));
  };

  const toggleBrand = (brandId) => {
    setFilters(prev => ({
      ...prev,
      brands: prev.brands.includes(brandId)
        ? prev.brands.filter(id => id !== brandId)
        : [...prev.brands, brandId]
    }));
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      categories: [],
      brands: [],
      priceRange: { min: '', max: '' },
      rating: 0,
      inStock: false,
      onSale: false,
      sortBy: 'name'
    });
  };

  const activeFiltersCount = filters.categories.length + filters.brands.length +
    (filters.priceRange.min || filters.priceRange.max ? 1 : 0) +
    (filters.rating > 0 ? 1 : 0) +
    (filters.inStock ? 1 : 0) +
    (filters.onSale ? 1 : 0);

  const FilterSection = ({ title, icon: Icon, isExpanded, onToggle, children }) => (
    <div className="border-b border-gray-200 pb-4">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full py-2 text-left"
      >
        <div className="flex items-center space-x-2">
          <Icon className="w-4 h-4 text-gray-500" />
          <span className="font-medium text-gray-900">{title}</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>
      {isExpanded && <div className="mt-3">{children}</div>}
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          {activeFiltersCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800"
            >
              <X className="w-3 h-3" />
              <span>Clear all ({activeFiltersCount})</span>
            </button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Categories Filter */}
        <FilterSection
          title="Categories"
          icon={Tag}
          isExpanded={expandedSections.categories}
          onToggle={() => toggleSection('categories')}
        >
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {categories.map(category => (
              <label key={category.id} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.categories.includes(category.id)}
                  onChange={() => toggleCategory(category.id)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{category.name}</span>
                {category.count && (
                  <span className="text-xs text-gray-500">({category.count})</span>
                )}
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Brands Filter */}
        {brands.length > 0 && (
          <FilterSection
            title="Brands"
            icon={Package}
            isExpanded={expandedSections.brands}
            onToggle={() => toggleSection('brands')}
          >
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {brands.map(brand => (
                <label key={brand.id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.brands.includes(brand.id)}
                    onChange={() => toggleBrand(brand.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{brand.name}</span>
                  {brand.count && (
                    <span className="text-xs text-gray-500">({brand.count})</span>
                  )}
                </label>
              ))}
            </div>
          </FilterSection>
        )}

        {/* Price Range Filter */}
        <FilterSection
          title="Price Range"
          icon={DollarSign}
          isExpanded={expandedSections.price}
          onToggle={() => toggleSection('price')}
        >
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.priceRange.min}
                onChange={(e) => updateFilter('priceRange', { ...filters.priceRange, min: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-500">to</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.priceRange.max}
                onChange={(e) => updateFilter('priceRange', { ...filters.priceRange, max: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Under $25', min: '', max: '25' },
                { label: '$25-$50', min: '25', max: '50' },
                { label: '$50-$100', min: '50', max: '100' },
                { label: '$100-$200', min: '100', max: '200' },
                { label: '$200+', min: '200', max: '' }
              ].map((range, index) => (
                <button
                  key={index}
                  onClick={() => updateFilter('priceRange', { min: range.min, max: range.max })}
                  className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50"
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </FilterSection>

        {/* Rating Filter */}
        <FilterSection
          title="Minimum Rating"
          icon={Star}
          isExpanded={expandedSections.rating}
          onToggle={() => toggleSection('rating')}
        >
          <div className="space-y-2">
            {[4, 3, 2, 1].map(rating => (
              <label key={rating} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="rating"
                  checked={filters.rating === rating}
                  onChange={() => updateFilter('rating', rating)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                  <span className="text-sm text-gray-600">& up</span>
                </div>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Stock & Sale Filters */}
        <FilterSection
          title="Availability"
          icon={Package}
          isExpanded={expandedSections.stock}
          onToggle={() => toggleSection('stock')}
        >
          <div className="space-y-3">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.inStock}
                onChange={(e) => updateFilter('inStock', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">In Stock Only</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.onSale}
                onChange={(e) => updateFilter('onSale', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">On Sale</span>
            </label>
          </div>
        </FilterSection>

        {/* Sort By */}
        <div className="pt-4 border-t border-gray-200">
          <label className="block text-sm font-medium text-gray-900 mb-2">Sort By</label>
          <select
            value={filters.sortBy}
            onChange={(e) => updateFilter('sortBy', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="name">Name (A-Z)</option>
            <option value="name_desc">Name (Z-A)</option>
            <option value="price_asc">Price (Low to High)</option>
            <option value="price_desc">Price (High to Low)</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest First</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilter;
