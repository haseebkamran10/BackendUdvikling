// contain the logic for handling requests related to your Supabase table, such as creating, reading, updating, and deleting orders.

const orders = require ('/models/orderModels');

async function createOrders(user_id, status, total_price) {
    try {
        const {data, error} = await supabase
            .from ('orders')
            .insert([{user_id, status, total_price}]);
            
        if (error) {
            throw new Error(error.message);
        }   
        
        return new orders(data.id, user_id, status, total_price, data.created_at);
    }   catch (error) {
        throw new Error ("Failed to create order");
    }
}
module.exports = {createOrder};






