import React from 'react';
import { Filter, X } from 'lucide-react';

const CategoryFilter = ({
  categories = [],
  selectedCategory,
  onCategoryChange,
  productCount = 0,
  isLoading = false,
  language = 'ar',
  translations
}) => {
  const isRTL = language === 'ar';
  const t = translations || {};

  const handleCategoryClick = (categoryId) => {
    // If the same category is clicked, deselect it (show all)
    if (selectedCategory === categoryId) {
      onCategoryChange(null);
    } else {
      onCategoryChange(categoryId);
    }
  };

  const clearFilter = () => {
    onCategoryChange(null);
  };

  const getLocalizedCategoryName = (category) => {
    if (language === 'ar') return category.name_ar || category.name;
    if (language === 'fr') return category.name_fr || category.name;
    return category.name;
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded-lg mb-6"></div>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-14 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6 sticky top-28" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className={`flex items-center justify-between mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <h3 className={`text-2xl font-bold text-blue-900 flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Filter className={`h-7 w-7 text-blue-500 ${isRTL ? 'ml-3' : 'mr-3'}`} />
          {t.categories?.filter || 'Filter Categories'}
        </h3>

        {selectedCategory && (
          <button
            onClick={clearFilter}
            className="text-blue-500 hover:text-blue-600 text-sm flex items-center transition-all duration-300 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg"
          >
            <X className={`h-4 w-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
            {t.categories.clear}
          </button>
        )}
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-500 mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
        {selectedCategory ? (
          <span className="font-semibold text-blue-900">
            {productCount} {t.categories.found}
          </span>
        ) : (
          <span className="font-semibold text-blue-900">
            {t.categories?.total || 'Total'} {productCount} {t.products?.products || 'products'}
          </span>
        )}
      </div>

      {/* All Products Option */}
      <div className="space-y-3">
        <button
          onClick={() => handleCategoryClick(null)}
          className={`w-full text-${isRTL ? 'right' : 'left'} p-5 rounded-lg transition-all duration-300 border transform hover:scale-[1.02] ${
            !selectedCategory
              ? 'bg-blue-50 border-blue-200 text-blue-900 shadow-md ring-2 ring-blue-100'
              : 'bg-white border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-200'
          }`}
        >
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className="font-bold text-lg">{t.categories?.all || 'All Categories'}</span>
            <span className={`text-sm px-3 py-1 rounded-full font-semibold ${
              !selectedCategory
                ? 'bg-blue-200 text-blue-800'
                : 'bg-gray-200 text-gray-600'
            }`}>
              {categories.reduce((total, cat) => total + (cat.product_count || 0), 0)}
            </span>
          </div>
        </button>

        {/* Category List */}
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={`w-full text-${isRTL ? 'right' : 'left'} p-5 rounded-lg transition-all duration-300 border transform hover:scale-[1.02] ${
              selectedCategory === category.id
                ? 'bg-orange-50 border-orange-200 text-orange-900 shadow-md ring-2 ring-orange-100'
                : 'bg-white border-gray-200 text-gray-700 hover:bg-orange-50 hover:border-orange-200'
            }`}
          >
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <div className="font-bold text-lg text-blue-900">
                  {getLocalizedCategoryName(category)}
                </div>
              </div>
              <span className={`text-sm px-3 py-1 rounded-full font-semibold ${
                selectedCategory === category.id
                  ? 'bg-orange-200 text-orange-800'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {category.product_count || 0}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Empty State */}
      {categories.length === 0 && !isLoading && (
        <div className="text-center py-16 text-gray-500">
          <div className="bg-gray-200 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <Filter className="h-12 w-12 opacity-50" />
          </div>
          <p className="font-semibold text-lg">{t.empty?.noCategories || 'No categories available'}</p>
        </div>
      )}
    </div>
  );
};

export default CategoryFilter;
