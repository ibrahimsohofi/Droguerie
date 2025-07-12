const Product = require('../models/Product');
const { validationResult } = require('express-validator');
const path = require('path');
const fs = require('fs');

const productController = {
  // Get all products with pagination and filters
  async getAllProducts(req, res) {
    try {
      const {
        category,
        search,
        featured,
        limit = 50,
        offset = 0,
        page = 1
      } = req.query;

      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const offsetNum = (pageNum - 1) * limitNum;

      let products;

      if (search && search.trim()) {
        products = await Product.search(search.trim(), limitNum, offsetNum);
      } else if (category) {
        products = await Product.getByCategory(parseInt(category), limitNum, offsetNum);
      } else if (featured === 'true') {
        products = await Product.getFeatured(limitNum);
      } else {
        products = await Product.getAll(limitNum, offsetNum);
      }

      // Get total count for pagination
      const totalCount = await Product.getCount();

      res.json({
        success: true,
        data: {
          products,
          pagination: {
            page: pageNum,
            limit: limitNum,
            total: totalCount,
            totalPages: Math.ceil(totalCount / limitNum),
            hasNext: offsetNum + products.length < totalCount,
            hasPrev: pageNum > 1
          }
        },
        count: products.length
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching products',
        error: error.message
      });
    }
  },

  // Search products with term
  async searchProducts(req, res) {
    try {
      const {
        q: query,
        category,
        limit = 50,
        offset = 0,
        page = 1
      } = req.query;

      if (!query || !query.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Search query is required'
        });
      }

      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const offsetNum = (pageNum - 1) * limitNum;

      let products;
      if (category) {
        // Search within specific category
        const allCategoryProducts = await Product.getByCategory(parseInt(category));
        products = allCategoryProducts.filter(product =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          (product.name_ar && product.name_ar.includes(query)) ||
          (product.description && product.description.toLowerCase().includes(query.toLowerCase()))
        ).slice(offsetNum, offsetNum + limitNum);
      } else {
        products = await Product.search(query.trim(), limitNum, offsetNum);
      }

      res.json({
        success: true,
        data: {
          products,
          search_term: query,
          category: category || null,
          pagination: {
            page: pageNum,
            limit: limitNum,
            total: products.length,
            hasNext: products.length === limitNum,
            hasPrev: pageNum > 1
          }
        },
        count: products.length
      });
    } catch (error) {
      console.error('Error searching products:', error);
      res.status(500).json({
        success: false,
        message: 'Error searching products',
        error: error.message
      });
    }
  },

  // Get product by ID
  async getProductById(req, res) {
    try {
      const { id } = req.params;
      const product = await Product.getById(parseInt(id));

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      res.json({
        success: true,
        data: product
      });
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching product',
        error: error.message
      });
    }
  },

  // Create new product (admin only)
  async createProduct(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const productData = {
        name: req.body.name,
        name_ar: req.body.name_ar || null,
        name_fr: req.body.name_fr || null,
        description: req.body.description || null,
        description_ar: req.body.description_ar || null,
        description_fr: req.body.description_fr || null,
        price: parseFloat(req.body.price),
        category_id: parseInt(req.body.category_id),
        stock_quantity: parseInt(req.body.stock_quantity || req.body.stock || 0),
        discount_percentage: parseFloat(req.body.discount_percentage || 0),
        brand: req.body.brand || null,
        sku: req.body.sku || null,
        weight: req.body.weight ? parseFloat(req.body.weight) : null,
        dimensions: req.body.dimensions || null,
        image_url: req.file ? `/uploads/products/${req.file.filename}` : null
      };

      const product = await Product.create(productData);

      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: product
      });
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating product',
        error: error.message
      });
    }
  },

  // Update product (admin only)
  async updateProduct(req, res) {
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
      const updateData = {};

      // Only update fields that are provided
      if (req.body.name !== undefined) updateData.name = req.body.name;
      if (req.body.name_ar !== undefined) updateData.name_ar = req.body.name_ar;
      if (req.body.name_fr !== undefined) updateData.name_fr = req.body.name_fr;
      if (req.body.description !== undefined) updateData.description = req.body.description;
      if (req.body.description_ar !== undefined) updateData.description_ar = req.body.description_ar;
      if (req.body.description_fr !== undefined) updateData.description_fr = req.body.description_fr;
      if (req.body.price !== undefined) updateData.price = parseFloat(req.body.price);
      if (req.body.category_id !== undefined) updateData.category_id = parseInt(req.body.category_id);
      if (req.body.stock_quantity !== undefined || req.body.stock !== undefined) {
        updateData.stock_quantity = parseInt(req.body.stock_quantity || req.body.stock);
      }
      if (req.body.discount_percentage !== undefined) updateData.discount_percentage = parseFloat(req.body.discount_percentage);
      if (req.body.brand !== undefined) updateData.brand = req.body.brand;
      if (req.body.sku !== undefined) updateData.sku = req.body.sku;
      if (req.body.weight !== undefined) updateData.weight = req.body.weight ? parseFloat(req.body.weight) : null;
      if (req.body.dimensions !== undefined) updateData.dimensions = req.body.dimensions;
      if (req.body.is_active !== undefined) updateData.is_active = req.body.is_active ? 1 : 0;

      // Handle image upload
      if (req.file) {
        updateData.image_url = `/uploads/products/${req.file.filename}`;
      }

      const result = await Product.update(parseInt(id), updateData);

      if (result.changes === 0) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      // Get updated product
      const updatedProduct = await Product.getById(parseInt(id));

      res.json({
        success: true,
        message: 'Product updated successfully',
        data: updatedProduct
      });
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating product',
        error: error.message
      });
    }
  },

  // Delete product (admin only)
  async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      const result = await Product.delete(parseInt(id));

      if (result.changes === 0) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      res.json({
        success: true,
        message: 'Product deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting product',
        error: error.message
      });
    }
  },

  // Get featured products
  async getFeaturedProducts(req, res) {
    try {
      const { limit = 8 } = req.query;
      const products = await Product.getFeatured(parseInt(limit));

      res.json({
        success: true,
        data: products,
        count: products.length
      });
    } catch (error) {
      console.error('Error fetching featured products:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching featured products',
        error: error.message
      });
    }
  },

  // Update product stock (for inventory management)
  async updateStock(req, res) {
    try {
      const { id } = req.params;
      const { quantity } = req.body;

      if (!quantity || quantity < 0) {
        return res.status(400).json({
          success: false,
          message: 'Valid quantity is required'
        });
      }

      await Product.updateStock(parseInt(id), parseInt(quantity));

      res.json({
        success: true,
        message: 'Stock updated successfully'
      });
    } catch (error) {
      console.error('Error updating stock:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error updating stock'
      });
    }
  },

  // Upload product image
  async uploadImage(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No image file provided'
        });
      }

      const imageUrl = `/uploads/products/${req.file.filename}`;

      res.json({
        success: true,
        message: 'Image uploaded successfully',
        data: {
          image_url: imageUrl,
          filename: req.file.filename
        }
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      res.status(500).json({
        success: false,
        message: 'Error uploading image',
        error: error.message
      });
    }
  }
};

module.exports = productController;
