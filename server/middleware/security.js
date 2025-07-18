const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { validationResult } = require('express-validator');
const xss = require('xss');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const { getConfig } = require('../config/env');

const config = getConfig();

/**
 * Rate limiting configuration
 */
const createRateLimiter = (windowMs = config.rateLimit.windowMs, maxRequests = config.rateLimit.maxRequests, message = 'Too many requests from this IP') => {
  return rateLimit({
    windowMs,
    max: maxRequests,
    message: {
      error: message,
      retryAfter: Math.ceil(windowMs / 1000)
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        success: false,
        error: message,
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }
  });
};

// Different rate limits for different endpoints
const rateLimiters = {
  // General API rate limiting
  general: createRateLimiter(
    config.rateLimit.windowMs, // 15 minutes
    config.rateLimit.maxRequests, // 100 requests
    'Too many requests from this IP, please try again later'
  ),

  // Stricter rate limiting for authentication
  auth: createRateLimiter(
    15 * 60 * 1000, // 15 minutes
    5, // 5 attempts
    'Too many authentication attempts, please try again later'
  ),

  // File upload rate limiting
  upload: createRateLimiter(
    60 * 60 * 1000, // 1 hour
    20, // 20 uploads
    'Too many file uploads, please try again later'
  ),

  // Contact form rate limiting
  contact: createRateLimiter(
    60 * 60 * 1000, // 1 hour
    3, // 3 messages
    'Too many messages sent, please try again later'
  )
};

/**
 * Security headers configuration
 */
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://fonts.googleapis.com",
        "https://cdn.tailwindcss.com"
      ],
      scriptSrc: [
        "'self'",
        "https://js.stripe.com",
        "https://checkout.stripe.com"
      ],
      imgSrc: [
        "'self'",
        "data:",
        "https:",
        "http://localhost:5000" // For development
      ],
      connectSrc: [
        "'self'",
        "https://api.stripe.com",
        "http://localhost:5000", // For development
        "ws://localhost:*" // For development WebSocket
      ],
      fontSrc: [
        "'self'",
        "https://fonts.googleapis.com",
        "https://fonts.gstatic.com"
      ],
      frameSrc: [
        "https://js.stripe.com",
        "https://hooks.stripe.com"
      ]
    }
  },
  crossOriginEmbedderPolicy: false, // Disable for Stripe compatibility
});

/**
 * Input sanitization middleware
 */
const sanitizeInput = (req, res, next) => {
  // Sanitize against XSS attacks
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = xss(req.body[key]);
      }
    });
  }

  if (req.query) {
    Object.keys(req.query).forEach(key => {
      if (typeof req.query[key] === 'string') {
        req.query[key] = xss(req.query[key]);
      }
    });
  }

  if (req.params) {
    Object.keys(req.params).forEach(key => {
      if (typeof req.params[key] === 'string') {
        req.params[key] = xss(req.params[key]);
      }
    });
  }

  next();
};

/**
 * CORS configuration
 */
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (config.cors.allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'X-CSRF-Token'
  ],
  exposedHeaders: ['X-Total-Count']
};

/**
 * Request validation middleware
 */
const validateRequest = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    next();
  };
};

/**
 * Security logging middleware
 */
const securityLogger = (req, res, next) => {
  // Log suspicious activities
  const suspiciousPatterns = [
    /\.\./,  // Directory traversal
    /<script/i,  // XSS attempts
    /union.*select/i,  // SQL injection
    /javascript:/i,  // XSS
    /%3C/i,  // Encoded <
    /%3E/i   // Encoded >
  ];

  const requestData = JSON.stringify({
    body: req.body,
    query: req.query,
    params: req.params,
    headers: req.headers
  });

  const suspicious = suspiciousPatterns.some(pattern => pattern.test(requestData));

  if (suspicious) {
    console.warn(`🚨 Suspicious request detected from IP: ${req.ip}`);
    console.warn(`   URL: ${req.method} ${req.originalUrl}`);
    console.warn(`   User-Agent: ${req.get('User-Agent')}`);
    console.warn(`   Data: ${requestData.substring(0, 500)}...`);
  }

  next();
};

module.exports = {
  rateLimiters,
  securityHeaders,
  sanitizeInput,
  corsOptions,
  validateRequest,
  securityLogger,
  // Data sanitization
  mongoSanitize: mongoSanitize(),
  // HTTP Parameter Pollution protection
  hppProtection: hpp()
};
