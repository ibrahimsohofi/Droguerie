import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Clock, Navigation, Filter, Search, Star } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const StoreLocator = () => {
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedStore, setSelectedStore] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  const { t } = useLanguage();

  useEffect(() => {
    fetchStores();
    getUserLocation();
  }, []);

  useEffect(() => {
    filterStores();
  }, [stores, searchTerm, selectedCity]);

  const fetchStores = async () => {
    try {
      // Mock store data - in real app, fetch from API
      const mockStores = [
        {
          id: 1,
          name: 'Droguerie Jamal - Centre Ville',
          address: '123 Rue Hassan II, Centre Ville, Casablanca 20000',
          city: 'Casablanca',
          phone: '+212 522 123 456',
          email: 'centeville@drogueriejamal.ma',
          coordinates: { lat: 33.5731, lng: -7.5898 },
          hours: {
            monday: '8:00 - 20:00',
            tuesday: '8:00 - 20:00',
            wednesday: '8:00 - 20:00',
            thursday: '8:00 - 20:00',
            friday: '8:00 - 20:00',
            saturday: '8:00 - 20:00',
            sunday: '9:00 - 18:00'
          },
          services: ['household_goods', 'delivery', 'parking', 'wheelchair'],
          rating: 4.8,
          reviews: 124,
          manager: 'Ahmed Benali',
          image: '${import.meta.env.VITE_API_URL}/api/placeholder/300x200',
          flagship: true
        },
        {
          id: 2,
          name: 'Droguerie Jamal - Maarif',
          address: '45 Boulevard Zerktouni, Maarif, Casablanca 20100',
          city: 'Casablanca',
          phone: '+212 522 234 567',
          email: 'maarif@drogueriejamal.ma',
          coordinates: { lat: 33.5892, lng: -7.6231 },
          hours: {
            monday: '8:00 - 20:00',
            tuesday: '8:00 - 20:00',
            wednesday: '8:00 - 20:00',
            thursday: '8:00 - 20:00',
            friday: '8:00 - 20:00',
            saturday: '8:00 - 20:00',
            sunday: '9:00 - 18:00'
          },
          services: ['household_goods', 'delivery', 'parking'],
          rating: 4.6,
          reviews: 89,
          manager: 'Fatima Alaoui',
          image: '${import.meta.env.VITE_API_URL}/api/placeholder/300x200',
          flagship: false
        },
        {
          id: 3,
          name: 'Droguerie Jamal - Rabat Agdal',
          address: '67 Avenue Mohamed V, Agdal, Rabat 10000',
          city: 'Rabat',
          phone: '+212 537 345 678',
          email: 'agdal@drogueriejamal.ma',
          coordinates: { lat: 34.0181, lng: -6.8406 },
          hours: {
            monday: '8:00 - 20:00',
            tuesday: '8:00 - 20:00',
            wednesday: '8:00 - 20:00',
            thursday: '8:00 - 20:00',
            friday: '8:00 - 20:00',
            saturday: '8:00 - 20:00',
            sunday: '9:00 - 18:00'
          },
          services: ['household_goods', 'delivery', 'wheelchair'],
          rating: 4.7,
          reviews: 67,
          manager: 'Omar Tadili',
          image: '${import.meta.env.VITE_API_URL}/api/placeholder/300x200',
          flagship: false
        },
        {
          id: 4,
          name: 'Droguerie Jamal - Marrakech Gueliz',
          address: '89 Avenue Mohammed V, Gueliz, Marrakech 40000',
          city: 'Marrakech',
          phone: '+212 524 456 789',
          email: 'gueliz@drogueriejamal.ma',
          coordinates: { lat: 31.6295, lng: -7.9811 },
          hours: {
            monday: '8:00 - 20:00',
            tuesday: '8:00 - 20:00',
            wednesday: '8:00 - 20:00',
            thursday: '8:00 - 20:00',
            friday: '8:00 - 20:00',
            saturday: '8:00 - 20:00',
            sunday: '9:00 - 18:00'
          },
          services: ['household_goods', 'delivery', 'parking', 'wheelchair'],
          rating: 4.5,
          reviews: 92,
          manager: 'Aicha Bennouna',
          image: '${import.meta.env.VITE_API_URL}/api/placeholder/300x200',
          flagship: true
        }
      ];

      setStores(mockStores);
      setFilteredStores(mockStores);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stores:', error);
      setLoading(false);
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Error getting location:', error);
        }
      );
    }
  };

  const filterStores = () => {
    let filtered = stores;

    if (searchTerm) {
      filtered = filtered.filter(store =>
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCity !== 'all') {
      filtered = filtered.filter(store => store.city === selectedCity);
    }

    setFilteredStores(filtered);
  };

  const calculateDistance = (store) => {
    if (!userLocation) return null;

    const R = 6371; // Earth's radius in km
    const dLat = (store.coordinates.lat - userLocation.lat) * Math.PI / 180;
    const dLng = (store.coordinates.lng - userLocation.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(userLocation.lat * Math.PI / 180) * Math.cos(store.coordinates.lat * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const getDirections = (store) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${store.coordinates.lat},${store.coordinates.lng}`;
    window.open(url, '_blank');
  };

  const cities = [...new Set(stores.map(store => store.city))];

  const ServiceIcon = ({ service }) => {
    const icons = {
      household_goods: '🏪',
      delivery: '🚚',
      parking: '🅿️',
      wheelchair: '♿'
    };
    return <span className="text-lg">{icons[service] || '📦'}</span>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loadingStores')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-2">{t('storeLocator')}</h1>
          <p className="text-blue-100">{t('findNearestStore')}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Search and Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-lg font-semibold mb-4">{t('findStore')}</h2>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={t('searchStores')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* City Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('city')}
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">{t('allCities')}</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {/* Results Count */}
              <p className="text-sm text-gray-600 mb-4">
                {filteredStores.length} {t('storesFound')}
              </p>

              {/* Store List */}
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredStores.map((store) => {
                  const distance = calculateDistance(store);
                  return (
                    <div
                      key={store.id}
                      onClick={() => setSelectedStore(store)}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedStore?.id === store.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-gray-900 text-sm">
                          {store.name}
                          {store.flagship && (
                            <span className="ml-2 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                              {t('flagship')}
                            </span>
                          )}
                        </h3>
                        {distance && (
                          <span className="text-xs text-gray-500">
                            {distance.toFixed(1)} km
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-gray-600 mb-2">{store.address}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-xs text-gray-600">{store.rating}</span>
                        </div>
                        <div className="flex space-x-1">
                          {store.services.slice(0, 3).map((service) => (
                            <ServiceIcon key={service} service={service} />
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Map and Store Details */}
          <div className="lg:col-span-2">
            {/* Map Placeholder */}
            <div className="bg-white rounded-lg shadow-md mb-6 h-96 flex items-center justify-center border-2 border-dashed border-gray-300">
              <div className="text-center text-gray-500">
                <MapPin className="w-12 h-12 mx-auto mb-2" />
                <p className="font-medium">{t('mapPlaceholder')}</p>
                <p className="text-sm">{t('mapIntegrationNote')}</p>
              </div>
            </div>

            {/* Selected Store Details */}
            {selectedStore && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col md:flex-row md:items-start md:space-x-6">
                  <img
                    src={selectedStore.image}
                    alt={selectedStore.name}
                    className="w-full md:w-48 h-32 object-cover rounded-lg mb-4 md:mb-0"
                  />

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-1">
                          {selectedStore.name}
                          {selectedStore.flagship && (
                            <span className="ml-2 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                              {t('flagship')}
                            </span>
                          )}
                        </h2>
                        <div className="flex items-center space-x-2 mb-2">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="font-medium">{selectedStore.rating}</span>
                          <span className="text-gray-500">({selectedStore.reviews} {t('reviews')})</span>
                        </div>
                      </div>

                      <button
                        onClick={() => getDirections(selectedStore)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                      >
                        <Navigation className="w-4 h-4" />
                        <span>{t('getDirections')}</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Contact Info */}
                      <div>
                        <h3 className="font-medium text-gray-900 mb-3">{t('contactInfo')}</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-start space-x-2">
                            <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-600">{selectedStore.address}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <a
                              href={`tel:${selectedStore.phone}`}
                              className="text-blue-600 hover:underline"
                            >
                              {selectedStore.phone}
                            </a>
                          </div>
                          <div className="text-gray-600">
                            <span className="font-medium">{t('manager')}: </span>
                            {selectedStore.manager}
                          </div>
                        </div>
                      </div>

                      {/* Hours */}
                      <div>
                        <h3 className="font-medium text-gray-900 mb-3">{t('storeHours')}</h3>
                        <div className="space-y-1 text-sm">
                          {Object.entries(selectedStore.hours).map(([day, hours]) => (
                            <div key={day} className="flex justify-between">
                              <span className="capitalize text-gray-600">{t(day)}:</span>
                              <span className="text-gray-900">{hours}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Services */}
                    <div className="mt-6">
                      <h3 className="font-medium text-gray-900 mb-3">{t('services')}</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedStore.services.map((service) => (
                          <div
                            key={service}
                            className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-full text-sm"
                          >
                            <ServiceIcon service={service} />
                            <span className="text-gray-700">{t(service)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreLocator;
