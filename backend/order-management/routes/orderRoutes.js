// Define routes for handling HTTP requests related to your Supabase table.

const express = require ('express');
const router = express.Router();
const orderController = require ('../controller/orderController');

// Route to create new orders
router.post('/orders', async (req, res) => {
    try {
        const {user_id, status, total_price} = req.body;
        const orders = await orderController.createOrder(user_id, status, total_price);
        res.status(201).json(orders);
    }   catch (error) {
        res.status(500).json({error:error.message});
    }
} );

// Route to get orders by user id
router.get('/orders/:user_id', async (req, res) => {
    try {
        const { user_id } = req.params;
        const orders = await orderController.getOrderByUserId(user_id);
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const express = require('express');
const router = express.Router();
const orderController = require('../controller/orderController');
//Route for creating a payment intent
router.post('/create-payment-intent', orderController.createPaymentIntent);


// Implement other routes as needed
module.exports = router;

//from frontend we will have to call the '/create-payment-intent' endpoint to retrieve the client secret and use it to confirm the payment with stripe o nthe client side.
