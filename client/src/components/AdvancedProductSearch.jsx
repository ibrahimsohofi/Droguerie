import React, { useState, useEffect, useMemo } from 'react';
import { useTranslations, useLanguage } from '../context/LanguageContext';
import {
  Search,
  Filter,
  X,
  SlidersHorizontal,
  Star,
  DollarSign,
  Package,
  Tag,
  ChevronDown,
  ChevronUp,
  RotateCcw
} from 'lucide-react';

const AdvancedProductSearch = ({
  products = [],
  onFilteredResults,
  categories = [],
  brands = []
}) => {
  const t = useTranslations();
  const { isRTL, formatCurrency } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('name'); // name, price_low, price_high, rating, newest

  // Filter states
  const [filters, setFilters] = useState({
    categories: [],
    brands: [],
    priceRange: { min: 0, max: 1000 },
    availability: 'all', // all, in_stock, out_of_stock
    rating: 0,
    tags: []
  });

  // Advanced search states
  const [searchMode, setSearchMode] = useState('simple'); // simple, advanced
  const [advancedSearch, setAdvancedSearch] = useState({
    productName: '',
    description: '',
    brand: '',
    category: '',
    sku: ''
  });

  // Calculate price range from products
  const priceRange = useMemo(() => {
    if (products.length === 0) return { min: 0, max: 1000 };

    const prices = products.map(p => p.price || 0);
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices))
    };
  }, [products]);

  // Get unique brands from products
  const availableBrands = useMemo(() => {
    const brandsSet = new Set();
    products.forEach(product => {
      if (product.brand) {
        brandsSet.add(product.brand);
      }
    });
    return Array.from(brandsSet);
  }, [products]);

  // Get unique tags from products
  const availableTags = useMemo(() => {
    const tagsSet = new Set();
    products.forEach(product => {
      if (product.tags && Array.isArray(product.tags)) {
        product.tags.forEach(tag => tagsSet.add(tag));
      }
    });
    return Array.from(tagsSet);
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(product => {
        const searchableText = [
          product.name?.en?.toLowerCase() || '',
          product.name?.ar?.toLowerCase() || '',
          product.name?.fr?.toLowerCase() || '',
          product.description?.en?.toLowerCase() || '',
          product.description?.ar?.toLowerCase() || '',
          product.description?.fr?.toLowerCase() || '',
          product.brand?.toLowerCase() || '',
          product.sku?.toLowerCase() || '',
          ...(product.tags || []).map(tag => tag.toLowerCase())
        ].join(' ');

        return searchableText.includes(query);
      });
    }

    // Advanced search filters
    if (searchMode === 'advanced') {
      if (advancedSearch.productName) {
        const nameQuery = advancedSearch.productName.toLowerCase();
        result = result.filter(product => {
          const names = [
            product.name?.en?.toLowerCase() || '',
            product.name?.ar?.toLowerCase() || '',
            product.name?.fr?.toLowerCase() || ''
          ];
          return names.some(name => name.includes(nameQuery));
        });
      }

      if (advancedSearch.description) {
        const descQuery = advancedSearch.description.toLowerCase();
        result = result.filter(product => {
          const descriptions = [
            product.description?.en?.toLowerCase() || '',
            product.description?.ar?.toLowerCase() || '',
            product.description?.fr?.toLowerCase() || ''
          ];
          return descriptions.some(desc => desc.includes(descQuery));
        });
      }

      if (advancedSearch.brand) {
        result = result.filter(product =>
          product.brand?.toLowerCase().includes(advancedSearch.brand.toLowerCase())
        );
      }

      if (advancedSearch.sku) {
        result = result.filter(product =>
          product.sku?.toLowerCase().includes(advancedSearch.sku.toLowerCase())
        );
      }
    }

    // Category filter
    if (filters.categories.length > 0) {
      result = result.filter(product =>
        filters.categories.includes(product.category_id)
      );
    }

    // Brand filter
    if (filters.brands.length > 0) {
      result = result.filter(product =>
        filters.brands.includes(product.brand)
      );
    }

    // Price range filter
    result = result.filter(product =>
      product.price >= filters.priceRange.min &&
      product.price <= filters.priceRange.max
    );

    // Availability filter
    if (filters.availability !== 'all') {
      result = result.filter(product => {
        const inStock = (product.stock_quantity || 0) > 0;
        return filters.availability === 'in_stock' ? inStock : !inStock;
      });
    }

    // Rating filter
    if (filters.rating > 0) {
      result = result.filter(product =>
        (product.average_rating || 0) >= filters.rating
      );
    }

    // Tags filter
    if (filters.tags.length > 0) {
      result = result.filter(product =>
        product.tags && filters.tags.some(tag => product.tags.includes(tag))
      );
    }

    // Sort results
    result.sort((a, b) => {
      switch (sortBy) {
        case 'price_low':
          return (a.price || 0) - (b.price || 0);
        case 'price_high':
          return (b.price || 0) - (a.price || 0);
        case 'rating':
          return (b.average_rating || 0) - (a.average_rating || 0);
        case 'newest':
          return new Date(b.created_at || 0) - new Date(a.created_at || 0);
        case 'name':
        default:
          const nameA = a.name?.[isRTL ? 'ar' : 'en'] || a.name?.en || '';
          const nameB = b.name?.[isRTL ? 'ar' : 'en'] || b.name?.en || '';
          return nameA.localeCompare(nameB);
      }
    });

    return result;
  }, [products, searchQuery, filters, sortBy, advancedSearch, searchMode, isRTL]);

  // Update parent component with filtered results
  useEffect(() => {
    onFilteredResults?.(filteredProducts);
  }, [filteredProducts, onFilteredResults]);

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setFilters({
      categories: [],
      brands: [],
      priceRange: { min: priceRange.min, max: priceRange.max },
      availability: 'all',
      rating: 0,
      tags: []
    });
    setAdvancedSearch({
      productName: '',
      description: '',
      brand: '',
      category: '',
      sku: ''
    });
    setSortBy('name');
    setSearchMode('simple');
  };

  // Handle filter changes
  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(item => item !== value)
        : [...prev[key], value]
    }));
  };

  const sortOptions = [
    { value: 'name', label: isRTL ? 'الاسم (أ-ي)' : 'Name (A-Z)' },
    { value: 'price_low', label: isRTL ? 'السعر (منخفض إلى عالي)' : 'Price (Low to High)' },
    { value: 'price_high', label: isRTL ? 'السعر (عالي إلى منخفض)' : 'Price (High to Low)' },
    { value: 'rating', label: isRTL ? 'التقييم' : 'Rating' },
    { value: 'newest', label: isRTL ? 'الأحدث' : 'Newest' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-moroccan border border-gray-200 p-4 mb-6">
      {/* Search Header */}
      <div className="flex items-center gap-3 mb-4">
        <Search className="w-5 h-5 text-gray-400" />
        <h2 className="text-lg font-semibold text-gray-800">
          {isRTL ? 'البحث والفلترة' : 'Search & Filter'}
        </h2>
        <div className="flex-1"></div>
        <span className="text-sm text-gray-600">
          {isRTL
            ? `${filteredProducts.length} من ${products.length} منتج`
            : `${filteredProducts.length} of ${products.length} products`
          }
        </span>
      </div>

      {/* Search Mode Toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setSearchMode('simple')}
          className={`px-3 py-1 text-sm rounded-lg transition-colors ${
            searchMode === 'simple'
              ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {isRTL ? 'بحث بسيط' : 'Simple Search'}
        </button>
        <button
          onClick={() => setSearchMode('advanced')}
          className={`px-3 py-1 text-sm rounded-lg transition-colors ${
            searchMode === 'advanced'
              ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {isRTL ? 'بحث متقدم' : 'Advanced Search'}
        </button>
      </div>

      {/* Simple Search */}
      {searchMode === 'simple' && (
        <div className="relative mb-4">
          <Search className={`absolute top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isRTL ? 'ابحث عن المنتجات...' : 'Search for products...'}
            className={`form-input ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
            dir={isRTL ? 'rtl' : 'ltr'}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 ${isRTL ? 'left-3' : 'right-3'}`}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Advanced Search */}
      {searchMode === 'advanced' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {isRTL ? 'اسم المنتج' : 'Product Name'}
            </label>
            <input
              type="text"
              value={advancedSearch.productName}
              onChange={(e) => setAdvancedSearch(prev => ({...prev, productName: e.target.value}))}
              className="form-input"
              dir={isRTL ? 'rtl' : 'ltr'}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {isRTL ? 'العلامة التجارية' : 'Brand'}
            </label>
            <input
              type="text"
              value={advancedSearch.brand}
              onChange={(e) => setAdvancedSearch(prev => ({...prev, brand: e.target.value}))}
              className="form-input"
              dir={isRTL ? 'rtl' : 'ltr'}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {isRTL ? 'الوصف' : 'Description'}
            </label>
            <input
              type="text"
              value={advancedSearch.description}
              onChange={(e) => setAdvancedSearch(prev => ({...prev, description: e.target.value}))}
              className="form-input"
              dir={isRTL ? 'rtl' : 'ltr'}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {isRTL ? 'رقم المنتج (SKU)' : 'Product Code (SKU)'}
            </label>
            <input
              type="text"
              value={advancedSearch.sku}
              onChange={(e) => setAdvancedSearch(prev => ({...prev, sku: e.target.value}))}
              className="form-input"
              dir={isRTL ? 'rtl' : 'ltr'}
            />
          </div>
        </div>
      )}

      {/* Sort and Filter Controls */}
      <div className="flex flex-wrap gap-3 mb-4">
        {/* Sort Dropdown */}
        <div className="flex-1 min-w-48">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="form-input"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="btn-secondary flex items-center gap-2"
        >
          <SlidersHorizontal className="w-4 h-4" />
          {isRTL ? 'فلاتر' : 'Filters'}
          {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {/* Reset Button */}
        <button
          onClick={resetFilters}
          className="btn-secondary flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          {isRTL ? 'إعادة تعيين' : 'Reset'}
        </button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="border-t pt-4 space-y-4">
          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isRTL ? 'نطاق السعر' : 'Price Range'}
            </label>
            <div className="flex items-center gap-4">
              <input
                type="number"
                value={filters.priceRange.min}
                onChange={(e) => updateFilter('priceRange', {
                  ...filters.priceRange,
                  min: parseInt(e.target.value) || 0
                })}
                min={priceRange.min}
                max={priceRange.max}
                className="form-input w-24"
              />
              <span className="text-gray-500">-</span>
              <input
                type="number"
                value={filters.priceRange.max}
                onChange={(e) => updateFilter('priceRange', {
                  ...filters.priceRange,
                  max: parseInt(e.target.value) || priceRange.max
                })}
                min={priceRange.min}
                max={priceRange.max}
                className="form-input w-24"
              />
              <span className="text-sm text-gray-600">
                {formatCurrency(filters.priceRange.min)} - {formatCurrency(filters.priceRange.max)}
              </span>
            </div>
          </div>

          {/* Categories */}
          {categories.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isRTL ? 'الفئات' : 'Categories'}
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {categories.map(category => (
                  <label key={category.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(category.id)}
                      onChange={() => toggleArrayFilter('categories', category.id)}
                      className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                    />
                    <span className="text-sm text-gray-700">
                      {category.name?.[isRTL ? 'ar' : 'en'] || category.name?.en || category.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Brands */}
          {availableBrands.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isRTL ? 'العلامات التجارية' : 'Brands'}
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {availableBrands.map(brand => (
                  <label key={brand} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.brands.includes(brand)}
                      onChange={() => toggleArrayFilter('brands', brand)}
                      className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                    />
                    <span className="text-sm text-gray-700">{brand}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Availability */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isRTL ? 'التوفر' : 'Availability'}
            </label>
            <div className="flex gap-4">
              {[
                { value: 'all', label: isRTL ? 'الكل' : 'All' },
                { value: 'in_stock', label: isRTL ? 'متوفر' : 'In Stock' },
                { value: 'out_of_stock', label: isRTL ? 'غير متوفر' : 'Out of Stock' }
              ].map(option => (
                <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="availability"
                    value={option.value}
                    checked={filters.availability === option.value}
                    onChange={(e) => updateFilter('availability', e.target.value)}
                    className="w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isRTL ? 'التقييم الأدنى' : 'Minimum Rating'}
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(rating => (
                <button
                  key={rating}
                  onClick={() => updateFilter('rating', filters.rating === rating ? 0 : rating)}
                  className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
                    filters.rating >= rating
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Star className="w-4 h-4" fill={filters.rating >= rating ? 'currentColor' : 'none'} />
                  <span className="text-sm">{rating}+</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedProductSearch;
