const supabase = require('../services/supabaseClient.js');

async function calculateTotalPrice(items) {
    let totalPrice = 0;
    for (const item of items) {
        const { data, error } = await supabase
            .from('Products')
            .select('price')
            .eq('id', item.product_id)
            .single();
        if (error) throw error;
        totalPrice += data.price * item.quantity;
        item.price = data.price;  // Store the price in the item object for later use
    }
    console.log("Total Price Calculated:", totalPrice);
    return totalPrice;
}

async function createOrder(req, res) {
    const { user_id, status, items } = req.body;

    try {
        const totalPrice = await calculateTotalPrice(items);
        const itemData = items.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price  // Ensure the price is already calculated
        }));

        const { data, error } = await supabase
          .rpc('create_order_transaction', {
            _user_id: parseInt(user_id, 10),  // Ensure user_id is an integer
            _status: status,
            _total_price: totalPrice,
            _items: itemData  // Make sure this is correctly formatted as JSON array
          });

        if (error) {
            console.error('Error during transaction:', error);
            throw error;
        }

        console.log('Order created successfully:', data);
        res.status(201).json(data);
    } catch (error) {
        console.error('Order creation failed:', error);
        res.status(500).json({ error: error.message });
    }
}

module.exports = { createOrder, calculateTotalPrice };
