const { db } = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class User {
  static async findByEmail(email) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) {
          console.error('Error finding user by email:', err);
          reject(err);
        } else {
          resolve(row || null);
        }
      });
    });
  }

  static async findById(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
        if (err) {
          console.error('Error finding user by ID:', err);
          reject(err);
        } else {
          resolve(row || null);
        }
      });
    });
  }

  static async create(userData) {
    return new Promise(async (resolve, reject) => {
      try {
        const passwordHash = await bcrypt.hash(userData.password, 10);
        const stmt = db.prepare(`
          INSERT INTO users (email, password, first_name, last_name, phone, address, city, is_admin, is_verified, google_id, facebook_id, avatar_url)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        stmt.run([
          userData.email,
          passwordHash,
          userData.first_name || userData.firstName || '',
          userData.last_name || userData.lastName || '',
          userData.phone || null,
          userData.address || null,
          userData.city || null,
          userData.is_admin || 0,
          userData.is_verified || 0,
          userData.google_id || null,
          userData.facebook_id || null,
          userData.avatar_url || null
        ], function(err) {
          if (err) {
            console.error('Error creating user:', err);
            reject(err);
          } else {
            resolve({ id: this.lastID, ...userData });
          }
        });

        stmt.finalize();
      } catch (error) {
        console.error('Error hashing password:', error);
        reject(error);
      }
    });
  }

  static async update(id, userData) {
    return new Promise((resolve, reject) => {
      const fields = [];
      const values = [];

      if (userData.first_name !== undefined) {
        fields.push('first_name = ?');
        values.push(userData.first_name);
      }
      if (userData.last_name !== undefined) {
        fields.push('last_name = ?');
        values.push(userData.last_name);
      }
      if (userData.phone !== undefined) {
        fields.push('phone = ?');
        values.push(userData.phone);
      }
      if (userData.address !== undefined) {
        fields.push('address = ?');
        values.push(userData.address);
      }
      if (userData.city !== undefined) {
        fields.push('city = ?');
        values.push(userData.city);
      }
      if (userData.is_verified !== undefined) {
        fields.push('is_verified = ?');
        values.push(userData.is_verified);
      }

      fields.push('updated_at = CURRENT_TIMESTAMP');
      values.push(id);

      const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;

      db.run(query, values, function(err) {
        if (err) {
          console.error('Error updating user:', err);
          reject(err);
        } else {
          resolve({ id, changes: this.changes });
        }
      });
    });
  }

  static async validatePassword(email, password) {
    try {
      const user = await this.findByEmail(email);
      if (!user) return null;

      const isValid = await bcrypt.compare(password, user.password);
      return isValid ? user : null;
    } catch (error) {
      console.error('Error validating password:', error);
      throw error;
    }
  }

  static async updatePassword(id, newPassword) {
    return new Promise(async (resolve, reject) => {
      try {
        const passwordHash = await bcrypt.hash(newPassword, 10);
        db.run(
          'UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [passwordHash, id],
          function(err) {
            if (err) {
              console.error('Error updating password:', err);
              reject(err);
            } else {
              resolve({ id, changes: this.changes });
            }
          }
        );
      } catch (error) {
        console.error('Error hashing new password:', error);
        reject(error);
      }
    });
  }

  static async setVerificationToken(id, token) {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE users SET verification_token = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [token, id],
        function(err) {
          if (err) {
            console.error('Error setting verification token:', err);
            reject(err);
          } else {
            resolve({ id, changes: this.changes });
          }
        }
      );
    });
  }

  static async setResetToken(id, token, expires) {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE users SET reset_token = ?, reset_token_expires = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [token, expires, id],
        function(err) {
          if (err) {
            console.error('Error setting reset token:', err);
            reject(err);
          } else {
            resolve({ id, changes: this.changes });
          }
        }
      );
    });
  }

  static async findByVerificationToken(token) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE verification_token = ?', [token], (err, row) => {
        if (err) {
          console.error('Error finding user by verification token:', err);
          reject(err);
        } else {
          resolve(row || null);
        }
      });
    });
  }

  static async findByResetToken(token) {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > CURRENT_TIMESTAMP',
        [token],
        (err, row) => {
          if (err) {
            console.error('Error finding user by reset token:', err);
            reject(err);
          } else {
            resolve(row || null);
          }
        }
      );
    });
  }

  static generateToken(userId) {
    return jwt.sign(
      { userId },
      process.env.JWT_SECRET || 'droguerie-jamal-secret-key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
  }

  static async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'droguerie-jamal-secret-key');
      const user = await this.findById(decoded.userId);
      return user;
    } catch (error) {
      console.error('Error verifying token:', error);
      return null;
    }
  }

  static async getAll(limit = 50, offset = 0) {
    return new Promise((resolve, reject) => {
      db.all(
        'SELECT id, email, first_name, last_name, phone, address, city, is_admin, is_verified, created_at FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?',
        [limit, offset],
        (err, rows) => {
          if (err) {
            console.error('Error getting all users:', err);
            reject(err);
          } else {
            resolve(rows || []);
          }
        }
      );
    });
  }

  static async delete(id) {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM users WHERE id = ?', [id], function(err) {
        if (err) {
          console.error('Error deleting user:', err);
          reject(err);
        } else {
          resolve({ id, changes: this.changes });
        }
      });
    });
  }

  static async updateGoogleId(id, googleId) {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE users SET google_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [googleId, id],
        function(err) {
          if (err) {
            console.error('Error updating Google ID:', err);
            reject(err);
          } else {
            resolve({ id, changes: this.changes });
          }
        }
      );
    });
  }

  static async updateFacebookId(id, facebookId) {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE users SET facebook_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [facebookId, id],
        function(err) {
          if (err) {
            console.error('Error updating Facebook ID:', err);
            reject(err);
          } else {
            resolve({ id, changes: this.changes });
          }
        }
      );
    });
  }

  static async updateAvatar(id, avatarUrl) {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE users SET avatar_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [avatarUrl, id],
        function(err) {
          if (err) {
            console.error('Error updating avatar URL:', err);
            reject(err);
          } else {
            resolve({ id, changes: this.changes });
          }
        }
      );
    });
  }
}

module.exports = User;
