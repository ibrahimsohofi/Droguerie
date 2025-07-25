const { db } = require('../config/db');

const addTrackingFeatures = () => {
  return new Promise((resolve, reject) => {
    console.log('🔄 Running tracking features migration...');

    db.serialize(() => {
      // Add missing fields to orders table
      db.run(`
        ALTER TABLE orders ADD COLUMN tracking_number TEXT
      `, (err) => {
        if (err && !err.message.includes('duplicate column')) {
          console.error('Error adding tracking_number column:', err.message);
        }
      });

      db.run(`
        ALTER TABLE orders ADD COLUMN estimated_delivery DATETIME
      `, (err) => {
        if (err && !err.message.includes('duplicate column')) {
          console.error('Error adding estimated_delivery column:', err.message);
        }
      });

      db.run(`
        ALTER TABLE orders ADD COLUMN delivered_at DATETIME
      `, (err) => {
        if (err && !err.message.includes('duplicate column')) {
          console.error('Error adding delivered_at column:', err.message);
        }
      });

      db.run(`
        ALTER TABLE orders ADD COLUMN customer_name TEXT
      `, (err) => {
        if (err && !err.message.includes('duplicate column')) {
          console.error('Error adding customer_name column:', err.message);
        }
      });

      db.run(`
        ALTER TABLE orders ADD COLUMN customer_email TEXT
      `, (err) => {
        if (err && !err.message.includes('duplicate column')) {
          console.error('Error adding customer_email column:', err.message);
        }
      });

      db.run(`
        ALTER TABLE orders ADD COLUMN customer_phone TEXT
      `, (err) => {
        if (err && !err.message.includes('duplicate column')) {
          console.error('Error adding customer_phone column:', err.message);
        }
      });

      db.run(`
        ALTER TABLE orders ADD COLUMN shipping_city TEXT
      `, (err) => {
        if (err && !err.message.includes('duplicate column')) {
          console.error('Error adding shipping_city column:', err.message);
        }
      });

      db.run(`
        ALTER TABLE orders ADD COLUMN shipping_postal_code TEXT
      `, (err) => {
        if (err && !err.message.includes('duplicate column')) {
          console.error('Error adding shipping_postal_code column:', err.message);
        }
      });

      // Add missing fields to users table
      db.run(`
        ALTER TABLE users ADD COLUMN name TEXT
      `, (err) => {
        if (err && !err.message.includes('duplicate column')) {
          console.error('Error adding name column:', err.message);
        }
      });

      db.run(`
        ALTER TABLE users ADD COLUMN language_preference TEXT DEFAULT 'ar'
      `, (err) => {
        if (err && !err.message.includes('duplicate column')) {
          console.error('Error adding language_preference column:', err.message);
        }
      });

      db.run(`
        ALTER TABLE users ADD COLUMN notification_preferences TEXT DEFAULT '{"email":true,"sms":true,"whatsapp":true}'
      `, (err) => {
        if (err && !err.message.includes('duplicate column')) {
          console.error('Error adding notification_preferences column:', err.message);
        }
      });

      // Add missing fields to order_items table
      db.run(`
        ALTER TABLE order_items ADD COLUMN product_name TEXT
      `, (err) => {
        if (err && !err.message.includes('duplicate column')) {
          console.error('Error adding product_name column:', err.message);
        }
      });

      // Create order tracking history table
      db.run(`
        CREATE TABLE IF NOT EXISTS order_tracking_history (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          order_id INTEGER NOT NULL,
          status TEXT NOT NULL,
          notes TEXT,
          location TEXT,
          tracking_info TEXT,
          created_by INTEGER,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
          FOREIGN KEY (created_by) REFERENCES users(id)
        )
      `);

      // Create notifications log table
      db.run(`
        CREATE TABLE IF NOT EXISTS notification_logs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          order_id INTEGER,
          user_id INTEGER,
          type TEXT NOT NULL CHECK (type IN ('email', 'sms', 'whatsapp')),
          recipient TEXT NOT NULL,
          subject TEXT,
          message TEXT NOT NULL,
          status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
          provider TEXT,
          provider_message_id TEXT,
          error_message TEXT,
          retry_count INTEGER DEFAULT 0,
          sent_at DATETIME,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (order_id) REFERENCES orders(id),
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `);

      // Create inventory tracking table for prescription items
      db.run(`
        CREATE TABLE IF NOT EXISTS prescription_uploads (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          order_id INTEGER,
          user_id INTEGER NOT NULL,
          file_path TEXT NOT NULL,
          file_name TEXT NOT NULL,
          file_type TEXT NOT NULL,
          verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
          verified_by INTEGER,
          verification_notes TEXT,
          uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          verified_at DATETIME,
          FOREIGN KEY (order_id) REFERENCES orders(id),
          FOREIGN KEY (user_id) REFERENCES users(id),
          FOREIGN KEY (verified_by) REFERENCES users(id)
        )
      `);

      // Create user coupons table (if not exists)
      db.run(`
        CREATE TABLE IF NOT EXISTS user_coupons (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          coupon_id INTEGER NOT NULL,
          order_id INTEGER,
          used_at DATETIME,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id),
          FOREIGN KEY (coupon_id) REFERENCES coupons(id),
          FOREIGN KEY (order_id) REFERENCES orders(id),
          UNIQUE(user_id, coupon_id, order_id)
        )
      `);

      // Create indexes for better performance
      db.run(`CREATE INDEX IF NOT EXISTS idx_orders_tracking_number ON orders(tracking_number)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_tracking_history_order_id ON order_tracking_history(order_id)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_notification_logs_order_id ON notification_logs(order_id)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_prescription_uploads_user_id ON prescription_uploads(user_id)`);

      console.log('✅ Tracking features migration completed successfully');
      resolve();
    });
  });
};

// Run migration if called directly
if (require.main === module) {
  const { initializeDatabase } = require('../config/db');

  initializeDatabase()
    .then(() => addTrackingFeatures())
    .then(() => {
      console.log('✅ Migration completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Migration failed:', error);
      process.exit(1);
    });
}

module.exports = { addTrackingFeatures };
