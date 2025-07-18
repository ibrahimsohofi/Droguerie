import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { LanguageProvider } from './context/LanguageContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { ComparisonProvider } from './context/ComparisonContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import LiveChat from './components/LiveChat';
import FloatingComparisonWidget from './components/FloatingComparisonWidget';
import ProductComparisonWidget from './components/ProductComparison';
import RecentlyViewedProducts from './components/RecentlyViewedProducts';
import WhatsAppBusinessWidget from './components/WhatsAppBusinessWidget';
import { NewsletterModal, useNewsletterPopup } from './components/NewsletterSubscription';
import { useComparison } from './context/ComparisonContext';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Contact from './pages/Contact';
import Categories from './pages/Categories';
import Profile from './pages/Profile';
import OrderHistory from './pages/OrderHistory';
import OrderConfirmation from './pages/OrderConfirmation';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSettings from './pages/admin/AdminSettings';
import AdminCoupons from './pages/admin/AdminCoupons';
import AdminInventory from './pages/admin/AdminInventory';
import NotFound from './pages/NotFound';
import Wishlist from './pages/Wishlist';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import About from './pages/About';
import FAQ from './pages/FAQ';
import OrderTracking from './pages/OrderTracking';
import EmailVerification from './pages/EmailVerification';
import LanguageTestComponent from './components/LanguageTestComponent';
import ProductComparison from './pages/ProductComparison';
import AdvancedSearch from './pages/AdvancedSearch';
import UserDashboard from './pages/UserDashboard';
import Blog from './pages/Blog';
import Support from './pages/Support';
import OrderInvoice from './pages/OrderInvoice';
import Returns from './pages/Returns';
import Services from './pages/Services';
import Brands from './pages/Brands';
import StoreLocator from './pages/StoreLocator';
import HouseholdHelper from './pages/HouseholdHelper';
import SeasonalDeals from './pages/SeasonalDeals';
import BundleDeals from './pages/BundleDeals';
import SchoolSupplies from './pages/SchoolSupplies';
import Community from './pages/Community';
import { ToastProvider } from './components/ToastProvider';
import { RecentlyViewedProvider } from './components/RecentlyViewed';
import CartDrawer from './components/CartDrawer';
import ProductQuickView from './components/ProductQuickView';
import './index.css';

function AppContent() {
  const { showPopup, handleClose } = useNewsletterPopup();
  const { isComparisonOpen, setIsComparisonOpen } = useComparison();

  return (
    <div className="App">
      <Navbar />
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<EmailVerification />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/support" element={<Support />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/brands" element={<Brands />} />
          <Route path="/stores" element={<StoreLocator />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/returns" element={<Returns />} />
          <Route path="/search" element={<AdvancedSearch />} />
          <Route path="/compare" element={<ProductComparison />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
          <Route path="/orders/:id" element={<ProtectedRoute><OrderInvoice /></ProtectedRoute>} />
          <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
          <Route path="/order-tracking" element={<OrderTracking />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
          <Route path="/household-helper" element={<HouseholdHelper />} />
          <Route path="/seasonal-deals" element={<SeasonalDeals />} />
          <Route path="/bundle-deals" element={<BundleDeals />} />
          <Route path="/school-supplies" element={<SchoolSupplies />} />
          <Route path="/community" element={<Community />} />
          <Route path="/language-test" element={<LanguageTestComponent />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/products" element={<ProtectedRoute><AdminProducts /></ProtectedRoute>} />
          <Route path="/admin/categories" element={<ProtectedRoute><AdminCategories /></ProtectedRoute>} />
          <Route path="/admin/orders" element={<ProtectedRoute><AdminOrders /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />
          <Route path="/admin/coupons" element={<ProtectedRoute><AdminCoupons /></ProtectedRoute>} />
          <Route path="/admin/inventory" element={<ProtectedRoute><AdminInventory /></ProtectedRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />

      {/* Global Components */}
      <LiveChat />
      <WhatsAppBusinessWidget showWidget={true} businessPhone="+212522123456" />
      <NewsletterModal isOpen={showPopup} onClose={handleClose} />
      <FloatingComparisonWidget />
      <ProductComparisonWidget
        isOpen={isComparisonOpen}
        onClose={() => setIsComparisonOpen(false)}
      />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <ThemeProvider>
          <LanguageProvider>
            <ToastProvider>
              <AuthProvider>
                <CartProvider>
                  <WishlistProvider>
                    <ComparisonProvider>
                      <RecentlyViewedProvider>
                        <Router>
                          <AppContent />
                        </Router>
                      </RecentlyViewedProvider>
                    </ComparisonProvider>
                  </WishlistProvider>
                </CartProvider>
              </AuthProvider>
            </ToastProvider>
          </LanguageProvider>
        </ThemeProvider>
      </GoogleOAuthProvider>
    </ErrorBoundary>
  );
}

export default App;
