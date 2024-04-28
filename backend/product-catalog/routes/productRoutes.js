const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { validateProduct } = require('../middlewares/validateProduct');

router.get('/products', productController.getProducts);
router.get('/products/search', productController.searchProductsByName);
router.post('/products', validateProduct, productController.createProduct);

router.get('/products/:id', productController.getProductById);
router.put('/products/:id', validateProduct, productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);

module.exports = router;
