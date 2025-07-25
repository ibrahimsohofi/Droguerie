import React, { useState, useEffect } from 'react';
import {
  ShoppingCart,
  Plus,
  Check,
  Trash2,
  Share2,
  Download,
  X,
  Edit3,
  Save,
  Calculator,
  List
} from 'lucide-react';

const HouseholdShoppingList = ({ onClose, onAddToCart }) => {
  const [lists, setLists] = useState([]);
  const [activeListId, setActiveListId] = useState(null);
  const [newListName, setNewListName] = useState('');
  const [showNewListForm, setShowNewListForm] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', category: 'cleaning', quantity: 1, priority: 'normal' });
  const [editingItem, setEditingItem] = useState(null);

  const categories = {
    cleaning: {
      name: 'Produits de nettoyage',
      color: 'bg-blue-100 text-blue-800',
      items: ['Détergent lessive', 'Nettoyant sol', 'Eau de Javel', 'Liquide vaisselle', 'Nettoyant vitres']
    },
    personal_care: {
      name: 'Soins personnels',
      color: 'bg-green-100 text-green-800',
      items: ['Savon', 'Shampoing', 'Dentifrice', 'Brosse à dents', 'Crème hydratante']
    },
    cosmetics: {
      name: 'Cosmétiques',
      color: 'bg-pink-100 text-pink-800',
      items: ['Crème visage', 'Mascara', 'Rouge à lèvres', 'Fond de teint', 'Vernis à ongles']
    },
    household: {
      name: 'Articles ménagers',
      color: 'bg-yellow-100 text-yellow-800',
      items: ['Contenants plastique', 'Serviettes', 'Sacs poubelle', 'Éponges', 'Torchons']
    },
    hardware: {
      name: 'Quincaillerie',
      color: 'bg-gray-100 text-gray-800',
      items: ['Ampoules', 'Piles', 'Vis', 'Câbles', 'Prises électriques']
    },
    kitchen: {
      name: 'Cuisine',
      color: 'bg-orange-100 text-orange-800',
      items: ['Ustensiles', 'Casseroles', 'Assiettes', 'Verres', 'Couverts']
    },
    baby: {
      name: 'Bébé',
      color: 'bg-purple-100 text-purple-800',
      items: ['Couches', 'Lingettes', 'Biberon', 'Lait infantile', 'Crème change']
    }
  };

  const priorities = {
    urgent: { name: 'Urgent', color: 'text-red-600', emoji: '🔴' },
    high: { name: 'Important', color: 'text-orange-600', emoji: '🟠' },
    normal: { name: 'Normal', color: 'text-green-600', emoji: '🟢' },
    low: { name: 'Pas pressé', color: 'text-gray-600', emoji: '⚪' }
  };

  // Initialize with default lists from localStorage or create sample
  useEffect(() => {
    const savedLists = localStorage.getItem('householdShoppingLists');
    if (savedLists) {
      const parsedLists = JSON.parse(savedLists);
      setLists(parsedLists);
      if (parsedLists.length > 0) {
        setActiveListId(parsedLists[0].id);
      }
    } else {
      // Create a sample list
      const sampleList = {
        id: Date.now(),
        name: 'Ma liste de courses',
        createdAt: new Date().toISOString(),
        items: [
          { id: 1, name: 'Détergent lessive', category: 'cleaning', quantity: 2, priority: 'normal', completed: false },
          { id: 2, name: 'Savon Dove', category: 'personal_care', quantity: 3, priority: 'normal', completed: false },
          { id: 3, name: 'Ampoules LED', category: 'hardware', quantity: 4, priority: 'high', completed: false }
        ]
      };
      setLists([sampleList]);
      setActiveListId(sampleList.id);
    }
  }, []);

  // Save to localStorage whenever lists change
  useEffect(() => {
    localStorage.setItem('householdShoppingLists', JSON.stringify(lists));
  }, [lists]);

  const activeList = lists.find(list => list.id === activeListId);

  const createNewList = () => {
    if (!newListName.trim()) return;

    const newList = {
      id: Date.now(),
      name: newListName,
      createdAt: new Date().toISOString(),
      items: []
    };

    setLists([...lists, newList]);
    setActiveListId(newList.id);
    setNewListName('');
    setShowNewListForm(false);
  };

  const deleteList = (listId) => {
    if (lists.length <= 1) return; // Keep at least one list

    const updatedLists = lists.filter(list => list.id !== listId);
    setLists(updatedLists);

    if (activeListId === listId) {
      setActiveListId(updatedLists[0]?.id || null);
    }
  };

  const addItem = () => {
    if (!newItem.name.trim() || !activeList) return;

    const item = {
      id: Date.now(),
      ...newItem,
      completed: false
    };

    setLists(lists.map(list =>
      list.id === activeListId
        ? { ...list, items: [...list.items, item] }
        : list
    ));

    setNewItem({ name: '', category: 'cleaning', quantity: 1, priority: 'normal' });
  };

  const toggleItemCompletion = (itemId) => {
    setLists(lists.map(list =>
      list.id === activeListId
        ? {
            ...list,
            items: list.items.map(item =>
              item.id === itemId ? { ...item, completed: !item.completed } : item
            )
          }
        : list
    ));
  };

  const deleteItem = (itemId) => {
    setLists(lists.map(list =>
      list.id === activeListId
        ? { ...list, items: list.items.filter(item => item.id !== itemId) }
        : list
    ));
  };

  const updateItem = (itemId, updates) => {
    setLists(lists.map(list =>
      list.id === activeListId
        ? {
            ...list,
            items: list.items.map(item =>
              item.id === itemId ? { ...item, ...updates } : item
            )
          }
        : list
    ));
    setEditingItem(null);
  };

  const addAllToCart = () => {
    if (!activeList || !onAddToCart) return;

    const uncompletedItems = activeList.items.filter(item => !item.completed);

    // This would integrate with your cart system
    uncompletedItems.forEach(item => {
      // Simulate adding to cart
      console.log(`Adding to cart: ${item.name} (${item.quantity})`);
    });

    if (onAddToCart) {
      onAddToCart(uncompletedItems);
    }

    alert(`${uncompletedItems.length} articles ajoutés au panier!`);
  };

  const shareList = () => {
    if (!activeList) return;

    const listText = `Liste de courses: ${activeList.name}\n\n` +
      activeList.items.map(item =>
        `${item.completed ? '✓' : '○'} ${item.name} (${item.quantity}) ${priorities[item.priority].emoji}`
      ).join('\n') +
      `\n\nCréée le ${new Date(activeList.createdAt).toLocaleDateString('fr-FR')}`;

    if (navigator.share) {
      navigator.share({
        title: `Liste de courses: ${activeList.name}`,
        text: listText
      });
    } else {
      navigator.clipboard.writeText(listText);
      alert('Liste copiée dans le presse-papiers!');
    }
  };

  const exportList = () => {
    if (!activeList) return;

    const dataStr = JSON.stringify(activeList, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeList.name.replace(/\s+/g, '_')}.json`;
    link.click();
  };

  const getItemsByCategory = () => {
    if (!activeList) return {};

    return activeList.items.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {});
  };

  const itemsByCategory = getItemsByCategory();
  const totalItems = activeList?.items.length || 0;
  const completedItems = activeList?.items.filter(item => item.completed).length || 0;
  const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <List className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900">Listes de courses ménagères</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Lists Sidebar */}
          <div className="lg:w-1/3 border-r border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">Mes listes</h3>
              <button
                onClick={() => setShowNewListForm(true)}
                className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {showNewListForm && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <input
                  type="text"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && createNewList()}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Nom de la nouvelle liste"
                  autoFocus
                />
                <div className="flex space-x-2 mt-2">
                  <button
                    onClick={createNewList}
                    className="flex-1 px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Créer
                  </button>
                  <button
                    onClick={() => setShowNewListForm(false)}
                    className="flex-1 px-3 py-1 text-sm bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {lists.map(list => (
                <div
                  key={list.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    activeListId === list.id ? 'bg-green-50 border-2 border-green-200' : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveListId(list.id)}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">{list.name}</h4>
                    {lists.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteList(list.id);
                        }}
                        className="text-red-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {list.items.length} article(s)
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(list.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Active List Content */}
          <div className="lg:w-2/3 p-6">
            {activeList ? (
              <>
                {/* List Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{activeList.name}</h3>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-sm text-gray-500">
                        {completedItems}/{totalItems} articles complétés
                      </span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-xs">
                        <div
                          className="bg-green-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={shareList}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="Partager la liste"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={exportList}
                      className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                      title="Exporter la liste"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={addAllToCart}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      title="Ajouter tous les articles au panier"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Ajouter au panier</span>
                    </button>
                  </div>
                </div>

                {/* Add New Item Form */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Ajouter un article</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <input
                      type="text"
                      value={newItem.name}
                      onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                      onKeyPress={(e) => e.key === 'Enter' && addItem()}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Nom de l'article"
                    />

                    <select
                      value={newItem.category}
                      onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      {Object.entries(categories).map(([key, category]) => (
                        <option key={key} value={key}>{category.name}</option>
                      ))}
                    </select>

                    <input
                      type="number"
                      min="1"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem({...newItem, quantity: parseInt(e.target.value) || 1})}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Qté"
                    />

                    <select
                      value={newItem.priority}
                      onChange={(e) => setNewItem({...newItem, priority: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      {Object.entries(priorities).map(([key, priority]) => (
                        <option key={key} value={key}>{priority.emoji} {priority.name}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={addItem}
                    disabled={!newItem.name.trim()}
                    className="mt-3 flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Ajouter</span>
                  </button>
                </div>

                {/* Items by Category */}
                <div className="space-y-6">
                  {Object.entries(itemsByCategory).map(([categoryKey, items]) => {
                    const category = categories[categoryKey];
                    return (
                      <div key={categoryKey}>
                        <h4 className={`font-medium mb-3 px-3 py-1 rounded-full inline-block ${category.color}`}>
                          {category.name} ({items.length})
                        </h4>

                        <div className="space-y-2">
                          {items.map(item => (
                            <div
                              key={item.id}
                              className={`flex items-center space-x-3 p-3 rounded-lg border transition-all ${
                                item.completed
                                  ? 'bg-gray-50 border-gray-200 opacity-60'
                                  : 'bg-white border-gray-300 hover:border-gray-400'
                              }`}
                            >
                              <button
                                onClick={() => toggleItemCompletion(item.id)}
                                className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                  item.completed
                                    ? 'bg-green-600 border-green-600 text-white'
                                    : 'border-gray-300 hover:border-green-500'
                                }`}
                              >
                                {item.completed && <Check className="w-3 h-3" />}
                              </button>

                              <div className="flex-1">
                                {editingItem === item.id ? (
                                  <div className="grid grid-cols-3 gap-2">
                                    <input
                                      type="text"
                                      defaultValue={item.name}
                                      onBlur={(e) => updateItem(item.id, { name: e.target.value })}
                                      onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                          updateItem(item.id, { name: e.target.value });
                                        }
                                      }}
                                      className="px-2 py-1 text-sm border rounded"
                                      autoFocus
                                    />
                                    <input
                                      type="number"
                                      min="1"
                                      defaultValue={item.quantity}
                                      onBlur={(e) => updateItem(item.id, { quantity: parseInt(e.target.value) || 1 })}
                                      className="px-2 py-1 text-sm border rounded"
                                    />
                                    <select
                                      defaultValue={item.priority}
                                      onChange={(e) => updateItem(item.id, { priority: e.target.value })}
                                      className="px-2 py-1 text-sm border rounded"
                                    >
                                      {Object.entries(priorities).map(([key, priority]) => (
                                        <option key={key} value={key}>{priority.name}</option>
                                      ))}
                                    </select>
                                  </div>
                                ) : (
                                  <div className="flex items-center space-x-3">
                                    <span className={`${item.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                      {item.name}
                                    </span>
                                    <span className="text-sm text-gray-500">×{item.quantity}</span>
                                    <span className={`text-sm ${priorities[item.priority].color}`}>
                                      {priorities[item.priority].emoji}
                                    </span>
                                  </div>
                                )}
                              </div>

                              <div className="flex space-x-1">
                                <button
                                  onClick={() => setEditingItem(editingItem === item.id ? null : item.id)}
                                  className="p-1 text-gray-400 hover:text-blue-600"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => deleteItem(item.id)}
                                  className="p-1 text-gray-400 hover:text-red-600"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {activeList.items.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <List className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Aucun article dans cette liste</p>
                    <p className="text-sm">Ajoutez des articles pour commencer vos courses</p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Sélectionnez une liste pour commencer</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HouseholdShoppingList;
