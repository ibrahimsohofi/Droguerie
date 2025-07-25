const Coupon = require('../models/Coupon');
const { validationResult } = require('express-validator');

const couponController = {
  // Get all coupons (Admin only)
  async getAllCoupons(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 50;
      const offset = parseInt(req.query.offset) || 0;

      const coupons = await Coupon.getAll(limit, offset);

      res.json({
        success: true,
        data: coupons,
        pagination: {
          limit,
          offset,
          hasMore: coupons.length === limit
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching coupons',
        error: error.message
      });
    }
  },

  // Get active coupons (Public)
  async getActiveCoupons(req, res) {
    try {
      const coupons = await Coupon.getActive();

      res.json({
        success: true,
        data: coupons
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching active coupons',
        error: error.message
      });
    }
  },

  // Create new coupon (Admin only)
  async createCoupon(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const coupon = await Coupon.create(req.body);

      res.status(201).json({
        success: true,
        message: 'Coupon created successfully',
        data: coupon
      });
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return res.status(409).json({
          success: false,
          message: 'Coupon code already exists'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error creating coupon',
        error: error.message
      });
    }
  },

  // Update coupon (Admin only)
  async updateCoupon(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const { id } = req.params;
      const coupon = await Coupon.update(id, req.body);

      if (!coupon) {
        return res.status(404).json({
          success: false,
          message: 'Coupon not found'
        });
      }

      res.json({
        success: true,
        message: 'Coupon updated successfully',
        data: coupon
      });
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return res.status(409).json({
          success: false,
          message: 'Coupon code already exists'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error updating coupon',
        error: error.message
      });
    }
  },

  // Delete coupon (Admin only)
  async deleteCoupon(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Coupon.delete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Coupon not found'
        });
      }

      res.json({
        success: true,
        message: 'Coupon deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting coupon',
        error: error.message
      });
    }
  },

  // Validate coupon code
  async validateCoupon(req, res) {
    try {
      const { code } = req.params;
      const { orderAmount } = req.query;
      const userId = req.user?.id;

      if (!orderAmount || isNaN(orderAmount)) {
        return res.status(400).json({
          success: false,
          message: 'Order amount is required'
        });
      }

      const validation = await Coupon.validateCoupon(code, userId, parseFloat(orderAmount));

      if (!validation.valid) {
        return res.status(400).json({
          success: false,
          message: validation.message
        });
      }

      res.json({
        success: true,
        message: 'Coupon is valid',
        data: {
          coupon: {
            id: validation.coupon.id,
            code: validation.coupon.code,
            name: validation.coupon.name,
            description: validation.coupon.description,
            type: validation.coupon.type,
            value: validation.coupon.value
          },
          discountAmount: validation.discountAmount,
          finalAmount: validation.finalAmount,
          originalAmount: parseFloat(orderAmount)
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error validating coupon',
        error: error.message
      });
    }
  },

  // Apply coupon to order (used during checkout)
  async applyCoupon(req, res) {
    try {
      const { couponCode, orderId } = req.body;
      const userId = req.user?.id;

      if (!couponCode || !orderId) {
        return res.status(400).json({
          success: false,
          message: 'Coupon code and order ID are required'
        });
      }

      const coupon = await Coupon.getByCode(couponCode);

      if (!coupon) {
        return res.status(404).json({
          success: false,
          message: 'Coupon not found'
        });
      }

      await Coupon.useCoupon(coupon.id, userId, orderId);

      res.json({
        success: true,
        message: 'Coupon applied successfully',
        data: {
          couponId: coupon.id,
          code: coupon.code,
          orderId
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error applying coupon',
        error: error.message
      });
    }
  },

  // Get coupon statistics (Admin only)
  async getCouponStats(req, res) {
    try {
      const stats = await Coupon.getStats();

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching coupon statistics',
        error: error.message
      });
    }
  },

  // Apply coupon to order (User authenticated)
  async applyCoupon(req, res) {
    try {
      const { code, orderTotal } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      if (!code || !orderTotal) {
        return res.status(400).json({
          success: false,
          message: 'Coupon code and order total are required'
        });
      }

      // Validate coupon
      const coupon = await Coupon.getByCode(code);

      if (!coupon) {
        return res.status(404).json({
          success: false,
          message: 'Invalid coupon code'
        });
      }

      // Check if coupon is active
      if (!coupon.is_active) {
        return res.status(400).json({
          success: false,
          message: 'This coupon is no longer active'
        });
      }

      // Check expiry date
      const now = new Date();
      if (coupon.expires_at && new Date(coupon.expires_at) < now) {
        return res.status(400).json({
          success: false,
          message: 'This coupon has expired'
        });
      }

      // Check usage limits
      if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
        return res.status(400).json({
          success: false,
          message: 'This coupon has reached its usage limit'
        });
      }

      // Check minimum order amount
      if (coupon.minimum_order_amount && orderTotal < coupon.minimum_order_amount) {
        return res.status(400).json({
          success: false,
          message: `Minimum order amount of ${coupon.minimum_order_amount} required for this coupon`
        });
      }

      // Calculate discount
      let discountAmount = 0;
      if (coupon.type === 'percentage') {
        discountAmount = (orderTotal * coupon.value) / 100;
        if (coupon.max_discount_amount && discountAmount > coupon.max_discount_amount) {
          discountAmount = coupon.max_discount_amount;
        }
      } else if (coupon.type === 'fixed') {
        discountAmount = Math.min(coupon.value, orderTotal);
      }

      res.json({
        success: true,
        data: {
          code: coupon.code,
          name: coupon.name,
          type: coupon.type,
          value: coupon.value,
          discount_amount: discountAmount,
          final_total: Math.max(0, orderTotal - discountAmount)
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error applying coupon',
        error: error.message
      });
    }
  },

  // Get user's coupon usage history
  async getUserCouponHistory(req, res) {
    try {
      const userId = req.user?.id;
      const limit = parseInt(req.query.limit) || 20;
      const offset = parseInt(req.query.offset) || 0;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      // Get user's coupon usage history
      const sql = `
        SELECT
          uc.used_at,
          uc.order_id,
          c.code,
          c.name,
          c.description,
          c.type,
          c.value
        FROM user_coupons uc
        JOIN coupons c ON uc.coupon_id = c.id
        WHERE uc.user_id = ?
        ORDER BY uc.used_at DESC
        LIMIT ? OFFSET ?
      `;

      // This would need to be implemented in the Coupon model
      // For now, return empty array
      res.json({
        success: true,
        data: [],
        pagination: {
          limit,
          offset,
          hasMore: false
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching coupon history',
        error: error.message
      });
    }
  }
};

module.exports = couponController;
