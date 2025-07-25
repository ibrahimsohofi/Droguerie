import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Grid, List, Filter, Search, Eye, ShoppingCart, GitCompare, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../components/ToastProvider';
import ProductCard from '../components/ProductCard';
import AdvancedFilter from '../components/AdvancedFilter';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';

const Products = () => {
  const { categoryId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(categoryId ? parseInt(categoryId) : null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [viewMode, setViewMode] = useState('grid');
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [comparisonProducts, setComparisonProducts] = useState([]);
  const [showComparison, setShowComparison] = useState(false);
  const [filters, setFilters] = useState({
    category: categoryId || '',
    minPrice: '',
    maxPrice: '',
    availability: '',
    sortBy: 'name',
    categories: [],
    brands: [],
    priceRange: { min: '', max: '' },
    rating: 0,
    inStock: false,
    onSale: false
  });

  const { language, isRTL, t } = useLanguage();
  const { addToCart } = useCart();
  const { warning, info, success } = useToast();

  // Comparison functions
  const addToComparison = (product) => {
    if (comparisonProducts.length >= 4) {
      warning('You can only compare up to 4 products at a time.', {
        title: 'Comparison Limit'
      });
      return;
    }

    if (comparisonProducts.find(p => p.id === product.id)) {
      info('This product is already in your comparison list.', {
        title: 'Already Added'
      });
      return;
    }

    setComparisonProducts(prev => [...prev, product]);
    success(`${product.name} has been added to comparison.`, {
      title: 'Added to Comparison'
    });
  };

  const removeFromComparison = (productId) => {
    setComparisonProducts(prev => prev.filter(p => p.id !== productId));
  };

  const handleAdvancedFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Fetch products and categories
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('${import.meta.env.VITE_API_URL}/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch('${import.meta.env.VITE_API_URL}/api/categories');
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        setCategories(data || []);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  // Handle search
  useEffect(() => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        setIsSearching(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [searchQuery]);

  // Update URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedCategory) params.set('category', selectedCategory.toString());
    setSearchParams(params);
  }, [searchQuery, selectedCategory, setSearchParams]);

  // Enhanced product filtering
  const getFilteredProducts = () => {
    let filtered = products;

    // Search query filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        (product[`name_${language}`] || product.name)
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (product[`description_${language}`] || product.description || '')
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter(product =>
        filters.categories.includes(product.category_id)
      );
    } else if (selectedCategory) {
      filtered = filtered.filter(product => product.category_id === selectedCategory);
    }

    // Brand filter
    if (filters.brands && filters.brands.length > 0) {
      filtered = filtered.filter(product =>
        filters.brands.includes(product.brand_id)
      );
    }

    // Price range filter
    if (filters.priceRange.min || filters.priceRange.max) {
      filtered = filtered.filter(product => {
        const price = parseFloat(product.price);
        const min = filters.priceRange.min ? parseFloat(filters.priceRange.min) : 0;
        const max = filters.priceRange.max ? parseFloat(filters.priceRange.max) : Infinity;
        return price >= min && price <= max;
      });
    }

    // Rating filter
    if (filters.rating > 0) {
      filtered = filtered.filter(product =>
        (product.rating || 0) >= filters.rating
      );
    }

    // Stock filter
    if (filters.inStock) {
      filtered = filtered.filter(product =>
        product.stock > 0
      );
    }

    // Sale filter
    if (filters.onSale) {
      filtered = filtered.filter(product =>
        product.discount_percent > 0
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'name':
          return (a[`name_${language}`] || a.name).localeCompare(b[`name_${language}`] || b.name);
        case 'name_desc':
          return (b[`name_${language}`] || b.name).localeCompare(a[`name_${language}`] || a.name);
        case 'price_asc':
          return parseFloat(a.price) - parseFloat(b.price);
        case 'price_desc':
          return parseFloat(b.price) - parseFloat(a.price);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'newest':
          return new Date(b.created_at) - new Date(a.created_at);
        case 'popular':
          return (b.view_count || 0) - (a.view_count || 0);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const filteredProducts = getFilteredProducts();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Products</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Products</h1>

        {/* Search and Filter Controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
              className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
              {showAdvancedFilter ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Advanced Filter */}
        {showAdvancedFilter && (
          <div className="mb-6">
            <AdvancedFilter
              onFilterChange={setFilters}
              categories={categories}
              brands={[]}
            />
          </div>
        )}

        {/* Comparison Panel */}
        {comparisonProducts.length > 0 && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <GitCompare className="w-5 h-5 text-blue-600" />
                <span className="font-medium">
                  {comparisonProducts.length} product(s) selected for comparison
                </span>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => setShowComparison(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Compare
                </button>
                <button
                  onClick={() => setComparisonProducts([])}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Products Grid/List */}
      <div className="mb-8">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-6'
          }>
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                viewMode={viewMode}
                onAddToCart={addToCart}
                onAddToComparison={() => addToComparison(product)}
                onRemoveFromComparison={() => removeFromComparison(product.id)}
                isInComparison={comparisonProducts.some(p => p.id === product.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredProducts.length > 0 && (
        <Pagination
          currentPage={1}
          totalPages={Math.ceil(filteredProducts.length / 12)}
          onPageChange={() => {}}
        />
      )}
    </div>
  );
};

export default Products;
