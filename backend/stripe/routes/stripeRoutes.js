const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.post('/api/create-payment-intent', paymentController.createPaymentIntentHandler);
router.post('/api/record-payment-details', paymentController.recordPaymentDetailsHandler);
router.post('/api/attach-payment-method', paymentController.attachPaymentMethodHandler);
router.post('/webhook', express.raw({ type: 'application/json' }), paymentController.stripeWebhookHandler);

module.exports = router;
