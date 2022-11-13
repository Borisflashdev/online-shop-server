const pool = require('../db/connect');
const { StatusCodes } = require('http-status-codes');

const addProduct = async (req, res) => {
    const user_id = req.headers.userid;
    const product_id = req.params.id;

    if (!user_id) {
        res.status(StatusCodes.BAD_REQUEST).json({ msg: 'You must provide userId.' });
        return;
    }
    if (!product_id) {
        res.status(StatusCodes.BAD_REQUEST).json({ msg: 'You must provide productId.' });
        return;
    }

    pool.execute(`
        SELECT *
        FROM shopping_cart
        WHERE user_id = "${user_id}" AND product_id = "${product_id}"`, function(err, result) {
        if (err) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err });
            return;
        } else if (result.length === 0) {
            pool.execute(`
                INSERT INTO shopping_cart(user_id, product_id, quantity)
                VALUES (${user_id}, ${product_id}, 1)`, function(err, result) {
                if (err) {
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err });
                    return;
                }  else {
                    res.status(StatusCodes.OK).json({ result });
                }
            });
        } else {
            pool.execute(`
                UPDATE shopping_cart 
                SET quantity = quantity + 1
                WHERE user_id = "${user_id}" AND product_id = "${product_id}"`, function(err, result) {
                if (err) {
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err });
                    return;
                }  else {
                    res.status(StatusCodes.OK).json({ result });
                }
            });
        }
    });
};

const deleteCart = async (req, res) => {
    const user_id = req.headers.userid;
    const product_id = req.params.id;

    if (!user_id) {
        res.status(StatusCodes.BAD_REQUEST).json({ msg: 'You must provide userId.' });
        return;
    }
    if (!product_id) {
        res.status(StatusCodes.BAD_REQUEST).json({ msg: 'You must provide productId.' });
        return;
    }
    
    pool.execute(`
        DELETE FROM shopping_cart
        WHERE user_id = ${user_id} AND product_id = ${product_id}`, function(err, result) {
        if (err) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err });
            return;
        }  else {
            res.status(StatusCodes.OK).json({ result });
        }
    });
};

const deleteFullCart = async (req, res) => {
    const user_id = req.headers.userid;

    if (!user_id) {
        res.status(StatusCodes.BAD_REQUEST).json({ msg: 'You must provide userId.' });
        return;
    }
    
    pool.execute(`
        DELETE FROM shopping_cart
        WHERE user_id = ${user_id}`, function(err, result) {
        if (err) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err });
            return;
        }  else {
            res.status(StatusCodes.OK).json({ result });
        }
    });
};

const getFullCart = async (req, res) => {
    const user_id = req.headers.userid;
    const sort = req.headers.sort;

    if (!user_id) {
        res.status(StatusCodes.BAD_REQUEST).json({ msg: 'You must provide userId.' });
        return;
    }
    
    pool.execute(`
        SELECT *
        FROM products p
        JOIN shopping_cart s
            ON p.product_id = s.product_id
        WHERE user_id = ${user_id}`, function(err, result) {
        if (err) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err });
            return;
        }  else {
            res.status(StatusCodes.OK).json({ result });
        }
    });
};

module.exports = { addProduct, deleteCart, deleteFullCart, getFullCart };