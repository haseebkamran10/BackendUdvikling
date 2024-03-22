const supabase = require('../services/supabaseClient');

class Order {
    constructor(id, user_id, status, total_price, created_at) {
        this.id = id;
        this.user_id = user_id;
        this.status = status;
        this.total_price = total_price;
        this.created_at = created_at;
    }
}

class OrderItem {
    constructor(id, order_id, product_id, quantity, price) {
        this.id = id;
        this.order_id = order_id;
        this.product_id = product_id;
        this.quantity = quantity;
        this.price = price;
    }
}

// This function is used to create an order item
async function createOrderItem(order_id, product_id, quantity, price) {
    try {
        const { data, error } = await supabase
            .from('OrderItems')
            .insert([{ order_id, product_id, quantity, price }])
            .single();

        if (error) {
            throw error;
        }

        return new OrderItem(data.id, order_id, product_id, quantity, data.price);
    } catch (error) {
        console.error('Failed to create order item:', error);
        throw new Error("Failed to create order item");
    }
}

// Export the classes and functions
module.exports = { Order, OrderItem, createOrderItem };
