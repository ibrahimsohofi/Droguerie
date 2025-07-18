const sqlite3 = require('sqlite3').verbose();
const mysql = require('mysql2');
const path = require('path');
require('dotenv').config();

// SQLite connection
const sqliteDb = new sqlite3.Database(path.join(__dirname, 'database.sqlite'));

// MySQL connection
const mysqlConnection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'droguerie_jamal',
});

// Promisify SQLite operations
const sqliteAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    sqliteDb.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Promisify MySQL operations
const mysqlQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    mysqlConnection.execute(sql, params, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

// Migration functions
const migrateTables = async () => {
  try {
    console.log('🚀 Starting SQLite to MySQL migration...');

    // Categories
    console.log('📁 Migrating categories...');
    const categories = await sqliteAll('SELECT * FROM categories');
    for (const category of categories) {
      await mysqlQuery(
        `INSERT IGNORE INTO categories (id, name, name_ar, name_fr, description, description_ar, description_fr, image_url, is_active, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          category.id,
          category.name,
          category.name_ar,
          category.name_fr,
          category.description,
          category.description_ar,
          category.description_fr,
          category.image_url,
          category.is_active,
          category.created_at,
          category.updated_at
        ]
      );
    }
    console.log(`✅ Migrated ${categories.length} categories`);

    // Products
    console.log('📦 Migrating products...');
    const products = await sqliteAll('SELECT * FROM products');
    for (const product of products) {
      await mysqlQuery(
        `INSERT IGNORE INTO products (id, name, name_ar, name_fr, description, description_ar, description_fr, price, category_id, image_url, stock_quantity, is_active, featured, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          product.id,
          product.name,
          product.name_ar,
          product.name_fr,
          product.description,
          product.description_ar,
          product.description_fr,
          product.price,
          product.category_id,
          product.image_url,
          product.stock_quantity,
          product.is_active,
          product.featured,
          product.created_at,
          product.updated_at
        ]
      );
    }
    console.log(`✅ Migrated ${products.length} products`);

    // Users
    console.log('👥 Migrating users...');
    const users = await sqliteAll('SELECT * FROM users');
    for (const user of users) {
      await mysqlQuery(
        `INSERT IGNORE INTO users (id, name, email, password, phone, address, role, status, email_verified, email_verified_at, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          user.id,
          user.name,
          user.email,
          user.password,
          user.phone,
          user.address,
          user.role,
          user.status,
          user.email_verified,
          user.email_verified_at,
          user.created_at,
          user.updated_at
        ]
      );
    }
    console.log(`✅ Migrated ${users.length} users`);

    // Orders
    console.log('📋 Migrating orders...');
    const orders = await sqliteAll('SELECT * FROM orders');
    for (const order of orders) {
      await mysqlQuery(
        `INSERT IGNORE INTO orders (id, user_id, customer_name, customer_email, customer_phone, shipping_address, shipping_city, shipping_postal_code, payment_method, payment_intent_id, payment_status, total_amount, status, tracking_number, estimated_delivery, delivered_at, notes, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          order.id,
          order.user_id,
          order.customer_name,
          order.customer_email,
          order.customer_phone,
          order.shipping_address,
          order.shipping_city,
          order.shipping_postal_code,
          order.payment_method,
          order.payment_intent_id,
          order.payment_status,
          order.total_amount,
          order.status,
          order.tracking_number,
          order.estimated_delivery,
          order.delivered_at,
          order.notes,
          order.created_at,
          order.updated_at
        ]
      );
    }
    console.log(`✅ Migrated ${orders.length} orders`);

    // Order items
    console.log('📦 Migrating order items...');
    const orderItems = await sqliteAll('SELECT * FROM order_items');
    for (const item of orderItems) {
      await mysqlQuery(
        `INSERT IGNORE INTO order_items (id, order_id, product_id, product_name, quantity, price, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          item.id,
          item.order_id,
          item.product_id,
          item.product_name,
          item.quantity,
          item.price,
          item.created_at
        ]
      );
    }
    console.log(`✅ Migrated ${orderItems.length} order items`);

    // Coupons (if they exist)
    try {
      console.log('🎫 Migrating coupons...');
      const coupons = await sqliteAll('SELECT * FROM coupons');
      for (const coupon of coupons) {
        await mysqlQuery(
          `INSERT IGNORE INTO coupons (id, code, name, description, type, value, minimum_order_amount, maximum_discount_amount, usage_limit, used_count, user_usage_limit, start_date, end_date, is_active, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            coupon.id,
            coupon.code,
            coupon.name,
            coupon.description,
            coupon.type,
            coupon.value,
            coupon.minimum_order_amount,
            coupon.maximum_discount_amount,
            coupon.usage_limit,
            coupon.used_count,
            coupon.user_usage_limit,
            coupon.start_date,
            coupon.end_date,
            coupon.is_active,
            coupon.created_at,
            coupon.updated_at
          ]
        );
      }
      console.log(`✅ Migrated ${coupons.length} coupons`);
    } catch (error) {
      console.log('⚠️  No coupons table found in SQLite database');
    }

    // Wishlist (if it exists)
    try {
      console.log('❤️  Migrating wishlist...');
      const wishlist = await sqliteAll('SELECT * FROM wishlist');
      for (const item of wishlist) {
        await mysqlQuery(
          `INSERT IGNORE INTO wishlist (id, user_id, product_id, created_at)
           VALUES (?, ?, ?, ?)`,
          [item.id, item.user_id, item.product_id, item.created_at]
        );
      }
      console.log(`✅ Migrated ${wishlist.length} wishlist items`);
    } catch (error) {
      console.log('⚠️  No wishlist table found in SQLite database');
    }

    console.log('🎉 Migration completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    sqliteDb.close();
    mysqlConnection.end();
  }
};

// Run migration
migrateTables();
