import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, X, Search, ShoppingCart, Heart, User, ChevronDown } from 'lucide-react';
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
    // You can integrate this with your existing search logic
    // or redirect to a search results page
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">DJ</span>
              </div>
              <span className="text-xl font-bold text-gray-900">{t('hero.storeName')}</span>
            </Link>
          </div>

          {/* Enhanced Search Bar - Desktop */}
          <div className="hidden md:block flex-1 max-w-2xl mx-8">
            <EnhancedSearchBar
              onSearch={handleSearch}
              className="w-full"
            />
          </div>

          {/* Right side navigation */}
          <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
            {/* Theme Toggle */}
            <ThemeToggle variant="simple" />

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Desktop Navigation Links */}
            <div className={`hidden md:flex items-center ${isRTL ? 'space-x-reverse space-x-6' : 'space-x-6'}`}>
              <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                {t('nav.home')}
              </Link>
              <Link to="/products" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                {t('nav.products')}
              </Link>
              <Link to="/categories" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                {t('nav.categories')}
              </Link>

              {/* Features Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsFeaturesMenuOpen(!isFeaturesMenuOpen)}
                  className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  <span>{language === 'ar' ? 'الخدمات' : language === 'fr' ? 'Services' : 'Services'}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {isFeaturesMenuOpen && (
                  <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50`}>
                    <Link
                      to="/seasonal-deals"
                      className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${isRTL ? 'text-right' : 'text-left'}`}
                      onClick={() => setIsFeaturesMenuOpen(false)}
                    >
                      {language === 'ar' ? 'العروض الموسمية' : language === 'fr' ? 'Offres Saisonnières' : 'Seasonal Deals'}
                    </Link>
                    <Link
                      to="/bundle-deals"
                      className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${isRTL ? 'text-right' : 'text-left'}`}
                      onClick={() => setIsFeaturesMenuOpen(false)}
                    >
                      {language === 'ar' ? 'عروض الحزم' : language === 'fr' ? 'Offres de Packs' : 'Bundle Deals'}
                    </Link>
                    <Link
                      to="/school-supplies"
                      className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${isRTL ? 'text-right' : 'text-left'}`}
                      onClick={() => setIsFeaturesMenuOpen(false)}
                    >
                      {language === 'ar' ? 'المستلزمات المدرسية' : language === 'fr' ? 'Fournitures Scolaires' : 'School Supplies'}
                    </Link>
                    <Link
                      to="/household-helper"
                      className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${isRTL ? 'text-right' : 'text-left'}`}
                      onClick={() => setIsFeaturesMenuOpen(false)}
                    >
                      {language === 'ar' ? 'مساعد المنزل' : language === 'fr' ? 'Assistant Ménager' : 'Household Helper'}
                    </Link>
                    <hr className="my-1" />
                    <Link
                      to="/community"
                      className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${isRTL ? 'text-right' : 'text-left'}`}
                      onClick={() => setIsFeaturesMenuOpen(false)}
                    >
                      {language === 'ar' ? 'مجتمع الحي' : language === 'fr' ? 'Communauté' : 'Community'}
                    </Link>
                  </div>
                )}
              </div>

              <Link to="/contact" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                {t('nav.contact')}
              </Link>
            </div>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden md:block">{user.name || user.email}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {isUserMenuOpen && (
                  <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1`}>
                    <Link
                      to="/profile"
                      className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${isRTL ? 'text-right' : 'text-left'}`}
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      {t('profile.title')}
                    </Link>
                    <Link
                      to="/orders"
                      className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${isRTL ? 'text-right' : 'text-left'}`}
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      {t('orders.title')}
                    </Link>
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${isRTL ? 'text-right' : 'text-left'}`}
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        {t('nav.admin')}
                      </Link>
                    )}
                    <hr className="my-1" />
                    <button
                      onClick={handleLogout}
                      className={`block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${isRTL ? 'text-right' : 'text-left'}`}
                    >
                      {t('auth.logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  {t('auth.login')}
                </Link>
                <span className="text-gray-300">|</span>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  {t('auth.register')}
                </Link>
              </div>
            )}

            {/* Wishlist Icon */}
            <Link
              to="/wishlist"
              className="relative text-gray-700 hover:text-blue-600 transition-colors"
            >
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative text-gray-700 hover:text-blue-600 transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Prayer Times Widget for Moroccan users */}
            <PrayerTimesWidget showInNavbar={true} city="Casablanca" country="MA" />

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-gray-700 hover:text-blue-600 transition-colors"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden py-3">
          <EnhancedSearchBar
            onSearch={handleSearch}
            className="w-full"
          />
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className={`block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors font-medium ${isRTL ? 'text-right' : 'text-left'}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('nav.home')}
              </Link>
              <Link
                to="/products"
                className={`block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors font-medium ${isRTL ? 'text-right' : 'text-left'}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('nav.products')}
              </Link>
              <Link
                to="/categories"
                className={`block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors font-medium ${isRTL ? 'text-right' : 'text-left'}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('nav.categories')}
              </Link>

              {/* New Features */}
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="px-3 py-1 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {language === 'ar' ? 'الخدمات المميزة' : language === 'fr' ? 'Services Premium' : 'Premium Services'}
                </div>
                <Link
                  to="/seasonal-deals"
                  className={`block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors font-medium ${isRTL ? 'text-right' : 'text-left'}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {language === 'ar' ? 'العروض الموسمية' : language === 'fr' ? 'Offres Saisonnières' : 'Seasonal Deals'}
                </Link>
                <Link
                  to="/bundle-deals"
                  className={`block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors font-medium ${isRTL ? 'text-right' : 'text-left'}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {language === 'ar' ? 'عروض الحزم' : language === 'fr' ? 'Offres de Packs' : 'Bundle Deals'}
                </Link>
                <Link
                  to="/school-supplies"
                  className={`block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors font-medium ${isRTL ? 'text-right' : 'text-left'}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {language === 'ar' ? 'المستلزمات المدرسية' : language === 'fr' ? 'Fournitures Scolaires' : 'School Supplies'}
                </Link>
                <Link
                  to="/household-helper"
                  className={`block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors font-medium ${isRTL ? 'text-right' : 'text-left'}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {language === 'ar' ? 'مساعد المنزل' : language === 'fr' ? 'Assistant Ménager' : 'Household Helper'}
                </Link>
                <Link
                  to="/community"
                  className={`block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors font-medium ${isRTL ? 'text-right' : 'text-left'}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {language === 'ar' ? 'مجتمع الحي' : language === 'fr' ? 'Communauté' : 'Community'}
                </Link>
              </div>

              <Link
                to="/contact"
                className={`block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors font-medium ${isRTL ? 'text-right' : 'text-left'}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('nav.contact')}
              </Link>
              {!user && (
                <>
                  <Link
                    to="/login"
                    className={`block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors font-medium ${isRTL ? 'text-right' : 'text-left'}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t('auth.login')}
                  </Link>
                  <Link
                    to="/register"
                    className={`block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors font-medium ${isRTL ? 'text-right' : 'text-left'}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t('auth.register')}
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
