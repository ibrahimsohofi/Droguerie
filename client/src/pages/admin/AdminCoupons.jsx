import React, { useState, useEffect, useContext } from 'react';
import { Plus, Edit2, Trash2, Tag, Calendar, Users, TrendingUp, Eye, ToggleLeft, ToggleRight } from 'lucide-react';
import { LanguageContext } from '../../context/LanguageContext';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [stats, setStats] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { t, language, isRTL } = useContext(LanguageContext);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    type: 'percentage',
    value: '',
    minimum_order_amount: '',
    maximum_discount_amount: '',
    usage_limit: '',
    user_usage_limit: '1',
    start_date: '',
    end_date: '',
    is_active: true
  });

  const content = {
    ar: {
      title: 'إدارة كوبونات الخصم',
      addCoupon: 'إضافة كوبون جديد',
      editCoupon: 'تعديل الكوبون',
      code: 'كود الكوبون',
      name: 'اسم الكوبون',
      description: 'الوصف',
      type: 'نوع الخصم',
      percentage: 'نسبة مئوية',
      fixed: 'مبلغ ثابت',
      value: 'قيمة الخصم',
      minimumOrder: 'الحد الأدنى للطلب',
      maximumDiscount: 'الحد الأقصى للخصم',
      usageLimit: 'حد الاستخدام الإجمالي',
      userUsageLimit: 'حد الاستخدام للمستخدم',
      startDate: 'تاريخ البداية',
      endDate: 'تاريخ النهاية',
      active: 'نشط',
      inactive: 'غير نشط',
      save: 'حفظ',
      cancel: 'إلغاء',
      delete: 'حذف',
      edit: 'تعديل',
      used: 'مستخدم',
      times: 'مرة',
      expired: 'منتهي الصلاحية',
      upcoming: 'قادم',
      stats: {
        total: 'إجمالي الكوبونات',
        active: 'كوبونات نشطة',
        expired: 'كوبونات منتهية',
        totalUsage: 'إجمالي الاستخدام'
      }
    },
    fr: {
      title: 'Gestion des Coupons',
      addCoupon: 'Ajouter un Coupon',
      editCoupon: 'Modifier le Coupon',
      code: 'Code Coupon',
      name: 'Nom du Coupon',
      description: 'Description',
      type: 'Type de Remise',
      percentage: 'Pourcentage',
      fixed: 'Montant Fixe',
      value: 'Valeur',
      minimumOrder: 'Commande Minimum',
      maximumDiscount: 'Remise Maximum',
      usageLimit: 'Limite d\'Utilisation',
      userUsageLimit: 'Limite par Utilisateur',
      startDate: 'Date de Début',
      endDate: 'Date de Fin',
      active: 'Actif',
      inactive: 'Inactif',
      save: 'Enregistrer',
      cancel: 'Annuler',
      delete: 'Supprimer',
      edit: 'Modifier',
      used: 'Utilisé',
      times: 'fois',
      expired: 'Expiré',
      upcoming: 'À venir',
      stats: {
        total: 'Total Coupons',
        active: 'Coupons Actifs',
        expired: 'Coupons Expirés',
        totalUsage: 'Utilisation Totale'
      }
    },
    en: {
      title: 'Coupon Management',
      addCoupon: 'Add New Coupon',
      editCoupon: 'Edit Coupon',
      code: 'Coupon Code',
      name: 'Coupon Name',
      description: 'Description',
      type: 'Discount Type',
      percentage: 'Percentage',
      fixed: 'Fixed Amount',
      value: 'Value',
      minimumOrder: 'Minimum Order',
      maximumDiscount: 'Maximum Discount',
      usageLimit: 'Usage Limit',
      userUsageLimit: 'User Usage Limit',
      startDate: 'Start Date',
      endDate: 'End Date',
      active: 'Active',
      inactive: 'Inactive',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      used: 'Used',
      times: 'times',
      expired: 'Expired',
      upcoming: 'Upcoming',
      stats: {
        total: 'Total Coupons',
        active: 'Active Coupons',
        expired: 'Expired Coupons',
        totalUsage: 'Total Usage'
      }
    }
  };

  const currentContent = content[language];

  useEffect(() => {
    fetchCoupons();
    fetchStats();
  }, [currentPage]);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/coupons?limit=20&offset=${(currentPage - 1) * 20}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      const data = await response.json();

      if (data.success) {
        setCoupons(data.data);
        setTotalPages(Math.ceil(data.total / 20));
      }
    } catch (error) {
      console.error('Error fetching coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/coupons/stats`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      const data = await response.json();

      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = editingCoupon
        ? `${import.meta.env.VITE_API_URL}/api/coupons/${editingCoupon.id}`
        : `${import.meta.env.VITE_API_URL}/api/coupons`;

      const method = editingCoupon ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setShowModal(false);
        resetForm();
        fetchCoupons();
        fetchStats();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error saving coupon:', error);
      alert('Error saving coupon');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/coupons/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      const data = await response.json();

      if (data.success) {
        fetchCoupons();
        fetchStats();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error deleting coupon:', error);
      alert('Error deleting coupon');
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      description: '',
      type: 'percentage',
      value: '',
      minimum_order_amount: '',
      maximum_discount_amount: '',
      usage_limit: '',
      user_usage_limit: '1',
      start_date: '',
      end_date: '',
      is_active: true
    });
    setEditingCoupon(null);
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      name: coupon.name,
      description: coupon.description || '',
      type: coupon.type,
      value: coupon.value.toString(),
      minimum_order_amount: coupon.minimum_order_amount?.toString() || '',
      maximum_discount_amount: coupon.maximum_discount_amount?.toString() || '',
      usage_limit: coupon.usage_limit?.toString() || '',
      user_usage_limit: coupon.user_usage_limit?.toString() || '1',
      start_date: coupon.start_date?.split('T')[0] || '',
      end_date: coupon.end_date?.split('T')[0] || '',
      is_active: coupon.is_active
    });
    setShowModal(true);
  };

  const getCouponStatus = (coupon) => {
    const now = new Date();
    const startDate = new Date(coupon.start_date);
    const endDate = new Date(coupon.end_date);

    if (!coupon.is_active) return 'inactive';
    if (now < startDate) return 'upcoming';
    if (now > endDate) return 'expired';
    return 'active';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className={`p-6 ${isRTL ? 'text-right' : 'text-left'}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{currentContent.title}</h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          {currentContent.addCoupon}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Tag className="h-8 w-8 text-blue-600" />
            <div className={`${isRTL ? 'mr-3' : 'ml-3'}`}>
              <p className="text-sm font-medium text-gray-600">{currentContent.stats.total}</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.total_coupons || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-green-600" />
            <div className={`${isRTL ? 'mr-3' : 'ml-3'}`}>
              <p className="text-sm font-medium text-gray-600">{currentContent.stats.active}</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.active_coupons || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-red-600" />
            <div className={`${isRTL ? 'mr-3' : 'ml-3'}`}>
              <p className="text-sm font-medium text-gray-600">{currentContent.stats.expired}</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.expired_coupons || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-purple-600" />
            <div className={`${isRTL ? 'mr-3' : 'ml-3'}`}>
              <p className="text-sm font-medium text-gray-600">{currentContent.stats.totalUsage}</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.total_usage || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {currentContent.code}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {currentContent.name}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {currentContent.type}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {currentContent.value}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {currentContent.used}
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
              {coupons.map((coupon) => {
                const status = getCouponStatus(coupon);
                return (
                  <tr key={coupon.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{coupon.code}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{coupon.name}</div>
                      {coupon.description && (
                        <div className="text-sm text-gray-500">{coupon.description}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {coupon.type === 'percentage' ? currentContent.percentage : currentContent.fixed}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        {coupon.type === 'percentage' ? `${coupon.value}%` : `${coupon.value} MAD`}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {coupon.used_count} / {coupon.usage_limit || '∞'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                        {currentContent[status] || status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(coupon)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(coupon.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                {editingCoupon ? currentContent.editCoupon : currentContent.addCoupon}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {currentContent.code} *
                    </label>
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {currentContent.name} *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {currentContent.description}
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {currentContent.type} *
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="percentage">{currentContent.percentage}</option>
                      <option value="fixed">{currentContent.fixed}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {currentContent.value} *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.value}
                      onChange={(e) => setFormData({...formData, value: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {currentContent.minimumOrder}
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.minimum_order_amount}
                      onChange={(e) => setFormData({...formData, minimum_order_amount: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {currentContent.maximumDiscount}
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.maximum_discount_amount}
                      onChange={(e) => setFormData({...formData, maximum_discount_amount: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {currentContent.usageLimit}
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.usage_limit}
                      onChange={(e) => setFormData({...formData, usage_limit: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {currentContent.userUsageLimit}
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.user_usage_limit}
                      onChange={(e) => setFormData({...formData, user_usage_limit: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {currentContent.startDate} *
                    </label>
                    <input
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {currentContent.endDate} *
                    </label>
                    <input
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, is_active: !formData.is_active})}
                    className={`${formData.is_active ? 'bg-green-600' : 'bg-gray-300'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                  >
                    <span className={`${formData.is_active ? 'translate-x-5' : 'translate-x-0'} pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`} />
                  </button>
                  <span className={`${isRTL ? 'mr-3' : 'ml-3'} text-sm font-medium text-gray-700`}>
                    {formData.is_active ? currentContent.active : currentContent.inactive}
                  </span>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    {currentContent.cancel}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {currentContent.save}
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

export default AdminCoupons;
