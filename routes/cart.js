const express = require('express');
const router = express.Router();

const { addProduct, deleteCart, editCart, deleteFullCart, getFullCart } = require('../controllers/cart');

// const authMiddleware = require('../middleware/auth');

router.post('/cart/:id', addProduct);
router.delete('/cart/:id', deleteCart);
router.patch('/cart/:id', editCart);
router.delete('/cart', deleteFullCart);
router.get('/cart', getFullCart);

module.exports = router;