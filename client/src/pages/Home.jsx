import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import CategoryFilter from '../components/CategoryFilter';
import NewsletterSubscription from '../components/NewsletterSubscription';
import SocialMediaIntegration from '../components/SocialMediaIntegration';
import { ProductCardSkeleton } from '../components/LoadingSpinner';
import { AnimatedNotification } from '../components/FormSkeleton';
import { ShoppingBag, Star, TrendingUp, Users, Award, ArrowRight, Package, Truck, Shield, Clock, Heart, Zap, Gift } from 'lucide-react';
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

  // Enhanced hero section with hardware store theme using footer colors
  const HeroSection = () => (
    <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 py-20 px-4 overflow-hidden hardware-pattern">
      {/* Tool decorative elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-orange-500 rounded-full opacity-30 animate-float"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-orange-400 rounded-full opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-orange-300 rounded-full opacity-15 animate-float" style={{animationDelay: '1s'}}></div>

      <div className="max-w-7xl mx-auto text-center">
        <div className="animate-fade-in">
          <h1 className={`text-5xl md:text-7xl font-bold mb-6 ${isRTL ? 'font-arabic' : 'font-display'}`}>
            <span className="bg-gradient-to-r from-orange-400 to-orange-300 bg-clip-text text-transparent">
              {language === 'ar' ? 'دروغيري جمال' : language === 'fr' ? 'Droguerie Jamal' : 'Jamal General Store'}
            </span>
          </h1>
          <p className={`text-xl md:text-2xl text-orange-100 mb-8 max-w-3xl mx-auto ${isRTL ? 'font-arabic' : ''}`}>
            {language === 'ar'
              ? 'متجرك المفضل لجميع احتياجات المنزل والعناية الشخصية'
              : language === 'fr'
              ? 'Votre magasin préféré pour tous vos besoins domestiques et de soins personnels'
              : 'Your favorite store for all household and personal care needs'
            }
          </p>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 max-w-4xl mx-auto">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 card-elegant border border-orange-200">
              <div className="text-3xl font-bold text-blue-900 mb-2">500+</div>
              <div className="text-gray-700 text-sm">
                {language === 'ar' ? 'منتج' : language === 'fr' ? 'Produits' : 'Products'}
              </div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 card-elegant border border-orange-200">
              <div className="text-3xl font-bold text-orange-600 mb-2">15+</div>
              <div className="text-gray-700 text-sm">
                {language === 'ar' ? 'سنة خبرة' : language === 'fr' ? 'Années d\'expérience' : 'Years Experience'}
              </div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 card-elegant border border-orange-200">
              <div className="text-3xl font-bold text-blue-800 mb-2">10K+</div>
              <div className="text-gray-700 text-sm">
                {language === 'ar' ? 'عميل راضي' : language === 'fr' ? 'Clients satisfaits' : 'Happy Customers'}
              </div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 card-elegant border border-orange-200">
              <div className="text-3xl font-bold text-orange-500 mb-2">24/7</div>
              <div className="text-gray-700 text-sm">
                {language === 'ar' ? 'دعم' : language === 'fr' ? 'Support' : 'Support'}
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => document.getElementById('featured-products').scrollIntoView({behavior: 'smooth'})}
              className="btn-primary group"
            >
              <span>{language === 'ar' ? 'تسوق الآن' : language === 'fr' ? 'Acheter maintenant' : 'Shop Now'}</span>
              <ShoppingBag className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
            <button
              onClick={() => document.getElementById('categories').scrollIntoView({behavior: 'smooth'})}
              className="btn-secondary group"
            >
              <span>{language === 'ar' ? 'تصفح الفئات' : language === 'fr' ? 'Parcourir les catégories' : 'Browse Categories'}</span>
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Enhanced features section
  const FeaturesSection = () => (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className={`text-3xl md:text-4xl font-bold text-center mb-12 ${isRTL ? 'font-arabic' : 'font-display'}`}>
          <span className="bg-gradient-to-r from-brand-teal-700 to-brand-terracotta-600 bg-clip-text text-transparent">
            {language === 'ar' ? 'لماذا تختارنا؟' : language === 'fr' ? 'Pourquoi nous choisir?' : 'Why Choose Us?'}
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: <Truck className="w-12 h-12 text-brand-teal-600" />,
              title: language === 'ar' ? 'توصيل سريع' : language === 'fr' ? 'Livraison rapide' : 'Fast Delivery',
              desc: language === 'ar' ? 'توصيل في نفس اليوم لجميع أنحاء الدار البيضاء' : language === 'fr' ? 'Livraison le jour même dans tout Casablanca' : 'Same-day delivery across Casablanca'
            },
            {
              icon: <Shield className="w-12 h-12 text-brand-terracotta-600" />,
              title: language === 'ar' ? 'جودة مضمونة' : language === 'fr' ? 'Qualité garantie' : 'Quality Guaranteed',
              desc: language === 'ar' ? 'منتجات أصلية من علامات تجارية موثوقة' : language === 'fr' ? 'Produits authentiques de marques de confiance' : 'Authentic products from trusted brands'
            },
            {
              icon: <Heart className="w-12 h-12 text-brand-amber-600" />,
              title: language === 'ar' ? 'خدمة عملاء ممتازة' : language === 'fr' ? 'Service client excellent' : 'Excellent Customer Service',
              desc: language === 'ar' ? 'فريق دعم ودود ومفيد متاح 24/7' : language === 'fr' ? 'Équipe de support amicale et utile disponible 24/7' : 'Friendly and helpful support team available 24/7'
            },
            {
              icon: <Gift className="w-12 h-12 text-brand-teal-600" />,
              title: language === 'ar' ? 'عروض حصرية' : language === 'fr' ? 'Offres exclusives' : 'Exclusive Deals',
              desc: language === 'ar' ? 'خصومات وعروض خاصة للعملاء المميزين' : language === 'fr' ? 'Remises et offres spéciales pour les clients privilégiés' : 'Special discounts and offers for valued customers'
            }
          ].map((feature, index) => (
            <div key={index} className="bg-white rounded-xl p-8 card-elegant group hover:scale-105 transition-all duration-300">
              <div className="mb-6 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className={`text-xl font-semibold mb-4 text-gray-800 ${isRTL ? 'font-arabic' : ''}`}>
                {feature.title}
              </h3>
              <p className={`text-gray-600 ${isRTL ? 'font-arabic' : ''}`}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Get filtered products
  const filteredProducts = products.filter(product => {
    const matchesCategory = !selectedCategory || product.category_id === selectedCategory;
    const matchesSearch = !searchQuery ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.name_ar?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.name_fr?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen">
      {/* Enhanced Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Featured Products Section */}
      <section id="featured-products" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isRTL ? 'font-arabic' : 'font-display'}`}>
              <span className="bg-gradient-to-r from-brand-teal-700 to-brand-terracotta-600 bg-clip-text text-transparent">
                {language === 'ar' ? 'المنتجات المميزة' : language === 'fr' ? 'Produits en vedette' : 'Featured Products'}
              </span>
            </h2>
            <p className={`text-xl text-gray-600 max-w-2xl mx-auto ${isRTL ? 'font-arabic' : ''}`}>
              {language === 'ar'
                ? 'اكتشف أفضل منتجاتنا المختارة بعناية لمنزلك وعائلتك'
                : language === 'fr'
                ? 'Découvrez nos meilleurs produits soigneusement sélectionnés pour votre maison et votre famille'
                : 'Discover our best products carefully selected for your home and family'
              }
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                <p className="text-red-600 font-medium">{error}</p>
                <button
                  onClick={fetchData}
                  className="mt-4 btn-primary"
                >
                  {language === 'ar' ? 'إعادة المحاولة' : language === 'fr' ? 'Réessayer' : 'Try Again'}
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {(featuredProducts.length > 0 ? featuredProducts : products.slice(0, 8)).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-16 bg-gradient-to-br from-gray-50 to-brand-teal-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isRTL ? 'font-arabic' : 'font-display'}`}>
              <span className="bg-gradient-to-r from-brand-teal-700 to-brand-terracotta-600 bg-clip-text text-transparent">
                {language === 'ar' ? 'تسوق حسب الفئة' : language === 'fr' ? 'Acheter par catégorie' : 'Shop by Category'}
              </span>
            </h2>
          </div>

          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>
      </section>

      {/* All Products Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isRTL ? 'font-arabic' : 'font-display'}`}>
              <span className="bg-gradient-to-r from-brand-teal-700 to-brand-terracotta-600 bg-clip-text text-transparent">
                {selectedCategory ?
                  (language === 'ar' ? 'منتجات مفلترة' : language === 'fr' ? 'Produits filtrés' : 'Filtered Products') :
                  (language === 'ar' ? 'جميع المنتجات' : language === 'fr' ? 'Tous les produits' : 'All Products')
                }
              </span>
            </h2>
            <p className="text-gray-600">
              {language === 'ar'
                ? `عرض ${filteredProducts.length} منتج`
                : language === 'fr'
                ? `Affichage de ${filteredProducts.length} produits`
                : `Showing ${filteredProducts.length} products`
              }
            </p>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {language === 'ar' ? 'لا توجد منتجات تطابق البحث' : language === 'fr' ? 'Aucun produit ne correspond à la recherche' : 'No products match your search'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <NewsletterSubscription />

      {/* Social Media Section */}
      <SocialMediaIntegration />
    </div>
  );
};

export default Home;
