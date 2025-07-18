const { pool } = require('../config/db');
const crypto = require('crypto');
const { sendVerificationEmail } = require('../services/emailService');

class EmailVerificationController {
  // Generate verification token
  static generateVerificationToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  // Send verification email
  static async sendVerificationEmail(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email is required'
        });
      }

      // Check if user exists
      const [users] = await pool.promise().execute(
        'SELECT id, email, email_verified FROM users WHERE email = ?',
        [email]
      );

      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const user = users[0];

      if (user.email_verified) {
        return res.status(400).json({
          success: false,
          message: 'Email is already verified'
        });
      }

      // Generate verification token
      const token = EmailVerificationController.generateVerificationToken();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Store verification token
      await pool.promise().execute(
        `INSERT INTO email_verification_tokens (user_id, token, expires_at)
         VALUES (?, ?, ?)
         ON CONFLICT(user_id) DO UPDATE SET token = ?, expires_at = ?`,
        [user.id, token, expiresAt, token, expiresAt]
      );

      // Send verification email
      try {
        await sendVerificationEmail(email, token);

        res.json({
          success: true,
          message: 'Verification email sent successfully'
        });
      } catch (emailError) {
        console.error('Error sending verification email:', emailError);
        res.status(500).json({
          success: false,
          message: 'Error sending verification email'
        });
      }

    } catch (error) {
      console.error('Error sending verification email:', error);
      res.status(500).json({
        success: false,
        message: 'Error sending verification email'
      });
    }
  }

  // Verify email with token
  static async verifyEmail(req, res) {
    try {
      const { token } = req.params;

      if (!token) {
        return res.status(400).json({
          success: false,
          message: 'Verification token is required'
        });
      }

      // Find verification token
      const [tokens] = await pool.promise().execute(
        `SELECT vt.*, u.email
         FROM email_verification_tokens vt
         JOIN users u ON vt.user_id = u.id
         WHERE vt.token = ? AND vt.expires_at > CURRENT_TIMESTAMP`,
        [token]
      );

      if (tokens.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired verification token'
        });
      }

      const verificationData = tokens[0];

      // Update user as verified
      await pool.promise().execute(
        'UPDATE users SET email_verified = 1, email_verified_at = CURRENT_TIMESTAMP WHERE id = ?',
        [verificationData.user_id]
      );

      // Delete verification token
      await pool.promise().execute(
        'DELETE FROM email_verification_tokens WHERE user_id = ?',
        [verificationData.user_id]
      );

      res.json({
        success: true,
        message: 'Email verified successfully',
        data: {
          email: verificationData.email
        }
      });

    } catch (error) {
      console.error('Error verifying email:', error);
      res.status(500).json({
        success: false,
        message: 'Error verifying email'
      });
    }
  }

  // Check verification status
  static async checkVerificationStatus(req, res) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      // Get user verification status
      const [users] = await pool.promise().execute(
        'SELECT email_verified, email_verified_at FROM users WHERE id = ?',
        [req.user.id]
      );

      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const user = users[0];

      res.json({
        success: true,
        data: {
          isVerified: user.email_verified === 1,
          verifiedAt: user.email_verified_at
        }
      });

    } catch (error) {
      console.error('Error checking verification status:', error);
      res.status(500).json({
        success: false,
        message: 'Error checking verification status'
      });
    }
  }

  // Resend verification email (for authenticated users)
  static async resendVerificationEmail(req, res) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      // Get user data
      const [users] = await pool.promise().execute(
        'SELECT email, email_verified FROM users WHERE id = ?',
        [req.user.id]
      );

      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const user = users[0];

      if (user.email_verified) {
        return res.status(400).json({
          success: false,
          message: 'Email is already verified'
        });
      }

      // Check if there's a recent verification email sent (rate limiting)
      const [recentTokens] = await pool.promise().execute(
        'SELECT created_at FROM email_verification_tokens WHERE user_id = ? AND created_at > datetime("now", "-5 minutes")',
        [req.user.id]
      );

      if (recentTokens.length > 0) {
        return res.status(429).json({
          success: false,
          message: 'Please wait before requesting another verification email'
        });
      }

      // Generate new verification token
      const token = EmailVerificationController.generateVerificationToken();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Store verification token
      await pool.promise().execute(
        `INSERT INTO email_verification_tokens (user_id, token, expires_at)
         VALUES (?, ?, ?)
         ON CONFLICT(user_id) DO UPDATE SET token = ?, expires_at = ?, created_at = CURRENT_TIMESTAMP`,
        [req.user.id, token, expiresAt, token, expiresAt]
      );

      // Send verification email
      try {
        await sendVerificationEmail(user.email, token);

        res.json({
          success: true,
          message: 'Verification email sent successfully'
        });
      } catch (emailError) {
        console.error('Error sending verification email:', emailError);
        res.status(500).json({
          success: false,
          message: 'Error sending verification email'
        });
      }

    } catch (error) {
      console.error('Error resending verification email:', error);
      res.status(500).json({
        success: false,
        message: 'Error resending verification email'
      });
    }
  }

  // Admin: Get all unverified users
  static async getUnverifiedUsers(req, res) {
    try {
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Admin access required'
        });
      }

      const [users] = await pool.promise().execute(`
        SELECT id, name, email, created_at,
               CASE WHEN vt.token IS NOT NULL THEN 1 ELSE 0 END as has_pending_verification
        FROM users u
        LEFT JOIN email_verification_tokens vt ON u.id = vt.user_id
        WHERE u.email_verified = 0
        ORDER BY u.created_at DESC
      `);

      res.json({
        success: true,
        data: users
      });

    } catch (error) {
      console.error('Error getting unverified users:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting unverified users'
      });
    }
  }

  // Admin: Manually verify a user
  static async manuallyVerifyUser(req, res) {
    try {
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Admin access required'
        });
      }

      const { userId } = req.params;

      // Check if user exists
      const [users] = await pool.promise().execute(
        'SELECT email, email_verified FROM users WHERE id = ?',
        [userId]
      );

      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const user = users[0];

      if (user.email_verified) {
        return res.status(400).json({
          success: false,
          message: 'User is already verified'
        });
      }

      // Verify the user
      await pool.promise().execute(
        'UPDATE users SET email_verified = 1, email_verified_at = CURRENT_TIMESTAMP WHERE id = ?',
        [userId]
      );

      // Delete any pending verification tokens
      await pool.promise().execute(
        'DELETE FROM email_verification_tokens WHERE user_id = ?',
        [userId]
      );

      res.json({
        success: true,
        message: 'User verified successfully',
        data: {
          email: user.email
        }
      });

    } catch (error) {
      console.error('Error manually verifying user:', error);
      res.status(500).json({
        success: false,
        message: 'Error manually verifying user'
      });
    }
  }
}

module.exports = EmailVerificationController;
