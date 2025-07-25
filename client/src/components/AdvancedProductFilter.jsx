import React, { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronUp, Star, Filter, RotateCcw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const AdvancedProductFilter = ({
  filters,
  onFiltersChange,
  categories = [],
  brands = [],
  isOpen = false,
  onClose,
  priceRange = { min: 0, max: 1000 }
}) => {
  const { t } = useLanguage();
  const [localFilters, setLocalFilters] = useState({
    categories: [],
    brands: [],
    priceMin: priceRange.min,
    priceMax: priceRange.max,
    rating: 0,
    inStock: false,
    onSale: false,
    freeShipping: false,
    sortBy: 'relevance',
    ...filters
  });

  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    brands: true,
    rating: true,
    features: true
  });

  const sortOptions = [
    { value: 'relevance', label: t('relevance') },
    { value: 'price_low', label: t('priceLowToHigh') },
    { value: 'price_high', label: t('priceHighToLow') },
    { value: 'newest', label: t('newest') },
    { value: 'rating', label: t('rating') },
    { value: 'popular', label: t('popular') }
  ];

  useEffect(() => {
    setLocalFilters(prev => ({ ...prev, ...filters }));
  }, [filters]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleFilterChange = (key, value) => {
    setLocalFilters(prev => {
      const newFilters = { ...prev, [key]: value };
      onFiltersChange(newFilters);
      return newFilters;
    });
  };

  const handleCategoryChange = (categoryId) => {
    const newCategories = localFilters.categories.includes(categoryId)
      ? localFilters.categories.filter(id => id !== categoryId)
      : [...localFilters.categories, categoryId];
    handleFilterChange('categories', newCategories);
  };

  const handleBrandChange = (brandId) => {
    const newBrands = localFilters.brands.includes(brandId)
      ? localFilters.brands.filter(id => id !== brandId)
      : [...localFilters.brands, brandId];
    handleFilterChange('brands', newBrands);
  };

  const handlePriceChange = (type, value) => {
    handleFilterChange(type, Number(value));
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      categories: [],
      brands: [],
      priceMin: priceRange.min,
      priceMax: priceRange.max,
      rating: 0,
      inStock: false,
      onSale: false,
      freeShipping: false,
      sortBy: 'relevance'
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const getActiveFiltersCount = () => {
    return localFilters.categories.length +
           localFilters.brands.length +
           (localFilters.rating > 0 ? 1 : 0) +
           (localFilters.inStock ? 1 : 0) +
           (localFilters.onSale ? 1 : 0) +
           (localFilters.freeShipping ? 1 : 0) +
           (localFilters.priceMin !== priceRange.min || localFilters.priceMax !== priceRange.max ? 1 : 0);
  };

  const FilterSection = ({ title, isExpanded, onToggle, children }) => (
    <div className="border-b border-gray-200">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 text-left font-medium text-gray-900 hover:text-gray-700"
      >
        {title}
        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {isExpanded && <div className="pb-4">{children}</div>}
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Filter Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-80 bg-white shadow-xl lg:shadow-none
        transform transition-transform duration-300 ease-in-out lg:transform-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col h-full lg:h-auto
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b lg:hidden">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            {t('filters')}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Header (Desktop) */}
        <div className="hidden lg:flex items-center justify-between p-4 border-b">
          <div className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">{t('filters')}</h2>
            {getActiveFiltersCount() > 0 && (
              <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                {getActiveFiltersCount()}
              </span>
            )}
          </div>
          <button
            onClick={clearAllFilters}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            {t('clearAll')}
          </button>
        </div>

        {/* Filter Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Sort By */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('sortBy')}
            </label>
            <select
              value={localFilters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Categories */}
          <FilterSection
            title={t('categories')}
            isExpanded={expandedSections.categories}
            onToggle={() => toggleSection('categories')}
          >
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {categories.map((category) => (
                <label key={category.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={localFilters.categories.includes(category.id)}
                    onChange={() => handleCategoryChange(category.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {category.name}
                    {category.productCount && (
                      <span className="text-gray-500 ml-1">({category.productCount})</span>
                    )}
                  </span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Price Range */}
          <FilterSection
            title={t('priceRange')}
            isExpanded={expandedSections.price}
            onToggle={() => toggleSection('price')}
          >
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={localFilters.priceMin}
                  onChange={(e) => handlePriceChange('priceMin', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={localFilters.priceMax}
                  onChange={(e) => handlePriceChange('priceMax', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>
              <div className="text-xs text-gray-500">
                {t('priceInMAD')}
              </div>
            </div>
          </FilterSection>

          {/* Brands */}
          {brands.length > 0 && (
            <FilterSection
              title={t('brands')}
              isExpanded={expandedSections.brands}
              onToggle={() => toggleSection('brands')}
            >
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {brands.map((brand) => (
                  <label key={brand.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={localFilters.brands.includes(brand.id)}
                      onChange={() => handleBrandChange(brand.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {brand.name}
                      {brand.productCount && (
                        <span className="text-gray-500 ml-1">({brand.productCount})</span>
                      )}
                    </span>
                  </label>
                ))}
              </div>
            </FilterSection>
          )}

          {/* Rating */}
          <FilterSection
            title={t('customerRating')}
            isExpanded={expandedSections.rating}
            onToggle={() => toggleSection('rating')}
          >
            <div className="space-y-2">
              {[4, 3, 2, 1].map((rating) => (
                <label key={rating} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="rating"
                    checked={localFilters.rating === rating}
                    onChange={() => handleFilterChange('rating', rating)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <div className="ml-2 flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="ml-1 text-sm text-gray-600">& {t('up')}</span>
                  </div>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Features */}
          <FilterSection
            title={t('features')}
            isExpanded={expandedSections.features}
            onToggle={() => toggleSection('features')}
          >
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={localFilters.inStock}
                  onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">{t('inStockOnly')}</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={localFilters.onSale}
                  onChange={(e) => handleFilterChange('onSale', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">{t('onSale')}</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={localFilters.freeShipping}
                  onChange={(e) => handleFilterChange('freeShipping', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">{t('freeShipping')}</span>
              </label>
            </div>
          </FilterSection>
        </div>

        {/* Mobile Apply Button */}
        <div className="p-4 border-t lg:hidden">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700"
          >
            {t('applyFilters')} ({getActiveFiltersCount()})
          </button>
        </div>
      </div>
    </>
  );
};

export default AdvancedProductFilter;
