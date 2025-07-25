const { getDatabase } = require('../config/db');
const { validationResult } = require('express-validator');

// Subscribe to newsletter
const subscribe = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { email, language = 'ar', source = 'default' } = req.body;
    const db = getDatabase();

    // Check if email already exists
    const existingSubscriber = await new Promise((resolve, reject) => {
      db.get('SELECT id FROM newsletter WHERE email = ?', [email], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (existingSubscriber) {
      return res.status(400).json({
        success: false,
        message: 'Email already subscribed to newsletter'
      });
    }

    // Add new subscriber
    await new Promise((resolve, reject) => {
      db.run(`
        INSERT INTO newsletter (email, language, source, subscribed_at, is_active)
        VALUES (?, ?, ?, CURRENT_TIMESTAMP, 1)
      `, [email, language, source], function(err) {
        if (err) reject(err);
        else resolve();
      });
    });

    res.json({
      success: true,
      message: 'Successfully subscribed to newsletter',
      data: {
        email,
        discount_code: generateDiscountCode()
      }
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to subscribe to newsletter'
    });
  }
};

// Unsubscribe from newsletter
const unsubscribe = async (req, res) => {
  try {
    const { email, token } = req.body;
    const db = getDatabase();

    await new Promise((resolve, reject) => {
      db.run(`
        UPDATE newsletter
        SET is_active = 0, unsubscribed_at = CURRENT_TIMESTAMP
        WHERE email = ?
      `, [email], function(err) {
        if (err) reject(err);
        else resolve();
      });
    });

    res.json({
      success: true,
      message: 'Successfully unsubscribed from newsletter'
    });

  } catch (error) {
    console.error('Newsletter unsubscribe error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to unsubscribe from newsletter'
    });
  }
};

// Get newsletter statistics (admin only)
const getStats = async (req, res) => {
  try {
    const db = getDatabase();

    const stats = await new Promise((resolve, reject) => {
      db.get(`
        SELECT
          COUNT(*) as total_subscribers,
          COUNT(CASE WHEN is_active = 1 THEN 1 END) as active_subscribers,
          COUNT(CASE WHEN subscribed_at >= date('now', '-30 days') THEN 1 END) as new_this_month
        FROM newsletter
      `, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Newsletter stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch newsletter statistics'
    });
  }
};

// Generate discount code for new subscribers
const generateDiscountCode = () => {
  const prefix = 'WELCOME';
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}${random}`;
};

module.exports = {
  subscribe,
  unsubscribe,
  getStats
};
