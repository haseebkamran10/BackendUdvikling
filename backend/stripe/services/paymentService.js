const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const supabase = require('./supabaseClient'); 

const createPaymentIntent = async (amount, currency, userId) => {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100,  
        currency: currency,
        metadata: { userId: userId.toString() },
        payment_method_types: ['card', 'klarna', 'mobilepay'], 
      });
      return paymentIntent;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  };
  

const recordPaymentDetails = async ({ orderId, userId, paymentIntentId, status, amount, currency, method }) => {
  try {
    const { data, error } = await supabase.from('Payments').insert([{
      orderid: orderId,
      userid: userId,
      paymentintentid: paymentIntentId,
      status,
      amount,
      currency,
      method,
      created_at: new Date().toISOString(), 
      updated_at: new Date().toISOString()
    }]);
    
    if (error) {
      console.error('Error recording payment details:', error.message);
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Error handling record payment details:', error);
    throw error;
  }
};

const attachPaymentMethod = async (paymentIntentId, paymentMethodId) => {
    try {
      // Attach the payment method to the payment intent
      await stripe.paymentIntents.update(paymentIntentId, {
        payment_method: paymentMethodId,
      });
      // Confirm the payment intent after attaching the payment method
      const confirmedPaymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);
      return confirmedPaymentIntent;
    } catch (error) {
      console.error('Error attaching payment method:', error);
      throw error;
    }
  };

module.exports = {
  createPaymentIntent,
  recordPaymentDetails,
  attachPaymentMethod
};
