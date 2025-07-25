import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  Navigation,
  Search,
  Filter,
  X,
  Star,
  Truck,
  Wifi,
  CreditCard,
  Accessibility,
  Car
} from 'lucide-react';

const StoreLocator = ({ onClose }) => {
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCity, setFilterCity] = useState('all');
  const [userLocation, setUserLocation] = useState(null);
  const [sortBy, setSortBy] = useState('distance');

  // Mock store data for Morocco
  const mockStores = [
    {
      id: 1,
      name: 'Droguerie Jamal - Centre Ville',
      address: '123 Avenue Mohammed V, Casablanca 20000',
      city: 'Casablanca',
      phone: '+212 522 123 456',
      email: 'casablanca@drogueriejamal.ma',
      coordinates: { lat: 33.5731, lng: -7.5898 },
      hours: {
        monday: '08:00-20:00',
        tuesday: '08:00-20:00',
        wednesday: '08:00-20:00',
        thursday: '08:00-20:00',
        friday: '08:00-20:00',
        saturday: '08:00-20:00',
        sunday: '09:00-18:00'
      },
      services: ['delivery', 'wifi', 'parking', 'cards', 'accessibility'],
      rating: 4.5,
      reviews: 127,
      description: 'Notre magasin principal au cœur de Casablanca. Large gamme de produits ménagers et cosmétiques.',
      manager: 'Ahmed Bennani',
      specialties: ['Produits de nettoyage', 'Cosmétiques haut de gamme', 'Articles de bricolage']
    },
    {
      id: 2,
      name: 'Droguerie Jamal - Ain Chock',
      address: '456 Rue Al Andalous, Ain Chock, Casablanca 20470',
      city: 'Casablanca',
      phone: '+212 522 987 654',
      email: 'ainchock@drogueriejamal.ma',
      coordinates: { lat: 33.5505, lng: -7.5573 },
      hours: {
        monday: '08:30-19:30',
        tuesday: '08:30-19:30',
        wednesday: '08:30-19:30',
        thursday: '08:30-19:30',
        friday: '08:30-19:30',
        saturday: '08:30-19:30',
        sunday: 'Fermé'
      },
      services: ['delivery', 'cards', 'parking'],
      rating: 4.2,
      reviews: 89,
      description: 'Magasin de quartier avec un service personnalisé et des prix compétitifs.',
      manager: 'Fatima Zahra',
      specialties: ['Produits pour bébé', 'Soins personnels', 'Articles ménagers']
    },
    {
      id: 3,
      name: 'Droguerie Jamal - Rabat Agdal',
      address: '789 Avenue Moulay Abdellah, Agdal, Rabat 10030',
      city: 'Rabat',
      phone: '+212 537 456 789',
      email: 'rabat@drogueriejamal.ma',
      coordinates: { lat: 34.0181, lng: -6.8416 },
      hours: {
        monday: '08:00-20:00',
        tuesday: '08:00-20:00',
        wednesday: '08:00-20:00',
        thursday: '08:00-20:00',
        friday: '08:00-20:00',
        saturday: '08:00-20:00',
        sunday: '09:00-17:00'
      },
      services: ['delivery', 'wifi', 'cards', 'accessibility'],
      rating: 4.7,
      reviews: 203,
      description: 'Notre flagship store à Rabat avec la plus large sélection de produits.',
      manager: 'Omar Alami',
      specialties: ['Électronique', 'Quincaillerie', 'Produits d\'entretien professionnels']
    },
    {
      id: 4,
      name: 'Droguerie Jamal - Marrakech Gueliz',
      address: '321 Avenue Mohammed VI, Gueliz, Marrakech 40000',
      city: 'Marrakech',
      phone: '+212 524 321 987',
      email: 'marrakech@drogueriejamal.ma',
      coordinates: { lat: 31.6295, lng: -7.9811 },
      hours: {
        monday: '08:30-19:00',
        tuesday: '08:30-19:00',
        wednesday: '08:30-19:00',
        thursday: '08:30-19:00',
        friday: '08:30-19:00',
        saturday: '08:30-19:00',
        sunday: '09:00-18:00'
      },
      services: ['delivery', 'parking', 'cards'],
      rating: 4.3,
      reviews: 156,
      description: 'Magasin moderne dans le quartier touristique de Gueliz.',
      manager: 'Aicha Benali',
      specialties: ['Cosmétiques', 'Parfums', 'Articles de voyage']
    },
    {
      id: 5,
      name: 'Droguerie Jamal - Tanger Ville',
      address: '654 Boulevard Pasteur, Tanger 90000',
      city: 'Tanger',
      phone: '+212 539 654 321',
      email: 'tanger@drogueriejamal.ma',
      coordinates: { lat: 35.7595, lng: -5.8340 },
      hours: {
        monday: '08:00-19:30',
        tuesday: '08:00-19:30',
        wednesday: '08:00-19:30',
        thursday: '08:00-19:30',
        friday: '08:00-19:30',
        saturday: '08:00-19:30',
        sunday: '09:00-17:00'
      },
      services: ['delivery', 'wifi', 'cards', 'parking'],
      rating: 4.4,
      reviews: 98,
      description: 'Situé au cœur de Tanger, proche du port et des zones commerciales.',
      manager: 'Youssef Tazi',
      specialties: ['Import/Export', 'Produits internationaux', 'Gros volumes']
    }
  ];

  const serviceIcons = {
    delivery: { icon: Truck, name: 'Livraison à domicile', color: 'text-green-600' },
    wifi: { icon: Wifi, name: 'WiFi gratuit', color: 'text-blue-600' },
    parking: { icon: Car, name: 'Parking disponible', color: 'text-purple-600' },
    cards: { icon: CreditCard, name: 'Cartes acceptées', color: 'text-orange-600' },
    accessibility: { icon: Accessibility, name: 'Accès handicapés', color: 'text-indigo-600' }
  };

  const cities = ['all', 'Casablanca', 'Rabat', 'Marrakech', 'Tanger'];

  useEffect(() => {
    setStores(mockStores);
    setFilteredStores(mockStores);

    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Geolocation error:', error);
        }
      );
    }
  }, []);

  useEffect(() => {
    let filtered = stores;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(store =>
        store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by city
    if (filterCity !== 'all') {
      filtered = filtered.filter(store => store.city === filterCity);
    }

    // Sort stores
    if (sortBy === 'distance' && userLocation) {
      filtered = filtered.sort((a, b) => {
        const distanceA = calculateDistance(userLocation, a.coordinates);
        const distanceB = calculateDistance(userLocation, b.coordinates);
        return distanceA - distanceB;
      });
    } else if (sortBy === 'rating') {
      filtered = filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'name') {
      filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredStores(filtered);
  }, [searchQuery, filterCity, sortBy, stores, userLocation]);

  const calculateDistance = (point1, point2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (point2.lat - point1.lat) * Math.PI / 180;
    const dLng = (point2.lng - point1.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const getDirections = (store) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${store.coordinates.lat},${store.coordinates.lng}`;
    window.open(url, '_blank');
  };

  const isStoreOpen = (store) => {
    const now = new Date();
    const day = now.toLocaleLowerCase().slice(0, 3) + now.toLocaleDateString('en', { weekday: 'long' }).slice(3);
    const currentTime = now.toTimeString().slice(0, 5);
    const todayHours = store.hours[day];

    if (!todayHours || todayHours === 'Fermé') return false;

    const [openTime, closeTime] = todayHours.split('-');
    return currentTime >= openTime && currentTime <= closeTime;
  };

  const formatHours = (hours) => {
    const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
    const daysKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    return days.map((day, index) => ({
      day,
      hours: hours[daysKeys[index]]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <MapPin className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Localiser nos magasins</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex h-[calc(90vh-80px)]">
          {/* Store List */}
          <div className="w-1/2 border-r border-gray-200 overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              {/* Search and Filters */}
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Rechercher un magasin..."
                  />
                </div>

                <div className="flex space-x-3">
                  <select
                    value={filterCity}
                    onChange={(e) => setFilterCity(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Toutes les villes</option>
                    {cities.slice(1).map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="distance">Distance</option>
                    <option value="rating">Note</option>
                    <option value="name">Nom</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Store Cards */}
            <div className="p-4 space-y-4">
              {filteredStores.map(store => {
                const distance = userLocation ? calculateDistance(userLocation, store.coordinates) : null;
                const isOpen = isStoreOpen(store);

                return (
                  <div
                    key={store.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                      selectedStore?.id === store.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedStore(store)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900">{store.name}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {isOpen ? 'Ouvert' : 'Fermé'}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-2">{store.address}</p>

                    <div className="flex items-center space-x-4 mb-3">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{store.rating}</span>
                        <span className="text-sm text-gray-500">({store.reviews} avis)</span>
                      </div>

                      {distance && (
                        <span className="text-sm text-gray-500">
                          {distance.toFixed(1)} km
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {store.services.map(service => {
                        const ServiceIcon = serviceIcons[service].icon;
                        return (
                          <div
                            key={service}
                            className="flex items-center space-x-1"
                            title={serviceIcons[service].name}
                          >
                            <ServiceIcon className={`w-4 h-4 ${serviceIcons[service].color}`} />
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`tel:${store.phone}`, '_blank');
                        }}
                        className="flex items-center space-x-1 px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200"
                      >
                        <Phone className="w-3 h-3" />
                        <span>Appeler</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          getDirections(store);
                        }}
                        className="flex items-center space-x-1 px-3 py-1 text-sm bg-green-100 text-green-800 rounded-lg hover:bg-green-200"
                      >
                        <Navigation className="w-3 h-3" />
                        <span>Itinéraire</span>
                      </button>
                    </div>
                  </div>
                );
              })}

              {filteredStores.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Aucun magasin trouvé</p>
                  <p className="text-sm">Essayez de modifier vos critères de recherche</p>
                </div>
              )}
            </div>
          </div>

          {/* Store Details */}
          <div className="w-1/2 overflow-y-auto">
            {selectedStore ? (
              <div className="p-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedStore.name}</h2>
                  <p className="text-gray-600">{selectedStore.description}</p>
                </div>

                {/* Contact Info */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Informations de contact</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{selectedStore.address}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <a href={`tel:${selectedStore.phone}`} className="text-sm text-blue-600 hover:underline">
                        {selectedStore.phone}
                      </a>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <a href={`mailto:${selectedStore.email}`} className="text-sm text-blue-600 hover:underline">
                        {selectedStore.email}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Opening Hours */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Horaires d'ouverture</h3>
                  <div className="space-y-1">
                    {formatHours(selectedStore.hours).map(({ day, hours }) => (
                      <div key={day} className="flex justify-between text-sm">
                        <span className="text-gray-700">{day}</span>
                        <span className={hours === 'Fermé' ? 'text-red-600' : 'text-gray-900'}>
                          {hours}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Services */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Services disponibles</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedStore.services.map(service => {
                      const ServiceIcon = serviceIcons[service].icon;
                      return (
                        <div key={service} className="flex items-center space-x-2">
                          <ServiceIcon className={`w-4 h-4 ${serviceIcons[service].color}`} />
                          <span className="text-sm">{serviceIcons[service].name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Specialties */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Spécialités</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedStore.specialties.map((specialty, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Manager */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Responsable du magasin</h3>
                  <p className="text-sm text-gray-700">{selectedStore.manager}</p>
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => getDirections(selectedStore)}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>Obtenir l'itinéraire</span>
                  </button>

                  <button
                    onClick={() => window.open(`tel:${selectedStore.phone}`, '_blank')}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Appeler</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Sélectionnez un magasin</p>
                  <p className="text-sm">pour voir les détails</p>
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
