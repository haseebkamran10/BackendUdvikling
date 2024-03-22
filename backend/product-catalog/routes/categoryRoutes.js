const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

router.get('/categories', categoryController.getAllCategories);
router.get('/categories/:id', categoryController.getCategoryById);
router.get('/categories/:name',categoryController.getCategoryByName)
router.get('/search', categoryController.searchCategories);


module.exports = router;
