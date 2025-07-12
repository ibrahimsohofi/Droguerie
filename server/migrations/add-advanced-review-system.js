const { initializeDatabase } = require('../config/db');

async function createAdvancedReviewTables() {
  console.log('🔧 Creating advanced review system tables...');

  try {
    const db = await initializeDatabase();

    // Enhanced reviews table (if not exists or needs updates)
    await db.run(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        product_id INTEGER NOT NULL,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        title VARCHAR(200),
        comment TEXT NOT NULL,
        verified_purchase BOOLEAN DEFAULT 0,
        status VARCHAR(20) DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
        helpful_count INTEGER DEFAULT 0,
        not_helpful_count INTEGER DEFAULT 0,
        report_count INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      )
    `);

    // Review helpful votes table
    await db.run(`
      CREATE TABLE IF NOT EXISTS review_helpful_votes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        review_id INTEGER NOT NULL,
        helpful BOOLEAN NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE,
        UNIQUE(user_id, review_id)
      )
    `);

    // Review reports table
    await db.run(`
      CREATE TABLE IF NOT EXISTS review_reports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        review_id INTEGER NOT NULL,
        reason TEXT,
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE,
        UNIQUE(user_id, review_id)
      )
    `);

    // Add review-related columns to products table if they don't exist
    try {
      await db.run(`ALTER TABLE products ADD COLUMN rating DECIMAL(3,2) DEFAULT 0.0`);
    } catch (error) {
      // Column might already exist
    }

    try {
      await db.run(`ALTER TABLE products ADD COLUMN review_count INTEGER DEFAULT 0`);
    } catch (error) {
      // Column might already exist
    }

    // Create indexes for better performance
    await db.run(`CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id)`);
    await db.run(`CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id)`);
    await db.run(`CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating)`);
    await db.run(`CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status)`);
    await db.run(`CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at)`);
    await db.run(`CREATE INDEX IF NOT EXISTS idx_review_helpful_votes_review_id ON review_helpful_votes(review_id)`);
    await db.run(`CREATE INDEX IF NOT EXISTS idx_review_reports_review_id ON review_reports(review_id)`);

    console.log('✅ Advanced review system tables created successfully');

    // Update existing reviews if needed
    await updateExistingReviews(db);

    console.log('✅ Review system migration completed');

  } catch (error) {
    console.error('❌ Error creating advanced review tables:', error);
    throw error;
  }
}

async function updateExistingReviews(db) {
  try {
    // Check if we need to migrate existing reviews
    const existingReviews = await db.all('SELECT COUNT(*) as count FROM reviews');

    if (existingReviews[0].count > 0) {
      console.log('🔄 Updating existing reviews...');

      // Update existing reviews to have proper structure
      await db.run(`
        UPDATE reviews
        SET
          status = COALESCE(status, 'approved'),
          helpful_count = COALESCE(helpful_count, 0),
          not_helpful_count = COALESCE(not_helpful_count, 0),
          report_count = COALESCE(report_count, 0),
          updated_at = CURRENT_TIMESTAMP
        WHERE status IS NULL OR helpful_count IS NULL
      `);

      // Update product ratings based on existing reviews
      await db.run(`
        UPDATE products
        SET
          rating = (
            SELECT AVG(rating)
            FROM reviews
            WHERE reviews.product_id = products.id AND reviews.status = 'approved'
          ),
          review_count = (
            SELECT COUNT(*)
            FROM reviews
            WHERE reviews.product_id = products.id AND reviews.status = 'approved'
          )
      `);

      console.log('✅ Existing reviews updated');
    }
  } catch (error) {
    console.error('⚠️ Warning: Could not update existing reviews:', error);
  }
}

// Gift Cards System Tables
async function createGiftCardTables() {
  console.log('🎁 Creating gift cards system tables...');

  try {
    const db = await initializeDatabase();

    // Gift cards table
    await db.run(`
      CREATE TABLE IF NOT EXISTS gift_cards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code VARCHAR(50) UNIQUE NOT NULL,
        initial_amount DECIMAL(10,2) NOT NULL,
        current_balance DECIMAL(10,2) NOT NULL,
        currency VARCHAR(3) DEFAULT 'MAD',
        status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'redeemed', 'expired', 'cancelled')),
        purchased_by INTEGER,
        recipient_email VARCHAR(255),
        recipient_name VARCHAR(255),
        message TEXT,
        expires_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (purchased_by) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    // Gift card transactions table
    await db.run(`
      CREATE TABLE IF NOT EXISTS gift_card_transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        gift_card_id INTEGER NOT NULL,
        order_id INTEGER,
        transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('purchase', 'redemption', 'refund')),
        amount DECIMAL(10,2) NOT NULL,
        balance_after DECIMAL(10,2) NOT NULL,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (gift_card_id) REFERENCES gift_cards(id) ON DELETE CASCADE,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
      )
    `);

    // Create indexes
    await db.run(`CREATE INDEX IF NOT EXISTS idx_gift_cards_code ON gift_cards(code)`);
    await db.run(`CREATE INDEX IF NOT EXISTS idx_gift_cards_status ON gift_cards(status)`);
    await db.run(`CREATE INDEX IF NOT EXISTS idx_gift_cards_purchased_by ON gift_cards(purchased_by)`);
    await db.run(`CREATE INDEX IF NOT EXISTS idx_gift_card_transactions_gift_card_id ON gift_card_transactions(gift_card_id)`);

    console.log('✅ Gift cards system tables created successfully');

  } catch (error) {
    console.error('❌ Error creating gift card tables:', error);
    throw error;
  }
}

// Loyalty Program Tables
async function createLoyaltyProgramTables() {
  console.log('🏆 Creating loyalty program tables...');

  try {
    const db = await initializeDatabase();

    // User loyalty points table
    await db.run(`
      CREATE TABLE IF NOT EXISTS user_loyalty_points (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        total_points INTEGER DEFAULT 0,
        available_points INTEGER DEFAULT 0,
        tier VARCHAR(20) DEFAULT 'bronze' CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum')),
        tier_expires_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE(user_id)
      )
    `);

    // Points transactions table
    await db.run(`
      CREATE TABLE IF NOT EXISTS loyalty_point_transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        order_id INTEGER,
        transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('earned', 'redeemed', 'expired', 'bonus')),
        points INTEGER NOT NULL,
        description TEXT,
        expires_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
      )
    `);

    // Loyalty rewards catalog
    await db.run(`
      CREATE TABLE IF NOT EXISTS loyalty_rewards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        points_required INTEGER NOT NULL,
        reward_type VARCHAR(20) NOT NULL CHECK (reward_type IN ('discount', 'product', 'free_shipping', 'gift_card')),
        reward_value DECIMAL(10,2),
        max_redemptions INTEGER,
        current_redemptions INTEGER DEFAULT 0,
        status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'expired')),
        valid_from DATETIME,
        valid_until DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // User reward redemptions
    await db.run(`
      CREATE TABLE IF NOT EXISTS loyalty_reward_redemptions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        reward_id INTEGER NOT NULL,
        order_id INTEGER,
        points_used INTEGER NOT NULL,
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'used', 'expired')),
        expires_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (reward_id) REFERENCES loyalty_rewards(id) ON DELETE CASCADE,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
      )
    `);

    // Create indexes
    await db.run(`CREATE INDEX IF NOT EXISTS idx_user_loyalty_points_user_id ON user_loyalty_points(user_id)`);
    await db.run(`CREATE INDEX IF NOT EXISTS idx_loyalty_point_transactions_user_id ON loyalty_point_transactions(user_id)`);
    await db.run(`CREATE INDEX IF NOT EXISTS idx_loyalty_rewards_status ON loyalty_rewards(status)`);
    await db.run(`CREATE INDEX IF NOT EXISTS idx_loyalty_reward_redemptions_user_id ON loyalty_reward_redemptions(user_id)`);

    console.log('✅ Loyalty program tables created successfully');

  } catch (error) {
    console.error('❌ Error creating loyalty program tables:', error);
    throw error;
  }
}

// Product bundles and packages
async function createProductBundleTables() {
  console.log('📦 Creating product bundle tables...');

  try {
    const db = await initializeDatabase();

    // Product bundles table
    await db.run(`
      CREATE TABLE IF NOT EXISTS product_bundles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        bundle_type VARCHAR(20) DEFAULT 'fixed' CHECK (bundle_type IN ('fixed', 'mix_match')),
        discount_type VARCHAR(20) DEFAULT 'percentage' CHECK (discount_type IN ('percentage', 'fixed_amount')),
        discount_value DECIMAL(10,2) NOT NULL,
        min_items INTEGER DEFAULT 1,
        max_items INTEGER,
        status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
        valid_from DATETIME,
        valid_until DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Bundle products relationship
    await db.run(`
      CREATE TABLE IF NOT EXISTS bundle_products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        bundle_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER DEFAULT 1,
        is_required BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (bundle_id) REFERENCES product_bundles(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        UNIQUE(bundle_id, product_id)
      )
    `);

    // Create indexes
    await db.run(`CREATE INDEX IF NOT EXISTS idx_product_bundles_status ON product_bundles(status)`);
    await db.run(`CREATE INDEX IF NOT EXISTS idx_bundle_products_bundle_id ON bundle_products(bundle_id)`);
    await db.run(`CREATE INDEX IF NOT EXISTS idx_bundle_products_product_id ON bundle_products(product_id)`);

    console.log('✅ Product bundle tables created successfully');

  } catch (error) {
    console.error('❌ Error creating product bundle tables:', error);
    throw error;
  }
}

// Advanced analytics tables
async function createAnalyticsTables() {
  console.log('📊 Creating analytics tables...');

  try {
    const db = await initializeDatabase();

    // User behavior tracking
    await db.run(`
      CREATE TABLE IF NOT EXISTS user_behavior_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        session_id VARCHAR(255),
        event_type VARCHAR(50) NOT NULL,
        event_data TEXT, -- JSON data
        page_url VARCHAR(500),
        user_agent TEXT,
        ip_address VARCHAR(45),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    // Product view tracking
    await db.run(`
      CREATE TABLE IF NOT EXISTS product_views (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER NOT NULL,
        user_id INTEGER,
        session_id VARCHAR(255),
        view_duration INTEGER, -- seconds
        came_from VARCHAR(255), -- referrer
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    // Search queries tracking
    await db.run(`
      CREATE TABLE IF NOT EXISTS search_queries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        session_id VARCHAR(255),
        query TEXT NOT NULL,
        results_count INTEGER DEFAULT 0,
        clicked_product_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
        FOREIGN KEY (clicked_product_id) REFERENCES products(id) ON DELETE SET NULL
      )
    `);

    // Create indexes for analytics
    await db.run(`CREATE INDEX IF NOT EXISTS idx_user_behavior_events_user_id ON user_behavior_events(user_id)`);
    await db.run(`CREATE INDEX IF NOT EXISTS idx_user_behavior_events_event_type ON user_behavior_events(event_type)`);
    await db.run(`CREATE INDEX IF NOT EXISTS idx_user_behavior_events_created_at ON user_behavior_events(created_at)`);
    await db.run(`CREATE INDEX IF NOT EXISTS idx_product_views_product_id ON product_views(product_id)`);
    await db.run(`CREATE INDEX IF NOT EXISTS idx_product_views_created_at ON product_views(created_at)`);
    await db.run(`CREATE INDEX IF NOT EXISTS idx_search_queries_query ON search_queries(query)`);
    await db.run(`CREATE INDEX IF NOT EXISTS idx_search_queries_created_at ON search_queries(created_at)`);

    console.log('✅ Analytics tables created successfully');

  } catch (error) {
    console.error('❌ Error creating analytics tables:', error);
    throw error;
  }
}

// Main migration function
async function runAdvancedFeaturesMigration() {
  console.log('🚀 Starting advanced features migration...');

  try {
    await createAdvancedReviewTables();
    await createGiftCardTables();
    await createLoyaltyProgramTables();
    await createProductBundleTables();
    await createAnalyticsTables();

    console.log('🎉 All advanced features migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration if called directly
if (require.main === module) {
  runAdvancedFeaturesMigration();
}

module.exports = {
  createAdvancedReviewTables,
  createGiftCardTables,
  createLoyaltyProgramTables,
  createProductBundleTables,
  createAnalyticsTables,
  runAdvancedFeaturesMigration
};
