const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../database.sqlite');

class Coupon {
  constructor() {
    this.db = new sqlite3.Database(dbPath);
    this.createTable();
  }

  createTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS coupons (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        type TEXT CHECK(type IN ('percentage', 'fixed')) DEFAULT 'percentage',
        value DECIMAL(10, 2) NOT NULL,
        minimum_order_amount DECIMAL(10, 2) DEFAULT 0,
        maximum_discount_amount DECIMAL(10, 2) DEFAULT NULL,
        usage_limit INTEGER DEFAULT NULL,
        used_count INTEGER DEFAULT 0,
        user_usage_limit INTEGER DEFAULT 1,
        start_date DATETIME NOT NULL,
        end_date DATETIME NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    return new Promise((resolve, reject) => {
      this.db.run(sql, (err) => {
        if (err) {
          console.error('Error creating coupons table:', err);
          reject(err);
        } else {
          console.log('✅ Coupons table created successfully');
          this.createUserCouponsTable().then(resolve).catch(reject);
        }
      });
    });
  }

  createUserCouponsTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS user_coupons (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        coupon_id INTEGER NOT NULL,
        order_id INTEGER,
        used_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE
      )
    `;

    return new Promise((resolve, reject) => {
      this.db.run(sql, (err) => {
        if (err) {
          console.error('Error creating user_coupons table:', err);
          reject(err);
        } else {
          console.log('✅ User coupons table created successfully');
          resolve();
        }
      });
    });
  }

  // Create a new coupon
  create(couponData) {
    const {
      code,
      name,
      description,
      type,
      value,
      minimum_order_amount,
      maximum_discount_amount,
      usage_limit,
      user_usage_limit,
      start_date,
      end_date,
      is_active
    } = couponData;

    const sql = `
      INSERT INTO coupons (
        code, name, description, type, value, minimum_order_amount,
        maximum_discount_amount, usage_limit, user_usage_limit,
        start_date, end_date, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    return new Promise((resolve, reject) => {
      this.db.run(sql, [
        code.toUpperCase(),
        name,
        description,
        type,
        value,
        minimum_order_amount || 0,
        maximum_discount_amount,
        usage_limit,
        user_usage_limit || 1,
        start_date,
        end_date,
        is_active !== false
      ], function(err) {
        if (err) {
          reject(err);
        } else {
          // Get the created coupon
          const getCouponSql = 'SELECT * FROM coupons WHERE id = ?';
          this.db.get(getCouponSql, [this.lastID], (err, row) => {
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

  // Get all coupons (admin)
  getAll(limit = 50, offset = 0) {
    const sql = `
      SELECT * FROM coupons
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;

    return new Promise((resolve, reject) => {
      this.db.all(sql, [limit, offset], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Get active coupons
  getActive() {
    const sql = `
      SELECT * FROM coupons
      WHERE is_active = true
        AND start_date <= datetime('now')
        AND end_date >= datetime('now')
        AND (usage_limit IS NULL OR used_count < usage_limit)
      ORDER BY created_at DESC
    `;

    return new Promise((resolve, reject) => {
      this.db.all(sql, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Get coupon by code
  getByCode(code) {
    const sql = 'SELECT * FROM coupons WHERE code = ? AND is_active = true';

    return new Promise((resolve, reject) => {
      this.db.get(sql, [code.toUpperCase()], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // Validate coupon for user and order
  async validateCoupon(code, userId, orderAmount) {
    try {
      const coupon = await this.getByCode(code);

      if (!coupon) {
        return { valid: false, message: 'Coupon not found' };
      }

      // Check if coupon is still valid
      const now = new Date();
      const startDate = new Date(coupon.start_date);
      const endDate = new Date(coupon.end_date);

      if (now < startDate) {
        return { valid: false, message: 'Coupon is not yet active' };
      }

      if (now > endDate) {
        return { valid: false, message: 'Coupon has expired' };
      }

      // Check usage limit
      if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
        return { valid: false, message: 'Coupon usage limit reached' };
      }

      // Check minimum order amount
      if (orderAmount < coupon.minimum_order_amount) {
        return {
          valid: false,
          message: `Minimum order amount is ${coupon.minimum_order_amount} MAD`
        };
      }

      // Check user usage limit
      if (userId) {
        const userUsage = await this.getUserCouponUsage(userId, coupon.id);
        if (userUsage >= coupon.user_usage_limit) {
          return { valid: false, message: 'You have already used this coupon' };
        }
      }

      // Calculate discount
      let discountAmount = 0;
      if (coupon.type === 'percentage') {
        discountAmount = (orderAmount * coupon.value) / 100;
        if (coupon.maximum_discount_amount && discountAmount > coupon.maximum_discount_amount) {
          discountAmount = coupon.maximum_discount_amount;
        }
      } else {
        discountAmount = Math.min(coupon.value, orderAmount);
      }

      return {
        valid: true,
        coupon,
        discountAmount,
        finalAmount: orderAmount - discountAmount
      };
    } catch (error) {
      return { valid: false, message: 'Error validating coupon' };
    }
  }

  // Get user coupon usage count
  getUserCouponUsage(userId, couponId) {
    const sql = 'SELECT COUNT(*) as count FROM user_coupons WHERE user_id = ? AND coupon_id = ?';

    return new Promise((resolve, reject) => {
      this.db.get(sql, [userId, couponId], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row.count);
        }
      });
    });
  }

  // Use coupon (record usage)
  async useCoupon(couponId, userId, orderId) {
    const updateCouponSql = 'UPDATE coupons SET used_count = used_count + 1 WHERE id = ?';
    const insertUsageSql = 'INSERT INTO user_coupons (user_id, coupon_id, order_id) VALUES (?, ?, ?)';

    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.run('BEGIN TRANSACTION');

        this.db.run(updateCouponSql, [couponId], (err) => {
          if (err) {
            this.db.run('ROLLBACK');
            reject(err);
            return;
          }

          this.db.run(insertUsageSql, [userId, couponId, orderId], (err) => {
            if (err) {
              this.db.run('ROLLBACK');
              reject(err);
              return;
            }

            this.db.run('COMMIT');
            resolve(true);
          });
        });
      });
    });
  }

  // Update coupon
  update(id, updateData) {
    const fields = [];
    const values = [];

    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(key === 'code' ? updateData[key].toUpperCase() : updateData[key]);
      }
    });

    if (fields.length === 0) {
      return Promise.reject(new Error('No fields to update'));
    }

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const sql = `UPDATE coupons SET ${fields.join(', ')} WHERE id = ?`;

    return new Promise((resolve, reject) => {
      this.db.run(sql, values, function(err) {
        if (err) {
          reject(err);
        } else {
          if (this.changes === 0) {
            resolve(null);
          } else {
            // Get updated coupon
            const getCouponSql = 'SELECT * FROM coupons WHERE id = ?';
            this.db.get(getCouponSql, [id], (err, row) => {
              if (err) {
                reject(err);
              } else {
                resolve(row);
              }
            });
          }
        }
      });
    });
  }

  // Delete coupon
  delete(id) {
    const sql = 'DELETE FROM coupons WHERE id = ?';

    return new Promise((resolve, reject) => {
      this.db.run(sql, [id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes > 0);
        }
      });
    });
  }

  // Get coupon statistics
  getStats() {
    const sql = `
      SELECT
        COUNT(*) as total_coupons,
        COUNT(CASE WHEN is_active = true THEN 1 END) as active_coupons,
        COUNT(CASE WHEN end_date < datetime('now') THEN 1 END) as expired_coupons,
        SUM(used_count) as total_usage
      FROM coupons
    `;

    return new Promise((resolve, reject) => {
      this.db.get(sql, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }
}

module.exports = new Coupon();
