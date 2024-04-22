const paymentService = require('../services/paymentService');  
// Handler for creating payment intent
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

// Handler for recording payment details
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
      const confirmedPaymentIntent = await paymentService.attachPaymentMethod(paymentIntentId, paymentMethodId);
      res.status(200).json(confirmedPaymentIntent);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

module.exports = {
  createPaymentIntentHandler,
  recordPaymentDetailsHandler,
  attachPaymentMethodHandler
};
