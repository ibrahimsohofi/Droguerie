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
      {/* Top Bar with Contact Info */}
      <div className="bg-gradient-to-r from-brand-teal-700 to-brand-teal-800 text-white py-2 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>+212 522 123 456</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>
                  {language === 'ar' ? 'الدار البيضاء، المغرب' :
                   language === 'fr' ? 'Casablanca, Maroc' :
                   'Casablanca, Morocco'}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <PrayerTimesWidget />
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="sticky top-0 z-50 bg-white shadow-elegant border-b border-gray-200 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                <div className="w-12 h-12 bg-gradient-to-br from-brand-teal-600 to-brand-teal-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                  <ShoppingBag className="w-7 h-7 text-white" />
                </div>
                <div className="flex flex-col">
                  <h1 className={`font-bold text-xl bg-gradient-to-r from-brand-teal-700 to-brand-terracotta-600 bg-clip-text text-transparent ${
                    language === 'ar' ? 'font-arabic' : 'font-display'
                  }`}>
                    {language === 'ar' ? 'دروغيري جمال' :
                     language === 'fr' ? 'Droguerie Jamal' :
                     'Jamal Store'}
                  </h1>
                  <p className="text-xs text-gray-500">
                    {language === 'ar' ? 'متجر المنزل الموثوق' :
                     language === 'fr' ? 'Votre droguerie de confiance' :
                     'Your trusted home store'}
                  </p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <Link
                to="/"
                className="text-gray-700 hover:text-brand-teal-700 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-brand-teal-50"
              >
                {navText.home}
              </Link>
              <Link
                to="/products"
                className="text-gray-700 hover:text-brand-teal-700 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-brand-teal-50"
              >
                {navText.products}
              </Link>
              <Link
                to="/categories"
                className="text-gray-700 hover:text-brand-teal-700 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-brand-teal-50"
              >
                {navText.categories}
              </Link>
              <Link
                to="/about"
                className="text-gray-700 hover:text-brand-teal-700 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-brand-teal-50"
              >
                {navText.about}
              </Link>
              <Link
                to="/contact"
                className="text-gray-700 hover:text-brand-teal-700 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-brand-teal-50"
              >
                {navText.contact}
              </Link>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <EnhancedSearchBar onSearch={handleSearch} />
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-4">
              {/* Cart */}
              <Link
                to="/cart"
                className="relative p-2 text-gray-700 hover:text-brand-teal-700 hover:bg-brand-teal-50 rounded-lg transition-all duration-200 group"
              >
                <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-terracotta-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold animate-pulse">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="relative p-2 text-gray-700 hover:text-brand-teal-700 hover:bg-brand-teal-50 rounded-lg transition-all duration-200 group"
              >
                <Heart className="w-6 h-6 group-hover:scale-110 transition-transform" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-terracotta-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 text-gray-700 hover:text-brand-teal-700 hover:bg-brand-teal-50 rounded-lg transition-all duration-200 group"
                >
                  <User className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  {user && (
                    <span className="hidden lg:block text-sm font-medium">
                      {user.name?.split(' ')[0] || navText.profile}
                    </span>
                  )}
                  <ChevronDown className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-warm border border-gray-100 py-2 z-50">
                    {user ? (
                      <>
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-brand-teal-50 hover:text-brand-teal-700 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          {navText.profile}
                        </Link>
                        <Link
                          to="/orders"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-brand-teal-50 hover:text-brand-teal-700 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          {navText.orders}
                        </Link>
                        {user.role === 'admin' && (
                          <Link
                            to="/admin"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-brand-amber-50 hover:text-brand-amber-700 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            {navText.admin}
                          </Link>
                        )}
                        <hr className="my-2" />
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          {navText.logout}
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/login"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-brand-teal-50 hover:text-brand-teal-700 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          {navText.login}
                        </Link>
                        <Link
                          to="/register"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-brand-teal-50 hover:text-brand-teal-700 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          {navText.register}
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-gray-700 hover:text-brand-teal-700 hover:bg-brand-teal-50 rounded-lg transition-all duration-200"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="px-4 py-6 space-y-4">
              {/* Mobile Search */}
              <div className="mb-6">
                <EnhancedSearchBar onSearch={handleSearch} compact />
              </div>

              {/* Mobile Navigation Links */}
              <div className="space-y-2">
                <Link
                  to="/"
                  className="block px-4 py-3 text-gray-700 hover:bg-brand-teal-50 hover:text-brand-teal-700 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {navText.home}
                </Link>
                <Link
                  to="/products"
                  className="block px-4 py-3 text-gray-700 hover:bg-brand-teal-50 hover:text-brand-teal-700 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {navText.products}
                </Link>
                <Link
                  to="/categories"
                  className="block px-4 py-3 text-gray-700 hover:bg-brand-teal-50 hover:text-brand-teal-700 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {navText.categories}
                </Link>
                <Link
                  to="/about"
                  className="block px-4 py-3 text-gray-700 hover:bg-brand-teal-50 hover:text-brand-teal-700 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {navText.about}
                </Link>
                <Link
                  to="/contact"
                  className="block px-4 py-3 text-gray-700 hover:bg-brand-teal-50 hover:text-brand-teal-700 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {navText.contact}
                </Link>
              </div>

              {/* Mobile User Section */}
              <div className="pt-4 border-t border-gray-200">
                {user ? (
                  <div className="space-y-2">
                    <div className="px-4 py-2 text-sm font-medium text-gray-900">
                      {language === 'ar' ? `مرحبا ${user.name}` :
                       language === 'fr' ? `Bonjour ${user.name}` :
                       `Hello ${user.name}`}
                    </div>
                    <Link
                      to="/profile"
                      className="block px-4 py-3 text-gray-700 hover:bg-brand-teal-50 hover:text-brand-teal-700 rounded-lg transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {navText.profile}
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-3 text-gray-700 hover:bg-brand-teal-50 hover:text-brand-teal-700 rounded-lg transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {navText.orders}
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="block px-4 py-3 text-gray-700 hover:bg-brand-amber-50 hover:text-brand-amber-700 rounded-lg transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {navText.admin}
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      {navText.logout}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      to="/login"
                      className="block w-full text-center bg-brand-teal-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-brand-teal-700 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {navText.login}
                    </Link>
                    <Link
                      to="/register"
                      className="block w-full text-center border border-brand-teal-600 text-brand-teal-600 px-4 py-3 rounded-lg font-medium hover:bg-brand-teal-50 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {navText.register}
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile Language Switcher */}
              <div className="pt-4 border-t border-gray-200">
                <div className="px-4 py-2 text-sm font-medium text-gray-500 uppercase tracking-wide">
                  {language === 'ar' ? 'اللغة' : language === 'fr' ? 'Langue' : 'Language'}
                </div>
                <div className="px-4">
                  <LanguageSwitcher />
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
