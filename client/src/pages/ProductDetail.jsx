import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, ArrowLeft, Plus, Minus, Heart, Share, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTranslations } from '../translations';
import { useCart } from '../context/CartContext';
import ReviewSection from '../components/ReviewSection';

const API_BASE = `${import.meta.env.VITE_API_URL}/api`;

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const { language, isRTL } = useLanguage();
  const t = useTranslations(language);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/products/${id}`);
      if (!response.ok) throw new Error('Product not found');
      const data = await response.json();
      setProduct(data.data);
    } catch (err) {
      setError(err.message);
      // Fallback product data for demonstration
      setProduct({
        id: parseInt(id),
        name: 'Premium Cleaning Solution',
        name_ar: 'محلول تنظيف فاخر',
        name_fr: 'Solution de nettoyage premium',
        description: 'High-quality cleaning solution for all surfaces. Safe and effective formula that removes tough stains and leaves surfaces sparkling clean.',
        description_ar: 'محلول تنظيف عالي الجودة لجميع الأسطح. تركيبة آمنة وفعالة تزيل البقع الصعبة وتترك الأسطح نظيفة ولامعة.',
        description_fr: 'Solution de nettoyage de haute qualité pour toutes les surfaces. Formule sûre et efficace qui élimine les taches tenaces et laisse les surfaces étincelantes.',
        price: 45.99,
        image_url: '${import.meta.env.VITE_API_URL}/api/placeholder/500/400',
        images: ['${import.meta.env.VITE_API_URL}/api/placeholder/500/400', '${import.meta.env.VITE_API_URL}/api/placeholder/500/400', '${import.meta.env.VITE_API_URL}/api/placeholder/500/400'],
        stock: 25,
        featured: true,
        category_id: 1,
        category_name: 'Cleaning Products',
        rating: 4.5,
        reviews_count: 128,
        brand: 'CleanPro',
        weight: '500ml',
        ingredients: 'Biodegradable surfactants, enzymes, essential oils'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getLocalizedName = () => {
    if (!product) return '';
    if (language === 'ar') return product.name_ar || product.name;
    if (language === 'fr') return product.name_fr || product.name;
    return product.name;
  };

  const getLocalizedDescription = () => {
    if (!product) return '';
    if (language === 'ar') return product.description_ar || product.description;
    if (language === 'fr') return product.description_fr || product.description;
    return product.description;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ar-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 2
    }).format(price);
  };

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= product?.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    const success = await addToCart(product.id, quantity);
    if (success) {
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
            <div className="md:flex">
              <div className="md:w-1/2">
                <div className="h-96 bg-gray-200"></div>
              </div>
              <div className="md:w-1/2 p-8">
                <div className="h-8 bg-gray-200 rounded mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-8"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-24">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {language === 'ar' ? 'المنتج غير موجود' : 'Produit non trouvé'}
            </h2>
            <p className="text-gray-500 mb-8">
              {language === 'ar' ? 'المنتج المطلوب غير متوفر' : 'Le produit demandé n\'est pas disponible'}
            </p>
            <button
              onClick={handleGoBack}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors duration-300"
            >
              {language === 'ar' ? 'العودة' : 'Retour'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center">
          <Check className="h-5 w-5 mr-2" />
          {language === 'ar' ? 'تم إضافة المنتج إلى السلة' : 'Produit ajouté au panier'}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={handleGoBack}
          className={`flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors duration-300 ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <ArrowLeft className={`h-5 w-5 ${isRTL ? 'ml-2 rotate-180' : 'mr-2'}`} />
          {language === 'ar' ? 'العودة إلى المنتجات' : 'Retour aux produits'}
        </button>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className={`md:flex ${isRTL ? 'md:flex-row-reverse' : ''}`}>
            {/* Product Images */}
            <div className="md:w-1/2">
              <div className="relative">
                <img
                  src={product.images?.[selectedImage] || product.image_url || '${import.meta.env.VITE_API_URL}/api/placeholder/500/400'}
                  alt={getLocalizedName()}
                  className="w-full h-96 object-cover"
                  onError={(e) => {
                    e.target.src = '${import.meta.env.VITE_API_URL}/api/placeholder/500/400';
                  }}
                />
                {product.featured && (
                  <div className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold`}>
                    {language === 'ar' ? 'مميز' : 'Featured'}
                  </div>
                )}
              </div>

              {/* Image Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="flex p-4 space-x-2 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors duration-200 ${
                        selectedImage === index ? 'border-orange-500' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${getLocalizedName()} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="md:w-1/2 p-8">
              {/* Category */}
              <div className="text-sm text-blue-600 font-semibold mb-2 uppercase tracking-wider">
                {product.category_name}
              </div>

              {/* Product Name */}
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {getLocalizedName()}
              </h1>

              {/* Rating */}
              <div className={`flex items-center mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < Math.floor(product.rating || 0) ? 'text-orange-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className={`text-gray-600 ${isRTL ? 'mr-2' : 'ml-2'}`}>
                  ({product.reviews_count || 0} {language === 'ar' ? 'تقييم' : 'avis'})
                </span>
              </div>

              {/* Price */}
              <div className="text-4xl font-bold text-gray-900 mb-6">
                {formatPrice(product.price)}
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {language === 'ar' ? 'الوصف' : 'Description'}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {getLocalizedDescription()}
                </p>
              </div>

              {/* Product Details */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {language === 'ar' ? 'تفاصيل المنتج' : 'Détails du produit'}
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  {product.brand && (
                    <div className={`flex ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className={`font-medium ${isRTL ? 'ml-2' : 'mr-2'}`}>
                        {language === 'ar' ? 'العلامة التجارية:' : 'Marque:'}
                      </span>
                      <span>{product.brand}</span>
                    </div>
                  )}
                  {product.weight && (
                    <div className={`flex ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className={`font-medium ${isRTL ? 'ml-2' : 'mr-2'}`}>
                        {language === 'ar' ? 'الحجم:' : 'Taille:'}
                      </span>
                      <span>{product.weight}</span>
                    </div>
                  )}
                  <div className={`flex ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className={`font-medium ${isRTL ? 'ml-2' : 'mr-2'}`}>
                      {language === 'ar' ? 'المخزون:' : 'Stock:'}
                    </span>
                    <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                      {product.stock > 0
                        ? `${product.stock} ${language === 'ar' ? 'قطعة متوفرة' : 'pièces disponibles'}`
                        : (language === 'ar' ? 'نفد المخزون' : 'Rupture de stock')
                      }
                    </span>
                  </div>
                </div>
              </div>

              {/* Quantity and Add to Cart */}
              {product.stock > 0 && (
                <div className="mb-6">
                  <div className={`flex items-center gap-4 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-lg font-medium text-gray-900">
                      {language === 'ar' ? 'الكمية:' : 'Quantité:'}
                    </span>
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                        className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-4 py-2 font-medium">{quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= product.stock}
                        className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 px-6 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center"
                  >
                    <ShoppingCart className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {language === 'ar' ? 'أضف إلى السلة' : 'Ajouter au panier'}
                  </button>
                </div>
              )}

              {/* Action Buttons */}
              <div className={`flex gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`flex-1 border ${isFavorite ? 'border-red-500 text-red-500' : 'border-gray-300 text-gray-600'} hover:bg-gray-50 py-3 px-4 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center`}
                >
                  <Heart className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'} ${isFavorite ? 'fill-current' : ''}`} />
                  {language === 'ar' ? 'المفضلة' : 'Favoris'}
                </button>
                <button className="flex-1 border border-gray-300 text-gray-600 hover:bg-gray-50 py-3 px-4 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center">
                  <Share className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {language === 'ar' ? 'مشاركة' : 'Partager'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-8">
          <ReviewSection productId={product.id} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
