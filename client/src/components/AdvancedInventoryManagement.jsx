import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Plus, Edit3, Trash2, Package, AlertTriangle, TrendingUp, TrendingDown, BarChart3, Download, Upload, RefreshCw, Eye, Calculator } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const AdvancedInventoryManagement = () => {
  const { language, isRTL, formatCurrency } = useLanguage();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    stockLevel: '',
    supplier: ''
  });
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [bulkAction, setBulkAction] = useState('');

  // Get text translations
  const getText = () => {
    return {
      title: language === 'ar' ? 'إدارة المخزون المتقدمة' : language === 'fr' ? 'Gestion avancée des stocks' : 'Advanced Inventory Management',
      overview: language === 'ar' ? 'نظرة عامة' : language === 'fr' ? 'Aperçu' : 'Overview',
      totalProducts: language === 'ar' ? 'إجمالي المنتجات' : language === 'fr' ? 'Total des produits' : 'Total Products',
      lowStock: language === 'ar' ? 'مخزون منخفض' : language === 'fr' ? 'Stock faible' : 'Low Stock',
      outOfStock: language === 'ar' ? 'نفد المخزون' : language === 'fr' ? 'En rupture' : 'Out of Stock',
      totalValue: language === 'ar' ? 'قيمة المخزون' : language === 'fr' ? 'Valeur du stock' : 'Total Value',

      // Search and Filter
      searchProducts: language === 'ar' ? 'البحث في المنتجات...' : language === 'fr' ? 'Rechercher des produits...' : 'Search products...',
      filters: language === 'ar' ? 'المرشحات' : language === 'fr' ? 'Filtres' : 'Filters',
      category: language === 'ar' ? 'الفئة' : language === 'fr' ? 'Catégorie' : 'Category',
      status: language === 'ar' ? 'الحالة' : language === 'fr' ? 'Statut' : 'Status',
      stockLevel: language === 'ar' ? 'مستوى المخزون' : language === 'fr' ? 'Niveau de stock' : 'Stock Level',
      supplier: language === 'ar' ? 'المورد' : language === 'fr' ? 'Fournisseur' : 'Supplier',

      // Product Fields
      productName: language === 'ar' ? 'اسم المنتج' : language === 'fr' ? 'Nom du produit' : 'Product Name',
      sku: language === 'ar' ? 'رمز المنتج' : language === 'fr' ? 'Référence' : 'SKU',
      currentStock: language === 'ar' ? 'المخزون الحالي' : language === 'fr' ? 'Stock actuel' : 'Current Stock',
      minStock: language === 'ar' ? 'الحد الأدنى' : language === 'fr' ? 'Stock min' : 'Min Stock',
      maxStock: language === 'ar' ? 'الحد الأقصى' : language === 'fr' ? 'Stock max' : 'Max Stock',
      unitCost: language === 'ar' ? 'سعر الوحدة' : language === 'fr' ? 'Coût unitaire' : 'Unit Cost',
      sellingPrice: language === 'ar' ? 'سعر البيع' : language === 'fr' ? 'Prix de vente' : 'Selling Price',
      lastUpdated: language === 'ar' ? 'آخر تحديث' : language === 'fr' ? 'Dernière mise à jour' : 'Last Updated',

      // Actions
      addProduct: language === 'ar' ? 'إضافة منتج' : language === 'fr' ? 'Ajouter un produit' : 'Add Product',
      editProduct: language === 'ar' ? 'تعديل' : language === 'fr' ? 'Modifier' : 'Edit',
      deleteProduct: language === 'ar' ? 'حذف' : language === 'fr' ? 'Supprimer' : 'Delete',
      viewDetails: language === 'ar' ? 'عرض التفاصيل' : language === 'fr' ? 'Voir les détails' : 'View Details',
      bulkActions: language === 'ar' ? 'إجراءات جماعية' : language === 'fr' ? 'Actions en lot' : 'Bulk Actions',
      updateStock: language === 'ar' ? 'تحديث المخزون' : language === 'fr' ? 'Mettre à jour le stock' : 'Update Stock',
      generateReport: language === 'ar' ? 'تقرير' : language === 'fr' ? 'Rapport' : 'Generate Report',
      exportData: language === 'ar' ? 'تصدير' : language === 'fr' ? 'Exporter' : 'Export',
      importData: language === 'ar' ? 'استيراد' : language === 'fr' ? 'Importer' : 'Import',

      // Status Labels
      inStock: language === 'ar' ? 'متوفر' : language === 'fr' ? 'En stock' : 'In Stock',
      discontinued: language === 'ar' ? 'متوقف' : language === 'fr' ? 'Arrêté' : 'Discontinued',

      // Stock Levels
      adequate: language === 'ar' ? 'كافي' : language === 'fr' ? 'Adéquat' : 'Adequate',
      low: language === 'ar' ? 'منخفض' : language === 'fr' ? 'Faible' : 'Low',
      critical: language === 'ar' ? 'حرج' : language === 'fr' ? 'Critique' : 'Critical',

      // Sorting
      sortBy: language === 'ar' ? 'ترتيب حسب' : language === 'fr' ? 'Trier par' : 'Sort by',
      ascending: language === 'ar' ? 'تصاعدي' : language === 'fr' ? 'Croissant' : 'Ascending',
      descending: language === 'ar' ? 'تنازلي' : language === 'fr' ? 'Décroissant' : 'Descending',
    };
  };

  const text = getText();

  // Sample inventory data (in production, this would come from an API)
  const sampleInventoryData = [
    {
      id: 1,
      name: language === 'ar' ? 'مسحوق أريال 3 كغ' : 'Ariel Detergent Powder 3kg',
      sku: 'ARD-3KG-001',
      category: language === 'ar' ? 'منتجات التنظيف' : 'Cleaning Products',
      currentStock: 45,
      minStock: 10,
      maxStock: 100,
      unitCost: 45.00,
      sellingPrice: 65.00,
      supplier: language === 'ar' ? 'شركة التوزيع المغربية' : 'Moroccan Distribution Co.',
      lastUpdated: '2024-01-15',
      expiryDate: '2025-06-15',
      location: 'A1-B3',
      barcode: '1234567890123'
    },
    {
      id: 2,
      name: language === 'ar' ? 'صابون دوف 90غ' : 'Dove Beauty Bar 90g',
      sku: 'DVB-90G-002',
      category: language === 'ar' ? 'العناية الشخصية' : 'Personal Care',
      currentStock: 8,
      minStock: 15,
      maxStock: 80,
      unitCost: 12.00,
      sellingPrice: 18.00,
      supplier: language === 'ar' ? 'يونيليفر المغرب' : 'Unilever Morocco',
      lastUpdated: '2024-01-10',
      expiryDate: '2026-12-31',
      location: 'B2-C1',
      barcode: '2345678901234'
    },
    {
      id: 3,
      name: language === 'ar' ? 'شامبو هيد آند شولدرز 400مل' : 'Head & Shoulders Shampoo 400ml',
      sku: 'HAS-400-003',
      category: language === 'ar' ? 'العناية الشخصية' : 'Personal Care',
      currentStock: 0,
      minStock: 12,
      maxStock: 60,
      unitCost: 35.00,
      sellingPrice: 55.00,
      supplier: language === 'ar' ? 'بروكتر آند غامبل' : 'Procter & Gamble',
      lastUpdated: '2024-01-12',
      expiryDate: '2025-08-20',
      location: 'B2-A4',
      barcode: '3456789012345'
    }
  ];

  // Initialize data
  useEffect(() => {
    setTimeout(() => {
      setProducts(sampleInventoryData);
      setFilteredProducts(sampleInventoryData);
      setLoading(false);
    }, 1000);
  }, [language]);

  // Calculate inventory statistics
  const inventoryStats = useMemo(() => {
    const totalProducts = products.length;
    const lowStockProducts = products.filter(p => p.currentStock <= p.minStock && p.currentStock > 0).length;
    const outOfStockProducts = products.filter(p => p.currentStock === 0).length;
    const totalValue = products.reduce((sum, product) => sum + (product.currentStock * product.unitCost), 0);

    return {
      totalProducts,
      lowStockProducts,
      outOfStockProducts,
      totalValue
    };
  }, [products]);

  // Get stock status
  const getStockStatus = (product) => {
    if (product.currentStock === 0) {
      return { status: 'outOfStock', color: 'red', label: text.outOfStock };
    } else if (product.currentStock <= product.minStock) {
      return { status: 'low', color: 'amber', label: text.low };
    } else if (product.currentStock <= product.minStock * 1.5) {
      return { status: 'low', color: 'yellow', label: text.low };
    } else {
      return { status: 'adequate', color: 'green', label: text.adequate };
    }
  };

  // Get stock level badge
  const getStockBadge = (product) => {
    const { status, color, label } = getStockStatus(product);
    const colorClasses = {
      red: 'bg-red-100 text-red-800',
      amber: 'bg-amber-100 text-amber-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      green: 'bg-green-100 text-green-800'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorClasses[color]}`}>
        {label}
      </span>
    );
  };

  // Filter and search logic
  useEffect(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.sku.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = !filters.category || product.category === filters.category;
      const matchesSupplier = !filters.supplier || product.supplier === filters.supplier;

      let matchesStockLevel = true;
      if (filters.stockLevel) {
        const { status } = getStockStatus(product);
        matchesStockLevel = status === filters.stockLevel;
      }

      return matchesSearch && matchesCategory && matchesSupplier && matchesStockLevel;
    });

    // Sort filtered results
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchTerm, filters, sortBy, sortOrder]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-brand-teal-600" />
          <p className={`text-gray-600 ${language === 'ar' ? 'font-arabic' : ''}`}>
            {language === 'ar' ? 'جاري تحميل المخزون...' : language === 'fr' ? 'Chargement du stock...' : 'Loading inventory...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${language === 'ar' ? 'font-arabic' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">{text.title}</h2>
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <button className="bg-brand-teal-600 hover:bg-brand-teal-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 rtl:space-x-reverse">
            <Plus className="w-4 h-4" />
            <span>{text.addProduct}</span>
          </button>
          <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 rtl:space-x-reverse">
            <Download className="w-4 h-4" />
            <span>{text.exportData}</span>
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-elegant">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{text.totalProducts}</p>
              <p className="text-2xl font-bold text-gray-900">{inventoryStats.totalProducts}</p>
            </div>
            <Package className="w-8 h-8 text-brand-teal-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-elegant">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{text.lowStock}</p>
              <p className="text-2xl font-bold text-amber-600">{inventoryStats.lowStockProducts}</p>
            </div>
            <TrendingDown className="w-8 h-8 text-amber-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-elegant">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{text.outOfStock}</p>
              <p className="text-2xl font-bold text-red-600">{inventoryStats.outOfStockProducts}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-elegant">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{text.totalValue}</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(inventoryStats.totalValue)}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-elegant">
        <div className="flex flex-col space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} w-5 h-5 text-gray-400`} />
            <input
              type="text"
              placeholder={text.searchProducts}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full ${isRTL ? 'pr-10 text-right' : 'pl-10'} py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal-500 focus:border-transparent`}
            />
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 rtl:space-x-reverse text-gray-600 hover:text-gray-900"
            >
              <Filter className="w-4 h-4" />
              <span>{text.filters}</span>
            </button>

            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-teal-500"
              >
                <option value="name">{text.productName}</option>
                <option value="currentStock">{text.currentStock}</option>
                <option value="unitCost">{text.unitCost}</option>
                <option value="lastUpdated">{text.lastUpdated}</option>
              </select>

              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                {sortOrder === 'asc' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-teal-500"
              >
                <option value="">{text.category}</option>
                <option value={language === 'ar' ? 'منتجات التنظيف' : 'Cleaning Products'}>
                  {language === 'ar' ? 'منتجات التنظيف' : 'Cleaning Products'}
                </option>
                <option value={language === 'ar' ? 'العناية الشخصية' : 'Personal Care'}>
                  {language === 'ar' ? 'العناية الشخصية' : 'Personal Care'}
                </option>
              </select>

              <select
                value={filters.stockLevel}
                onChange={(e) => setFilters({ ...filters, stockLevel: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-teal-500"
              >
                <option value="">{text.stockLevel}</option>
                <option value="adequate">{text.adequate}</option>
                <option value="low">{text.low}</option>
                <option value="outOfStock">{text.outOfStock}</option>
              </select>

              <select
                value={filters.supplier}
                onChange={(e) => setFilters({ ...filters, supplier: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-teal-500"
              >
                <option value="">{text.supplier}</option>
                <option value={language === 'ar' ? 'شركة التوزيع المغربية' : 'Moroccan Distribution Co.'}>
                  {language === 'ar' ? 'شركة التوزيع المغربية' : 'Moroccan Distribution Co.'}
                </option>
                <option value={language === 'ar' ? 'يونيليفر المغرب' : 'Unilever Morocco'}>
                  {language === 'ar' ? 'يونيليفر المغرب' : 'Unilever Morocco'}
                </option>
              </select>

              <button
                onClick={() => setFilters({ category: '', status: '', stockLevel: '', supplier: '' })}
                className="text-brand-teal-600 hover:text-brand-teal-700 font-medium"
              >
                {language === 'ar' ? 'مسح الفلاتر' : language === 'fr' ? 'Effacer les filtres' : 'Clear Filters'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow-elegant overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className={`px-6 py-3 ${isRTL ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                  {text.productName}
                </th>
                <th className={`px-6 py-3 ${isRTL ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                  {text.sku}
                </th>
                <th className={`px-6 py-3 ${isRTL ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                  {text.currentStock}
                </th>
                <th className={`px-6 py-3 ${isRTL ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                  {text.status}
                </th>
                <th className={`px-6 py-3 ${isRTL ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                  {text.unitCost}
                </th>
                <th className={`px-6 py-3 ${isRTL ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                  {text.sellingPrice}
                </th>
                <th className={`px-6 py-3 ${isRTL ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                  {language === 'ar' ? 'إجراءات' : language === 'fr' ? 'Actions' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input type="checkbox" className="rounded" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    <div className="text-sm text-gray-500">{product.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.sku}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{product.currentStock}</div>
                    <div className="text-xs text-gray-500">
                      {text.minStock}: {product.minStock} | {text.maxStock}: {product.maxStock}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStockBadge(product)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(product.unitCost)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(product.sellingPrice)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <button className="text-brand-teal-600 hover:text-brand-teal-900">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-blue-600 hover:text-blue-900">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              {language === 'ar' ? 'لا توجد منتجات تطابق البحث' : language === 'fr' ? 'Aucun produit trouvé' : 'No products found'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedInventoryManagement;
