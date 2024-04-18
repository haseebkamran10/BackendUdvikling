// This file will define the structure of your Supabase table and any methods for interacting with it.
const supabase = require('../services/supabaseClient.js');

class orders {
    constructor(id, user_id, status, total_price, created_at) {
        this.id = id;
        this.user_id = user_id;
        this.status = status;
        this.total_price = total_price;
        this.created_at = created_at;
        this.order_items = [];

    }
addItem(quantity, price, product_id) {
    this.order_items.push({product_id, quantity, price});
    }

static async getOrderById(order_id) {
    try {
        const {data, error} = await supabase
        .from('Orders')
        .select('*')
        .eq('id', order_id)
        .single();
        if (error){
            throw new Error(error.message);
        }
        if (!data) {
            throw new Error ('Order not found');
        }

        return new orders(data.id, data.user_id,data.status, data.total_price, data.created_at);
        } catch (error) {
            throw new Error ('Failed to fetch order');
        }
}

getOrderItems(){
    return this.order_items;
    }    
}

// Function to create a new order
const createdOrder = async (user_id, status, total_price) => {
    try {
        // Insert new order into supabase's "order" table
        const {data, error} = await supabase
            .from('orders')
            .insert([{user_id,status,total_price}]);
        if (error) {
            throw error;
        }
        // Extract the newly created order
        const newOrderData = data[0];
        //Construct a new orders object with the retrieved data
        return new orders(newOrderData.id, newOrderData.user_id, newOrderData.status, newOrderData.total_price, newOrderData.created_at);
    } catch (error) {
        throw new Error ("Failed to create order");
    }
};
//Get order data by user id 
const getOrderByUserId = async (user_id) => {
    //Query the "orders" table to fetch orders for a specific user
    const {data,error} = await supabase
        .from('orders')
        .select('*')
        .eq('user_id',user_id);
    if (error) {
        throw error;
    }
    return data;
}

module.exports = orders;

