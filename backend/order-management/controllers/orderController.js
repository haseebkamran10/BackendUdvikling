const supabase = require('../services/supabaseClient.js');
// const Order = require('../models/orderModels'); // Uncomment if Order model is used

// Helper function to calculate total order amount
function calculateOrderAmount(items) {
    return items.reduce((total, item) => total + item.quantity * item.price, 0);
  }
  
  async function createOrder(req, res) {
    const { user_id, status, items } = req.body; // Expect items to be an array of { product_id, quantity }
  
    try {
      console.log('Request received with user_id:', user_id); // Log received user ID
      console.log('Request items:', items); // Log received order items
  
      // Retrieve product details for each item to get the latest prices
      const prices = await Promise.all(
        items.map(item =>
          supabase
            .from('Products')
            .select('price')
            .eq('id', item.product_id)
            .single()
        )
      );
  
      console.log('Retrieved prices:', prices); // Debug log for product details
  
      // Calculate total price using prices from the database
      const total_price = prices.reduce((sum, { data }, index) => {
        if (!data) {
          console.error(`Product with ID ${items[index].product_id} not found`); // Log specific error for missing product
          throw new Error(`Product with ID ${items[index].product_id} not found`);
        }
        return sum + (data.price * items[index].quantity);
      }, 0);
  
      // Insert the new order with the calculated total price
      const { data: order, error: orderError } = await supabase
  .from('Orders')
  .insert([{ user_id, status, total_price }])
  .single();

if (orderError) throw new Error(orderError.message);

console.log('Created Order:', order); // Added log to inspect order object

// Check if order insertion was successful (order might be null if insertion fails)
if (!order) {
  throw new Error('Failed to create order (order insertion might have failed)');
}
  
      console.log('Order created:', order); // Log the created order object for debugging
  
      // Prepare order items for insertion with logs
      const orderItemsPromises = items.map((item, index) => {
        console.log('Order Item Object for Product:', item.product_id); // Existing log
        console.log('Price for Product:', prices[index].data.price); // Existing log
  
        console.log('Inserting order item:', {
          order_id: order.id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: prices[index].data.price,
        }); // Log specific order item data being inserted
  
        return supabase
          .from('OrderItems')
          .insert({
            order_id: order.id,
            product_id: item.product_id,
            quantity: item.quantity,
            price: prices[index].data.price,
          });
      });
  
      const orderItemsResults = await Promise.all(orderItemsPromises);
  
      // Check for errors in all insertions before processing further
      const hasErrors = orderItemsResults.some(result => result.error);
      if (hasErrors) {
        console.log('Order Item insertion errors:', orderItemsResults); // Existing log
        throw new Error('Failed to insert some order items');
      }
  
      const orderItems = orderItemsResults.map(result => result.data[0]);
  
      console.log('Order Item results:', orderItems); // Existing log
  
      // Return the order with items
      res.status(201).json({ order, items: orderItems });
    } catch (error) {
      console.error('Order creation failed:', error);
      res.status(500).json({ error: error.message });
    }
  }
  
// Get orders by user ID
const getOrderByUserId = async (req, res) => {
  const { user_id } = req.params;
  try {
    // Here you would add logic to retrieve orders by user_id from the database
    // For this example, let's just log the user_id and send a placeholder response
    console.log(`Retrieving orders for user_id: ${user_id}`);
    // Placeholder response, replace with actual data retrieval logic
    res.status(200).json({ message: `Orders for user_id ${user_id} retrieved successfully.` });
  } catch (error) {
    res.status(500).json({ error: "Failed to get orders by user ID" });
  }
};

// Export the controller functions
module.exports = { createOrder, getOrderByUserId };
