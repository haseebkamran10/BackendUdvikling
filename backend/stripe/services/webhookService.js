const paymentService = require('./paymentService');

const handleStripeWebhook = async (event) => {
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntentSuccess = event.data.object;
      await paymentService.handlePaymentIntentSucceeded(paymentIntentSuccess);
      break;
    case 'payment_intent.payment_failed':
      const paymentIntentFailed = event.data.object;
      await paymentService.handlePaymentIntentFailed(paymentIntentFailed);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
};

module.exports = { handleStripeWebhook };
