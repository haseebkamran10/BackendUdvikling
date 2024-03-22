// Make sure to require the Supabase client properly at the top of the file
const supabase = require('../services/supabaseClient.js');
const Order = require('../models/orderModels');

// Function to create a new order
async function createOrder(req, res) {
    const { user_id, status, total_price, items } = req.body; // Assuming these are the body parameters including items
    try {
        // Insert new order into Supabase's "orders" table
        const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .insert([{ user_id, status, total_price }])
            .select();
        
        // Error handling for any issues with the insert operation for orders
        if (orderError) {
            console.error('Insert error:', orderError);
            throw new Error(orderError.message);
        }

        // Check if order data is not null and has at least one item
        if (orderData && orderData.length > 0) {
            const newOrder = new Order(orderData[0].id, user_id, status, total_price, orderData[0].created_at);

            // Loop through each item and add it to the order
            for (const item of items) {
                // Create order item for each item in the order
                await createOrderItem(newOrder.id, item.product_id, item.quantity, item.price);
            }

            res.status(201).json(newOrder);
        } else {
            // Handle the case where order data is null or empty
            throw new Error('No data returned from insert operation for orders');
        }
    } catch (error) {
        // Log the error for debugging purposes
        console.error('Creation failed:', error);
        // If creation failed, sends this error
        res.status(500).json({ error: error.message });
    }
}

// Function to create a new order item
async function createOrderItem(order_id, product_id, quantity, price) {
    try {
        // Insert new order item into Supabase's "orderItem" table
        const { data: orderItemData, error: orderItemError } = await supabase
            .from('orderItem')
            .insert([{ order_id, product_id, quantity, price }])
            .select();

        // Error handling for any issues with the insert operation for order items
        if (orderItemError) {
            console.error('Insert error:', orderItemError);
            throw new Error(orderItemError.message);
        }

        // Check if order item data is not null and has at least one item
        if (orderItemData && orderItemData.length > 0) {
            // Optionally, you can return the newly created order item if needed
            return orderItemData[0];
        } else {
            // Handle the case where order item data is null or empty
            throw new Error('No data returned from insert operation for order items');
        }
    } catch (error) {
        // Log the error for debugging purposes
        console.error('Creation failed:', error);
        // If creation failed, throw the error
        throw error;
    }
}

// Function to get orders by user ID
async function getOrderByUserId(req, res) {
    try {
        const { user_id } = req.params;
        //Static method from Order to fetch orders by user_id
        const orders = await Order.getOrderByUserId(user_id);
        //Sending fetched orders as a json response
        res.status(200).json(orders); 
    } catch (error) {
        // Error handling doing retrieval
        res.status(500).json({ error: "Failed to get orders by user ID" });
    }
}

module.exports = { createOrder, getOrderByUserId };
