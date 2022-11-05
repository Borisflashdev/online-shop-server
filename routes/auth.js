const express = require('express');
const router = express.Router();

const { signup, login, deleteaccount, editaccount } = require('../controllers/auth');

// const authMiddleware = require('../middleware/auth');

router.post('/signup', signup);
router.post('/login', login);
router.delete('/deleteaccount', deleteaccount);
router.patch('/editaccount', editaccount);

module.exports = router;