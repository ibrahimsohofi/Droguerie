const { pool } = require('../config/db');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const emailService = require('../services/emailService');

class PasswordResetController {
  // Generate password reset token
  static generateResetToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  // Request password reset
  static async requestPasswordReset(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email is required'
        });
      }

      // Check if user exists
      const user = await User.findByEmail(email);
      if (!user) {
        // Don't reveal if email exists or not for security
        return res.json({
          success: true,
          message: 'If the email exists in our system, you will receive a password reset link shortly.'
        });
      }

      // Check for existing recent reset request (rate limiting)
      const [recentTokens] = await pool.promise().execute(
        'SELECT created_at FROM password_reset_tokens WHERE user_id = ? AND created_at > datetime("now", "-15 minutes")',
        [user.id]
      );

      if (recentTokens.length > 0) {
        return res.status(429).json({
          success: false,
          message: 'A password reset email was recently sent. Please wait before requesting another.'
        });
      }

      // Generate reset token
      const token = PasswordResetController.generateResetToken();
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      // Store reset token (replace any existing token for this user)
      await pool.promise().execute(
        `INSERT INTO password_reset_tokens (user_id, token, expires_at)
         VALUES (?, ?, ?)
         ON CONFLICT(user_id) DO UPDATE SET token = ?, expires_at = ?, created_at = CURRENT_TIMESTAMP`,
        [user.id, token, expiresAt, token, expiresAt]
      );

      // Send password reset email
      try {
        await emailService.sendPasswordReset(email, token);

        res.json({
          success: true,
          message: 'If the email exists in our system, you will receive a password reset link shortly.'
        });
      } catch (emailError) {
        console.error('Error sending password reset email:', emailError);

        // Clean up the token if email failed
        await pool.promise().execute(
          'DELETE FROM password_reset_tokens WHERE user_id = ?',
          [user.id]
        );

        res.status(500).json({
          success: false,
          message: 'Error sending password reset email. Please try again.'
        });
      }

    } catch (error) {
      console.error('Error requesting password reset:', error);
      res.status(500).json({
        success: false,
        message: 'Error processing password reset request'
      });
    }
  }

  // Verify reset token (without resetting password)
  static async verifyResetToken(req, res) {
    try {
      const { token } = req.params;

      if (!token) {
        return res.status(400).json({
          success: false,
          message: 'Reset token is required'
        });
      }

      // Find valid reset token
      const [tokens] = await pool.promise().execute(
        `SELECT rt.*, u.email
         FROM password_reset_tokens rt
         JOIN users u ON rt.user_id = u.id
         WHERE rt.token = ? AND rt.expires_at > CURRENT_TIMESTAMP`,
        [token]
      );

      if (tokens.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired reset token'
        });
      }

      const resetData = tokens[0];

      res.json({
        success: true,
        message: 'Reset token is valid',
        data: {
          email: resetData.email,
          expiresAt: resetData.expires_at
        }
      });

    } catch (error) {
      console.error('Error verifying reset token:', error);
      res.status(500).json({
        success: false,
        message: 'Error verifying reset token'
      });
    }
  }

  // Reset password with token
  static async resetPassword(req, res) {
    try {
      const { token } = req.params;
      const { password, confirmPassword } = req.body;

      if (!token) {
        return res.status(400).json({
          success: false,
          message: 'Reset token is required'
        });
      }

      if (!password || !confirmPassword) {
        return res.status(400).json({
          success: false,
          message: 'Password and confirmation are required'
        });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({
          success: false,
          message: 'Passwords do not match'
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 6 characters long'
        });
      }

      // Find valid reset token
      const [tokens] = await pool.promise().execute(
        `SELECT rt.*, u.email
         FROM password_reset_tokens rt
         JOIN users u ON rt.user_id = u.id
         WHERE rt.token = ? AND rt.expires_at > CURRENT_TIMESTAMP`,
        [token]
      );

      if (tokens.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired reset token'
        });
      }

      const resetData = tokens[0];

      // Hash new password
      const passwordHash = await bcrypt.hash(password, 10);

      // Update user password
      await pool.promise().execute(
        'UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [passwordHash, resetData.user_id]
      );

      // Delete used reset token
      await pool.promise().execute(
        'DELETE FROM password_reset_tokens WHERE user_id = ?',
        [resetData.user_id]
      );

      res.json({
        success: true,
        message: 'Password reset successfully',
        data: {
          email: resetData.email
        }
      });

    } catch (error) {
      console.error('Error resetting password:', error);
      res.status(500).json({
        success: false,
        message: 'Error resetting password'
      });
    }
  }

  // Change password (for authenticated users)
  static async changePassword(req, res) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const { currentPassword, newPassword, confirmPassword } = req.body;

      if (!currentPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({
          success: false,
          message: 'Current password, new password, and confirmation are required'
        });
      }

      if (newPassword !== confirmPassword) {
        return res.status(400).json({
          success: false,
          message: 'New passwords do not match'
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'New password must be at least 6 characters long'
        });
      }

      // Get current user data
      const user = await User.getById(req.user.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(currentPassword, user.password);
      if (!isValidPassword) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }

      // Hash new password
      const passwordHash = await bcrypt.hash(newPassword, 10);

      // Update password
      await pool.promise().execute(
        'UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [passwordHash, user.id]
      );

      res.json({
        success: true,
        message: 'Password changed successfully'
      });

    } catch (error) {
      console.error('Error changing password:', error);
      res.status(500).json({
        success: false,
        message: 'Error changing password'
      });
    }
  }

  // Admin: Get all password reset requests
  static async getPasswordResetRequests(req, res) {
    try {
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Admin access required'
        });
      }

      const [requests] = await pool.promise().execute(`
        SELECT rt.id, rt.token, rt.expires_at, rt.created_at,
               u.id as user_id, u.name, u.email
        FROM password_reset_tokens rt
        JOIN users u ON rt.user_id = u.id
        ORDER BY rt.created_at DESC
      `);

      res.json({
        success: true,
        data: requests.map(request => ({
          id: request.id,
          userId: request.user_id,
          userName: request.name,
          userEmail: request.email,
          createdAt: request.created_at,
          expiresAt: request.expires_at,
          isExpired: new Date(request.expires_at) < new Date()
        }))
      });

    } catch (error) {
      console.error('Error getting password reset requests:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting password reset requests'
      });
    }
  }

  // Admin: Revoke password reset token
  static async revokeResetToken(req, res) {
    try {
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Admin access required'
        });
      }

      const { tokenId } = req.params;

      const [result] = await pool.promise().execute(
        'DELETE FROM password_reset_tokens WHERE id = ?',
        [tokenId]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Reset token not found'
        });
      }

      res.json({
        success: true,
        message: 'Reset token revoked successfully'
      });

    } catch (error) {
      console.error('Error revoking reset token:', error);
      res.status(500).json({
        success: false,
        message: 'Error revoking reset token'
      });
    }
  }

  // Admin: Manually reset user password
  static async adminResetUserPassword(req, res) {
    try {
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Admin access required'
        });
      }

      const { userId } = req.params;
      const { newPassword } = req.body;

      if (!newPassword) {
        return res.status(400).json({
          success: false,
          message: 'New password is required'
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 6 characters long'
        });
      }

      // Check if user exists
      const user = await User.getById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Hash new password
      const passwordHash = await bcrypt.hash(newPassword, 10);

      // Update password
      await pool.promise().execute(
        'UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [passwordHash, userId]
      );

      // Delete any existing reset tokens for this user
      await pool.promise().execute(
        'DELETE FROM password_reset_tokens WHERE user_id = ?',
        [userId]
      );

      res.json({
        success: true,
        message: 'User password reset successfully',
        data: {
          userId: user.id,
          email: user.email
        }
      });

    } catch (error) {
      console.error('Error admin resetting user password:', error);
      res.status(500).json({
        success: false,
        message: 'Error resetting user password'
      });
    }
  }

  // Clean expired tokens (utility function)
  static async cleanExpiredTokens(req, res) {
    try {
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Admin access required'
        });
      }

      const [result] = await pool.promise().execute(
        'DELETE FROM password_reset_tokens WHERE expires_at < CURRENT_TIMESTAMP'
      );

      res.json({
        success: true,
        message: `Cleaned ${result.affectedRows} expired tokens`
      });

    } catch (error) {
      console.error('Error cleaning expired tokens:', error);
      res.status(500).json({
        success: false,
        message: 'Error cleaning expired tokens'
      });
    }
  }
}

module.exports = PasswordResetController;
