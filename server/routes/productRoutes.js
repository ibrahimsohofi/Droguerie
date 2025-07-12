const express = require('express');
const { body } = require('express-validator');
const productController = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// Validation rules for products
const productValidation = [
  body('name').trim().isLength({ min: 2, max: 255 }).withMessage('Product name must be between 2 and 255 characters'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category_id').isInt({ min: 1 }).withMessage('Valid category ID is required'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  body('featured').optional().isBoolean().withMessage('Featured must be true or false')
];

// Public routes
router.get('/', productController.getAllProducts);
router.get('/search/advanced', productController.searchProducts);
router.get('/:id', productController.getProductById);

// Admin routes (require authentication)
router.post('/',
  protect,
  adminOnly,
  upload.single('image'),
  productValidation,
  productController.createProduct
);

router.put('/:id',
  protect,
  adminOnly,
  upload.single('image'),
  productValidation,
  productController.updateProduct
);

router.delete('/:id',
  protect,
  adminOnly,
  productController.deleteProduct
);

// Image upload endpoint
router.post('/upload-image',
  protect,
  adminOnly,
  upload.single('image'),
  productController.uploadImage
);

// Featured products endpoint
router.get('/featured', productController.getFeaturedProducts);

// Update stock endpoint
router.put('/:id/stock',
  protect,
  adminOnly,
  productController.updateStock
);

module.exports = router;
