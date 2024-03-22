// Make sure to require the Supabase client properly at the top of the file
const supabase = require('../services/supabaseClient.js');
const { Order, createOrderItems} = require('../models/orderModels'); // Import createOrderItems function and Order class

// Function to create a new order
async function createOrder(req, res) {
    const { user_id, status, total_price, items } = req.body;
    try {
        // Insert new order into Supabase's "orders" table
        const { data: orderData, error: orderError } = await supabase
            .from('Orders')
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
                await createOrderItems(newOrder.id, item.product_id, item.quantity, item.price);
            }

            res.status(201).json(newOrder);
        } else {
            // Handle the case where order data is null or empty
            throw new Error('No data returned from insert operation for orders');
        }
    } catch (error) {
        console.error('Creation failed:', error);
        res.status(500).json({ error: error.message });
    }
}


// Function to create a new order item
async function createOrderItems(order_id, product_id, quantity, price) {
    try {
        // Insert new order item into Supabase's "orderItems" table
        const { data: orderItemsData, error: orderItemsError } = await supabase
            .from('OrderItems')
            .insert([{ order_id, product_id, quantity, price }])
            .select();

        // Error handling for any issues with the insert operation for order items
        if (orderItemsError) {
            console.error('Insert error:', orderItemsError);
            throw new Error(orderItemsError.message);
        }

        // Check if order item data is not null and has at least one item
        if (orderItemsData && orderItemsData.length > 0) {
            // Optionally, you can return the newly created order item if needed
            return orderItemsData[0];
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
        const Orders = await Order.getOrderByUserId(user_id);
        //Sending fetched orders as a json response
        res.status(200).json(Orders); 
    } catch (error) {
        // Error handling doing retrieval
        res.status(500).json({ error: "Failed to get orders by user ID" });
    }
}

module.exports = { createOrder, getOrderByUserId, createOrderItems };
