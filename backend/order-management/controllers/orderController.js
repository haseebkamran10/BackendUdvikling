const supabase = require('../services/supabaseClient.js');

async function calculateTotalPrice(items) {
  let totalPrice = 0;
  for (const item of items) {
    const { data, error } = await supabase
      .from('Products')
      .select('price')
      .eq('id', item.product_id)
      .single();
    if (error) throw error;
    totalPrice += data.price * item.quantity;
  }
  console.log("Total Price Calculated:", totalPrice);
  return totalPrice;
}

async function createOrder(req, res) {
  const { user_id, status, items } = req.body;

  try {
    // Calculate the total price
    const totalPrice = await calculateTotalPrice(items);

    // Handle items data preparation with proper async operations
    const itemData = await Promise.all(items.map(async (item) => {
      const { data, error } = await supabase.from('Products').select('price').eq('id', item.product_id).single();
      if (error) {
        throw error; // Proper error handling
      }
      return {
        product_id: item.product_id,
        quantity: item.quantity,
        price: data.price * item.quantity
      };
    }));

    const { data, error } = await supabase
  .from('public') // Assuming your function resides in the public schema
  .rpc('create_order_transaction', {
    user_id,
    status,
    total_price: totalPrice,
    items: itemData,
  });

    if (transactionError) {
      console.error('Error during transaction:', transactionError);
      throw transactionError;
    }

    console.log('Order created successfully:', transactionData);
    res.status(201).json(transactionData);
  } catch (error) {
    console.error('Order creation failed:', error);
    res.status(500).json({ error: error.message });
  }
}
module.exports = { createOrder, calculateTotalPrice };
