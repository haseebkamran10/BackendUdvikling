const { supabase } = require('../services/supabaseClient');

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

async function createOrder(user_id, status, total_price) {
    try {
        const { data, error } = await supabase
            .from('Orders')
            .insert([{ user_id, status, total_price }])
            .select();

        if (error) {
            throw error;
        }

        const newOrderData = data[0];
        return new Order(newOrderData.id, user_id, status, total_price, newOrderData.created_at);
    } catch (error) {
        throw new Error("Failed to create order");
    }
}

async function getOrdersByUserId(user_id) {
    try {
        const { data, error } = await supabase
            .from('Orders')
            .select('*')
            .eq('user_id', user_id);

        if (error) {
            throw error;
        }

        return data.map(order => new Order(order.id, order.user_id, order.status, order.total_price, order.created_at));
    } catch (error) {
        throw new Error("Failed to get orders by user ID");
    }
}

async function createOrderItem(order_id, product_id, quantity, price) {
    try {
        const { data, error } = await supabase
            .from('OrderItems')
            .insert([{ order_id, product_id, quantity, price }])
            .select();

        if (error) {
            throw error;
        }

        const newOrderItemData = data[0];
        return new OrderItem(newOrderItemData.id, order_id, product_id, quantity, price);
    } catch (error) {
        throw new Error("Failed to create order item");
    }
}

async function getOrderItemsByOrderId(order_id) {
    try {
        const { data, error } = await supabase
            .from('OrderItems')
            .select('*')
            .eq('order_id', order_id);

        if (error) {
            throw error;
        }

        return data.map(item => new OrderItem(item.id, item.order_id, item.product_id, item.quantity, item.price));
    } catch (error) {
        throw new Error("Failed to get order items by order ID");
    }
}

module.exports = { Order, OrderItem, createOrder, getOrdersByUserId, createOrderItem, getOrderItemsByOrderId };
