// Define routes for handling HTTP requests related to your Supabase table.

const express = require ('express');
const router = express.Router();
const orderController = require ('/controller/orderController');

router.post('/orders', async (req, res) => {
    try {
        const {user_id, status, total_price} = req.body;
        const orders = await orderController.creaedOrder(user_id, status, total_price);
        res.status(201).json(orders);
    }   catch (error) {
        res.status(500).json({error:error.message});
    }

} );

// Implement other routes as needed
module.exports = router;


