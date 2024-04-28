const paymentService = require('../services/paymentService');  
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createPaymentIntentHandler = async (req, res) => {
  const { amount, currency, userId } = req.body;
  if (!amount || !currency || !userId) {
    return res.status(400).json({ error: "All fields are required: amount, currency, and userId." });
  }

  try {
    const paymentIntent = await paymentService.createPaymentIntent(amount, currency, userId);
    res.status(200).json(paymentIntent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const recordPaymentDetailsHandler = async (req, res) => {
  const { orderId, userId, paymentIntentId, status, amount, currency, method } = req.body;

  if (!orderId || !userId || !paymentIntentId || !status || !amount || !currency || !method) {
    return res.status(400).json({ error: "Missing fields: Ensure all fields including orderId, userId, paymentIntentId, status, amount, currency, and method are provided." });
  }

  try {
    const record = await paymentService.recordPaymentDetails({
      orderId, userId, paymentIntentId, status, amount, currency, method
    });
    res.status(200).json(record);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const attachPaymentMethodHandler = async (req, res) => {
  const { paymentIntentId, paymentMethodId } = req.body;

  if (!paymentIntentId || !paymentMethodId) {
    return res.status(400).json({ error: "paymentIntentId and paymentMethodId are required." });
  }

  try {
    // Attach the payment method to the payment intent
    await stripe.paymentIntents.update(paymentIntentId, {
      payment_method: paymentMethodId,
    });

    // Confirm the payment intent to complete the payment
    const confirmedPaymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);

    // Respond with the confirmed payment intent details
    res.status(200).json(confirmedPaymentIntent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
  const stripeWebhookHandler = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;
  
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
      await handleStripeWebhook(event);
      res.status(200).json({ received: true });
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  };
  
  
module.exports = {
  createPaymentIntentHandler,
  recordPaymentDetailsHandler,
  attachPaymentMethodHandler,
  stripeWebhookHandler
};
