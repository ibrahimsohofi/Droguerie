import React, { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '../../context/LanguageContext';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { t } = useContext(LanguageContext);

  const [formData, setFormData] = useState({
    name: '',
    name_ar: '',
    name_fr: '',
    description: '',
    description_ar: '',
    description_fr: '',
    price: '',
    category_id: '',
    stock_quantity: '',
    image_url: '',
    is_active: true
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/categories`);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    if (!selectedFile) return null;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/upload-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setUploadProgress(100);
        return data.data.image_url;
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      let finalFormData = { ...formData };

      // Upload image if selected
      if (selectedFile) {
        const imageUrl = await uploadImage();
        if (imageUrl) {
          finalFormData.image_url = imageUrl;
        } else {
          setIsUploading(false);
          return;
        }
      }

      const url = editingProduct
        ? `${import.meta.env.VITE_API_URL}/api/products/${editingProduct.id}`
        : `${import.meta.env.VITE_API_URL}/api/products`;

      const method = editingProduct ? 'PUT' : 'POST';

      // Use FormData for file uploads, JSON for regular updates
      const body = selectedFile
        ? (() => {
            const fd = new FormData();
            Object.keys(finalFormData).forEach(key => {
              fd.append(key, finalFormData[key]);
            });
            if (selectedFile) fd.append('image', selectedFile);
            return fd;
          })()
        : JSON.stringify(finalFormData);

      const headers = {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      };

      if (!selectedFile) {
        headers['Content-Type'] = 'application/json';
      }

      const response = await fetch(url, {
        method,
        headers,
        body
      });

      if (response.ok) {
        fetchProducts();
        resetForm();
        alert(editingProduct ? t('admin.products.updateSuccess') : t('admin.products.createSuccess'));
      } else {
        alert(t('admin.products.error'));
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert(t('admin.products.error'));
    } finally {
      setIsUploading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      name_ar: product.name_ar || '',
      name_fr: product.name_fr || '',
      description: product.description || '',
      description_ar: product.description_ar || '',
      description_fr: product.description_fr || '',
      price: product.price || '',
      category_id: product.category_id || '',
      stock_quantity: product.stock_quantity || '',
      image_url: product.image_url || '',
      is_active: product.is_active
    });
    setPreviewUrl(product.image_url ? `${import.meta.env.VITE_API_URL}${product.image_url}` : '');
    setSelectedFile(null);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm(t('admin.products.confirmDelete'))) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          fetchProducts();
          alert(t('admin.products.deleteSuccess'));
        } else {
          alert(t('admin.products.error'));
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        alert(t('admin.products.error'));
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
      price: '',
      category_id: '',
      stock_quantity: '',
      image_url: '',
      is_active: true
    });
    setEditingProduct(null);
    setShowModal(false);
    setSelectedFile(null);
    setPreviewUrl('');
    setUploadProgress(0);
    setIsUploading(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.name_ar?.includes(searchTerm) ||
    product.name_fr?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <h1 className="text-3xl font-bold">{t('admin.products.title')}</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {t('admin.products.addProduct')}
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder={t('admin.products.searchPlaceholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/3 p-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('admin.products.image')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('admin.products.name')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('admin.products.category')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('admin.products.price')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('admin.products.stock')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('admin.products.status')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('admin.products.actions')}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={product.image_url || '/placeholder-product.jpg'}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    <div className="text-sm text-gray-500">{product.name_ar}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {categories.find(cat => cat.id === product.category_id)?.name || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.price} {t('common.currency')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.stock_quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      product.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.is_active ? t('admin.products.active') : t('admin.products.inactive')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      {t('admin.products.edit')}
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      {t('admin.products.delete')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingProduct ? t('admin.products.editProduct') : t('admin.products.addProduct')}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    name="name"
                    placeholder={t('admin.products.nameEn')}
                    value={formData.name}
                    onChange={handleChange}
                    className="p-2 border border-gray-300 rounded-md"
                    required
                  />
                  <input
                    type="text"
                    name="name_ar"
                    placeholder={t('admin.products.nameAr')}
                    value={formData.name_ar}
                    onChange={handleChange}
                    className="p-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="text"
                    name="name_fr"
                    placeholder={t('admin.products.nameFr')}
                    value={formData.name_fr}
                    onChange={handleChange}
                    className="p-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="number"
                    name="price"
                    placeholder={t('admin.products.price')}
                    value={formData.price}
                    onChange={handleChange}
                    className="p-2 border border-gray-300 rounded-md"
                    step="0.01"
                    required
                  />
                  <input
                    type="number"
                    name="stock_quantity"
                    placeholder={t('admin.products.stock')}
                    value={formData.stock_quantity}
                    onChange={handleChange}
                    className="p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    className="p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">{t('admin.products.selectCategory')}</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="url"
                    name="image_url"
                    placeholder={t('admin.products.imageUrl')}
                    value={formData.image_url}
                    onChange={handleChange}
                    className="p-2 border border-gray-300 rounded-md"
                  />
                </div>

                <textarea
                  name="description"
                  placeholder={t('admin.products.descriptionEn')}
                  value={formData.description}
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
                  <label>{t('admin.products.isActive')}</label>
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
                    {editingProduct ? t('common.update') : t('common.create')}
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

export default AdminProducts;
