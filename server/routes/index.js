const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const productRoutes = require('./productRoutes');
const supplierRoutes = require('./supplierRoutes');
const saleRoutes = require('./saleRoutes');

// Mount routes
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/suppliers', supplierRoutes);
router.use('/sales', saleRoutes);

// Add other routes as they are created
// router.use('/reports', reportRoutes);
// router.use('/transactions', transactionRoutes);
// router.use('/employees', employeeRoutes);

module.exports = router; 