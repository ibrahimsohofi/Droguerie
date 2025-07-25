const { pool } = require('../config/db');

class SettingsController {
  // Get all settings (admin only gets all, public gets only public settings)
  static async getSettings(req, res) {
    try {
      const isAdmin = req.user && req.user.role === 'admin';

      let query = `
        SELECT setting_key, setting_value, setting_type, category, description, is_public
        FROM site_settings
      `;

      if (!isAdmin) {
        query += ` WHERE is_public = 1`;
      }

      query += ` ORDER BY category, setting_key`;

      const [rows] = await pool.promise().execute(query);

      // Group settings by category
      const settingsByCategory = {};
      rows.forEach(setting => {
        if (!settingsByCategory[setting.category]) {
          settingsByCategory[setting.category] = {};
        }

        let value = setting.setting_value;
        // Convert value based on type
        if (setting.setting_type === 'boolean') {
          value = value === '1' || value === 'true';
        } else if (setting.setting_type === 'number') {
          value = parseFloat(value);
        }

        settingsByCategory[setting.category][setting.setting_key] = {
          value,
          type: setting.setting_type,
          description: setting.description,
          isPublic: setting.is_public === 1
        };
      });

      res.json({
        success: true,
        data: settingsByCategory
      });
    } catch (error) {
      console.error('Error fetching settings:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching settings'
      });
    }
  }

  // Get a specific setting by key
  static async getSetting(req, res) {
    try {
      const { key } = req.params;
      const isAdmin = req.user && req.user.role === 'admin';

      let query = `
        SELECT setting_key, setting_value, setting_type, category, description, is_public
        FROM site_settings
        WHERE setting_key = ?
      `;

      if (!isAdmin) {
        query += ` AND is_public = 1`;
      }

      const [rows] = await pool.promise().execute(query, [key]);

      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Setting not found'
        });
      }

      const setting = rows[0];
      let value = setting.setting_value;

      // Convert value based on type
      if (setting.setting_type === 'boolean') {
        value = value === '1' || value === 'true';
      } else if (setting.setting_type === 'number') {
        value = parseFloat(value);
      }

      res.json({
        success: true,
        data: {
          key: setting.setting_key,
          value,
          type: setting.setting_type,
          category: setting.category,
          description: setting.description,
          isPublic: setting.is_public === 1
        }
      });
    } catch (error) {
      console.error('Error fetching setting:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching setting'
      });
    }
  }

  // Update a setting (admin only)
  static async updateSetting(req, res) {
    try {
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Admin access required'
        });
      }

      const { key } = req.params;
      const { value } = req.body;

      // Check if setting exists
      const [existing] = await pool.promise().execute(
        'SELECT id FROM site_settings WHERE setting_key = ?',
        [key]
      );

      if (existing.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Setting not found'
        });
      }

      // Convert value to string for storage
      let stringValue = value;
      if (typeof value === 'boolean') {
        stringValue = value ? '1' : '0';
      } else if (typeof value === 'number') {
        stringValue = value.toString();
      }

      await pool.promise().execute(
        'UPDATE site_settings SET setting_value = ?, updated_at = CURRENT_TIMESTAMP WHERE setting_key = ?',
        [stringValue, key]
      );

      res.json({
        success: true,
        message: 'Setting updated successfully'
      });
    } catch (error) {
      console.error('Error updating setting:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating setting'
      });
    }
  }

  // Update multiple settings (admin only)
  static async updateMultipleSettings(req, res) {
    try {
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Admin access required'
        });
      }

      const { settings } = req.body;

      if (!settings || typeof settings !== 'object') {
        return res.status(400).json({
          success: false,
          message: 'Settings object is required'
        });
      }

      // Update each setting
      for (const [key, value] of Object.entries(settings)) {
        // Convert value to string for storage
        let stringValue = value;
        if (typeof value === 'boolean') {
          stringValue = value ? '1' : '0';
        } else if (typeof value === 'number') {
          stringValue = value.toString();
        }

        await pool.promise().execute(
          'UPDATE site_settings SET setting_value = ?, updated_at = CURRENT_TIMESTAMP WHERE setting_key = ?',
          [stringValue, key]
        );
      }

      res.json({
        success: true,
        message: 'Settings updated successfully'
      });
    } catch (error) {
      console.error('Error updating settings:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating settings'
      });
    }
  }

  // Create a new setting (admin only)
  static async createSetting(req, res) {
    try {
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Admin access required'
        });
      }

      const { key, value, type = 'string', category = 'general', description = '', isPublic = false } = req.body;

      if (!key || value === undefined) {
        return res.status(400).json({
          success: false,
          message: 'Key and value are required'
        });
      }

      // Convert value to string for storage
      let stringValue = value;
      if (typeof value === 'boolean') {
        stringValue = value ? '1' : '0';
      } else if (typeof value === 'number') {
        stringValue = value.toString();
      }

      await pool.promise().execute(
        `INSERT INTO site_settings (setting_key, setting_value, setting_type, category, description, is_public)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [key, stringValue, type, category, description, isPublic ? 1 : 0]
      );

      res.status(201).json({
        success: true,
        message: 'Setting created successfully'
      });
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return res.status(400).json({
          success: false,
          message: 'Setting key already exists'
        });
      }

      console.error('Error creating setting:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating setting'
      });
    }
  }

  // Delete a setting (admin only)
  static async deleteSetting(req, res) {
    try {
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Admin access required'
        });
      }

      const { key } = req.params;

      const [result] = await pool.promise().execute(
        'DELETE FROM site_settings WHERE setting_key = ?',
        [key]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Setting not found'
        });
      }

      res.json({
        success: true,
        message: 'Setting deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting setting:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting setting'
      });
    }
  }
}

module.exports = SettingsController;
