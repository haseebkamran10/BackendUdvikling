
const Category = require('../models/Category');

// Get all categories
exports.getAllCategories = async (req, res) => {
    try {
      const categories = await Category.findAll();
      res.status(200).json(categories);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
  // Get a single category by ID
  exports.getCategoryById = async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);
      if (category) {
        res.status(200).json(category);
      } else {
        res.status(500).json({ error: 'Failed to get Category' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  exports.getCategoryByName = async (req, res) => {
    try {
      const category = await Category.findByName(req.params.name);
      if (category) {
        res.status(200).json(category);
      } else {
        res.status(500).json({ error: 'Failed to get Category' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
exports.searchCategories = async (req, res) => {
  try {
    // Extract the search term from query parameters
    const { search } = req.query;

    // Pass the search term to the model
    const categories = await Category.findByNameOrDescription(search);

    res.status(200).json(categories);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
