const { getDatabase } = require('../config/db');
const { validationResult } = require('express-validator');

// Handle contact form submission
const submitContactForm = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { name, email, phone, subject, message } = req.body;
    const db = getDatabase();

    // Store contact message in database
    const contactId = await new Promise((resolve, reject) => {
      db.run(`
        INSERT INTO contact_messages (name, email, phone, subject, message, submitted_at, status)
        VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, 'new')
      `, [name, email, phone || null, subject || null, message], function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      });
    });

    // Here you could also send an email notification to admin
    // For now, we'll just return success

    res.json({
      success: true,
      message: 'Contact form submitted successfully',
      data: {
        id: contactId,
        name,
        email
      }
    });

  } catch (error) {
    console.error('Contact form submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit contact form'
    });
  }
};

// Get all contact messages (admin only)
const getAllContactMessages = async (req, res) => {
  try {
    const db = getDatabase();
    const { page = 1, limit = 20, status } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM contact_messages';
    let params = [];

    if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }

    query += ' ORDER BY submitted_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const messages = await new Promise((resolve, reject) => {
      db.all(query, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM contact_messages';
    let countParams = [];

    if (status) {
      countQuery += ' WHERE status = ?';
      countParams.push(status);
    }

    const totalCount = await new Promise((resolve, reject) => {
      db.get(countQuery, countParams, (err, row) => {
        if (err) reject(err);
        else resolve(row.total);
      });
    });

    res.json({
      success: true,
      data: {
        messages,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalCount,
          pages: Math.ceil(totalCount / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get contact messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact messages'
    });
  }
};

// Update contact message status (admin only)
const updateMessageStatus = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { status } = req.body;

    if (!['new', 'read', 'replied', 'archived'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be new, read, replied, or archived'
      });
    }

    const db = getDatabase();

    await new Promise((resolve, reject) => {
      db.run(`
        UPDATE contact_messages
        SET status = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [status, messageId], function(err) {
        if (err) reject(err);
        else resolve();
      });
    });

    res.json({
      success: true,
      message: 'Message status updated successfully'
    });

  } catch (error) {
    console.error('Update message status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update message status'
    });
  }
};

// Get contact statistics (admin only)
const getContactStats = async (req, res) => {
  try {
    const db = getDatabase();

    const stats = await new Promise((resolve, reject) => {
      db.get(`
        SELECT
          COUNT(*) as total_messages,
          COUNT(CASE WHEN status = 'new' THEN 1 END) as new_messages,
          COUNT(CASE WHEN status = 'read' THEN 1 END) as read_messages,
          COUNT(CASE WHEN status = 'replied' THEN 1 END) as replied_messages,
          COUNT(CASE WHEN submitted_at >= date('now', '-7 days') THEN 1 END) as this_week
        FROM contact_messages
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
    console.error('Contact stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact statistics'
    });
  }
};

module.exports = {
  submitContactForm,
  getAllContactMessages,
  updateMessageStatus,
  getContactStats
};
