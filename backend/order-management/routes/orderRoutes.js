const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { createOrderItem } = require('../models/orderModels'); // Assuming createOrderItem is in orderModels

// Route to create new orders
router.post('/orders', orderController.createOrder);

// Route to get orders by user ID
router.get('/orders/:user_id', orderController.getOrderByUserId);

// Route to create order items
router.post('/orderItems', createOrderItem); // Now using createOrderItem from orderModels

module.exports = router;
