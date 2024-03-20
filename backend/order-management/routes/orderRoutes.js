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


// Implement other routes as needed
module.exports = router;


