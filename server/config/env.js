const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Required environment variables
const REQUIRED_ENV_VARS = [
  'PORT',
  'JWT_SECRET',
  'DATABASE_URL'
];

// Optional but recommended environment variables
const RECOMMENDED_ENV_VARS = [
  'SMTP_HOST',
  'SMTP_USER',
  'SMTP_PASS',
  'STRIPE_SECRET_KEY',
  'STRIPE_PUBLISHABLE_KEY'
];

/**
 * Validate environment variables
 */
const validateEnv = () => {
  const missing = [];
  const recommended = [];

  // Check required variables
  REQUIRED_ENV_VARS.forEach(varName => {
    if (!process.env[varName] || process.env[varName].trim() === '') {
      missing.push(varName);
    }
  });

  // Check recommended variables
  RECOMMENDED_ENV_VARS.forEach(varName => {
    if (!process.env[varName] || process.env[varName].trim() === '') {
      recommended.push(varName);
    }
  });

  // Validate JWT_SECRET strength
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    console.warn('⚠️  JWT_SECRET should be at least 32 characters long for security');
  }

  // Check for default/placeholder values
  const defaultValues = [
    'CHANGE_THIS_TO_A_SECURE_RANDOM_STRING',
    'your-email@gmail.com',
    'sk_test_your_actual_stripe_secret_key',
    'pk_test_your_actual_stripe_publishable_key'
  ];

  defaultValues.forEach(defaultVal => {
    Object.values(process.env).forEach(envVal => {
      if (envVal && envVal.includes(defaultVal)) {
        console.warn(`⚠️  Found placeholder value in environment variables. Please update with real values.`);
      }
    });
  });

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(varName => console.error(`   - ${varName}`));
    console.error('\nPlease check your .env file and ensure all required variables are set.');
    process.exit(1);
  }

  if (recommended.length > 0) {
    console.warn('⚠️  Missing recommended environment variables:');
    recommended.forEach(varName => console.warn(`   - ${varName}`));
    console.warn('\nThese are optional but recommended for full functionality.');
  }

  console.log('✅ Environment validation completed');
};

/**
 * Get configuration object with defaults
 */
const getConfig = () => {
  return {
    // Server
    port: parseInt(process.env.PORT) || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
    apiBaseUrl: process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 5000}`,

    // Database
    database: {
      url: process.env.DATABASE_URL || './database.sqlite',
      name: process.env.DB_NAME || 'droguerie_jamal'
    },

    // JWT
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
      refreshSecret: process.env.REFRESH_TOKEN_SECRET,
      refreshExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '30d'
    },

    // Email
    email: {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
      from: process.env.SMTP_FROM || '"Droguerie Jamal" <noreply@droguerie-jamal.com>'
    },

    // Stripe
    stripe: {
      secretKey: process.env.STRIPE_SECRET_KEY,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET
    },

    // File Upload
    upload: {
      maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880, // 5MB
      uploadPath: process.env.UPLOAD_PATH || './uploads',
      allowedTypes: (process.env.ALLOWED_FILE_TYPES || 'jpg,jpeg,png,gif,webp').split(','),
      maxFiles: parseInt(process.env.MAX_FILES_PER_UPLOAD) || 10
    },

    // CORS
    cors: {
      origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
      allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:5173').split(',')
    },

    // Rate Limiting
    rateLimit: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
      maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
    },

    // Logging
    logging: {
      level: process.env.LOG_LEVEL || 'info',
      enableRequestLogging: process.env.ENABLE_REQUEST_LOGGING === 'true'
    },

    // Cache
    cache: {
      redisUrl: process.env.REDIS_URL,
      redisPassword: process.env.REDIS_PASSWORD,
      ttl: parseInt(process.env.CACHE_TTL) || 3600
    },

    // Admin
    admin: {
      email: process.env.ADMIN_EMAIL || 'admin@droguerie-jamal.com',
      password: process.env.ADMIN_PASSWORD
    }
  };
};

module.exports = {
  validateEnv,
  getConfig
};
