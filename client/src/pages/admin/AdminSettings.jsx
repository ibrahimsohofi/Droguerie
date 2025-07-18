import React, { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '../../context/LanguageContext';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminSettings = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('general');
  const { t } = useContext(LanguageContext);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/settings`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();

      if (data.success) {
        setSettings(data.data);
      } else {
        setMessage({ type: 'error', text: 'Failed to fetch settings' });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      setMessage({ type: 'error', text: 'Error fetching settings' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (category, key, value, type) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: {
          ...prev[category][key],
          value: type === 'number' ? parseFloat(value) : type === 'boolean' ? value === 'true' : value
        }
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Flatten settings for API
      const flatSettings = {};
      Object.entries(settings).forEach(([category, categorySettings]) => {
        Object.entries(categorySettings).forEach(([key, setting]) => {
          flatSettings[key] = setting.value;
        });
      });

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ settings: flatSettings })
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Settings saved successfully!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to save settings' });
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: 'Error saving settings' });
    } finally {
      setSaving(false);
    }
  };

  const categories = [
    { key: 'general', label: 'General', icon: '⚙️' },
    { key: 'contact', label: 'Contact', icon: '📞' },
    { key: 'financial', label: 'Financial', icon: '💰' },
    { key: 'security', label: 'Security', icon: '🔐' },
    { key: 'orders', label: 'Orders', icon: '📦' }
  ];

  const renderInput = (category, key, setting) => {
    const { value, type, description } = setting;

    switch (type) {
      case 'boolean':
        return (
          <div className="space-y-2">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => handleInputChange(category, key, e.target.checked, type)}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <span className="text-sm font-medium text-gray-700 capitalize">
                {key.replace(/_/g, ' ')}
              </span>
            </label>
            <p className="text-xs text-gray-500">{description}</p>
          </div>
        );

      case 'number':
        return (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 capitalize">
              {key.replace(/_/g, ' ')}
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) => handleInputChange(category, key, e.target.value, type)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              step={key.includes('rate') ? '0.01' : '1'}
            />
            <p className="text-xs text-gray-500">{description}</p>
          </div>
        );

      default:
        return (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 capitalize">
              {key.replace(/_/g, ' ')}
            </label>
            <input
              type="text"
              value={value}
              onChange={(e) => handleInputChange(category, key, e.target.value, type)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
            />
            <p className="text-xs text-gray-500">{description}</p>
          </div>
        );
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Site Settings</h1>
          <p className="text-gray-600 mt-2">Manage your site configuration and preferences</p>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-100 text-green-700 border border-green-200'
              : 'bg-red-100 text-red-700 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {categories.map((category) => (
                <button
                  key={category.key}
                  onClick={() => setActiveTab(category.key)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === category.key
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {settings[activeTab] && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 capitalize">
                  {activeTab} Settings
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(settings[activeTab]).map(([key, setting]) => (
                    <div key={key} className="bg-gray-50 p-4 rounded-lg">
                      {renderInput(activeTab, key, setting)}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!settings[activeTab] && (
              <div className="text-center py-8">
                <p className="text-gray-500">No settings found for this category</p>
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="border-t border-gray-200 px-6 py-4">
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {saving && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                <span>{saving ? 'Saving...' : 'Save Settings'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
