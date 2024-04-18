const supabase = require('../services/supabaseClient.js');
const Order = require('../models/orderModels');
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Use environment variables for secrets

// Function to create a new order
async function createOrder(req, res) {
    const { user_id, status, total_price } = req.body; // Assuming these are the body parameters
    try {
        const { data, error } = await supabase
    .from('Orders')
    .insert([{ user_id, status, total_price }])
    .select();

        // Log the response data from Supabase for debugging
        console.log('Insert response data:', data);

        // Error handling for any issues with the insert operation
        if (error) {
            console.error('Insert error:', error);
            throw new Error(error.message);
        }

        // Check if data is not null and has at least one item
        if (data && data.length > 0) {
            // Assuming that your Order class constructor takes these parameters in this order
            // and that it doesn't perform any additional logic that might throw an error
            const newOrder = new Order(data[0].id, user_id, status, total_price, data[0].created_at);
            res.status(201).json(newOrder);
        } else {
            // Handle the case where data is null or empty
            throw new Error('No data returned from insert operation');
        }
    } catch (error) {
        // Log the error for debugging purposes
        console.error('Creation failed:', error);
        // If creation failed, sends this error
        res.status(500).json({ error: error.message });
    }
}



const getOrderByUserId = async (req, res) => {
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
};

// Function to add items to an order
async function addOrderItems (req, res) {
    const {order_id, product_id, quantity, price} = req.body;

    try {
        const {data, error} = await supabase
        .from ('OrderItems')
        .insert ([{order_id, product_id, quantity, price}]);

        if (error) {
            console.error('Insert error:', error);
            throw new Error(error.message);
        }

        const orderInstance = await Order.getOrderById(order_id);
        if (!orderInstance){
            throw new Error('Order not found')
        }

        orderInstance.addOrderItems(product_id, quantity, price);
        res.status(201).json({message: 'Order item successfully added'});
    } catch (error) {
        console.error('Failed to add order item', error);
        res.status(500).json({error: error.message});
    }
}


function calculateOrderAmount(items) {
    // Sum up the total based on item prices. Replace this logic with your own.
    return items.reduce((total, item) => {
        return total + item.price;
    }, 0);
}

module.exports = { createOrder, getOrderByUserId/*, createPaymentIntent */};

module.exports = { createOrder, getOrderByUserId/*, createPaymentIntent*/ };




