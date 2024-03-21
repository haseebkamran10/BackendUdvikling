const Product = require('../models/Product');

exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all products
exports.getProducts = async (req, res) => {
    try {
      const products = await Product.findAll();
      res.status(200).json(products);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
  // Get a single product by ID
  exports.getProductById = async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (product) {
        res.status(200).json(product);
      } else {
        res.status(404).json({ error: 'Product not found' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
  // Update a product by ID
exports.updateProduct = async (req, res) => {
    try {
      const updatedProduct = await Product.updateById(req.params.id, req.body);
      res.status(200).json(updatedProduct);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
// Delete a product by ID
exports.deleteProduct = async (req, res) => {
    try {
      await Product.deleteById(req.params.id);
      res.status(200).json({ message: 'Product successfully deleted' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
// Get filtered products
exports.getProducts = async (req, res) => {
    try {
      // Extract query parameters
      const { category, minPrice, maxPrice } = req.query;
  
      // Pass the query parameters to the model
      const filters = { category, minPrice, maxPrice };
      const products = await Product.findFiltered(filters);
  
      res.status(200).json(products);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  