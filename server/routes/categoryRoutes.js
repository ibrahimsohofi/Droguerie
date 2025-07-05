const express = require('express');
const { body, validationResult } = require('express-validator');
const Category = require('../models/Category');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// Validation rules for categories
const categoryValidation = [
  body('name').trim().isLength({ min: 2, max: 255 }).withMessage('Category name must be between 2 and 255 characters')
];

// Public routes

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.getAll();
    res.json({
      success: true,
      data: categories,
      count: categories.length
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
});

// Get popular categories
router.get('/popular', async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    const categories = await Category.getPopular(parseInt(limit));
    res.json({
      success: true,
      data: categories,
      count: categories.length
    });
  } catch (error) {
    console.error('Error fetching popular categories:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching popular categories',
      error: error.message
    });
  }
});

// Search categories
router.get('/search', async (req, res) => {
  try {
    const { q: searchTerm } = req.query;
    if (!searchTerm || !searchTerm.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Search term is required'
      });
    }

    const categories = await Category.search(searchTerm.trim());
    res.json({
      success: true,
      data: categories,
      count: categories.length,
      search_term: searchTerm
    });
  } catch (error) {
    console.error('Error searching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching categories',
      error: error.message
    });
  }
});

// Get category by ID
router.get('/:id', async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);
    if (isNaN(categoryId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category ID'
      });
    }

    const category = await Category.getById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching category',
      error: error.message
    });
  }
});

// Get category with its products
router.get('/:id/products', async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);
    if (isNaN(categoryId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category ID'
      });
    }

    const category = await Category.getWithProducts(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Error fetching category with products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching category with products',
      error: error.message
    });
  }
});

// Admin routes

// Create new category
router.post('/', protect, adminOnly, categoryValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const category = await Category.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating category',
      error: error.message
    });
  }
});

// Update category
router.put('/:id', protect, adminOnly, categoryValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const categoryId = parseInt(req.params.id);
    if (isNaN(categoryId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category ID'
      });
    }

    const result = await Category.update(categoryId, req.body);
    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Get updated category
    const updatedCategory = await Category.getById(categoryId);

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: updatedCategory
    });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating category',
      error: error.message
    });
  }
});

// Delete category
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);
    if (isNaN(categoryId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category ID'
      });
    }

    const result = await Category.delete(categoryId);
    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting category',
      error: error.message
    });
  }
});

module.exports = router;
