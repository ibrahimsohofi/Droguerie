const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Inventory {
  constructor() {
    this.db = null;
  }

  async initializeDatabase() {
    const dbPath = process.env.DATABASE_URL || path.join(__dirname, '../database.sqlite');
    this.db = new sqlite3.Database(dbPath);

    await this.createTables();
  }

  createTables() {
    return new Promise((resolve, reject) => {
      const queries = [
        // Enhanced inventory tracking
        `CREATE TABLE IF NOT EXISTS inventory_transactions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          product_id INTEGER NOT NULL,
          transaction_type TEXT NOT NULL CHECK (transaction_type IN ('PURCHASE', 'SALE', 'ADJUSTMENT', 'RETURN', 'TRANSFER')),
          quantity_change INTEGER NOT NULL,
          previous_quantity INTEGER NOT NULL,
          new_quantity INTEGER NOT NULL,
          unit_cost DECIMAL(10, 2),
          supplier_id INTEGER,
          reason TEXT,
          created_by INTEGER,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (product_id) REFERENCES products (id),
          FOREIGN KEY (supplier_id) REFERENCES suppliers (id),
          FOREIGN KEY (created_by) REFERENCES users (id)
        )`,

        // Suppliers management
        `CREATE TABLE IF NOT EXISTS suppliers (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          contact_person TEXT,
          email TEXT,
          phone TEXT,
          address TEXT,
          city TEXT DEFAULT 'Casablanca',
          country TEXT DEFAULT 'Morocco',
          payment_terms INTEGER DEFAULT 30,
          is_active BOOLEAN DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,

        // Purchase orders
        `CREATE TABLE IF NOT EXISTS purchase_orders (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          supplier_id INTEGER NOT NULL,
          order_number TEXT UNIQUE NOT NULL,
          status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CONFIRMED', 'SHIPPED', 'RECEIVED', 'CANCELLED')),
          order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
          expected_delivery_date DATETIME,
          total_amount DECIMAL(12, 2),
          notes TEXT,
          created_by INTEGER,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (supplier_id) REFERENCES suppliers (id),
          FOREIGN KEY (created_by) REFERENCES users (id)
        )`,

        // Purchase order items
        `CREATE TABLE IF NOT EXISTS purchase_order_items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          purchase_order_id INTEGER NOT NULL,
          product_id INTEGER NOT NULL,
          quantity INTEGER NOT NULL,
          unit_cost DECIMAL(10, 2) NOT NULL,
          total_cost DECIMAL(12, 2) NOT NULL,
          received_quantity INTEGER DEFAULT 0,
          FOREIGN KEY (purchase_order_id) REFERENCES purchase_orders (id),
          FOREIGN KEY (product_id) REFERENCES products (id)
        )`,

        // Stock alerts
        `CREATE TABLE IF NOT EXISTS stock_alerts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          product_id INTEGER NOT NULL,
          alert_type TEXT NOT NULL CHECK (alert_type IN ('LOW_STOCK', 'OUT_OF_STOCK', 'OVERSTOCKED', 'EXPIRY_WARNING')),
          threshold_value INTEGER,
          current_value INTEGER,
          is_active BOOLEAN DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          resolved_at DATETIME,
          FOREIGN KEY (product_id) REFERENCES products (id)
        )`,

        // Product locations (for store layout)
        `CREATE TABLE IF NOT EXISTS product_locations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          product_id INTEGER NOT NULL,
          aisle TEXT,
          shelf TEXT,
          position TEXT,
          store_section TEXT,
          notes TEXT,
          FOREIGN KEY (product_id) REFERENCES products (id)
        )`,

        // Inventory audits
        `CREATE TABLE IF NOT EXISTS inventory_audits (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          audit_date DATETIME DEFAULT CURRENT_TIMESTAMP,
          audited_by INTEGER,
          total_products INTEGER,
          discrepancies_found INTEGER,
          total_value_difference DECIMAL(12, 2),
          status TEXT DEFAULT 'IN_PROGRESS' CHECK (status IN ('IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
          notes TEXT,
          FOREIGN KEY (audited_by) REFERENCES users (id)
        )`,

        // Inventory audit items
        `CREATE TABLE IF NOT EXISTS inventory_audit_items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          audit_id INTEGER NOT NULL,
          product_id INTEGER NOT NULL,
          system_quantity INTEGER NOT NULL,
          counted_quantity INTEGER,
          difference INTEGER,
          unit_cost DECIMAL(10, 2),
          value_difference DECIMAL(12, 2),
          notes TEXT,
          FOREIGN KEY (audit_id) REFERENCES inventory_audits (id),
          FOREIGN KEY (product_id) REFERENCES products (id)
        )`
      ];

      let completed = 0;
      queries.forEach((query, index) => {
        this.db.run(query, (err) => {
          if (err) {
            console.error(`Error creating table ${index}:`, err);
            reject(err);
          } else {
            completed++;
            if (completed === queries.length) {
              resolve();
            }
          }
        });
      });
    });
  }

  // Real-time stock tracking
  async updateStock(productId, quantityChange, transactionType, details = {}) {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.run('BEGIN TRANSACTION');

        // Get current stock
        this.db.get(
          'SELECT stock_quantity FROM products WHERE id = ?',
          [productId],
          (err, product) => {
            if (err) {
              this.db.run('ROLLBACK');
              reject(err);
              return;
            }

            if (!product) {
              this.db.run('ROLLBACK');
              reject(new Error('Product not found'));
              return;
            }

            const previousQuantity = product.stock_quantity;
            const newQuantity = previousQuantity + quantityChange;

            // Update product stock
            this.db.run(
              'UPDATE products SET stock_quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
              [newQuantity, productId],
              (err) => {
                if (err) {
                  this.db.run('ROLLBACK');
                  reject(err);
                  return;
                }

                // Record transaction
                this.db.run(
                  `INSERT INTO inventory_transactions
                   (product_id, transaction_type, quantity_change, previous_quantity, new_quantity, unit_cost, supplier_id, reason, created_by)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                  [
                    productId,
                    transactionType,
                    quantityChange,
                    previousQuantity,
                    newQuantity,
                    details.unitCost || null,
                    details.supplierId || null,
                    details.reason || null,
                    details.userId || null
                  ],
                  (err) => {
                    if (err) {
                      this.db.run('ROLLBACK');
                      reject(err);
                    } else {
                      this.db.run('COMMIT');

                      // Check for stock alerts
                      this.checkStockAlerts(productId, newQuantity);

                      resolve({ previousQuantity, newQuantity, quantityChange });
                    }
                  }
                );
              }
            );
          }
        );
      });
    });
  }

  // Check and create stock alerts
  async checkStockAlerts(productId, currentStock) {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT reorder_level, max_stock_level FROM products WHERE id = ?',
        [productId],
        (err, product) => {
          if (err) {
            reject(err);
            return;
          }

          const alerts = [];

          // Low stock alert
          if (product.reorder_level && currentStock <= product.reorder_level) {
            alerts.push({
              type: currentStock === 0 ? 'OUT_OF_STOCK' : 'LOW_STOCK',
              threshold: product.reorder_level,
              current: currentStock
            });
          }

          // Overstock alert
          if (product.max_stock_level && currentStock > product.max_stock_level) {
            alerts.push({
              type: 'OVERSTOCKED',
              threshold: product.max_stock_level,
              current: currentStock
            });
          }

          // Create alerts
          alerts.forEach(alert => {
            this.db.run(
              `INSERT OR REPLACE INTO stock_alerts
               (product_id, alert_type, threshold_value, current_value)
               VALUES (?, ?, ?, ?)`,
              [productId, alert.type, alert.threshold, alert.current]
            );
          });

          resolve(alerts);
        }
      );
    });
  }

  // Get low stock products
  async getLowStockProducts() {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT p.*, sa.alert_type, sa.threshold_value, sa.current_value
         FROM products p
         JOIN stock_alerts sa ON p.id = sa.product_id
         WHERE sa.is_active = 1 AND sa.alert_type IN ('LOW_STOCK', 'OUT_OF_STOCK')
         ORDER BY sa.current_value ASC`,
        [],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  // Get inventory transactions
  async getInventoryTransactions(filters = {}) {
    let query = `
      SELECT it.*, p.name as product_name, s.name as supplier_name, u.name as user_name
      FROM inventory_transactions it
      LEFT JOIN products p ON it.product_id = p.id
      LEFT JOIN suppliers s ON it.supplier_id = s.id
      LEFT JOIN users u ON it.created_by = u.id
      WHERE 1=1
    `;

    const params = [];

    if (filters.productId) {
      query += ' AND it.product_id = ?';
      params.push(filters.productId);
    }

    if (filters.transactionType) {
      query += ' AND it.transaction_type = ?';
      params.push(filters.transactionType);
    }

    if (filters.startDate) {
      query += ' AND DATE(it.created_at) >= ?';
      params.push(filters.startDate);
    }

    if (filters.endDate) {
      query += ' AND DATE(it.created_at) <= ?';
      params.push(filters.endDate);
    }

    query += ' ORDER BY it.created_at DESC';

    if (filters.limit) {
      query += ' LIMIT ?';
      params.push(filters.limit);
    }

    return new Promise((resolve, reject) => {
      this.db.all(query, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  // Create purchase order
  async createPurchaseOrder(supplierId, items, details = {}) {
    return new Promise((resolve, reject) => {
      const orderNumber = `PO${Date.now()}`;
      const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.unitCost), 0);

      this.db.run(
        `INSERT INTO purchase_orders
         (supplier_id, order_number, total_amount, expected_delivery_date, notes, created_by)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          supplierId,
          orderNumber,
          totalAmount,
          details.expectedDeliveryDate || null,
          details.notes || null,
          details.userId || null
        ],
        function(err) {
          if (err) {
            reject(err);
            return;
          }

          const purchaseOrderId = this.lastID;

          // Insert order items
          const itemQueries = items.map(item => {
            return new Promise((itemResolve, itemReject) => {
              this.db.run(
                `INSERT INTO purchase_order_items
                 (purchase_order_id, product_id, quantity, unit_cost, total_cost)
                 VALUES (?, ?, ?, ?, ?)`,
                [
                  purchaseOrderId,
                  item.productId,
                  item.quantity,
                  item.unitCost,
                  item.quantity * item.unitCost
                ],
                (err) => {
                  if (err) itemReject(err);
                  else itemResolve();
                }
              );
            });
          });

          Promise.all(itemQueries)
            .then(() => resolve({ purchaseOrderId, orderNumber, totalAmount }))
            .catch(reject);
        }.bind(this)
      );
    });
  }

  // Get product location in store
  async getProductLocation(productId) {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT * FROM product_locations WHERE product_id = ?',
        [productId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
  }

  // Update product location
  async updateProductLocation(productId, location) {
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT OR REPLACE INTO product_locations
         (product_id, aisle, shelf, position, store_section, notes)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          productId,
          location.aisle || null,
          location.shelf || null,
          location.position || null,
          location.storeSection || null,
          location.notes || null
        ],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  // Get inventory summary
  async getInventorySummary() {
    return new Promise((resolve, reject) => {
      const queries = {
        totalProducts: 'SELECT COUNT(*) as count FROM products WHERE is_active = 1',
        totalValue: 'SELECT SUM(stock_quantity * price) as value FROM products WHERE is_active = 1',
        lowStockItems: 'SELECT COUNT(*) as count FROM stock_alerts WHERE is_active = 1 AND alert_type = "LOW_STOCK"',
        outOfStockItems: 'SELECT COUNT(*) as count FROM stock_alerts WHERE is_active = 1 AND alert_type = "OUT_OF_STOCK"',
        recentTransactions: 'SELECT COUNT(*) as count FROM inventory_transactions WHERE DATE(created_at) = DATE("now")'
      };

      const results = {};
      const queryKeys = Object.keys(queries);
      let completed = 0;

      queryKeys.forEach(key => {
        this.db.get(queries[key], [], (err, row) => {
          if (err) {
            reject(err);
            return;
          }

          results[key] = row.count || row.value || 0;
          completed++;

          if (completed === queryKeys.length) {
            resolve(results);
          }
        });
      });
    });
  }
}

module.exports = Inventory;
