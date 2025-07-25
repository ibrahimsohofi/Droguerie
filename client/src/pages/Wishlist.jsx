import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, AlertCircle } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTranslations } from '../translations';
import LoadingSpinner from '../components/LoadingSpinner';

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, isLoading, error } = useWishlist();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { language, isRTL } = useLanguage();
  const t = useTranslations(language);
  const [removingItems, setRemovingItems] = useState(new Set());

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ar-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getLocalizedText = (item, field) => {
    if (language === 'ar') return item[`${field}_ar`] || item[field];
    if (language === 'fr') return item[`${field}_fr`] || item[field];
    return item[field];
  };

  const handleRemoveFromWishlist = async (productId) => {
    setRemovingItems(prev => new Set([...prev, productId]));
    try {
      await removeFromWishlist(productId);
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
    } finally {
      setRemovingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product.id, 1);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Heart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {language === 'ar' ? 'يجب تسجيل الدخول' : 'Connexion requise'}
            </h1>
            <p className="text-gray-600 mb-8">
              {language === 'ar'
                ? 'يجب تسجيل الدخول لعرض قائمة المفضلة الخاصة بك'
                : 'Vous devez vous connecter pour voir votre liste de souhaits'
              }
            </p>
            <Link
              to="/login"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
            >
              {language === 'ar' ? 'تسجيل الدخول' : 'Se connecter'}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LoadingSpinner size="lg" className="mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`mb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {language === 'ar' ? 'قائمة المفضلة' : 'Ma liste de souhaits'}
          </h1>
          <p className="text-gray-600">
            {wishlistItems.length > 0
              ? (language === 'ar'
                  ? `${wishlistItems.length} منتج في قائمة المفضلة`
                  : `${wishlistItems.length} produit${wishlistItems.length > 1 ? 's' : ''} dans votre liste`)
              : (language === 'ar'
                  ? 'لا توجد منتجات في قائمة المفضلة'
                  : 'Aucun produit dans votre liste')
            }
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        {wishlistItems.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {language === 'ar' ? 'قائمة المفضلة فارغة' : 'Votre liste est vide'}
            </h2>
            <p className="text-gray-600 mb-8">
              {language === 'ar'
                ? 'ابدأ بإضافة منتجات إلى قائمة المفضلة لحفظها لاحقاً'
                : 'Commencez à ajouter des produits à votre liste pour les sauvegarder'
              }
            </p>
            <Link
              to="/products"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
            >
              {language === 'ar' ? 'تصفح المنتجات' : 'Parcourir les produits'}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative">
                  <img
                    src={item.image_url || '/placeholder-product.jpg'}
                    alt={getLocalizedText(item, 'name')}
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={() => handleRemoveFromWishlist(item.id)}
                    disabled={removingItems.has(item.id)}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors duration-300"
                  >
                    {removingItems.has(item.id) ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <Trash2 className="h-4 w-4 text-red-500" />
                    )}
                  </button>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {getLocalizedText(item, 'name')}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {getLocalizedText(item, 'description')}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-bold text-blue-600">
                      {formatPrice(item.price)}
                    </span>
                    {item.stock_quantity > 0 ? (
                      <span className="text-sm text-green-600">
                        {language === 'ar' ? 'متوفر' : 'En stock'}
                      </span>
                    ) : (
                      <span className="text-sm text-red-600">
                        {language === 'ar' ? 'غير متوفر' : 'Rupture de stock'}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCart(item)}
                      disabled={item.stock_quantity === 0}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-300 flex items-center justify-center"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {language === 'ar' ? 'أضف للسلة' : 'Ajouter au panier'}
                    </button>
                    <Link
                      to={`/products/${item.id}`}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300"
                    >
                      {language === 'ar' ? 'عرض' : 'Voir'}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {wishlistItems.length > 0 && (
          <div className="mt-12 text-center">
            <Link
              to="/products"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-300"
            >
              {language === 'ar' ? 'تصفح المزيد من المنتجات' : 'Découvrir plus de produits'}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
