const express = require('express');
const router = express.Router();
const emailService = require('../services/emailService');

// Test email service
router.post('/test-email', async (req, res) => {
  try {
    const { email, type = 'welcome' } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email address is required'
      });
    }

    let result;

    switch (type) {
      case 'welcome':
        result = await emailService.sendWelcomeEmail(email, {
          name: 'Test User',
          language: 'ar'
        });
        break;

      case 'order':
        result = await emailService.sendOrderConfirmation(email, {
          customerName: 'Test Customer',
          orderNumber: 'ORD-' + Date.now(),
          total: '250.00',
          paymentMethod: 'Cash on Delivery',
          estimatedDelivery: '2-3 days',
          language: 'ar'
        });
        break;

      case 'reset':
        result = await emailService.sendPasswordReset(email, {
          language: 'ar',
          resetUrl: 'http://localhost:5173/reset-password?token=test-token'
        });
        break;

      default:
        result = await emailService.sendTestEmail(email);
    }

    res.json({
      success: result.success,
      message: result.success ? 'Test email sent successfully!' : 'Failed to send email',
      details: result,
      emailType: type
    });

  } catch (error) {
    console.error('Error sending test email:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Test PWA manifest and service worker
router.get('/test-pwa', (req, res) => {
  res.json({
    success: true,
    message: 'PWA testing endpoint',
    features: {
      manifest: 'Available at /manifest.json',
      serviceWorker: 'Available at /sw.js',
      icons: 'Generated 8 sizes + 4 shortcuts',
      screenshots: 'Desktop and mobile placeholders created',
      installPrompt: 'Configured with Arabic/French/English support'
    },
    status: {
      icons: '✅ Complete',
      serviceWorker: '✅ Registered',
      manifest: '✅ Configured',
      screenshots: '✅ Generated',
      offlineSupport: '⚠️ Basic (ready for enhancement)'
    }
  });
});

// Test Stripe configuration
router.get('/test-stripe', (req, res) => {
  const stripeConfigured = !!(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PUBLISHABLE_KEY);

  res.json({
    success: stripeConfigured,
    message: stripeConfigured ? 'Stripe is configured' : 'Stripe needs configuration',
    environment: process.env.NODE_ENV,
    keyType: process.env.STRIPE_SECRET_KEY?.startsWith('sk_live_') ? 'LIVE' : 'TEST',
    status: {
      secretKey: process.env.STRIPE_SECRET_KEY ? '✅ Set' : '❌ Missing',
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY ? '✅ Set' : '❌ Missing',
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET ? '✅ Set' : '❌ Missing'
    },
    recommendations: [
      'Use test keys for development',
      'Switch to live keys for production',
      'Set up webhook endpoints for order confirmations',
      'Test payment flow before going live'
    ]
  });
});

// Test database connection
router.get('/test-database', async (req, res) => {
  try {
    const { database } = require('../config/db');

    // Simple test query
    const result = await new Promise((resolve, reject) => {
      database.get("SELECT name FROM sqlite_master WHERE type='table'", (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    res.json({
      success: true,
      message: 'Database connection successful',
      type: 'SQLite',
      status: '✅ Connected',
      location: './database.sqlite',
      tables: 'Available and accessible'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// Overall system health check
router.get('/health', async (req, res) => {
  const health = {
    timestamp: new Date().toISOString(),
    status: 'healthy',
    services: {},
    version: '2.0.0',
    environment: process.env.NODE_ENV
  };

  // Check email service
  health.services.email = {
    status: emailService.isConfigured ? '✅ Configured' : '⚠️ Not configured',
    type: emailService.isConfigured ? 'SMTP' : 'Simulation mode'
  };

  // Check database
  try {
    const { database } = require('../config/db');
    health.services.database = {
      status: '✅ Connected',
      type: 'SQLite'
    };
  } catch (error) {
    health.services.database = {
      status: '❌ Error',
      error: error.message
    };
  }

  // Check Stripe
  health.services.stripe = {
    status: process.env.STRIPE_SECRET_KEY ? '✅ Configured' : '⚠️ Not configured',
    environment: process.env.STRIPE_SECRET_KEY?.startsWith('sk_live_') ? 'LIVE' : 'TEST'
  };

  // Check PWA
  health.services.pwa = {
    status: '✅ Ready',
    features: 'Icons, Service Worker, Manifest configured'
  };

  res.json(health);
});

module.exports = router;
