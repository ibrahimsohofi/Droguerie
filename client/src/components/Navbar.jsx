import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, X, Search, ShoppingCart, Heart, User, ChevronDown, Globe, MapPin, Phone } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';
import EnhancedSearchBar from './EnhancedSearchBar';
import PrayerTimesWidget from './PrayerTimesWidget';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isFeaturesMenuOpen, setIsFeaturesMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { language, isRTL, t } = useLanguage();
  const { user, logout } = useAuth();
  const { getCartItemCount } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();

  const cartCount = getCartItemCount();

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearch = ({ query, filters }) => {
    console.log('Search performed:', { query, filters });
    navigate(`/products?search=${encodeURIComponent(query)}`);
  };

  // Get navigation text based on language
  const getNavText = () => {
    return {
      home: language === 'ar' ? 'الرئيسية' : language === 'fr' ? 'Accueil' : 'Home',
      products: language === 'ar' ? 'المنتجات' : language === 'fr' ? 'Produits' : 'Products',
      categories: language === 'ar' ? 'الفئات' : language === 'fr' ? 'Catégories' : 'Categories',
      about: language === 'ar' ? 'حولنا' : language === 'fr' ? 'À propos' : 'About',
      contact: language === 'ar' ? 'اتصل بنا' : language === 'fr' ? 'Contact' : 'Contact',
      cart: language === 'ar' ? 'السلة' : language === 'fr' ? 'Panier' : 'Cart',
      wishlist: language === 'ar' ? 'المفضلة' : language === 'fr' ? 'Favoris' : 'Wishlist',
      login: language === 'ar' ? 'تسجيل الدخول' : language === 'fr' ? 'Connexion' : 'Login',
      register: language === 'ar' ? 'إنشاء حساب' : language === 'fr' ? 'S\'inscrire' : 'Register',
      profile: language === 'ar' ? 'الملف الشخصي' : language === 'fr' ? 'Profil' : 'Profile',
      orders: language === 'ar' ? 'طلباتي' : language === 'fr' ? 'Mes commandes' : 'My Orders',
      logout: language === 'ar' ? 'تسجيل الخروج' : language === 'fr' ? 'Déconnexion' : 'Logout',
      admin: language === 'ar' ? 'لوحة الإدارة' : language === 'fr' ? 'Administration' : 'Admin Panel',
    };
  };

  const navText = getNavText();

  return (
    <>
      {/* Enhanced Top Bar with Moroccan Gradient */}
      <div className="bg-gradient-to-r from-brand-teal-800 via-brand-teal-700 to-brand-terracotta-700 text-white py-3 hidden md:block shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 group">
                <Phone className="w-4 h-4 text-brand-amber-300 group-hover:scale-110 transition-transform" />
                <span className="text-white/90 hover:text-brand-amber-200 transition-colors cursor-pointer">+212 522 123 456</span>
              </div>
              <div className="flex items-center space-x-2 group">
                <MapPin className="w-4 h-4 text-brand-amber-300 group-hover:scale-110 transition-transform" />
                <span className="text-white/90 hover:text-brand-amber-200 transition-colors">
                  {language === 'ar' ? 'الدار البيضاء، المغرب' :
                   language === 'fr' ? 'Casablanca, Maroc' :
                   'Casablanca, Morocco'}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <PrayerTimesWidget showInNavbar={true} />
              <LanguageSwitcher />
              <ThemeToggle variant="simple" />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Main Navigation with Modern Design */}
      <nav className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-elegant border-b border-brand-neutral-200 dark:border-gray-700 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Enhanced Logo with Modern Design */}
            <div className="flex items-center">
              <Link to="/" className={`flex items-center group ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-brand-teal-600 to-brand-teal-700 rounded-2xl flex items-center justify-center shadow-glow group-hover:shadow-glow-warm transition-all duration-300 group-hover:scale-105">
                    <ShoppingBag className="w-7 h-7 text-brand-amber-200 group-hover:text-brand-amber-100 transition-colors" />
                  </div>
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-teal-500 to-brand-amber-500 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur"></div>
                </div>
                <div className="flex flex-col">
                  <h1 className={`font-bold text-xl bg-gradient-to-r from-brand-teal-700 to-brand-terracotta-600 bg-clip-text text-transparent group-hover:from-brand-teal-600 group-hover:to-brand-terracotta-500 transition-all duration-300 ${
                    language === 'ar' ? 'font-arabic' : 'font-display'
                  }`}>
                    {language === 'ar' ? 'دروغيري جمال' :
                     language === 'fr' ? 'Droguerie Jamal' :
                     'Jamal Store'}
                  </h1>
                  <p className="text-xs text-brand-neutral-500 dark:text-gray-400 group-hover:text-brand-teal-600 transition-colors">
                    {language === 'ar' ? 'متجر المنزل الموثوق' :
                     language === 'fr' ? 'Votre droguerie de confiance' :
                     'Your trusted home store'}
                  </p>
                </div>
              </Link>
            </div>

            {/* Enhanced Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-2">
              <Link
                to="/"
                className="relative px-4 py-2 text-brand-neutral-700 dark:text-gray-300 hover:text-brand-teal-700 dark:hover:text-brand-amber-400 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-brand-teal-50 dark:hover:bg-gray-800 group"
              >
                <span className="relative z-10">{navText.home}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-brand-teal-500/10 to-brand-amber-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <Link
                to="/products"
                className="relative px-4 py-2 text-brand-neutral-700 dark:text-gray-300 hover:text-brand-teal-700 dark:hover:text-brand-amber-400 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-brand-teal-50 dark:hover:bg-gray-800 group"
              >
                <span className="relative z-10">{navText.products}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-brand-teal-500/10 to-brand-amber-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <Link
                to="/categories"
                className="relative px-4 py-2 text-brand-neutral-700 dark:text-gray-300 hover:text-brand-teal-700 dark:hover:text-brand-amber-400 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-brand-teal-50 dark:hover:bg-gray-800 group"
              >
                <span className="relative z-10">{navText.categories}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-brand-teal-500/10 to-brand-amber-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <Link
                to="/about"
                className="relative px-4 py-2 text-brand-neutral-700 dark:text-gray-300 hover:text-brand-teal-700 dark:hover:text-brand-amber-400 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-brand-teal-50 dark:hover:bg-gray-800 group"
              >
                <span className="relative z-10">{navText.about}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-brand-teal-500/10 to-brand-amber-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <Link
                to="/contact"
                className="relative px-4 py-2 text-brand-neutral-700 dark:text-gray-300 hover:text-brand-teal-700 dark:hover:text-brand-amber-400 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-brand-teal-50 dark:hover:bg-gray-800 group"
              >
                <span className="relative z-10">{navText.contact}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-brand-teal-500/10 to-brand-amber-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </div>

            {/* Enhanced Search Bar */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <EnhancedSearchBar onSearch={handleSearch} />
              </div>
            </div>

            {/* Enhanced Right Side Icons */}
            <div className="flex items-center space-x-3">
              {/* Enhanced Cart */}
              <Link
                to="/cart"
                className="relative p-3 text-brand-neutral-600 dark:text-gray-300 hover:text-brand-teal-700 dark:hover:text-brand-amber-400 hover:bg-brand-teal-50 dark:hover:bg-gray-800 rounded-xl transition-all duration-300 group shadow-sm hover:shadow-md"
              >
                <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-brand-terracotta-500 to-brand-terracotta-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-semibold shadow-md animate-pulse">
                    {cartCount}
                  </span>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-brand-teal-500/10 to-brand-amber-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>

              {/* Enhanced Wishlist */}
              <Link
                to="/wishlist"
                className="relative p-3 text-brand-neutral-600 dark:text-gray-300 hover:text-brand-teal-700 dark:hover:text-brand-amber-400 hover:bg-brand-teal-50 dark:hover:bg-gray-800 rounded-xl transition-all duration-300 group shadow-sm hover:shadow-md"
              >
                <Heart className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-brand-terracotta-500 to-brand-terracotta-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-semibold shadow-md">
                    {wishlistCount}
                  </span>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-brand-teal-500/10 to-brand-amber-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>

              {/* Enhanced User Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-3 text-brand-neutral-600 dark:text-gray-300 hover:text-brand-teal-700 dark:hover:text-brand-amber-400 hover:bg-brand-teal-50 dark:hover:bg-gray-800 rounded-xl transition-all duration-300 group shadow-sm hover:shadow-md"
                >
                  <User className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                  {user && (
                    <span className="hidden lg:block text-sm font-medium">
                      {user.name?.split(' ')[0] || navText.profile}
                    </span>
                  )}
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-teal-500/10 to-brand-amber-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>

                {/* Enhanced User Dropdown */}
                {isUserMenuOpen && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsUserMenuOpen(false)}
                    />

                    <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-warm border border-brand-neutral-100 dark:border-gray-700 py-2 z-50 animate-scale-in">
                      {user ? (
                        <>
                          <div className="px-4 py-3 border-b border-brand-neutral-100 dark:border-gray-700">
                            <p className="text-sm font-medium text-brand-neutral-900 dark:text-white">{user.name}</p>
                            <p className="text-xs text-brand-neutral-500 dark:text-gray-400">{user.email}</p>
                          </div>
                          <Link
                            to="/profile"
                            className="block px-4 py-3 text-sm text-brand-neutral-700 dark:text-gray-300 hover:bg-brand-teal-50 dark:hover:bg-gray-700 hover:text-brand-teal-700 dark:hover:text-brand-amber-400 transition-all duration-200 rounded-lg mx-2 my-1"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            {navText.profile}
                          </Link>
                          <Link
                            to="/orders"
                            className="block px-4 py-3 text-sm text-brand-neutral-700 dark:text-gray-300 hover:bg-brand-teal-50 dark:hover:bg-gray-700 hover:text-brand-teal-700 dark:hover:text-brand-amber-400 transition-all duration-200 rounded-lg mx-2 my-1"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            {navText.orders}
                          </Link>
                          {user.role === 'admin' && (
                            <Link
                              to="/admin"
                              className="block px-4 py-3 text-sm text-brand-terracotta-700 dark:text-brand-amber-400 hover:bg-brand-terracotta-50 dark:hover:bg-gray-700 hover:text-brand-terracotta-800 dark:hover:text-brand-amber-300 transition-all duration-200 rounded-lg mx-2 my-1 font-medium"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              {navText.admin}
                            </Link>
                          )}
                          <div className="border-t border-brand-neutral-100 dark:border-gray-700 my-2"></div>
                          <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 transition-all duration-200 rounded-lg mx-2 my-1"
                          >
                            {navText.logout}
                          </button>
                        </>
                      ) : (
                        <>
                          <Link
                            to="/login"
                            className="block px-4 py-3 text-sm text-brand-neutral-700 dark:text-gray-300 hover:bg-brand-teal-50 dark:hover:bg-gray-700 hover:text-brand-teal-700 dark:hover:text-brand-amber-400 transition-all duration-200 rounded-lg mx-2 my-1"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            {navText.login}
                          </Link>
                          <Link
                            to="/register"
                            className="block px-4 py-3 text-sm text-brand-teal-700 dark:text-brand-amber-400 hover:bg-brand-teal-50 dark:hover:bg-gray-700 hover:text-brand-teal-800 dark:hover:text-brand-amber-300 transition-all duration-200 rounded-lg mx-2 my-1 font-medium"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            {navText.register}
                          </Link>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Enhanced Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-3 text-brand-neutral-600 dark:text-gray-300 hover:text-brand-teal-700 dark:hover:text-brand-amber-400 hover:bg-brand-teal-50 dark:hover:bg-gray-800 rounded-xl transition-all duration-300 group shadow-sm hover:shadow-md"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                ) : (
                  <Menu className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-brand-teal-500/10 to-brand-amber-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Mobile Menu */}
        {isMobileMenuOpen && (
          <>
            {/* Mobile Backdrop */}
            <div
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            <div className="lg:hidden relative z-50">
              <div className="bg-white dark:bg-gray-900 border-t border-brand-neutral-200 dark:border-gray-700 shadow-warm rounded-b-2xl mx-4 mb-4 overflow-hidden animate-slide-in">
                <div className="px-4 py-6 space-y-2">
                  {/* Mobile Search */}
                  <div className="mb-4">
                    <EnhancedSearchBar onSearch={handleSearch} />
                  </div>

                  <Link
                    to="/"
                    className="block px-4 py-3 text-brand-neutral-700 dark:text-gray-300 hover:bg-brand-teal-50 dark:hover:bg-gray-800 hover:text-brand-teal-700 dark:hover:text-brand-amber-400 transition-all duration-200 rounded-xl font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {navText.home}
                  </Link>
                  <Link
                    to="/products"
                    className="block px-4 py-3 text-brand-neutral-700 dark:text-gray-300 hover:bg-brand-teal-50 dark:hover:bg-gray-800 hover:text-brand-teal-700 dark:hover:text-brand-amber-400 transition-all duration-200 rounded-xl font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {navText.products}
                  </Link>
                  <Link
                    to="/categories"
                    className="block px-4 py-3 text-brand-neutral-700 dark:text-gray-300 hover:bg-brand-teal-50 dark:hover:bg-gray-800 hover:text-brand-teal-700 dark:hover:text-brand-amber-400 transition-all duration-200 rounded-xl font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {navText.categories}
                  </Link>
                  <Link
                    to="/about"
                    className="block px-4 py-3 text-brand-neutral-700 dark:text-gray-300 hover:bg-brand-teal-50 dark:hover:bg-gray-800 hover:text-brand-teal-700 dark:hover:text-brand-amber-400 transition-all duration-200 rounded-xl font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {navText.about}
                  </Link>
                  <Link
                    to="/contact"
                    className="block px-4 py-3 text-brand-neutral-700 dark:text-gray-300 hover:bg-brand-teal-50 dark:hover:bg-gray-800 hover:text-brand-teal-700 dark:hover:text-brand-amber-400 transition-all duration-200 rounded-xl font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {navText.contact}
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </nav>
    </>
  );
};

export default Navbar;
