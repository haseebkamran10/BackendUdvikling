const express = require('express');
const bodyParser = require('body-parser');
const paymentController = require('../controllers/paymentController');

const router = express.Router();

router.post('/api/webhook', bodyParser.raw({type: 'application/json'}), paymentController.stripeWebhookHandler);

module.exports = router;
