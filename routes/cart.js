const express = require('express');
const router = express.Router();

const { addProduct, deleteCart, editCart, deleteFullCart, getFullCart } = require('../controllers/cart');

const authMiddleware = require('../middleware/auth');

router.post('/cart/:id', authMiddleware, addProduct);
router.delete('/cart/:id', authMiddleware, deleteCart);
router.delete('/cart', authMiddleware, deleteFullCart);
router.get('/cart', authMiddleware, getFullCart);

module.exports = router;