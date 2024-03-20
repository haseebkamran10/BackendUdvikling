// contain the logic for handling requests related to your Supabase table, such as creating, reading, updating, and deleting orders.

//Importing the Order model
const Order = require('../models/orderModels'); 

//Function to create a new order
async function createOrder(user_id, status, total_price) {
    try {
        //Inserts the new order into Supabase
        const { data, error } = await supabase
            .from('Orders') // The table name from Supabase
            .insert([{ user_id, status, total_price }]);
         //Error handling if any should occur   
        if (error) {
            throw new Error(error.message);
        }   
        
        return new Order(data.id, user_id, status, total_price, data.created_at);
    } catch (error) {
        //If creation falied, throws this error
        throw new Error("Failed to create order");
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

module.exports = { createOrder, getOrderByUserId };






