import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Filter, Grid, List, Star, ArrowRight, Package } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { ProductGridSkeleton } from '../components/LoadingSkeletons';

const Brands = () => {
  const [brands, setBrands] = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('name'); // 'name', 'products', 'popularity'
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBrands();
    fetchCategories();
  }, []);

  useEffect(() => {
    filterAndSortBrands();
  }, [brands, searchTerm, selectedCategory, sortBy]);

  const fetchBrands = async () => {
    try {
      // Simulated brand data - in real app, fetch from API
      const mockBrands = [
        {
          id: 1,
          name: 'Ariel',
          logo: '${import.meta.env.VITE_API_URL}/api/placeholder/100x60',
          description: 'Leading laundry detergent brand',
          productCount: 15,
          categories: ['cleaning'],
          rating: 4.5,
          country: 'Germany',
          established: 1967,
          website: 'https://ariel.com',
          featured: true
        },
        {
          id: 2,
          name: 'Dove',
          logo: '${import.meta.env.VITE_API_URL}/api/placeholder/100x60',
          description: 'Premium personal care and beauty products',
          productCount: 23,
          categories: ['personal-care', 'cosmetics'],
          rating: 4.7,
          country: 'Netherlands',
          established: 1957,
          website: 'https://dove.com',
          featured: true
        },
        {
          id: 3,
          name: 'Nivea',
          logo: '${import.meta.env.VITE_API_URL}/api/placeholder/100x60',
          description: 'Skincare and cosmetics excellence',
          productCount: 31,
          categories: ['cosmetics', 'personal-care'],
          rating: 4.6,
          country: 'Germany',
          established: 1911,
          website: 'https://nivea.com',
          featured: true
        },
        {
          id: 4,
          name: 'Ajax',
          logo: '${import.meta.env.VITE_API_URL}/api/placeholder/100x60',
          description: 'Powerful household cleaning solutions',
          productCount: 8,
          categories: ['cleaning'],
          rating: 4.3,
          country: 'USA',
          established: 1947,
          website: 'https://ajax.com',
          featured: false
        },
        {
          id: 5,
          name: "L'Oréal",
          logo: '${import.meta.env.VITE_API_URL}/api/placeholder/100x60',
          description: 'World leader in beauty and cosmetics',
          productCount: 45,
          categories: ['cosmetics'],
          rating: 4.8,
          country: 'France',
          established: 1909,
          website: 'https://loreal.com',
          featured: true
        },
        {
          id: 6,
          name: 'Colgate',
          logo: '${import.meta.env.VITE_API_URL}/api/placeholder/100x60',
          description: 'Oral care products and toothpaste',
          productCount: 12,
          categories: ['personal-care'],
          rating: 4.4,
          country: 'USA',
          established: 1806,
          website: 'https://colgate.com',
          featured: false
        }
      ];

      setBrands(mockBrands);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching brands:', error);
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const mockCategories = [
        { id: 'all', name: t('allCategories') },
        { id: 'cleaning', name: t('cleaningProducts') },
        { id: 'personal-care', name: t('personalCare') },
        { id: 'cosmetics', name: t('cosmetics') },
        { id: 'household', name: t('householdItems') }
      ];
      setCategories(mockCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const filterAndSortBrands = () => {
    let filtered = brands.filter(brand => {
      const matchesSearch = brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           brand.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' ||
                             brand.categories.includes(selectedCategory);
      return matchesSearch && matchesCategory;
    });

    // Sort brands
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'products':
          return b.productCount - a.productCount;
        case 'popularity':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

    setFilteredBrands(filtered);
  };

  const handleBrandClick = (brand) => {
    navigate(`/products?brand=${brand.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <ProductGridSkeleton count={6} />
        </div>
      </div>
    );
  }

  const featuredBrands = brands.filter(brand => brand.featured);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">{t('ourBrands')}</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              {t('brandsDescription')}
            </p>
          </div>
        </div>
      </div>

      {/* Featured Brands */}
      {featuredBrands.length > 0 && (
        <div className="bg-white py-12">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              {t('featuredBrands')}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {featuredBrands.map((brand) => (
                <div
                  key={brand.id}
                  onClick={() => handleBrandClick(brand)}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-200"
                >
                  <div className="text-center">
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="h-16 mx-auto mb-3 object-contain"
                    />
                    <h3 className="font-semibold text-gray-900">{brand.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {brand.productCount} {t('products')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t('searchBrands')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filters and View Options */}
            <div className="flex items-center space-x-4">
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="name">{t('sortByName')}</option>
                <option value="products">{t('sortByProducts')}</option>
                <option value="popularity">{t('sortByPopularity')}</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-gray-600">
            {filteredBrands.length} {t('brandsFound')}
          </div>
        </div>
      </div>

      {/* Brands Grid/List */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {filteredBrands.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('noBrandsFound')}</h3>
            <p className="text-gray-500">{t('tryDifferentSearch')}</p>
          </div>
        ) : (
          <div className={viewMode === 'grid'
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"
          }>
            {filteredBrands.map((brand) => (
              <div
                key={brand.id}
                onClick={() => handleBrandClick(brand)}
                className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer ${
                  viewMode === 'grid' ? 'p-6' : 'p-4 flex items-center space-x-4'
                }`}
              >
                {viewMode === 'grid' ? (
                  <div className="text-center">
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="h-20 mx-auto mb-4 object-contain"
                    />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {brand.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {brand.description}
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{brand.rating}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {brand.productCount} {t('products')}
                      </div>
                      <div className="text-xs text-gray-400">
                        {brand.country} • {t('since')} {brand.established}
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="h-16 w-24 object-contain flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {brand.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {brand.description}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span>{brand.rating}</span>
                        </div>
                        <span>{brand.productCount} {t('products')}</span>
                        <span>{brand.country}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Brand Partnership CTA */}
      <div className="bg-blue-600 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">{t('brandPartnership')}</h2>
          <p className="text-blue-100 mb-6">
            {t('brandPartnershipDescription')}
          </p>
          <Link
            to="/contact"
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors inline-flex items-center space-x-2"
          >
            <span>{t('contactUs')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Brands;
