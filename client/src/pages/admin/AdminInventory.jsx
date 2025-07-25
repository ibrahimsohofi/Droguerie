import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Package, AlertTriangle, TrendingUp, TrendingDown, Edit, Download, Upload, Filter, Search, RotateCcw, CheckCircle, XCircle } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminInventory = () => {
  const { t, isRTL } = useLanguage();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showBulkUpdate, setShowBulkUpdate] = useState(false);
  const [bulkUpdateValue, setBulkUpdateValue] = useState('');
  const [bulkUpdateType, setBulkUpdateType] = useState('set');
  const [inventoryStats, setInventoryStats] = useState({
    totalProducts: 0,
    lowStockItems: 0,
    outOfStockItems: 0,
    totalValue: 0
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    calculateInventoryStats();
  }, [products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/products`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      setProducts(data.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateInventoryStats = () => {
    const stats = products.reduce((acc, product) => {
      acc.totalProducts++;
      if (product.stock_quantity <= 0) {
        acc.outOfStockItems++;
      } else if (product.stock_quantity <= 5) {
        acc.lowStockItems++;
      }
      acc.totalValue += (product.price || 0) * (product.stock_quantity || 0);
      return acc;
    }, {
      totalProducts: 0,
      lowStockItems: 0,
      outOfStockItems: 0,
      totalValue: 0
    });
    setInventoryStats(stats);
  };

  const updateStock = async (productId, newStock) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/products/${productId}/stock`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          quantity: newStock,
          type: 'SET',
          reason: 'Admin stock adjustment'
        }),
      });

      const data = await response.json();

      if (data.success) {
        setProducts(prev => prev.map(product =>
          product.id === productId
            ? { ...product, stock_quantity: data.data.newQuantity }
            : product
        ));
      } else {
        console.error('Stock update failed:', data.message);
      }
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  };

  const bulkUpdateStock = async () => {
    if (selectedProducts.length === 0 || !bulkUpdateValue) return;

    try {
      const updatePromises = selectedProducts.map(productId => {
        const product = products.find(p => p.id === productId);
        if (!product) return null;

        let newStock;
        switch (bulkUpdateType) {
          case 'set':
            newStock = parseInt(bulkUpdateValue);
            break;
          case 'add':
            newStock = (product.stock_quantity || 0) + parseInt(bulkUpdateValue);
            break;
          case 'subtract':
            newStock = Math.max(0, (product.stock_quantity || 0) - parseInt(bulkUpdateValue));
            break;
          default:
            return null;
        }

        return updateStock(productId, newStock);
      });

      await Promise.all(updatePromises.filter(Boolean));
      setSelectedProducts([]);
      setShowBulkUpdate(false);
      setBulkUpdateValue('');
    } catch (error) {
      console.error('Error bulk updating stock:', error);
    }
  };

  const getStockStatus = (stock) => {
    if (stock <= 0) return { status: 'out', color: 'text-red-600 bg-red-50', icon: XCircle };
    if (stock <= 5) return { status: 'low', color: 'text-orange-600 bg-orange-50', icon: AlertTriangle };
    return { status: 'good', color: 'text-green-600 bg-green-50', icon: CheckCircle };
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = (product.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.name_ar || '').includes(searchTerm) ||
                         (product.name_fr || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = (() => {
      switch (filterBy) {
        case 'low_stock': return product.stock_quantity > 0 && product.stock_quantity <= 5;
        case 'out_of_stock': return product.stock_quantity <= 0;
        case 'in_stock': return product.stock_quantity > 5;
        default: return true;
      }
    })();

    return matchesSearch && matchesFilter;
  }).sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case 'name':
        aValue = a.name || '';
        bValue = b.name || '';
        break;
      case 'stock':
        aValue = a.stock_quantity || 0;
        bValue = b.stock_quantity || 0;
        break;
      case 'price':
        aValue = a.price || 0;
        bValue = b.price || 0;
        break;
      default:
        return 0;
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const exportInventoryReport = () => {
    const csvContent = [
      ['Product Name', 'Stock Quantity', 'Price', 'Stock Value', 'Status'],
      ...filteredProducts.map(product => [
        product.name || '',
        product.stock_quantity || 0,
        product.price || 0,
        (product.price || 0) * (product.stock_quantity || 0),
        getStockStatus(product.stock_quantity).status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className={`p-6 max-w-7xl mx-auto ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          📦 Inventory Management
        </h1>
        <p className="text-gray-600">
          Monitor and manage your product inventory levels
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{inventoryStats.totalProducts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-50 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
            </div>
            <div className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
              <p className="text-sm font-medium text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-orange-600">{inventoryStats.lowStockItems}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-50 rounded-lg">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
              <p className="text-sm font-medium text-gray-600">Out of Stock</p>
              <p className="text-2xl font-bold text-red-600">{inventoryStats.outOfStockItems}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-50 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
              <p className="text-sm font-medium text-gray-600">Inventory Value</p>
              <p className="text-2xl font-bold text-green-600">
                {inventoryStats.totalValue.toFixed(2)} DH
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative">
              <Search className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} h-4 w-4 text-gray-400`} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`${isRTL ? 'pr-10' : 'pl-10'} pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64`}
              />
            </div>

            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Products</option>
              <option value="in_stock">In Stock</option>
              <option value="low_stock">Low Stock</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>

            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [sort, order] = e.target.value.split('-');
                setSortBy(sort);
                setSortOrder(order);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="stock-asc">Stock (Low to High)</option>
              <option value="stock-desc">Stock (High to Low)</option>
              <option value="price-asc">Price (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
            </select>
          </div>

          <div className="flex gap-2">
            {selectedProducts.length > 0 && (
              <button
                onClick={() => setShowBulkUpdate(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                Bulk Update ({selectedProducts.length})
              </button>
            )}

            <button
              onClick={exportInventoryReport}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export Report
            </button>

            <button
              onClick={fetchProducts}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Update Modal */}
      {showBulkUpdate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold mb-4">Bulk Stock Update</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Update Type
                </label>
                <select
                  value={bulkUpdateType}
                  onChange={(e) => setBulkUpdateType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="set">Set Stock To</option>
                  <option value="add">Add Stock</option>
                  <option value="subtract">Subtract Stock</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Value
                </label>
                <input
                  type="number"
                  value={bulkUpdateValue}
                  onChange={(e) => setBulkUpdateValue(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter stock value"
                  min="0"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={bulkUpdateStock}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                disabled={!bulkUpdateValue}
              >
                Update Stock
              </button>
              <button
                onClick={() => {
                  setShowBulkUpdate(false);
                  setBulkUpdateValue('');
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedProducts(filteredProducts.map(p => p.id));
                      } else {
                        setSelectedProducts([]);
                      }
                    }}
                    checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => {
                const stockInfo = getStockStatus(product.stock_quantity);
                const StockIcon = stockInfo.icon;

                return (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedProducts(prev => [...prev, product.id]);
                          } else {
                            setSelectedProducts(prev => prev.filter(id => id !== product.id));
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img
                          src={product.image_url || '/placeholder-product.jpg'}
                          alt={product.name}
                          className="h-10 w-10 rounded-lg object-cover"
                          onError={(e) => {
                            e.target.src = '/placeholder-product.jpg';
                          }}
                        />
                        <div className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {product.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={product.stock_quantity || 0}
                          onChange={(e) => updateStock(product.id, parseInt(e.target.value) || 0)}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                          min="0"
                        />
                        <span className="text-sm text-gray-500">units</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {(product.price || 0).toFixed(2)} DH
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {((product.price || 0) * (product.stock_quantity || 0)).toFixed(2)} DH
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stockInfo.color}`}>
                        <StockIcon className="h-3 w-3 mr-1" />
                        {stockInfo.status === 'out' ? 'Out of Stock' :
                         stockInfo.status === 'low' ? 'Low Stock' : 'In Stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <button
                        onClick={() => updateStock(product.id, (product.stock_quantity || 0) + 10)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        title="Quick Add 10"
                      >
                        +10
                      </button>
                      <button
                        onClick={() => updateStock(product.id, Math.max(0, (product.stock_quantity || 0) - 5))}
                        className="text-orange-600 hover:text-orange-900"
                        title="Quick Remove 5"
                      >
                        -5
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminInventory;
