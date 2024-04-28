const supabase = require('../services/supabaseClient.js');

async function calculateTotalPrice(items) {
  // Fetch the latest prices and calculate the total price
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
  console.log("Total Price:", totalPrice); // Log the calculated price
  return totalPrice;
}

async function createOrder(req, res) {
  const { user_id, status, items } = req.body;

  try {
    // Start a transaction and insert the order with a default total price
    const { data: transaction, error: transactionError } = await supabase
      .from('Orders')
      .insert([{ user_id, status, total_price: 0.00 }])
      .select('id');

    if (transactionError) {
      console.error('Error starting transaction:', transactionError);
      throw transactionError;
    }

    const order_id = transaction[0].id; // Get the order_id from the inserted order

    console.log("Status:", status); // Log the status value for verification

    const totalPrice = await calculateTotalPrice(items); // Wait for price calculation

    // Insert order items with the order_id from the transaction
    const orderItems = items.map(item => ({
      order_id: order_id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: totalPrice / items.length, 
    }));

    const { error: orderItemsError } = await supabase
      .from('OrderItems')
      .insert(orderItems);

    if (orderItemsError) {
      console.error('Error inserting order items:', orderItemsError);
      throw orderItemsError;
    }

    // Update the order with the actual total price
    const { error: updateError } = await supabase
      .from('Orders')
      .upsert({ id: order_id, total_price: totalPrice });

    if (updateError) {
      console.error('Error updating total price:', updateError);
      throw updateError;
    }

    await res.status(201).json({
      order_id: order_id,
      user_id: user_id,
      status: status,
      total_price: totalPrice, 
      items: orderItems
    });
  } catch (error) {
    console.error('Order creation failed:', error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = { createOrder };