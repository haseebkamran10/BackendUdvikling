
const Products = require('../models/Products');

exports.getProducts = async (req, res) => {
  try {
    // 1. Fetch all products initially
    const products = await Products.findAll();
    res.status(200).json(products);
  } catch (error) {
    console.error('Unexpected error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Products.findById(req.params.id);

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

exports.getProductByName = async (req, res) => {
  try {
    const productName = req.params.name; // Assuming product name is sent in params

    // Fetch product by name from Supabase
    const product = await Products.findByName(productName)
    if (error) {
      console.error('Error fetching product:', error);
      return res.status(500).json({ error: 'Failed to get product' });
    }

    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error('Unexpected error fetching product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
exports.getProductsByFilter = async (req, res) => {
  try {
    // Extract filters from query parameters (adjust based on your implementation)
    const filters = {};
    if (req.query.category) {
      filters.category = req.query.category;
    }

    if (req.query.minPrice) {
      filters.minPrice = parseFloat(req.query.minPrice);
    }

    if (req.query.maxPrice) {
      filters.maxPrice = parseFloat(req.query.maxPrice);
    }

    // Call filterProducts function with extracted filters
    const filteredProducts = await productController.filterProducts(filters);

    res.status(200).json(filteredProducts);
  } catch (error) {
    console.error('Error fetching filtered products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
