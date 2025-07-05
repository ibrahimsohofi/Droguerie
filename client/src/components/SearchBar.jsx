import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Filter, SlidersHorizontal } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const SearchBar = ({
  onSearch,
  onFilterChange,
  placeholder,
  suggestions = [],
  filters = {},
  showFilters = true,
  className = ''
}) => {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);
  const searchRef = useRef(null);
  const filterRef = useRef(null);

  // Handle search input
  const handleSearch = (searchQuery) => {
    setQuery(searchQuery);
    if (onSearch) {
      onSearch(searchQuery, localFilters);
    }
  };

  // Handle filter changes
  const handleFilterChange = (filterKey, value) => {
    const newFilters = { ...localFilters, [filterKey]: value };
    setLocalFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
    if (onSearch) {
      onSearch(query, newFilters);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setLocalFilters({});
    if (onFilterChange) {
      onFilterChange({});
    }
    if (onSearch) {
      onSearch(query, {});
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.name || suggestion);
    setShowSuggestions(false);
    handleSearch(suggestion.name || suggestion);
  };

  // Handle click outside to close suggestions and filters
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilterPanel(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter suggestions based on query
  const filteredSuggestions = suggestions.filter(suggestion => {
    const suggestionText = suggestion.name || suggestion;
    return suggestionText.toLowerCase().includes(query.toLowerCase());
  }).slice(0, 8); // Limit to 8 suggestions

  // Count active filters
  const activeFiltersCount = Object.values(localFilters).filter(value =>
    value && value !== '' && value !== 'all'
  ).length;

  return (
    <div className={`relative ${className}`}>
      <div className="flex gap-2">
        {/* Search Input */}
        <div ref={searchRef} className="relative flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSuggestions(true);
                handleSearch(e.target.value);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder={placeholder || t('search.placeholder', 'البحث عن المنتجات...')}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
            {query && (
              <button
                onClick={() => {
                  setQuery('');
                  handleSearch('');
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Search Suggestions */}
          {showSuggestions && (query || suggestions.length > 0) && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
              {filteredSuggestions.length > 0 ? (
                filteredSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
                  >
                    <Search className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900 dark:text-gray-100">
                      {suggestion.name || suggestion}
                    </span>
                    {suggestion.category && (
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        في {suggestion.category}
                      </span>
                    )}
                  </button>
                ))
              ) : query ? (
                <div className="px-4 py-2 text-gray-500 dark:text-gray-400">
                  لا توجد نتائج للبحث "{query}"
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* Filter Button */}
        {showFilters && (
          <div ref={filterRef} className="relative">
            <button
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              className={`
                relative px-4 py-3 border rounded-lg transition-colors flex items-center gap-2
                ${showFilterPanel
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }
              `}
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span className="hidden sm:inline">فلتر</span>
              {activeFiltersCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Filter Panel */}
            {showFilterPanel && (
              <div className="absolute top-full right-0 mt-1 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    خيارات الفلترة
                  </h3>
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      مسح الكل
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      الفئة
                    </label>
                    <select
                      value={localFilters.category || ''}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    >
                      <option value="">كل الفئات</option>
                      <option value="medicine">أدوية</option>
                      <option value="vitamins">فيتامينات</option>
                      <option value="skincare">العناية بالبشرة</option>
                      <option value="supplements">مكملات غذائية</option>
                    </select>
                  </div>

                  {/* Price Range Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      النطاق السعري (درهم)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="من"
                        value={localFilters.minPrice || ''}
                        onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                        className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      />
                      <input
                        type="number"
                        placeholder="إلى"
                        value={localFilters.maxPrice || ''}
                        onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                        className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                  </div>

                  {/* Availability Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      التوفر
                    </label>
                    <select
                      value={localFilters.availability || ''}
                      onChange={(e) => handleFilterChange('availability', e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    >
                      <option value="">الكل</option>
                      <option value="inStock">متوفر</option>
                      <option value="outOfStock">غير متوفر</option>
                    </select>
                  </div>

                  {/* Sort By */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      ترتيب حسب
                    </label>
                    <select
                      value={localFilters.sortBy || ''}
                      onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    >
                      <option value="">الافتراضي</option>
                      <option value="name">الاسم (أ-ي)</option>
                      <option value="price-low">السعر (منخفض إلى عالي)</option>
                      <option value="price-high">السعر (عالي إلى منخفض)</option>
                      <option value="newest">الأحدث</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
