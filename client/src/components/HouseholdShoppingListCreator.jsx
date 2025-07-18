import React, { useState, useEffect } from 'react';
import {
  ShoppingCart, Plus, X, Check, Star, Home, Baby,
  Sparkles, Wrench, School, Battery, ChefHat, Clock,
  Users, Calculator, Calendar, Trash2, Edit3, Save,
  Package, ShoppingBag, ListChecks, Filter
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';

const HouseholdShoppingListCreator = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [currentList, setCurrentList] = useState({
    name: '',
    items: [],
    category: 'general',
    estimatedTotal: 0,
    dueDate: '',
    familySize: 4,
    priority: 'normal'
  });
  const [savedLists, setSavedLists] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { language, isRTL, t } = useLanguage();
  const { addToCart } = useCart();

  const messages = {
    ar: {
      householdShopping: 'قوائم التسوق المنزلية',
      createList: 'إنشاء قائمة',
      myLists: 'قوائمي',
      templates: 'قوالب جاهزة',
      listName: 'اسم القائمة',
      familySize: 'عدد أفراد الأسرة',
      estimatedTotal: 'التكلفة المتوقعة',
      dueDate: 'تاريخ التسوق',
      priority: 'الأولوية',
      addItem: 'إضافة منتج',
      itemName: 'اسم المنتج',
      quantity: 'الكمية',
      category: 'الفئة',
      price: 'السعر',
      total: 'المجموع',
      saveList: 'حفظ القائمة',
      loadTemplate: 'تحميل قالب',
      weeklyEssentials: 'الضروريات الأسبوعية',
      monthlySupplies: 'المستلزمات الشهرية',
      cleaningDay: 'يوم التنظيف',
      backToSchool: 'العودة للمدرسة',
      babyEssentials: 'مستلزمات الطفل',
      ramadanPrep: 'تحضيرات رمضان',
      addToCart: 'إضافة للسلة',
      deleteList: 'حذف القائمة',
      editList: 'تعديل القائمة',
      completeList: 'إكمال القائمة',
      itemsCount: 'عدد المنتجات',
      normal: 'عادية',
      high: 'عالية',
      urgent: 'عاجلة',
      cleaning: 'التنظيف',
      personal: 'العناية الشخصية',
      beauty: 'التجميل',
      household: 'منزلية',
      hardware: 'أدوات',
      baby: 'الأطفال',
      kitchen: 'المطبخ',
      office: 'مكتبية'
    },
    fr: {
      householdShopping: 'Listes de courses ménagères',
      createList: 'Créer une liste',
      myLists: 'Mes listes',
      templates: 'Modèles prêts',
      listName: 'Nom de la liste',
      familySize: 'Taille de la famille',
      estimatedTotal: 'Total estimé',
      dueDate: 'Date de course',
      priority: 'Priorité',
      addItem: 'Ajouter un article',
      itemName: 'Nom de l\'article',
      quantity: 'Quantité',
      category: 'Catégorie',
      price: 'Prix',
      total: 'Total',
      saveList: 'Sauvegarder la liste',
      loadTemplate: 'Charger un modèle',
      weeklyEssentials: 'Essentiels hebdomadaires',
      monthlySupplies: 'Fournitures mensuelles',
      cleaningDay: 'Jour de nettoyage',
      backToSchool: 'Rentrée scolaire',
      babyEssentials: 'Essentiels bébé',
      ramadanPrep: 'Préparations Ramadan',
      addToCart: 'Ajouter au panier',
      deleteList: 'Supprimer la liste',
      editList: 'Modifier la liste',
      completeList: 'Compléter la liste',
      itemsCount: 'Nombre d\'articles',
      normal: 'Normale',
      high: 'Élevée',
      urgent: 'Urgente',
      cleaning: 'Nettoyage',
      personal: 'Soins personnels',
      beauty: 'Beauté',
      household: 'Ménager',
      hardware: 'Outils',
      baby: 'Bébé',
      kitchen: 'Cuisine',
      office: 'Bureau'
    },
    en: {
      householdShopping: 'Household Shopping Lists',
      createList: 'Create List',
      myLists: 'My Lists',
      templates: 'Ready Templates',
      listName: 'List Name',
      familySize: 'Family Size',
      estimatedTotal: 'Estimated Total',
      dueDate: 'Shopping Date',
      priority: 'Priority',
      addItem: 'Add Item',
      itemName: 'Item Name',
      quantity: 'Quantity',
      category: 'Category',
      price: 'Price',
      total: 'Total',
      saveList: 'Save List',
      loadTemplate: 'Load Template',
      weeklyEssentials: 'Weekly Essentials',
      monthlySupplies: 'Monthly Supplies',
      cleaningDay: 'Cleaning Day',
      backToSchool: 'Back to School',
      babyEssentials: 'Baby Essentials',
      ramadanPrep: 'Ramadan Preparations',
      addToCart: 'Add to Cart',
      deleteList: 'Delete List',
      editList: 'Edit List',
      completeList: 'Complete List',
      itemsCount: 'Items Count',
      normal: 'Normal',
      high: 'High',
      urgent: 'Urgent',
      cleaning: 'Cleaning',
      personal: 'Personal Care',
      beauty: 'Beauty',
      household: 'Household',
      hardware: 'Hardware',
      baby: 'Baby',
      kitchen: 'Kitchen',
      office: 'Office'
    }
  };

  const msg = messages[language] || messages.en;

  // Categories with icons
  const categories = [
    { id: 'cleaning', name: msg.cleaning, icon: Sparkles, color: 'blue' },
    { id: 'personal', name: msg.personal, icon: Users, color: 'green' },
    { id: 'beauty', name: msg.beauty, icon: Star, color: 'pink' },
    { id: 'household', name: msg.household, icon: Home, color: 'purple' },
    { id: 'hardware', name: msg.hardware, icon: Wrench, color: 'gray' },
    { id: 'baby', name: msg.baby, icon: Baby, color: 'yellow' },
    { id: 'kitchen', name: msg.kitchen, icon: ChefHat, color: 'orange' },
    { id: 'office', name: msg.office, icon: School, color: 'indigo' }
  ];

  // Pre-defined templates
  const templates = {
    weekly: {
      name: msg.weeklyEssentials,
      icon: Calendar,
      items: [
        { name: 'Ariel Detergent Powder', category: 'cleaning', quantity: 1, price: 49.99 },
        { name: 'Ajax Floor Cleaner', category: 'cleaning', quantity: 1, price: 15.50 },
        { name: 'Dove Beauty Bar', category: 'personal', quantity: 3, price: 8.50 },
        { name: 'Head & Shoulders Shampoo', category: 'personal', quantity: 1, price: 32.00 },
        { name: 'Colgate Toothpaste', category: 'personal', quantity: 1, price: 15.25 }
      ]
    },
    monthly: {
      name: msg.monthlySupplies,
      icon: Package,
      items: [
        { name: 'Javex Bleach 2L', category: 'cleaning', quantity: 2, price: 18.00 },
        { name: 'Glass Cleaner Spray', category: 'cleaning', quantity: 2, price: 12.75 },
        { name: 'L\'Oréal Face Cream', category: 'beauty', quantity: 1, price: 85.00 },
        { name: 'Nivea Hand Cream', category: 'beauty', quantity: 2, price: 22.50 },
        { name: 'Storage Containers Set', category: 'household', quantity: 1, price: 35.00 }
      ]
    },
    cleaning: {
      name: msg.cleaningDay,
      icon: Sparkles,
      items: [
        { name: 'Ariel Detergent Powder', category: 'cleaning', quantity: 1, price: 49.99 },
        { name: 'Ajax Floor Cleaner', category: 'cleaning', quantity: 2, price: 15.50 },
        { name: 'Javex Bleach', category: 'cleaning', quantity: 1, price: 18.00 },
        { name: 'Glass Cleaner Spray', category: 'cleaning', quantity: 1, price: 12.75 },
        { name: 'Rubber Gloves', category: 'cleaning', quantity: 2, price: 8.00 }
      ]
    },
    school: {
      name: msg.backToSchool,
      icon: School,
      items: [
        { name: 'Notebooks Set', category: 'office', quantity: 5, price: 25.00 },
        { name: 'Pens Pack', category: 'office', quantity: 2, price: 15.00 },
        { name: 'Pencils Box', category: 'office', quantity: 1, price: 12.00 },
        { name: 'Erasers Pack', category: 'office', quantity: 1, price: 8.00 },
        { name: 'School Bag', category: 'office', quantity: 1, price: 120.00 }
      ]
    },
    baby: {
      name: msg.babyEssentials,
      icon: Baby,
      items: [
        { name: 'Baby Diapers', category: 'baby', quantity: 2, price: 65.00 },
        { name: 'Baby Wipes', category: 'baby', quantity: 4, price: 18.00 },
        { name: 'Baby Shampoo', category: 'baby', quantity: 1, price: 28.00 },
        { name: 'Baby Lotion', category: 'baby', quantity: 1, price: 22.00 },
        { name: 'Baby Bottles', category: 'baby', quantity: 2, price: 45.00 }
      ]
    },
    ramadan: {
      name: msg.ramadanPrep,
      icon: Star,
      items: [
        { name: 'Large Storage Containers', category: 'household', quantity: 5, price: 75.00 },
        { name: 'Extra Cleaning Supplies', category: 'cleaning', quantity: 3, price: 45.00 },
        { name: 'Decorative Lights', category: 'household', quantity: 2, price: 35.00 },
        { name: 'Extra Towels', category: 'household', quantity: 4, price: 80.00 }
      ]
    }
  };

  useEffect(() => {
    // Load saved lists from localStorage
    const saved = localStorage.getItem('householdLists');
    if (saved) {
      setSavedLists(JSON.parse(saved));
    }
  }, []);

  const addItem = () => {
    const newItem = {
      id: Date.now(),
      name: '',
      category: 'household',
      quantity: 1,
      price: 0,
      completed: false
    };
    setCurrentList(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const updateItem = (id, field, value) => {
    setCurrentList(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeItem = (id) => {
    setCurrentList(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  const calculateTotal = () => {
    return currentList.items.reduce((total, item) =>
      total + (item.price * item.quantity), 0
    );
  };

  const saveList = () => {
    if (!currentList.name.trim()) return;

    const listToSave = {
      ...currentList,
      id: currentList.id || Date.now(),
      estimatedTotal: calculateTotal(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedLists = currentList.id
      ? savedLists.map(list => list.id === currentList.id ? listToSave : list)
      : [...savedLists, listToSave];

    setSavedLists(updatedLists);
    localStorage.setItem('householdLists', JSON.stringify(updatedLists));

    // Reset current list
    setCurrentList({
      name: '',
      items: [],
      category: 'general',
      estimatedTotal: 0,
      dueDate: '',
      familySize: 4,
      priority: 'normal'
    });
  };

  const loadTemplate = (templateKey) => {
    const template = templates[templateKey];
    if (template) {
      setCurrentList(prev => ({
        ...prev,
        name: template.name,
        items: template.items.map(item => ({
          ...item,
          id: Date.now() + Math.random(),
          completed: false
        }))
      }));
      setShowTemplates(false);
    }
  };

  const loadList = (list) => {
    setCurrentList(list);
    setActiveTab('create');
  };

  const deleteList = (id) => {
    const updatedLists = savedLists.filter(list => list.id !== id);
    setSavedLists(updatedLists);
    localStorage.setItem('householdLists', JSON.stringify(updatedLists));
  };

  const addAllToCart = () => {
    currentList.items.forEach(item => {
      if (!item.completed) {
        addToCart({
          id: Date.now() + Math.random(),
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          category: item.category
        });
      }
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getCategoryIcon = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.icon : Package;
  };

  const renderCreateTab = () => (
    <div className="space-y-6">
      {/* List Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {msg.listName}
          </label>
          <input
            type="text"
            value={currentList.name}
            onChange={(e) => setCurrentList(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={msg.listName}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {msg.dueDate}
          </label>
          <input
            type="date"
            value={currentList.dueDate}
            onChange={(e) => setCurrentList(prev => ({ ...prev, dueDate: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {msg.familySize}
          </label>
          <select
            value={currentList.familySize}
            onChange={(e) => setCurrentList(prev => ({ ...prev, familySize: parseInt(e.target.value) }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map(size => (
              <option key={size} value={size}>{size} {size === 1 ? 'person' : 'people'}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {msg.priority}
          </label>
          <select
            value={currentList.priority}
            onChange={(e) => setCurrentList(prev => ({ ...prev, priority: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="normal">{msg.normal}</option>
            <option value="high">{msg.high}</option>
            <option value="urgent">{msg.urgent}</option>
          </select>
        </div>
      </div>

      {/* Templates */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-gray-800">{msg.templates}</h4>
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            {showTemplates ? 'Hide' : 'Show'} Templates
          </button>
        </div>

        {showTemplates && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(templates).map(([key, template]) => {
              const IconComponent = template.icon;
              return (
                <button
                  key={key}
                  onClick={() => loadTemplate(key)}
                  className="flex items-center space-x-2 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <IconComponent className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">{template.name}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Items List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-gray-800">Items ({currentList.items.length})</h4>
          <button
            onClick={addItem}
            className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>{msg.addItem}</span>
          </button>
        </div>

        {currentList.items.map((item) => {
          const IconComponent = getCategoryIcon(item.category);
          return (
            <div key={item.id} className="grid grid-cols-12 gap-3 items-center p-3 bg-white border border-gray-200 rounded-lg">
              <div className="col-span-1">
                <IconComponent className="h-5 w-5 text-gray-500" />
              </div>

              <div className="col-span-4">
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                  placeholder={msg.itemName}
                  className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="col-span-2">
                <select
                  value={item.category}
                  onChange={(e) => updateItem(item.id, 'category', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="col-span-1">
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                  min="1"
                  className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent text-center"
                />
              </div>

              <div className="col-span-2">
                <input
                  type="number"
                  value={item.price}
                  onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="col-span-1 text-right">
                <span className="text-sm font-medium text-gray-700">
                  {(item.price * item.quantity).toFixed(2)} MAD
                </span>
              </div>

              <div className="col-span-1 text-center">
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      {currentList.items.length > 0 && (
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600">{msg.itemsCount}: {currentList.items.length}</p>
              <p className="text-lg font-semibold text-blue-800">
                {msg.total}: {calculateTotal().toFixed(2)} MAD
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={addAllToCart}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <ShoppingCart className="h-4 w-4" />
                <span>{msg.addToCart}</span>
              </button>
              <button
                onClick={saveList}
                disabled={!currentList.name.trim()}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-4 w-4" />
                <span>{msg.saveList}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderMyListsTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">
          {msg.myLists} ({savedLists.length})
        </h3>
      </div>

      {savedLists.length === 0 ? (
        <div className="text-center py-12">
          <ListChecks className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-600 mb-2">
            No saved lists
          </h4>
          <p className="text-gray-500 mb-6">
            Create your first shopping list to get started
          </p>
          <button
            onClick={() => setActiveTab('create')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {msg.createList}
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {savedLists.map((list) => (
            <div key={list.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">{list.name}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <span className="flex items-center">
                      <Package className="h-4 w-4 mr-1" />
                      {list.items.length} items
                    </span>
                    <span className="flex items-center">
                      <Calculator className="h-4 w-4 mr-1" />
                      {list.estimatedTotal?.toFixed(2) || calculateTotal().toFixed(2)} MAD
                    </span>
                    <span className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {list.familySize} people
                    </span>
                    {list.dueDate && (
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(list.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(list.priority)}`}>
                    {msg[list.priority] || list.priority}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => loadList(list)}
                    className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded"
                    title={msg.editList}
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deleteList(list.id)}
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
                    title={msg.deleteList}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Preview of first few items */}
              {list.items.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex flex-wrap gap-2">
                    {list.items.slice(0, 3).map((item, index) => {
                      const IconComponent = getCategoryIcon(item.category);
                      return (
                        <div key={index} className="flex items-center space-x-1 px-2 py-1 bg-gray-100 rounded text-xs">
                          <IconComponent className="h-3 w-3 text-gray-500" />
                          <span>{item.name}</span>
                          <span className="text-gray-500">x{item.quantity}</span>
                        </div>
                      );
                    })}
                    {list.items.length > 3 && (
                      <div className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-500">
                        +{list.items.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className={`household-shopping-creator ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('create')}
            className={`flex-1 px-6 py-4 text-sm font-medium text-center border-b-2 transition-colors ${
              activeTab === 'create'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Plus className="h-5 w-5 mx-auto mb-1" />
            {msg.createList}
          </button>

          <button
            onClick={() => setActiveTab('lists')}
            className={`flex-1 px-6 py-4 text-sm font-medium text-center border-b-2 transition-colors ${
              activeTab === 'lists'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <ListChecks className="h-5 w-5 mx-auto mb-1" />
            {msg.myLists}
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {activeTab === 'create' && renderCreateTab()}
        {activeTab === 'lists' && renderMyListsTab()}
      </div>
    </div>
  );
};

export default HouseholdShoppingListCreator;
