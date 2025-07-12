import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Filter, X, Clock, TrendingUp, Tag, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EnhancedSearchBar = ({ onSearch, className = "" }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [popularSearches] = useState([
    'Ariel detergent', 'Ajax cleaner', 'Dove soap', 'Shampoo', 'Toothpaste',
    'Cleaning products', 'Bathroom items', 'Kitchen supplies', 'Personal care'
  ]);

  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    brand: '',
    inStock: false,
    rating: ''
  });

  const [categories] = useState([
    'Cleaning Products', 'Personal Care', 'Cosmetics & Beauty',
    'Household Items', 'Bath Products', 'Hardware & Tools',
    'Health & Medicine', 'Baby Products', 'Laundry & Fabric Care',
    'Kitchen Supplies', 'Electronics & Batteries', 'School & Office'
  ]);

  const [brands] = useState([
    'Ariel', 'Ajax', 'Dove', 'Head & Shoulders', 'Colgate', 'Oral-B',
    'L\'Oréal', 'Nivea', 'Maybelline', 'Javex'
  ]);

  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('recentSearches');
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    if (searchTerm.length > 0) {
      generateSuggestions(searchTerm);
    } else {
      setSuggestions([]);
    }
  }, [searchTerm]);

  const generateSuggestions = useCallback((term) => {
    const productSuggestions = [
      { type: 'product', name: 'Ariel Detergent Powder 3kg', category: 'Cleaning Products' },
      { type: 'product', name: 'Ajax Floor Cleaner 1L', category: 'Cleaning Products' },
      { type: 'product', name: 'Dove Beauty Bar 90g', category: 'Personal Care' },
      { type: 'product', name: 'Head & Shoulders Shampoo 400ml', category: 'Personal Care' },
      { type: 'product', name: 'Colgate Total Toothpaste 100ml', category: 'Personal Care' },
      { type: 'product', name: 'L\'Oréal Face Cream 50ml', category: 'Cosmetics & Beauty' },
      { type: 'product', name: 'Plastic Storage Containers Set', category: 'Household Items' },
      { type: 'product', name: 'Kitchen Sponges Pack', category: 'Kitchen Supplies' }
    ];

    const filtered = productSuggestions.filter(item =>
      item.name.toLowerCase().includes(term.toLowerCase())
    );

    const categorySuggestions = categories
      .filter(cat => cat.toLowerCase().includes(term.toLowerCase()))
      .map(cat => ({ type: 'category', name: cat }));

    const brandSuggestions = brands
      .filter(brand => brand.toLowerCase().includes(term.toLowerCase()))
      .map(brand => ({ type: 'brand', name: brand }));

    setSuggestions([...filtered, ...categorySuggestions, ...brandSuggestions].slice(0, 8));
  }, [categories, brands]);

  const handleSearch = (term = searchTerm, searchFilters = filters) => {
    if (term.trim()) {
      // Add to recent searches
      const newRecentSearches = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
      setRecentSearches(newRecentSearches);
      localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));

      // Perform search
      onSearch({ query: term, filters: searchFilters });
      setShowSuggestions(false);

      // Navigate to products page with search params
      const searchParams = new URLSearchParams({ q: term });
      if (searchFilters.category) searchParams.set('category', searchFilters.category);
      if (searchFilters.priceRange) searchParams.set('price', searchFilters.priceRange);
      if (searchFilters.brand) searchParams.set('brand', searchFilters.brand);
      if (searchFilters.inStock) searchParams.set('inStock', 'true');
      if (searchFilters.rating) searchParams.set('rating', searchFilters.rating);

      navigate(`/products?${searchParams.toString()}`);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    if (suggestion.type === 'product') {
      setSearchTerm(suggestion.name);
      handleSearch(suggestion.name);
    } else if (suggestion.type === 'category') {
      setSearchTerm('');
      setFilters(prev => ({ ...prev, category: suggestion.name }));
      handleSearch('', { ...filters, category: suggestion.name });
    } else if (suggestion.type === 'brand') {
      setSearchTerm('');
      setFilters(prev => ({ ...prev, brand: suggestion.name }));
      handleSearch('', { ...filters, brand: suggestion.name });
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
  };

  const applyFilters = () => {
    handleSearch(searchTerm, filters);
    setShowFilters(false);
  };

  const clearFilters = () => {
    const clearedFilters = {
      category: '',
      priceRange: '',
      brand: '',
      inStock: false,
      rating: ''
    };
    setFilters(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters).some(value =>
    value !== '' && value !== false
  );

  return (
    <div className={`relative ${className}`}>
      {/* Main Search Bar */}
      <div className="relative">
        <div className="flex items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              ref={searchRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
              placeholder="Search for products, brands, categories..."
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-3 border border-l-0 border-gray-300 ${hasActiveFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-gray-50 text-gray-700'} hover:bg-gray-100 transition-colors relative`}
          >
            <Filter className="h-5 w-5" />
            {hasActiveFilters && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></div>
            )}
          </button>

          <button
            onClick={() => handleSearch()}
            className="px-6 py-3 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Search
          </button>
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 mt-1">
          {/* Current Search */}
          {searchTerm && (
            <div className="p-3 border-b">
              <button
                onClick={() => handleSearch()}
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Search className="h-4 w-4" />
                <span>Search for "<strong>{searchTerm}</strong>"</span>
              </button>
            </div>
          )}

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="p-3 border-b">
              <div className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
                Suggestions
              </div>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="flex items-center space-x-3 w-full text-left py-2 px-2 rounded hover:bg-gray-50 transition-colors"
                >
                  {suggestion.type === 'product' && <Search className="h-4 w-4 text-gray-400" />}
                  {suggestion.type === 'category' && <Tag className="h-4 w-4 text-gray-400" />}
                  {suggestion.type === 'brand' && <MapPin className="h-4 w-4 text-gray-400" />}
                  <div>
                    <div className="text-sm font-medium text-gray-900">{suggestion.name}</div>
                    {suggestion.category && (
                      <div className="text-xs text-gray-500">{suggestion.category}</div>
                    )}
                    {suggestion.type === 'category' && (
                      <div className="text-xs text-gray-500">Category</div>
                    )}
                    {suggestion.type === 'brand' && (
                      <div className="text-xs text-gray-500">Brand</div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Recent Searches */}
          {recentSearches.length > 0 && !searchTerm && (
            <div className="p-3 border-b">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Recent Searches
                </div>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-gray-400 hover:text-gray-600"
                >
                  Clear
                </button>
              </div>
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(search)}
                  className="flex items-center space-x-2 w-full text-left py-1 px-2 rounded hover:bg-gray-50 transition-colors"
                >
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{search}</span>
                </button>
              ))}
            </div>
          )}

          {/* Popular Searches */}
          {!searchTerm && (
            <div className="p-3">
              <div className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
                Popular Searches
              </div>
              {popularSearches.slice(0, 5).map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(search)}
                  className="flex items-center space-x-2 w-full text-left py-1 px-2 rounded hover:bg-gray-50 transition-colors"
                >
                  <TrendingUp className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{search}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Filters Panel */}
      {showFilters && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 mt-1">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Filters</h3>
              <div className="flex space-x-2">
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <select
                  value={filters.priceRange}
                  onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Any Price</option>
                  <option value="0-25">Under 25 MAD</option>
                  <option value="25-50">25 - 50 MAD</option>
                  <option value="50-100">50 - 100 MAD</option>
                  <option value="100-200">100 - 200 MAD</option>
                  <option value="200+">200+ MAD</option>
                </select>
              </div>

              {/* Brand */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand
                </label>
                <select
                  value={filters.brand}
                  onChange={(e) => handleFilterChange('brand', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Brands</option>
                  {brands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Rating
                </label>
                <select
                  value={filters.rating}
                  onChange={(e) => handleFilterChange('rating', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Any Rating</option>
                  <option value="4">4+ Stars</option>
                  <option value="3">3+ Stars</option>
                  <option value="2">2+ Stars</option>
                </select>
              </div>

              {/* In Stock */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="inStock"
                  checked={filters.inStock}
                  onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="inStock" className="ml-2 text-sm text-gray-700">
                  In Stock Only
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowFilters(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={applyFilters}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedSearchBar;
