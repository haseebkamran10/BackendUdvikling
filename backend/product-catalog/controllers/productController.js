const supabase = require('../services/supabaseClient.js');


exports.createProduct = async (req, res) => {
  try {
    // Create product in Supabase directly
    const { data, error } = await supabase
      .from('Products')
      .insert(req.body);

    if (error) {
      console.error('Error creating product:', error);
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json(data);
  } catch (error) {
    console.error('Unexpected error creating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getProducts = async (req, res) => {
  try {
    // Explicitly select product IDs from 1 to 16 for demo purposes
    const productIds = Array.from({ length: 16 }, (_, i) => i + 1); 

    // Fetch only the specified products directly from Supabase with only specific fields
    const { data: products, error } = await supabase
      .from('Products')
      .select('id, name, price, image_url') 
      .in('id', productIds); 
    if (error) {
      console.error('Error fetching products:', error);
      return res.status(500).json({ error: 'Failed to get products' });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error('Unexpected error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



exports.getProductById = async (req, res) => {
  try {
    const productId = req.params.id;

    // Fetch product by ID from Supabase
    const { data: product, error } = await supabase
      .from('Products')
      .select('*')
      .eq('id', productId);

    if (error) {
      console.error('Error fetching product:', error);
      return res.status(500).json({ error: 'Failed to get product' });
    }

    if (product) {
      res.status(200).json(product[0]); // Assuming product is an array with one element
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error('Unexpected error fetching product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const productUpdates = req.body;

    // Update product in Supabase
    const { data, error } = await supabase
      .from('Products')
      .update(productUpdates)
      .eq('id', productId);

    if (error) {
      console.error('Error updating product:', error);
      return res.status(400).json({ error: error.message });
    }

    if (data.updatedCount === 1) {
      // Product updated successfully
      res.status(200).json({ message: 'Product successfully updated' });
    } else {
      res.status(400).json({ error: 'Failed to update product' });
    }
  } catch (error) {
    console.error('Unexpected error updating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    // Delete product from Supabase
    const { data, error } = await supabase
      .from('Products')
      .delete()
      .eq('id', productId);

    if (error) {
      console.error('Error deleting product:', error);
      return res.status(500).json({ error: 'Failed to delete product' });
    }

    if (data.deletedCount === 1) {
      // Product deleted successfully
      res.status(200).json({ message: 'Product successfully deleted' });
    } else {
      res.status(400).json({ error: 'Failed to delete product' });
    }
  } catch (error) {
    console.error('Unexpected error deleting product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
