const { db } = require('../config/db');

class Product {
  static async getAll(limit = 50, offset = 0, categoryId = null, searchTerm = null) {
    return new Promise((resolve, reject) => {
      let query = `
        SELECT p.*, c.name as category_name, c.name_ar as category_name_ar
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.is_active = 1
      `;
      const params = [];

      if (categoryId) {
        query += ' AND p.category_id = ?';
        params.push(categoryId);
      }

      if (searchTerm) {
        query += ' AND (p.name LIKE ? OR p.description LIKE ? OR p.name_ar LIKE ?)';
        params.push(`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`);
      }

      query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
      params.push(limit, offset);

      db.all(query, params, (err, rows) => {
        if (err) {
          console.error('Error getting all products:', err);
          reject(err);
        } else {
          resolve(rows || []);
        }
      });
    });
  }

  static async getById(id) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT p.*, c.name as category_name, c.name_ar as category_name_ar
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.id = ? AND p.is_active = 1
      `;

      db.get(query, [id], (err, row) => {
        if (err) {
          console.error('Error getting product by ID:', err);
          reject(err);
        } else {
          resolve(row || null);
        }
      });
    });
  }

  static async create(productData) {
    return new Promise((resolve, reject) => {
      const stmt = db.prepare(`
        INSERT INTO products (name, name_ar, name_fr, description, description_ar, description_fr, price, category_id, image_url, stock_quantity, discount_percentage, brand, sku, weight, dimensions)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      stmt.run([
        productData.name,
        productData.name_ar || null,
        productData.name_fr || null,
        productData.description || null,
        productData.description_ar || null,
        productData.description_fr || null,
        productData.price,
        productData.category_id,
        productData.image_url || null,
        productData.stock_quantity || 0,
        productData.discount_percentage || 0,
        productData.brand || null,
        productData.sku || null,
        productData.weight || null,
        productData.dimensions || null
      ], function(err) {
        if (err) {
          console.error('Error creating product:', err);
          reject(err);
        } else {
          resolve({ id: this.lastID, ...productData });
        }
      });

      stmt.finalize();
    });
  }

  static async update(id, productData) {
    return new Promise((resolve, reject) => {
      const fields = [];
      const values = [];

      if (productData.name !== undefined) {
        fields.push('name = ?');
        values.push(productData.name);
      }
      if (productData.name_ar !== undefined) {
        fields.push('name_ar = ?');
        values.push(productData.name_ar);
      }
      if (productData.name_fr !== undefined) {
        fields.push('name_fr = ?');
        values.push(productData.name_fr);
      }
      if (productData.description !== undefined) {
        fields.push('description = ?');
        values.push(productData.description);
      }
      if (productData.description_ar !== undefined) {
        fields.push('description_ar = ?');
        values.push(productData.description_ar);
      }
      if (productData.description_fr !== undefined) {
        fields.push('description_fr = ?');
        values.push(productData.description_fr);
      }
      if (productData.price !== undefined) {
        fields.push('price = ?');
        values.push(productData.price);
      }
      if (productData.category_id !== undefined) {
        fields.push('category_id = ?');
        values.push(productData.category_id);
      }
      if (productData.image_url !== undefined) {
        fields.push('image_url = ?');
        values.push(productData.image_url);
      }
      if (productData.stock_quantity !== undefined) {
        fields.push('stock_quantity = ?');
        values.push(productData.stock_quantity);
      }
      if (productData.discount_percentage !== undefined) {
        fields.push('discount_percentage = ?');
        values.push(productData.discount_percentage);
      }
      if (productData.brand !== undefined) {
        fields.push('brand = ?');
        values.push(productData.brand);
      }
      if (productData.sku !== undefined) {
        fields.push('sku = ?');
        values.push(productData.sku);
      }
      if (productData.weight !== undefined) {
        fields.push('weight = ?');
        values.push(productData.weight);
      }
      if (productData.dimensions !== undefined) {
        fields.push('dimensions = ?');
        values.push(productData.dimensions);
      }
      if (productData.is_active !== undefined) {
        fields.push('is_active = ?');
        values.push(productData.is_active);
      }

      fields.push('updated_at = CURRENT_TIMESTAMP');
      values.push(id);

      const query = `UPDATE products SET ${fields.join(', ')} WHERE id = ?`;

      db.run(query, values, function(err) {
        if (err) {
          console.error('Error updating product:', err);
          reject(err);
        } else {
          resolve({ id, changes: this.changes });
        }
      });
    });
  }

  static async delete(id) {
    return new Promise((resolve, reject) => {
      db.run('UPDATE products SET is_active = 0 WHERE id = ?', [id], function(err) {
        if (err) {
          console.error('Error deleting product:', err);
          reject(err);
        } else {
          resolve({ id, changes: this.changes });
        }
      });
    });
  }

  static async updateStock(id, quantity) {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE products SET stock_quantity = stock_quantity - ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND stock_quantity >= ?',
        [quantity, id, quantity],
        function(err) {
          if (err) {
            console.error('Error updating stock:', err);
            reject(err);
          } else if (this.changes === 0) {
            reject(new Error('Insufficient stock or product not found'));
          } else {
            resolve({ id, changes: this.changes });
          }
        }
      );
    });
  }

  static async getByCategory(categoryId, limit = 50, offset = 0) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT p.*, c.name as category_name, c.name_ar as category_name_ar
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.category_id = ? AND p.is_active = 1
        ORDER BY p.created_at DESC
        LIMIT ? OFFSET ?
      `;

      db.all(query, [categoryId, limit, offset], (err, rows) => {
        if (err) {
          console.error('Error getting products by category:', err);
          reject(err);
        } else {
          resolve(rows || []);
        }
      });
    });
  }

  static async getFeatured(limit = 8) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT p.*, c.name as category_name, c.name_ar as category_name_ar
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.is_active = 1 AND p.discount_percentage > 0
        ORDER BY p.discount_percentage DESC, p.created_at DESC
        LIMIT ?
      `;

      db.all(query, [limit], (err, rows) => {
        if (err) {
          console.error('Error getting featured products:', err);
          reject(err);
        } else {
          resolve(rows || []);
        }
      });
    });
  }

  static async search(searchTerm, limit = 50, offset = 0) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT p.*, c.name as category_name, c.name_ar as category_name_ar
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.is_active = 1 AND (
          p.name LIKE ? OR
          p.description LIKE ? OR
          p.name_ar LIKE ? OR
          p.brand LIKE ?
        )
        ORDER BY p.created_at DESC
        LIMIT ? OFFSET ?
      `;

      const searchPattern = `%${searchTerm}%`;
      db.all(query, [searchPattern, searchPattern, searchPattern, searchPattern, limit, offset], (err, rows) => {
        if (err) {
          console.error('Error searching products:', err);
          reject(err);
        } else {
          resolve(rows || []);
        }
      });
    });
  }

  static async getCount() {
    return new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM products WHERE is_active = 1', [], (err, row) => {
        if (err) {
          console.error('Error getting product count:', err);
          reject(err);
        } else {
          resolve(row ? row.count : 0);
        }
      });
    });
  }
}

module.exports = Product;
