// paymentService.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const supabase = require('./supabaseClient'); 

const createPaymentIntent = async (amount, currency, userId) => {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100,  
        currency: currency,
        metadata: { userId: userId.toString() },
        payment_method_types: ['card', 'klarna', 'viabill', 'mobilePay', 'invoice'], 
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
      created_at: new Date().toISOString(), // Optional: manage timestamp on the server side
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

module.exports = {
  createPaymentIntent,
  recordPaymentDetails
};
