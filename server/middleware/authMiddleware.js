const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const user = await User.verifyToken(token);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }

    req.user = {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      is_admin: Boolean(user.is_admin),
      is_verified: Boolean(user.is_verified)
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid token.'
    });
  }
};

const adminOnly = (req, res, next) => {
  if (!req.user || !req.user.is_admin) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin role required.'
    });
  }
  next();
};

const verifiedOnly = (req, res, next) => {
  if (!req.user || !req.user.is_verified) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Account verification required.'
    });
  }
  next();
};

// Optional auth middleware (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (token) {
      const user = await User.verifyToken(token);
      if (user) {
        req.user = {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          is_admin: Boolean(user.is_admin),
          is_verified: Boolean(user.is_verified)
        };
      }
    }

    next();
  } catch (error) {
    // Don't fail on optional auth
    next();
  }
};

module.exports = {
  protect,
  adminOnly,
  verifiedOnly,
  optionalAuth,
  // Legacy compatibility
  authMiddleware: protect,
  adminMiddleware: adminOnly,
  verifyToken: protect,
  verifyAdmin: adminOnly
};
