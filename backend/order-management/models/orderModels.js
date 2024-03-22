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

// Function to create a new order
const createOrder = async (user_id, status, total_price) => {
    try {
        // Insert new order into supabase's "order" table
        const { data, error } = await supabase
            .from('orders')
            .insert([{ user_id, status, total_price }]);
        if (error) {
            throw error;
        }
        // Extract the newly created order
        const newOrderData = data[0];
        // Construct a new Order object with the retrieved data
        return new Order(newOrderData.id, newOrderData.user_id, newOrderData.status, newOrderData.total_price, newOrderData.created_at);
    } catch (error) {
        throw new Error("Failed to create order");
    }
};

// Get order data by user id 
const getOrderByUserId = async (user_id) => {
    try {
        // Query the "orders" table to fetch orders for a specific user
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('user_id', user_id);
        if (error) {
            throw error;
        }
        return data;
    } catch (error) {
        throw new Error("Failed to get orders by user ID");
    }
};

const createOrderItem = async (order_id, product_id, quantity, price) => {
    try {
        // Insert new order item into the "orderitem" table
        const { data, error } = await supabase
            .from('orderitem')
            .insert([{ order_id, product_id, quantity, price }]);
        if (error) {
            throw error;
        }
        // Extract the newly created order item
        const newOrderItemData = data[0];
        // Construct a new OrderItem object with the retrieved data
        return new OrderItem(newOrderItemData.id, newOrderItemData.order_id, newOrderItemData.product_id, newOrderItemData.quantity, newOrderItemData.price);
    } catch (error) {
        throw new Error("Failed to create order item");
    }
};

const getOrderItemsByOrderId = async (order_id) => {
    try {
        // Query the "orderitem" table to fetch order items for a specific order
        const { data, error } = await supabase
            .from('orderitem')
            .select('*')
            .eq('order_id', order_id);
        if (error) {
            throw error;
        }
        return data.map(item => new OrderItem(item.id, item.order_id, item.product_id, item.quantity, item.price));
    } catch (error) {
        throw new Error("Failed to get order items by order ID");
    }
};

module.exports = { Order, OrderItem, createOrder, getOrderByUserId, createOrderItem, getOrderItemsByOrderId };
