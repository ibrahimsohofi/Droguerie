import React, { useState } from 'react';
import {
  Calculator,
  List,
  MapPin,
  Building,
  Palette,
  Shirt,
  Home,
  Users,
  Package,
  Clock,
  Phone,
  Mail
} from 'lucide-react';

// Import the new components
import BulkOrderCalculator from '../components/BulkOrderCalculator';
import ProductUsageCalculator from '../components/ProductUsageCalculator';
import HouseholdShoppingList from '../components/HouseholdShoppingList';
import StoreLocator from '../components/StoreLocator';

const Services = () => {
  const [activeModal, setActiveModal] = useState(null);

  const services = [
    {
      id: 'bulk-calculator',
      title: 'Calculateur de commande en gros',
      description: 'Calculez vos commandes en volume avec remises automatiques pour professionnels',
      icon: Building,
      color: 'from-blue-500 to-blue-600',
      features: [
        'Remises par quantité automatiques',
        'Calcul de TVA inclus',
        'Génération de devis',
        'Tarifs professionnels'
      ]
    },
    {
      id: 'usage-calculator',
      title: 'Calculateur d\'usage produits',
      description: 'Estimez les quantités exactes de peinture, détergent et produits de nettoyage',
      icon: Calculator,
      color: 'from-green-500 to-green-600',
      features: [
        'Calcul de peinture par surface',
        'Dosage optimal de lessive',
        'Quantités de nettoyants',
        'Estimation des coûts'
      ]
    },
    {
      id: 'shopping-list',
      title: 'Listes de courses intelligentes',
      description: 'Organisez vos achats ménagers par catégorie avec suivi et partage',
      icon: List,
      color: 'from-purple-500 to-purple-600',
      features: [
        'Organisation par catégories',
        'Partage avec la famille',
        'Ajout au panier direct',
        'Historique des achats'
      ]
    },
    {
      id: 'store-locator',
      title: 'Localiser nos magasins',
      description: 'Trouvez le magasin Droguerie Jamal le plus proche avec horaires et services',
      icon: MapPin,
      color: 'from-orange-500 to-orange-600',
      features: [
        'Géolocalisation automatique',
        'Horaires d\'ouverture',
        'Services disponibles',
        'Itinéraires GPS'
      ]
    }
  ];

  const additionalServices = [
    {
      title: 'Livraison à domicile',
      description: 'Livraison gratuite pour commandes supérieures à 200 MAD',
      icon: Package,
      details: ['Livraison sous 24h', 'Zones de livraison étendues', 'Suivi en temps réel']
    },
    {
      title: 'Service client',
      description: 'Support dédié pour vos questions et conseils produits',
      icon: Users,
      details: ['Chat en direct', 'Conseillers experts', 'Support multilingue']
    },
    {
      title: 'Horaires étendus',
      description: 'Ouvert 7j/7 pour votre commodité',
      icon: Clock,
      details: ['Lun-Sam: 8h-20h', 'Dimanche: 9h-18h', 'Jours fériés adaptés']
    }
  ];

  const openModal = (modalType) => {
    setActiveModal(modalType);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const handleAddToCart = (items) => {
    console.log('Adding items to cart:', items);
    // Integrate with your cart system here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Nos Services</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Découvrez tous nos outils et services conçus pour faciliter
              vos achats de produits ménagers et d'articles pour la maison
            </p>
          </div>
        </div>
      </div>

      {/* Main Services */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Outils intelligents</h2>
          <p className="text-lg text-gray-600">
            Des calculateurs et outils spécialement conçus pour vos besoins ménagers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {services.map((service) => {
            const IconComponent = service.icon;
            return (
              <div
                key={service.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className={`bg-gradient-to-r ${service.color} p-6`}>
                  <div className="flex items-center space-x-4">
                    <div className="bg-white/20 p-3 rounded-lg">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">{service.title}</h3>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-gray-600 mb-4">{service.description}</p>

                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => openModal(service.id)}
                    className={`w-full py-3 px-4 bg-gradient-to-r ${service.color} text-white rounded-lg hover:opacity-90 transition-opacity font-medium`}
                  >
                    Utiliser l'outil
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Services */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Services additionnels</h2>
          <p className="text-lg text-gray-600">
            Des services pour vous accompagner dans tous vos achats
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {additionalServices.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="w-8 h-8 text-gray-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <ul className="space-y-1">
                  {service.details.map((detail, idx) => (
                    <li key={idx} className="text-sm text-gray-500">{detail}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-8 text-white">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Besoin d'aide ?</h3>
            <p className="text-gray-300 mb-6">
              Notre équipe est là pour vous accompagner dans l'utilisation de nos services
            </p>

            <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8">
              <a
                href="tel:+212522123456"
                className="flex items-center space-x-2 text-blue-400 hover:text-blue-300"
              >
                <Phone className="w-5 h-5" />
                <span>+212 522 123 456</span>
              </a>

              <a
                href="mailto:support@drogueriejamal.ma"
                className="flex items-center space-x-2 text-blue-400 hover:text-blue-300"
              >
                <Mail className="w-5 h-5" />
                <span>support@drogueriejamal.ma</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {activeModal === 'bulk-calculator' && (
        <BulkOrderCalculator onClose={closeModal} />
      )}

      {activeModal === 'usage-calculator' && (
        <ProductUsageCalculator onClose={closeModal} />
      )}

      {activeModal === 'shopping-list' && (
        <HouseholdShoppingList onClose={closeModal} onAddToCart={handleAddToCart} />
      )}

      {activeModal === 'store-locator' && (
        <StoreLocator onClose={closeModal} />
      )}
    </div>
  );
};

export default Services;
