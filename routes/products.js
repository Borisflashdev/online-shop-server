const express = require('express');
const router = express.Router();

const { getAllProducts, getSingleProduct, addOrder } = require('../controllers/products');

const authMiddleware = require('../middleware/auth');

router.get('/products', getAllProducts);
router.get('/products/:productId', getSingleProduct);
router.post('/order', authMiddleware, addOrder);

module.exports = router;