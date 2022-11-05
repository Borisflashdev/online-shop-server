const express = require('express');
const router = express.Router();

const { getAllProducts, getFilteredProducts, getSingleProduct, addOrder } = require('../controllers/products');

// const authMiddleware = require('../middleware/auth');

router.get('/products', getAllProducts);
router.get('/products?:price?:category?:author?:language', getFilteredProducts);
router.get('/products/:productId', getSingleProduct);
router.get('/order', addOrder);

module.exports = router;