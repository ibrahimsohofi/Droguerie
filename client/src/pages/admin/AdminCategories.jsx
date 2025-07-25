import React, { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '../../context/LanguageContext';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const { t } = useContext(LanguageContext);

  const [formData, setFormData] = useState({
    name: '',
    name_ar: '',
    name_fr: '',
    description: '',
    description_ar: '',
    description_fr: '',
    image_url: '',
    is_active: true
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/categories`);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingCategory
        ? `${import.meta.env.VITE_API_URL}/api/categories/${editingCategory.id}`
        : `${import.meta.env.VITE_API_URL}/api/categories`;

      const method = editingCategory ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchCategories();
        resetForm();
        alert(editingCategory ? t('admin.categories.updateSuccess') : t('admin.categories.createSuccess'));
      } else {
        alert(t('admin.categories.error'));
      }
    } catch (error) {
      console.error('Error saving category:', error);
      alert(t('admin.categories.error'));
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name || '',
      name_ar: category.name_ar || '',
      name_fr: category.name_fr || '',
      description: category.description || '',
      description_ar: category.description_ar || '',
      description_fr: category.description_fr || '',
      image_url: category.image_url || '',
      is_active: category.is_active
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm(t('admin.categories.confirmDelete'))) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/categories/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          fetchCategories();
          alert(t('admin.categories.deleteSuccess'));
        } else {
          alert(t('admin.categories.error'));
        }
      } catch (error) {
        console.error('Error deleting category:', error);
        alert(t('admin.categories.error'));
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      name_ar: '',
      name_fr: '',
      description: '',
      description_ar: '',
      description_fr: '',
      image_url: '',
      is_active: true
    });
    setEditingCategory(null);
    setShowModal(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t('admin.categories.title')}</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {t('admin.categories.addCategory')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="aspect-w-16 aspect-h-9">
              <img
                src={category.image_url || '/placeholder-category.jpg'}
                alt={category.name}
                className="w-full h-48 object-cover"
              />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">{category.name}</h3>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  category.is_active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {category.is_active ? t('admin.categories.active') : t('admin.categories.inactive')}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-2">{category.name_ar}</p>
              <p className="text-sm text-gray-600 mb-4">{category.name_fr}</p>

              {category.description && (
                <p className="text-sm text-gray-700 mb-4 line-clamp-2">{category.description}</p>
              )}

              <div className="flex justify-between">
                <button
                  onClick={() => handleEdit(category)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  {t('admin.categories.edit')}
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  {t('admin.categories.delete')}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">{t('admin.categories.noCategories')}</p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            {t('admin.categories.addFirstCategory')}
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingCategory ? t('admin.categories.editCategory') : t('admin.categories.addCategory')}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    name="name"
                    placeholder={t('admin.categories.nameEn')}
                    value={formData.name}
                    onChange={handleChange}
                    className="p-2 border border-gray-300 rounded-md"
                    required
                  />
                  <input
                    type="text"
                    name="name_ar"
                    placeholder={t('admin.categories.nameAr')}
                    value={formData.name_ar}
                    onChange={handleChange}
                    className="p-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="text"
                    name="name_fr"
                    placeholder={t('admin.categories.nameFr')}
                    value={formData.name_fr}
                    onChange={handleChange}
                    className="p-2 border border-gray-300 rounded-md"
                  />
                </div>

                <input
                  type="url"
                  name="image_url"
                  placeholder={t('admin.categories.imageUrl')}
                  value={formData.image_url}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />

                <textarea
                  name="description"
                  placeholder={t('admin.categories.descriptionEn')}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows="3"
                />

                <textarea
                  name="description_ar"
                  placeholder={t('admin.categories.descriptionAr')}
                  value={formData.description_ar}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows="3"
                />

                <textarea
                  name="description_fr"
                  placeholder={t('admin.categories.descriptionFr')}
                  value={formData.description_fr}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows="3"
                />

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <label>{t('admin.categories.isActive')}</label>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    {editingCategory ? t('common.update') : t('common.create')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
