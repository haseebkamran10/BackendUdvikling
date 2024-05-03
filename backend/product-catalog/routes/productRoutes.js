const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { validateProduct } = require('../middlewares/validateProduct');

router.get('/products', productController.getProducts);
router.get('/products/:id', productController.getProductById);
//router.get('/search', productController.getProducts);

module.exports = router;
