import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, X, SlidersHorizontal, MapPin, Clock } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import ProductCard from './ProductCard';
import LoadingSpinner from './LoadingSpinner';

const AdvancedSearchSystem = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  // Filter states
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    rating: '',
    inStock: false,
    onSale: false,
    freeShipping: false,
    location: '',
    availability: 'all' // all, in-stock, low-stock
  });

  // Search states
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    // Load initial data
    fetchCategories();
    fetchBrands();
    loadRecentSearches();

    // Parse URL parameters
    const urlQuery = searchParams.get('q') || '';
    const urlCategory = searchParams.get('category') || '';
    const urlBrand = searchParams.get('brand') || '';
    const urlSort = searchParams.get('sort') || 'relevance';

    setSearchQuery(urlQuery);
    setSortBy(urlSort);
    setFilters(prev => ({
      ...prev,
      category: urlCategory,
      brand: urlBrand
    }));

    if (urlQuery || urlCategory || urlBrand) {
      performSearch(urlQuery, { category: urlCategory, brand: urlBrand }, urlSort);
    }
  }, [searchParams]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/categories`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/brands`);
      if (response.ok) {
        const data = await response.json();
        setBrands(data.brands || []);
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  const loadRecentSearches = () => {
    const recent = localStorage.getItem('recentSearches');
    if (recent) {
      setRecentSearches(JSON.parse(recent));
    }
  };

  const saveRecentSearch = (query) => {
    if (!query.trim()) return;

    const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    const newRecent = [query, ...recent.filter(item => item !== query)].slice(0, 10);
    localStorage.setItem('recentSearches', JSON.stringify(newRecent));
    setRecentSearches(newRecent);
  };

  const fetchSuggestions = useCallback(async (query) => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/search/suggestions?q=${encodeURIComponent(query)}`
      );
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.suggestions || []);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  }, []);

  const performSearch = async (query = searchQuery, searchFilters = filters, sort = sortBy) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      if (query.trim()) params.append('q', query);
      if (searchFilters.category) params.append('category', searchFilters.category);
      if (searchFilters.brand) params.append('brand', searchFilters.brand);
      if (searchFilters.minPrice) params.append('minPrice', searchFilters.minPrice);
      if (searchFilters.maxPrice) params.append('maxPrice', searchFilters.maxPrice);
      if (searchFilters.rating) params.append('rating', searchFilters.rating);
      if (searchFilters.inStock) params.append('inStock', 'true');
      if (searchFilters.onSale) params.append('onSale', 'true');
      if (searchFilters.freeShipping) params.append('freeShipping', 'true');
      if (searchFilters.availability !== 'all') params.append('availability', searchFilters.availability);
      if (sort !== 'relevance') params.append('sort', sort);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/search?${params.toString()}`
      );

      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);

        // Save search query to recent searches
        if (query.trim()) {
          saveRecentSearch(query);
        }

        // Update URL
        const newSearchParams = new URLSearchParams();
        if (query.trim()) newSearchParams.append('q', query);
        if (searchFilters.category) newSearchParams.append('category', searchFilters.category);
        if (searchFilters.brand) newSearchParams.append('brand', searchFilters.brand);
        if (sort !== 'relevance') newSearchParams.append('sort', sort);

        setSearchParams(newSearchParams);
      }
    } catch (error) {
      console.error('Error performing search:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchInput = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Fetch suggestions with debounce
    const timeoutId = setTimeout(() => {
      fetchSuggestions(value);
      setShowSuggestions(true);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  const handleFilterChange = (filterName, value) => {
    const newFilters = { ...filters, [filterName]: value };
    setFilters(newFilters);
  };

  const applyFilters = () => {
    performSearch(searchQuery, filters, sortBy);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      brand: '',
      minPrice: '',
      maxPrice: '',
      rating: '',
      inStock: false,
      onSale: false,
      freeShipping: false,
      location: '',
      availability: 'all'
    });
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.text);
    setShowSuggestions(false);
    if (suggestion.type === 'product') {
      navigate(`/products/${suggestion.id}`);
    } else {
      performSearch(suggestion.text);
    }
  };

  const activeFiltersCount = Object.values(filters).filter(value =>
    value && value !== '' && value !== false && value !== 'all'
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Search Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="relative">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchInput}
              onKeyPress={(e) => e.key === 'Enter' && performSearch()}
              placeholder="Search for products, brands, categories..."
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={() => performSearch()}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-1 rounded hover:bg-blue-700"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>

          {/* Search Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
                >
                  <Search className="h-4 w-4 text-gray-400" />
                  <span>{suggestion.text}</span>
                  {suggestion.type === 'product' && (
                    <span className="text-xs text-blue-600 ml-auto">Product</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Recent Searches */}
        {recentSearches.length > 0 && !searchQuery && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Recent Searches</h3>
            <div className="flex flex-wrap gap-2">
              {recentSearches.slice(0, 5).map((search, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSearchQuery(search);
                    performSearch(search);
                  }}
                  className="flex items-center space-x-1 px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200"
                >
                  <Clock className="h-3 w-3" />
                  <span>{search}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quick Filters */}
        <div className="flex flex-wrap items-center gap-4 mt-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${
              showFilters ? 'bg-blue-50 border-blue-300' : 'border-gray-300'
            } hover:bg-gray-50`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="relevance">Most Relevant</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest First</option>
            <option value="bestselling">Best Selling</option>
          </select>

          {/* Quick Filter Buttons */}
          <button
            onClick={() => {
              handleFilterChange('inStock', !filters.inStock);
              const newFilters = { ...filters, inStock: !filters.inStock };
              performSearch(searchQuery, newFilters, sortBy);
            }}
            className={`px-3 py-2 rounded-lg text-sm ${
              filters.inStock ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'
            }`}
          >
            In Stock Only
          </button>

          <button
            onClick={() => {
              handleFilterChange('onSale', !filters.onSale);
              const newFilters = { ...filters, onSale: !filters.onSale };
              performSearch(searchQuery, newFilters, sortBy);
            }}
            className={`px-3 py-2 rounded-lg text-sm ${
              filters.onSale ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-700'
            }`}
          >
            On Sale
          </button>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Brand Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand
              </label>
              <select
                value={filters.brand}
                onChange={(e) => handleFilterChange('brand', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">All Brands</option>
                {brands.map(brand => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range (MAD)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Rating
              </label>
              <select
                value={filters.rating}
                onChange={(e) => handleFilterChange('rating', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Any Rating</option>
                <option value="4">4 Stars & Up</option>
                <option value="3">3 Stars & Up</option>
                <option value="2">2 Stars & Up</option>
                <option value="1">1 Star & Up</option>
              </select>
            </div>
          </div>

          {/* Additional Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.freeShipping}
                onChange={(e) => handleFilterChange('freeShipping', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Free Shipping</span>
            </label>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Availability
              </label>
              <select
                value={filters.availability}
                onChange={(e) => handleFilterChange('availability', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="all">All Products</option>
                <option value="in-stock">In Stock</option>
                <option value="low-stock">Low Stock (Hurry!)</option>
              </select>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex space-x-4 mt-6">
            <button
              onClick={applyFilters}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Apply Filters
            </button>
            <button
              onClick={clearFilters}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Clear All
            </button>
          </div>
        </div>
      )}

      {/* Search Results */}
      <div>
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {searchQuery ? (
                  <>Search results for "{searchQuery}" ({products.length} products)</>
                ) : (
                  <>All Products ({products.length} products)</>
                )}
              </h2>
            </div>

            {/* Products Grid */}
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No products found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your search or filters to find what you're looking for.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdvancedSearchSystem;
