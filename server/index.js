// Environment validation - Must be first
const { validateEnv, getConfig } = require('./config/env');
validateEnv();

const express = require('express');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const { initializeDatabase } = require('./config/db');

// Import security middleware
const {
  rateLimiters,
  securityHeaders,
  sanitizeInput,
  corsOptions,
  securityLogger,
  mongoSanitize,
  hppProtection
} = require('./middleware/security');

// Import routes
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const couponRoutes = require('./routes/couponRoutes');
const adminRoutes = require('./routes/adminRoutes');
const newsletterRoutes = require('./routes/newsletterRoutes');
const contactRoutes = require('./routes/contactRoutes');

const app = express();
const config = getConfig();

// Trust proxy (important for rate limiting behind reverse proxy)
app.set('trust proxy', 1);

// =================================================================
// SECURITY MIDDLEWARE (Order matters!)
// =================================================================

// Security headers
app.use(securityHeaders);

// CORS configuration
app.use(cors(corsOptions));

// Compression middleware
app.use(compression());

// Request logging
if (config.logging.enableRequestLogging) {
  app.use(morgan('combined'));
}

// Rate limiting - Apply to all requests
app.use(rateLimiters.general);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Data sanitization against NoSQL injection attacks
app.use(mongoSanitize);

// Data sanitization against XSS attacks
app.use(sanitizeInput);

// Prevent HTTP Parameter Pollution attacks
app.use(hppProtection);

// Security logging
app.use(securityLogger);

// Serve uploaded files with security headers
app.use('/uploads', express.static('uploads', {
  setHeaders: (res, path) => {
    // Prevent execution of uploaded files
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Content-Disposition', 'inline');
  }
}));

// =================================================================
// DATABASE INITIALIZATION
// =================================================================
initializeDatabase();

// =================================================================
// API ROUTES WITH SPECIFIC RATE LIMITING
// =================================================================

// Health check endpoint (no rate limiting)
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Droguerie Jamal API is running!',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
    version: '1.0.0'
  });
});

// Authentication routes (strict rate limiting)
app.use('/api/auth', rateLimiters.auth, authRoutes);

// Product and category routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);

// Cart and wishlist routes
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);

// Order routes
app.use('/api/orders', orderRoutes);

// Review routes
app.use('/api/reviews', reviewRoutes);

// Payment routes (with upload rate limiting for receipts)
app.use('/api/payments', rateLimiters.upload, paymentRoutes);

// Settings routes
app.use('/api/settings', settingsRoutes);

// Coupon routes
app.use('/api/coupons', couponRoutes);

// Admin routes (protected)
app.use('/api/admin', adminRoutes);

// Newsletter routes
app.use('/api/newsletter', newsletterRoutes);

// Contact routes
app.use('/api/contact', contactRoutes);

// =================================================================
// ERROR HANDLING MIDDLEWARE
// =================================================================

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString()
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Error occurred:');
  console.error('Stack:', err.stack);
  console.error('URL:', req.originalUrl);
  console.error('Method:', req.method);
  console.error('IP:', req.ip);
  console.error('User-Agent:', req.get('User-Agent'));

  // Don't leak error details in production
  const isDevelopment = config.nodeEnv === 'development';

  res.status(err.status || 500).json({
    success: false,
    message: isDevelopment ? err.message : 'Internal server error',
    ...(isDevelopment && {
      stack: err.stack,
      details: err
    }),
    timestamp: new Date().toISOString()
  });
});

// =================================================================
// SERVER STARTUP
// =================================================================

const server = app.listen(config.port, '0.0.0.0', () => {
  console.log('🚀 ===============================================');
  console.log(`🏪 Droguerie Jamal Server Started Successfully`);
  console.log('🚀 ===============================================');
  console.log(`📱 Server running on port: ${config.port}`);
  console.log(`🌍 Environment: ${config.nodeEnv}`);
  console.log(`📊 Health check: http://localhost:${config.port}/api/health`);
  console.log(`🔒 Security: Enabled with rate limiting`);
  console.log(`📧 Email service: ${config.email.user ? 'Configured' : 'Disabled - SMTP credentials not configured'}`);
  console.log(`💳 Stripe: ${config.stripe.secretKey ? 'Configured' : 'Disabled - Stripe keys not configured'}`);
  console.log('🚀 ===============================================');
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('📴 SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('📴 SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Process terminated');
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('💥 Unhandled Rejection:', err);
  process.exit(1);
});

module.exports = app;
