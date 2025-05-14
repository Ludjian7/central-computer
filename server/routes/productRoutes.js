const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { isAuthenticated, authorizeRoles } = require('../middleware/authMiddleware');

// Product routes - temporarily disabled authentication for testing
router.get('/', productController.getAllProducts);
router.get('/low-stock', productController.getLowStockProducts);
router.get('/:id', productController.getProductById);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router; 