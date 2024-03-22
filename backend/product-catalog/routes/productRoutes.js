const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { validateProduct } = require('../middlewares/validateProduct');

router.get('/products', productController.getProducts);
router.get('/products/filter', productController.getProductsByFilter); 
router.get('/products/:id', productController.getProductById); 
router.get('/products/:name',productController.getProductByName); 


//router.get('/search', productController.getProductByName);


module.exports = router;
