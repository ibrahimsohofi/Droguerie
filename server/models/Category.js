const { db } = require('../config/db');

class Category {
  static async getAll() {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT c.*, COUNT(p.id) as product_count
        FROM categories c
        LEFT JOIN products p ON c.id = p.category_id AND p.is_active = 1
        WHERE c.is_active = 1
        GROUP BY c.id
        ORDER BY c.name ASC
      `;

      db.all(query, [], (err, rows) => {
        if (err) {
          console.error('Error getting all categories:', err);
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
        SELECT c.*, COUNT(p.id) as product_count
        FROM categories c
        LEFT JOIN products p ON c.id = p.category_id AND p.is_active = 1
        WHERE c.id = ? AND c.is_active = 1
        GROUP BY c.id
      `;

      db.get(query, [id], (err, row) => {
        if (err) {
          console.error('Error getting category by ID:', err);
          reject(err);
        } else {
          resolve(row || null);
        }
      });
    });
  }

  static async create(categoryData) {
    return new Promise((resolve, reject) => {
      const stmt = db.prepare(`
        INSERT INTO categories (name, name_ar, name_fr, description, description_ar, description_fr, image_url)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      stmt.run([
        categoryData.name,
        categoryData.name_ar || null,
        categoryData.name_fr || null,
        categoryData.description || null,
        categoryData.description_ar || null,
        categoryData.description_fr || null,
        categoryData.image_url || null
      ], function(err) {
        if (err) {
          console.error('Error creating category:', err);
          reject(err);
        } else {
          resolve({ id: this.lastID, ...categoryData });
        }
      });

      stmt.finalize();
    });
  }

  static async update(id, categoryData) {
    return new Promise((resolve, reject) => {
      const fields = [];
      const values = [];

      if (categoryData.name !== undefined) {
        fields.push('name = ?');
        values.push(categoryData.name);
      }
      if (categoryData.name_ar !== undefined) {
        fields.push('name_ar = ?');
        values.push(categoryData.name_ar);
      }
      if (categoryData.name_fr !== undefined) {
        fields.push('name_fr = ?');
        values.push(categoryData.name_fr);
      }
      if (categoryData.description !== undefined) {
        fields.push('description = ?');
        values.push(categoryData.description);
      }
      if (categoryData.description_ar !== undefined) {
        fields.push('description_ar = ?');
        values.push(categoryData.description_ar);
      }
      if (categoryData.description_fr !== undefined) {
        fields.push('description_fr = ?');
        values.push(categoryData.description_fr);
      }
      if (categoryData.image_url !== undefined) {
        fields.push('image_url = ?');
        values.push(categoryData.image_url);
      }
      if (categoryData.is_active !== undefined) {
        fields.push('is_active = ?');
        values.push(categoryData.is_active);
      }

      fields.push('updated_at = CURRENT_TIMESTAMP');
      values.push(id);

      const query = `UPDATE categories SET ${fields.join(', ')} WHERE id = ?`;

      db.run(query, values, function(err) {
        if (err) {
          console.error('Error updating category:', err);
          reject(err);
        } else {
          resolve({ id, changes: this.changes });
        }
      });
    });
  }

  static async delete(id) {
    return new Promise((resolve, reject) => {
      db.run('UPDATE categories SET is_active = 0 WHERE id = ?', [id], function(err) {
        if (err) {
          console.error('Error deleting category:', err);
          reject(err);
        } else {
          resolve({ id, changes: this.changes });
        }
      });
    });
  }

  static async getWithProducts(id) {
    return new Promise((resolve, reject) => {
      const categoryQuery = `
        SELECT * FROM categories WHERE id = ? AND is_active = 1
      `;

      db.get(categoryQuery, [id], (err, category) => {
        if (err) {
          console.error('Error getting category:', err);
          reject(err);
          return;
        }

        if (!category) {
          resolve(null);
          return;
        }

        const productsQuery = `
          SELECT * FROM products
          WHERE category_id = ? AND is_active = 1
          ORDER BY created_at DESC
        `;

        db.all(productsQuery, [id], (err, products) => {
          if (err) {
            console.error('Error getting category products:', err);
            reject(err);
          } else {
            resolve({
              ...category,
              products: products || []
            });
          }
        });
      });
    });
  }

  static async getPopular(limit = 5) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT c.*, COUNT(p.id) as product_count
        FROM categories c
        LEFT JOIN products p ON c.id = p.category_id AND p.is_active = 1
        WHERE c.is_active = 1
        GROUP BY c.id
        ORDER BY product_count DESC
        LIMIT ?
      `;

      db.all(query, [limit], (err, rows) => {
        if (err) {
          console.error('Error getting popular categories:', err);
          reject(err);
        } else {
          resolve(rows || []);
        }
      });
    });
  }

  static async search(searchTerm) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT c.*, COUNT(p.id) as product_count
        FROM categories c
        LEFT JOIN products p ON c.id = p.category_id AND p.is_active = 1
        WHERE c.is_active = 1 AND (
          c.name LIKE ? OR
          c.description LIKE ? OR
          c.name_ar LIKE ?
        )
        GROUP BY c.id
        ORDER BY c.name ASC
      `;

      const searchPattern = `%${searchTerm}%`;
      db.all(query, [searchPattern, searchPattern, searchPattern], (err, rows) => {
        if (err) {
          console.error('Error searching categories:', err);
          reject(err);
        } else {
          resolve(rows || []);
        }
      });
    });
  }

  static async getCount() {
    return new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM categories WHERE is_active = 1', [], (err, row) => {
        if (err) {
          console.error('Error getting category count:', err);
          reject(err);
        } else {
          resolve(row ? row.count : 0);
        }
      });
    });
  }
}

module.exports = Category;
