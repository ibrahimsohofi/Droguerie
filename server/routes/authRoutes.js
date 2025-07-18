const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// Validation rules
const registerValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('first_name').trim().isLength({ min: 1, max: 50 }).withMessage('First name is required'),
  body('last_name').trim().isLength({ min: 1, max: 50 }).withMessage('Last name is required')
];

const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

// Register new user
router.post('/register', registerValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { email, password, first_name, last_name, phone, address, city } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create new user
    const userData = {
      email,
      password,
      first_name,
      last_name,
      phone: phone || null,
      address: address || null,
      city: city || null,
      is_admin: 0,
      is_verified: 1 // Auto-verify for now
    };

    const newUser = await User.create(userData);
    const token = User.generateToken(newUser.id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: newUser.id,
          email: newUser.email,
          first_name: newUser.first_name,
          last_name: newUser.last_name,
          is_admin: false,
          is_verified: true
        },
        token
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// Login user
router.post('/login', loginValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Validate user credentials
    const user = await User.validatePassword(email, password);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = User.generateToken(user.id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          phone: user.phone,
          address: user.address,
          city: user.city,
          is_admin: Boolean(user.is_admin),
          is_verified: Boolean(user.is_verified)
        },
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// Verify token
router.get('/verify', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          phone: user.phone,
          address: user.address,
          city: user.city,
          is_admin: Boolean(user.is_admin),
          is_verified: Boolean(user.is_verified)
        }
      }
    });

  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during token verification'
    });
  }
});

// Get current user profile
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          phone: user.phone,
          address: user.address,
          city: user.city,
          is_admin: Boolean(user.is_admin),
          is_verified: Boolean(user.is_verified),
          created_at: user.created_at
        }
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting profile'
    });
  }
});

// Update user profile
router.put('/me', protect, [
  body('first_name').optional().trim().isLength({ min: 1, max: 50 }),
  body('last_name').optional().trim().isLength({ min: 1, max: 50 }),
  body('phone').optional().trim(),
  body('address').optional().trim(),
  body('city').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { first_name, last_name, phone, address, city } = req.body;

    const updateData = {};
    if (first_name !== undefined) updateData.first_name = first_name;
    if (last_name !== undefined) updateData.last_name = last_name;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    if (city !== undefined) updateData.city = city;

    await User.update(req.user.id, updateData);

    const updatedUser = await User.findById(req.user.id);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          first_name: updatedUser.first_name,
          last_name: updatedUser.last_name,
          phone: updatedUser.phone,
          address: updatedUser.address,
          city: updatedUser.city,
          is_admin: Boolean(updatedUser.is_admin),
          is_verified: Boolean(updatedUser.is_verified)
        }
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating profile'
    });
  }
});

// Change password
router.put('/change-password', protect, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const validUser = await User.validatePassword(user.email, currentPassword);
    if (!validUser) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    await User.updatePassword(req.user.id, newPassword);

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error changing password'
    });
  }
});

// Get all users (admin only)
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    const users = await User.getAll(parseInt(limit), parseInt(offset));

    res.json({
      success: true,
      data: {
        users: users.map(user => ({
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          phone: user.phone,
          address: user.address,
          city: user.city,
          is_admin: Boolean(user.is_admin),
          is_verified: Boolean(user.is_verified),
          created_at: user.created_at
        }))
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting users'
    });
  }
});

// Google OAuth Login
router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: 'Google credential is required'
      });
    }

    // Import Google Auth Library here
    const { OAuth2Client } = require('google-auth-library');
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture, given_name, family_name } = payload;

    // Check if user exists with this email
    let user = await User.findByEmail(email);

    if (user) {
      // User exists, update Google ID if not set
      if (!user.google_id) {
        await User.updateGoogleId(user.id, googleId);
        user.google_id = googleId;
      }
    } else {
      // Create new user
      const userData = {
        email,
        first_name: given_name || name?.split(' ')[0] || 'User',
        last_name: family_name || name?.split(' ').slice(1).join(' ') || '',
        password: Math.random().toString(36).slice(-12), // Random password for OAuth users
        is_verified: true, // Google accounts are pre-verified
        google_id: googleId,
        avatar_url: picture
      };

      const userId = await User.create(userData);
      user = await User.findById(userId);
    }

    // Generate JWT token
    const token = User.generateToken(user.id);

    res.json({
      success: true,
      message: 'Google login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          phone: user.phone,
          address: user.address,
          city: user.city,
          is_admin: Boolean(user.is_admin),
          is_verified: Boolean(user.is_verified),
          avatar_url: user.avatar_url
        },
        token
      }
    });

  } catch (error) {
    console.error('Google OAuth error:', error);
    res.status(400).json({
      success: false,
      message: 'Google authentication failed'
    });
  }
});

// Facebook OAuth Login
router.post('/facebook', async (req, res) => {
  try {
    const { accessToken, userID } = req.body;

    if (!accessToken || !userID) {
      return res.status(400).json({
        success: false,
        message: 'Facebook access token and user ID are required'
      });
    }

    const axios = require('axios');

    // Verify Facebook token and get user info
    const fbResponse = await axios.get(`https://graph.facebook.com/me?fields=id,name,email,first_name,last_name,picture&access_token=${accessToken}`);
    const fbUser = fbResponse.data;

    if (fbUser.id !== userID) {
      return res.status(400).json({
        success: false,
        message: 'Facebook token verification failed'
      });
    }

    // Check if user exists with this email
    let user = await User.findByEmail(fbUser.email);

    if (user) {
      // User exists, update Facebook ID if not set
      if (!user.facebook_id) {
        await User.updateFacebookId(user.id, fbUser.id);
        user.facebook_id = fbUser.id;
      }
    } else {
      // Create new user
      const userData = {
        email: fbUser.email,
        first_name: fbUser.first_name || fbUser.name?.split(' ')[0] || 'User',
        last_name: fbUser.last_name || fbUser.name?.split(' ').slice(1).join(' ') || '',
        password: Math.random().toString(36).slice(-12), // Random password for OAuth users
        is_verified: true, // Facebook accounts are pre-verified
        facebook_id: fbUser.id,
        avatar_url: fbUser.picture?.data?.url
      };

      const userId = await User.create(userData);
      user = await User.findById(userId);
    }

    // Generate JWT token
    const token = User.generateToken(user.id);

    res.json({
      success: true,
      message: 'Facebook login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          phone: user.phone,
          address: user.address,
          city: user.city,
          is_admin: Boolean(user.is_admin),
          is_verified: Boolean(user.is_verified),
          avatar_url: user.avatar_url
        },
        token
      }
    });

  } catch (error) {
    console.error('Facebook OAuth error:', error);
    res.status(400).json({
      success: false,
      message: 'Facebook authentication failed'
    });
  }
});

// Logout (client-side token removal)
router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

module.exports = router;
