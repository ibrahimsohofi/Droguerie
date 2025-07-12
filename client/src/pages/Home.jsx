import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import CategoryFilter from '../components/CategoryFilter';
import NewsletterSubscription from '../components/NewsletterSubscription';
import SocialMediaIntegration from '../components/SocialMediaIntegration';
import { ProductCardSkeleton } from '../components/LoadingSpinner';
import { AnimatedNotification } from '../components/FormSkeleton';
import { ShoppingBag, Star, TrendingUp, Users, Award, ArrowRight, Package, Truck, Shield, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';

// Helper for fetching from API
const API_BASE = `${import.meta.env.VITE_API_URL}/api`;

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { language, isRTL, t } = useLanguage();
  const { addToCart } = useCart();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch categories from API
      const categoriesRes = await fetch(`${API_BASE}/categories`);
      if (!categoriesRes.ok) throw new Error('Failed to fetch categories');
      const categoriesData = await categoriesRes.json();
      setCategories(categoriesData.data || []);

      // Fetch products from API
      const productsRes = await fetch(`${API_BASE}/products`);
      if (!productsRes.ok) throw new Error('Failed to fetch products');
      const productsData = await productsRes.json();
      setProducts(productsData.data || []);
      setFeaturedProducts((productsData.data || []).filter(p => p.featured));
    } catch (err) {
      setError('Failed to load products or categories');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleViewDetails = (product) => {
    window.location.href = `/products/${product.id}`;
  };

  const handleAddToCart = async (product) => {
    const success = await addToCart(product.id, 1);
    if (success) {
      console.log('Product added to cart successfully');
      // You could show a success notification here
    }
  };

  const filteredProducts = selectedCategory
    ? products.filter(p => p.category_id === selectedCategory)
    : products;

  return (
    <div className="min-h-screen bg-gray-100" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
      <div className="gradient-modern-primary text-white relative overflow-hidden min-h-screen flex items-center">
        {/* Background decorative elements - responsive */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-48 md:w-96 h-48 md:h-96 bg-orange-400/10 rounded-full -translate-x-24 md:-translate-x-48 -translate-y-24 md:-translate-y-48"></div>
          <div className="absolute bottom-0 right-0 w-32 md:w-64 h-32 md:h-64 bg-orange-400/10 rounded-full translate-x-16 md:translate-x-32 translate-y-16 md:translate-y-32"></div>
          <div className="absolute top-1/2 left-1/2 w-16 md:w-32 h-16 md:h-32 bg-orange-400/10 rounded-full -translate-x-8 md:-translate-x-16 -translate-y-8 md:-translate-y-16"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24 relative z-10 w-full">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-6 md:mb-8 animate-fade-in">
              <span className="block text-lg sm:text-xl md:text-2xl lg:text-3xl mb-2 md:mb-4 text-orange-200 font-medium">
                {language === 'ar' ? 'مرحباً بكم في' : language === 'fr' ? 'Bienvenue chez' : 'Welcome to'}
              </span>
              <span className="block text-white drop-shadow-lg">
                {t('businessName')}
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 mb-8 md:mb-16 max-w-4xl mx-auto leading-relaxed animate-fade-in" style={{animationDelay: '0.2s'}}>
              {language === 'ar' ? 'متجرك الموثوق للمنتجات المنزلية والشخصية' :
               language === 'fr' ? 'Votre droguerie de confiance pour tous vos besoins' :
               'Your trusted neighborhood drugstore for all your needs'}
            </p>
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mt-8 md:mt-20 ${isRTL ? 'space-x-reverse' : ''}`}>
              <div className="flex items-center glass rounded-2xl p-4 md:p-6 hover:bg-white/20 transition-all duration-300 animate-fade-in mobile-optimized" style={{animationDelay: '0.4s'}}>
                <Users className="h-8 w-8 md:h-12 md:w-12 mr-3 md:mr-4 text-orange-300" />
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <div className="text-2xl md:text-4xl font-bold text-white">1000+</div>
                  <div className="text-orange-200 text-xs md:text-sm font-medium">
                    {language === 'ar' ? 'عميل سعيد' : language === 'fr' ? 'Clients Satisfaits' : 'Happy Customers'}
                  </div>
                </div>
              </div>
              <div className="flex items-center glass rounded-2xl p-4 md:p-6 hover:bg-white/20 transition-all duration-300 animate-fade-in mobile-optimized" style={{animationDelay: '0.6s'}}>
                <ShoppingBag className="h-8 w-8 md:h-12 md:w-12 mr-3 md:mr-4 text-orange-300" />
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <div className="text-2xl md:text-4xl font-bold text-white">500+</div>
                  <div className="text-orange-200 text-xs md:text-sm font-medium">
                    {language === 'ar' ? 'منتج متوفر' : language === 'fr' ? 'Produits Disponibles' : 'Products Available'}
                  </div>
                </div>
              </div>
              <div className="flex items-center glass rounded-2xl p-4 md:p-6 hover:bg-white/20 transition-all duration-300 animate-fade-in mobile-optimized col-span-1 sm:col-span-2 lg:col-span-1 justify-center sm:justify-start" style={{animationDelay: '0.8s'}}>
                <Award className="h-8 w-8 md:h-12 md:w-12 mr-3 md:mr-4 text-orange-300" />
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <div className="text-2xl md:text-4xl font-bold text-white">15+</div>
                  <div className="text-orange-200 text-xs md:text-sm font-medium">
                    {language === 'ar' ? 'سنوات من الخبرة' : language === 'fr' ? 'Années d\'Expérience' : 'Years of Experience'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className={`text-5xl font-bold text-blue-900 mb-8 flex items-center justify-center ${isRTL ? 'flex-row-reverse' : ''}`}>
              <TrendingUp className={`h-12 w-12 text-orange-500 ${isRTL ? 'ml-4' : 'mr-4'}`} />
              {language === 'ar' ? 'المنتجات المميزة' : language === 'fr' ? 'Produits en Vedette' : 'Featured Products'}
            </h2>
            <p className="text-gray-500 max-w-4xl mx-auto text-lg leading-relaxed">
              {language === 'ar' ? 'اكتشف أفضل منتجاتنا المختارة بعناية' :
               language === 'fr' ? 'Découvrez nos meilleurs produits soigneusement sélectionnés' :
               'Discover our carefully selected best products'}
            </p>
            <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-orange-500 mx-auto rounded-full mt-8"></div>
          </div>

          {error ? (
            <div className="text-center text-red-600 text-lg mb-8">{error}</div>
          ) : isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[...Array(3)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-24">
              {featuredProducts.map((product, index) => (
                <div key={product.id} style={{ animationDelay: `${index * 0.2}s` }}>
                  <ProductCard
                    product={product}
                    onViewDetails={handleViewDetails}
                    onAddToCart={handleAddToCart}
                    language={language}
                    translations={t}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Products Catalog Section */}
      <div className="bg-gray-100 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-blue-900 mb-8">
              {language === 'ar' ? 'كتالوج المنتجات' : language === 'fr' ? 'Catalogue des Produits' : 'Product Catalog'}
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-orange-500 to-blue-500 mx-auto rounded-full"></div>
          </div>

          <div className={`flex flex-col lg:flex-row gap-12 ${isRTL ? 'lg:flex-row-reverse' : ''}`}>
            {/* Category Filter Sidebar */}
            <div className="lg:w-1/4">
              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
                productCount={filteredProducts.length}
                isLoading={isLoading}
                language={language}
                translations={t}
              />
            </div>

            {/* Products Grid */}
            <div className="lg:w-3/4">
              {error ? (
                <div className="text-center text-red-600 text-lg mb-8">{error}</div>
              ) : isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {[...Array(6)].map((_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {filteredProducts.map((product, index) => (
                    <div key={product.id} style={{ animationDelay: `${index * 0.1}s` }}>
                      <ProductCard
                        product={product}
                        onViewDetails={handleViewDetails}
                        onAddToCart={handleAddToCart}
                        language={language}
                        translations={t}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!isLoading && !error && filteredProducts.length === 0 && (
                <div className="text-center py-24">
                  <div className="bg-gray-200 rounded-full w-40 h-40 flex items-center justify-center mx-auto mb-8">
                    <ShoppingBag className="h-20 w-20 text-gray-400" />
                  </div>
                  <h3 className="text-3xl font-bold text-blue-900 mb-6">
                    {language === 'ar' ? 'لا توجد منتجات متاحة' : language === 'fr' ? 'Aucun produit disponible' : 'No products available'}
                  </h3>
                  <p className="text-gray-500 mb-12 max-w-md mx-auto text-lg leading-relaxed">
                    {language === 'ar' ? 'حاول تحديث الصفحة أو تصفح الفئات' :
                     language === 'fr' ? 'Essayez de rafraîchir la page ou de parcourir les catégories' :
                     'Try refreshing the page or browse categories'}
                  </p>
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md text-lg font-medium"
                  >
                    {t.empty.showAll}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-blue-900 mb-6">
              {language === 'ar' ? 'لماذا تختارنا؟' : 'Pourquoi nous choisir?'}
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-orange-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Fast Delivery */}
            <div className="group text-center p-8 rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-500 transition-colors duration-300">
                <Truck className="h-8 w-8 text-blue-500 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-4">
                {language === 'ar' ? 'توصيل سريع' : 'Livraison rapide'}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {language === 'ar'
                  ? 'توصيل سريع وآمن لجميع أنحاء المغرب خلال 24-48 ساعة'
                  : 'Livraison rapide et sécurisée dans tout le Maroc en 24-48h'
                }
              </p>
            </div>

            {/* Quality Products */}
            <div className="group text-center p-8 rounded-2xl border border-gray-200 hover:border-orange-300 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-orange-500 transition-colors duration-300">
                <Package className="h-8 w-8 text-orange-500 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-4">
                {language === 'ar' ? 'منتجات عالية الجودة' : 'Produits de qualité'}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {language === 'ar'
                  ? 'جميع منتجاتنا مضمونة ومن أفضل الماركات العالمية'
                  : 'Tous nos produits sont garantis et des meilleures marques'
                }
              </p>
            </div>

            {/* Secure Payment */}
            <div className="group text-center p-8 rounded-2xl border border-gray-200 hover:border-green-300 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-500 transition-colors duration-300">
                <Shield className="h-8 w-8 text-green-500 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-4">
                {language === 'ar' ? 'دفع آمن' : 'Paiement sécurisé'}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {language === 'ar'
                  ? 'طرق دفع متعددة وآمنة بتشفير عالي المستوى'
                  : 'Plusieurs moyens de paiement sécurisés avec cryptage avancé'
                }
              </p>
            </div>

            {/* 24/7 Support */}
            <div className="group text-center p-8 rounded-2xl border border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-500 transition-colors duration-300">
                <Clock className="h-8 w-8 text-purple-500 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-4">
                {language === 'ar' ? 'دعم على مدار الساعة' : 'Support 24/7'}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {language === 'ar'
                  ? 'فريق دعم متاح على مدار الساعة للإجابة على استفساراتكم'
                  : 'Équipe de support disponible 24h/24 pour répondre à vos questions'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <NewsletterSubscription variant="inline" showDiscount={true} />
        </div>
      </div>

      {/* Social Media Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <SocialMediaIntegration variant="follow" />
            </div>
            <div>
              <SocialMediaIntegration variant="feed" />
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            {language === 'ar' ? 'ابدأ التسوق الآن' : 'Commencez vos achats maintenant'}
          </h2>
          <p className="text-xl text-blue-200 mb-10 max-w-3xl mx-auto">
            {language === 'ar'
              ? 'اكتشف مجموعتنا الواسعة من المنتجات عالية الجودة واستمتع بتجربة تسوق استثنائية'
              : 'Découvrez notre large gamme de produits de qualité et profitez d\'une expérience d\'achat exceptionnelle'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.href = '/products'}
              className="group bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg text-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
            >
              {language === 'ar' ? 'تصفح المنتجات' : 'Parcourir les produits'}
              <ArrowRight className={`h-5 w-5 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'} group-hover:translate-x-1 transition-transform duration-300`} />
            </button>
            <button
              onClick={() => window.location.href = '/contact'}
              className="border-2 border-white text-white hover:bg-white hover:text-blue-900 px-8 py-4 rounded-lg text-lg font-medium transition-all duration-300 transform hover:scale-105"
            >
              {language === 'ar' ? 'تواصل معنا' : 'Contactez-nous'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
