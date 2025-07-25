const express = require('express');
const router = express.Router();
const SettingsController = require('../controllers/settingsController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

// Public routes (for public settings)
router.get('/public', SettingsController.getSettings);
router.get('/public/:key', SettingsController.getSetting);

// Protected admin routes
router.use(verifyToken);

// Get all settings (admin gets all, users get public only)
router.get('/', SettingsController.getSettings);

// Get specific setting
router.get('/:key', SettingsController.getSetting);

// Admin only routes
router.use(verifyAdmin);

// Update single setting
router.put('/:key', SettingsController.updateSetting);

// Update multiple settings
router.put('/', SettingsController.updateMultipleSettings);

// Create new setting
router.post('/', SettingsController.createSetting);

// Delete setting
router.delete('/:key', SettingsController.deleteSetting);

module.exports = router;
