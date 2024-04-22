// stripeRoutes.js
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');  // Adjust path as necessary

router.post('/api/create-payment-intent', paymentController.createPaymentIntentHandler);
router.post('/api/record-payment-details', paymentController.recordPaymentDetailsHandler);
router.post('/api/attach-payment-method', paymentController.attachPaymentMethodHandler);


module.exports = router;
