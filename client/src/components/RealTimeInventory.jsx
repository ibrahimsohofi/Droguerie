import React, { useState, useEffect, useMemo } from 'react';
import { useTranslations, useLanguage } from '../context/LanguageContext';
import {
  Package,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  RefreshCw,
  Plus,
  Minus,
  Search,
  Filter,
  Download,
  Upload,
  Barcode,
  Calendar,
  DollarSign,
  Users
} from 'lucide-react';

const RealTimeInventory = ({
  products = [],
  onStockUpdate,
  onLowStockAlert,
  isAdmin = false
}) => {
  const t = useTranslations();
  const { isRTL, formatCurrency, formatNumber } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState('all'); // all, low_stock, out_of_stock, in_stock
  const [sortBy, setSortBy] = useState('name');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [newStockValues, setNewStockValues] = useState({});

  // Inventory statistics
  const inventoryStats = useMemo(() => {
    const totalProducts = products.length;
    const inStock = products.filter(p => (p.stock_quantity || 0) > 0).length;
    const lowStock = products.filter(p => (p.stock_quantity || 0) > 0 && (p.stock_quantity || 0) <= (p.low_stock_threshold || 10)).length;
    const outOfStock = products.filter(p => (p.stock_quantity || 0) === 0).length;
    const totalValue = products.reduce((sum, p) => sum + ((p.stock_quantity || 0) * (p.cost_price || p.price || 0)), 0);

    return {
      totalProducts,
      inStock,
      lowStock,
      outOfStock,
      totalValue,
      stockPercentage: totalProducts > 0 ? Math.round((inStock / totalProducts) * 100) : 0
    };
  }, [products]);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(product => {
        const searchableText = [
          product.name?.en?.toLowerCase() || '',
          product.name?.ar?.toLowerCase() || '',
          product.sku?.toLowerCase() || '',
          product.brand?.toLowerCase() || ''
        ].join(' ');
        return searchableText.includes(query);
      });
    }

    // Stock filter
    switch (filterBy) {
      case 'low_stock':
        result = result.filter(p =>
          (p.stock_quantity || 0) > 0 &&
          (p.stock_quantity || 0) <= (p.low_stock_threshold || 10)
        );
        break;
      case 'out_of_stock':
        result = result.filter(p => (p.stock_quantity || 0) === 0);
        break;
      case 'in_stock':
        result = result.filter(p => (p.stock_quantity || 0) > (p.low_stock_threshold || 10));
        break;
      default:
        break;
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'stock_low':
          return (a.stock_quantity || 0) - (b.stock_quantity || 0);
        case 'stock_high':
          return (b.stock_quantity || 0) - (a.stock_quantity || 0);
        case 'value':
          return ((b.stock_quantity || 0) * (b.price || 0)) - ((a.stock_quantity || 0) * (a.price || 0));
        case 'updated':
          return new Date(b.updated_at || 0) - new Date(a.updated_at || 0);
        case 'name':
        default:
          const nameA = a.name?.[isRTL ? 'ar' : 'en'] || a.name?.en || '';
          const nameB = b.name?.[isRTL ? 'ar' : 'en'] || b.name?.en || '';
          return nameA.localeCompare(nameB);
      }
    });

    return result;
  }, [products, searchQuery, filterBy, sortBy, isRTL]);

  // Handle stock update
  const handleStockUpdate = async (productId, newQuantity, reason = 'manual_adjustment') => {
    setIsUpdating(true);

    try {
      const updateData = {
        product_id: productId,
        new_quantity: newQuantity,
        reason,
        timestamp: new Date().toISOString()
      };

      await onStockUpdate?.(updateData);

      // Clear new stock value
      setNewStockValues(prev => {
        const updated = { ...prev };
        delete updated[productId];
        return updated;
      });

    } catch (error) {
      console.error('Failed to update stock:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle bulk stock update
  const handleBulkUpdate = async () => {
    if (selectedProducts.length === 0) return;

    setIsUpdating(true);

    try {
      const updates = selectedProducts.map(productId => ({
        product_id: productId,
        new_quantity: newStockValues[productId] || 0,
        reason: 'bulk_adjustment',
        timestamp: new Date().toISOString()
      }));

      for (const update of updates) {
        await onStockUpdate?.(update);
      }

      setSelectedProducts([]);
      setNewStockValues({});
      setShowBulkActions(false);

    } catch (error) {
      console.error('Failed to bulk update stock:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Get stock status
  const getStockStatus = (product) => {
    const quantity = product.stock_quantity || 0;
    const threshold = product.low_stock_threshold || 10;

    if (quantity === 0) {
      return { status: 'out_of_stock', color: 'text-red-600 bg-red-100', label: isRTL ? 'غير متوفر' : 'Out of Stock' };
    } else if (quantity <= threshold) {
      return { status: 'low_stock', color: 'text-yellow-600 bg-yellow-100', label: isRTL ? 'مخزون منخفض' : 'Low Stock' };
    } else {
      return { status: 'in_stock', color: 'text-green-600 bg-green-100', label: isRTL ? 'متوفر' : 'In Stock' };
    }
  };

  // Handle product selection
  const toggleProductSelection = (productId) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const selectAllVisible = () => {
    const visibleIds = filteredProducts.map(p => p.id);
    setSelectedProducts(visibleIds);
  };

  const clearSelection = () => {
    setSelectedProducts([]);
    setNewStockValues({});
  };

  if (!isAdmin) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-600" />
          <p className="text-yellow-800">
            {isRTL ? 'مطلوب صلاحية إدارية لعرض إدارة المخزون' : 'Admin privileges required to view inventory management'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Inventory Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-moroccan p-4 border border-emerald-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Package className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">
                {isRTL ? 'إجمالي المنتجات' : 'Total Products'}
              </p>
              <p className="text-xl font-bold text-gray-800">
                {formatNumber(inventoryStats.totalProducts)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-moroccan p-4 border border-green-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">
                {isRTL ? 'متوفر' : 'In Stock'}
              </p>
              <p className="text-xl font-bold text-gray-800">
                {formatNumber(inventoryStats.inStock)} ({inventoryStats.stockPercentage}%)
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-moroccan p-4 border border-yellow-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">
                {isRTL ? 'مخزون منخفض' : 'Low Stock'}
              </p>
              <p className="text-xl font-bold text-gray-800">
                {formatNumber(inventoryStats.lowStock)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-moroccan p-4 border border-red-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <TrendingDown className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">
                {isRTL ? 'غير متوفر' : 'Out of Stock'}
              </p>
              <p className="text-xl font-bold text-gray-800">
                {formatNumber(inventoryStats.outOfStock)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Value */}
      <div className="bg-gradient-moroccan text-white rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <DollarSign className="w-6 h-6" />
            <div>
              <p className="text-white opacity-90">
                {isRTL ? 'إجمالي قيمة المخزون' : 'Total Inventory Value'}
              </p>
              <p className="text-2xl font-bold">
                {formatCurrency(inventoryStats.totalValue)}
              </p>
            </div>
          </div>
          <RefreshCw className="w-5 h-5 opacity-75" />
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-moroccan p-4">
        <div className="flex flex-wrap gap-4 mb-4">
          {/* Search */}
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className={`absolute top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isRTL ? 'البحث عن المنتجات...' : 'Search products...'}
                className={`form-input ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
              />
            </div>
          </div>

          {/* Filter */}
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="form-input min-w-40"
          >
            <option value="all">{isRTL ? 'جميع المنتجات' : 'All Products'}</option>
            <option value="in_stock">{isRTL ? 'متوفر' : 'In Stock'}</option>
            <option value="low_stock">{isRTL ? 'مخزون منخفض' : 'Low Stock'}</option>
            <option value="out_of_stock">{isRTL ? 'غير متوفر' : 'Out of Stock'}</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="form-input min-w-40"
          >
            <option value="name">{isRTL ? 'الاسم' : 'Name'}</option>
            <option value="stock_low">{isRTL ? 'المخزون (أقل)' : 'Stock (Low)'}</option>
            <option value="stock_high">{isRTL ? 'المخزون (أكثر)' : 'Stock (High)'}</option>
            <option value="value">{isRTL ? 'القيمة' : 'Value'}</option>
            <option value="updated">{isRTL ? 'آخر تحديث' : 'Last Updated'}</option>
          </select>
        </div>

        {/* Bulk Actions */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={selectAllVisible}
            className="btn-secondary text-sm"
          >
            {isRTL ? 'تحديد الكل' : 'Select All'}
          </button>

          <button
            onClick={clearSelection}
            className="btn-secondary text-sm"
          >
            {isRTL ? 'إلغاء التحديد' : 'Clear Selection'}
          </button>

          {selectedProducts.length > 0 && (
            <button
              onClick={() => setShowBulkActions(!showBulkActions)}
              className="btn-primary text-sm flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              {isRTL ? `تحديث مجموعي (${selectedProducts.length})` : `Bulk Update (${selectedProducts.length})`}
            </button>
          )}
        </div>

        {/* Bulk Update Panel */}
        {showBulkActions && selectedProducts.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-3">
              {isRTL ? 'تحديث المخزون المجموعي' : 'Bulk Stock Update'}
            </h3>
            <div className="flex gap-3">
              <button
                onClick={handleBulkUpdate}
                disabled={isUpdating}
                className="btn-primary text-sm"
              >
                {isRTL ? 'تطبيق التحديثات' : 'Apply Updates'}
              </button>
              <button
                onClick={() => setShowBulkActions(false)}
                className="btn-secondary text-sm"
              >
                {t.cancel || 'إلغاء'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-moroccan overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                    onChange={selectedProducts.length === filteredProducts.length ? clearSelection : selectAllVisible}
                    className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                  />
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  {isRTL ? 'المنتج' : 'Product'}
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  {isRTL ? 'الحالة' : 'Status'}
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  {isRTL ? 'المخزون الحالي' : 'Current Stock'}
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  {isRTL ? 'مخزون جديد' : 'New Stock'}
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  {isRTL ? 'القيمة' : 'Value'}
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  {isRTL ? 'إجراءات' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product);
                const isSelected = selectedProducts.includes(product.id);
                const stockValue = (product.stock_quantity || 0) * (product.cost_price || product.price || 0);

                return (
                  <tr key={product.id} className={isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}>
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleProductSelection(product.id)}
                        className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                      />
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image_url || '/placeholder-product.jpg'}
                          alt={product.name?.en || product.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-800">
                            {product.name?.[isRTL ? 'ar' : 'en'] || product.name?.en || product.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            SKU: {product.sku || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}>
                        {stockStatus.label}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span className="font-semibold">
                        {formatNumber(product.stock_quantity || 0)}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={newStockValues[product.id] ?? product.stock_quantity ?? 0}
                          onChange={(e) => setNewStockValues(prev => ({
                            ...prev,
                            [product.id]: parseInt(e.target.value) || 0
                          }))}
                          min="0"
                          className="form-input w-20 text-sm"
                        />
                        <div className="flex gap-1">
                          <button
                            onClick={() => setNewStockValues(prev => ({
                              ...prev,
                              [product.id]: Math.max(0, (prev[product.id] ?? product.stock_quantity ?? 0) - 1)
                            }))}
                            className="p-1 text-gray-600 hover:text-red-600 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setNewStockValues(prev => ({
                              ...prev,
                              [product.id]: (prev[product.id] ?? product.stock_quantity ?? 0) + 1
                            }))}
                            className="p-1 text-gray-600 hover:text-green-600 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span className="font-semibold text-emerald-600">
                        {formatCurrency(stockValue)}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleStockUpdate(
                          product.id,
                          newStockValues[product.id] ?? product.stock_quantity ?? 0
                        )}
                        disabled={isUpdating || (newStockValues[product.id] ?? product.stock_quantity) === product.stock_quantity}
                        className="btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isUpdating ? (
                          <RefreshCw className="w-4 h-4 spinner" />
                        ) : (
                          isRTL ? 'تحديث' : 'Update'
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              {isRTL ? 'لا توجد منتجات مطابقة للفلترة' : 'No products match the current filter'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RealTimeInventory;
