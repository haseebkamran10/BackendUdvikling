const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Ensure that the orderController has the expected methods
console.log(orderController);

// Route to create new orders
router.post('/orders', orderController.createOrder);

// Route to get orders by user id
// router.get('/orders/:user_id', orderController.getOrderByUserId);

// Since you're not using the createPaymentIntent function, it's commented out
// router.post('/create-payment-intent', orderController.createPaymentIntent);

// Export the router for use in the main app
module.exports = router;