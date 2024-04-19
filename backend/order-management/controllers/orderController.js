const supabase = require('../services/supabaseClient.js');

// Helper function to calculate total order amount
async function calculateOrderAmount(items) {
  let total = 0;
  for (const item of items) {
    const { data, error } = await supabase
      .from('Products')
      .select('price')
      .eq('id', item.product_id)
      .single();
    if (error) {
      console.error(`Error fetching price for product ID ${item.product_id}`, error);
      throw error;
    }
    total += data.price * item.quantity;
  }
  return total;
}

async function createOrder(req, res) {
  const { user_id, status, items } = req.body;

  try {
    const total_price = await calculateOrderAmount(items);

    const { data: order, error: orderError } = await supabase
      .from('Orders')
      .insert([{ user_id, status, total_price }])
      .single();

    if (orderError) {
      console.error('Order creation error:', orderError);
      throw orderError;
    }

    const orderItemsResults = await Promise.allSettled(items.map(item => {
      return supabase
        .from('OrderItems')
        .insert({
          order_id: order.id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price // Assuming the price is set after fetching latest from Products
        });
    }));

    // Check if any item insertions failed
    const failedItems = orderItemsResults.filter(result => result.status === 'rejected');
    if (failedItems.length > 0) {
      console.error('Failed to insert some order items:', failedItems);
      // Optional: Handle rolling back the order creation if needed
      throw new Error('Failed to insert some order items');
    }

    const successfulOrderItems = orderItemsResults.map(result => result.value.data[0]);
    res.status(201).json({ order, items: successfulOrderItems });
  } catch (error) {
    console.error('Order creation failed:', error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = { createOrder };
