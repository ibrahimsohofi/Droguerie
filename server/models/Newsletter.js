const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../database.sqlite');

class Newsletter {
  static async createTable() {
    return new Promise((resolve, reject) => {
      const db = new sqlite3.Database(dbPath);

      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          language TEXT DEFAULT 'fr',
          source TEXT DEFAULT 'website',
          discount_code TEXT,
          is_active BOOLEAN DEFAULT 1,
          subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          unsubscribed_at DATETIME NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `;

      db.run(createTableSQL, (err) => {
        db.close();
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  static async create(data) {
    return new Promise((resolve, reject) => {
      const db = new sqlite3.Database(dbPath);

      const insertSQL = `
        INSERT INTO newsletter_subscriptions
        (email, language, source, is_active, subscribed_at)
        VALUES (?, ?, ?, ?, ?)
      `;

      const values = [
        data.email,
        data.language || 'fr',
        data.source || 'website',
        data.is_active !== undefined ? data.is_active : 1,
        data.subscribed_at || new Date().toISOString()
      ];

      db.run(insertSQL, values, function(err) {
        if (err) {
          db.close();
          reject(err);
        } else {
          const selectSQL = 'SELECT * FROM newsletter_subscriptions WHERE id = ?';
          db.get(selectSQL, [this.lastID], (err, row) => {
            db.close();
            if (err) {
              reject(err);
            } else {
              resolve(row);
            }
          });
        }
      });
    });
  }

  static async findByEmail(email) {
    return new Promise((resolve, reject) => {
      const db = new sqlite3.Database(dbPath);

      const selectSQL = 'SELECT * FROM newsletter_subscriptions WHERE email = ?';

      db.get(selectSQL, [email], (err, row) => {
        db.close();
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  static async updateDiscountCode(id, discountCode) {
    return new Promise((resolve, reject) => {
      const db = new sqlite3.Database(dbPath);

      const updateSQL = `
        UPDATE newsletter_subscriptions
        SET discount_code = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;

      db.run(updateSQL, [discountCode, id], function(err) {
        db.close();
        if (err) {
          reject(err);
        } else {
          resolve({ changes: this.changes });
        }
      });
    });
  }

  static async unsubscribe(email) {
    return new Promise((resolve, reject) => {
      const db = new sqlite3.Database(dbPath);

      const updateSQL = `
        UPDATE newsletter_subscriptions
        SET is_active = 0, unsubscribed_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
        WHERE email = ? AND is_active = 1
      `;

      db.run(updateSQL, [email], function(err) {
        db.close();
        if (err) {
          reject(err);
        } else {
          resolve({ changes: this.changes });
        }
      });
    });
  }

  static async getStats() {
    return new Promise((resolve, reject) => {
      const db = new sqlite3.Database(dbPath);

      const statsSQL = `
        SELECT
          COUNT(*) as total_subscribers,
          COUNT(CASE WHEN is_active = 1 THEN 1 END) as active_subscribers,
          COUNT(CASE WHEN is_active = 0 THEN 1 END) as unsubscribed_count,
          COUNT(CASE WHEN language = 'fr' THEN 1 END) as french_subscribers,
          COUNT(CASE WHEN language = 'ar' THEN 1 END) as arabic_subscribers,
          COUNT(CASE WHEN language = 'en' THEN 1 END) as english_subscribers,
          COUNT(CASE WHEN DATE(subscribed_at) = DATE('now') THEN 1 END) as today_subscriptions
        FROM newsletter_subscriptions
      `;

      db.get(statsSQL, (err, row) => {
        db.close();
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }
}

// Initialize the table when the module is loaded
Newsletter.createTable().catch(console.error);

module.exports = Newsletter;
