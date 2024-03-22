// Make sure to require the Supabase client properly at the top of the file
const { createOrderItem } = require('../models/orderModels'); // Importing the createOrderItem
const supabase = require('../services/supabaseClient');

// Import only the Order class
const { Order } = require('../models/orderModels');

// Function to create a new order
async function createOrder(req, res) {
    const { user_id, status, total_price, items } = req.body;
    try {
        // Only insert the order data without the select
        const { data: orderData, error: orderError } = await supabase
            .from('Orders')
            .insert([{ user_id, status, total_price }])
            .single();

        if (orderError) {
            console.error('Insert error:', orderError);
            return res.status(400).json({ error: orderError.message });
        }

        // Create an instance of Order
        const newOrder = new Order(orderData.id, user_id, status, total_price, orderData.created_at);

        // Create order items for each item in the items array
        const orderItemsPromises = items.map(item =>
            createOrderItem(orderData.id, item.product_id, item.quantity, item.price)
        );

        // Wait for all order items to be created
        const orderItems = await Promise.all(orderItemsPromises);

        res.status(201).json({ order: newOrder, orderItems });
    } catch (error) {
        console.error('Creation failed:', error);
        res.status(500).json({ error: error.message });
    }
}

async function getOrderByUserId(req, res) {
    const { user_id } = req.params;
    try {
        // Fetch orders by user ID from your model or database
        const { data, error } = await supabase
            .from('Orders')
            .select('*')
            .eq('user_id', user_id);
        
        if (error) {
            throw error;
        }

        // Assuming you map your data to instances of the Order class
        const orders = data.map(order => new Order(order.id, order.user_id, order.status, order.total_price, order.created_at));
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error getting orders by user ID:', error);
        res.status(500).json({ error: error.message });
    }
}

// Export the necessary functions
module.exports = { createOrder, getOrderByUserId };
