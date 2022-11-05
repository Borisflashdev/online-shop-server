const pool = require('../db/connect');
const { StatusCodes } = require('http-status-codes');

const getAllProducts = async (req, res) => {
    pool.execute(`
        SELECT *
        FROM products`, function(err, result) {
        if (err) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err });
            return;
        }  else {
            res.status(StatusCodes.OK).json({ result });
        }
    });
};

const getFilteredProducts = async (req, res) => {
    const price = req.query.price;
    const category = req.query.category;
    const author = req.query.author;
    const language = req.query.language;

    pool.execute(`
        SELECT *
        FROM products
        WHERE price = ${price} AND
        category = ${category} AND
        author = ${author} AND
        language = ${language}`, function(err, result) {
        if (err) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err });
            return;
        }  else {
            res.status(StatusCodes.OK).json({ result });
        }
    });
};

const getSingleProduct = async (req, res) => {
    const productId = req.params.productId

    pool.execute(`
        SELECT *
        FROM products
        WHERE product_id = "${productId}"`, function(err, result) {
        if (err) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err });
            return;
        }  else {
            res.status(StatusCodes.OK).json({ result });
        }
    });
};

const addOrder = async (req, res) => {
    const userId = req.headers.userid;
    const adress = req.headers.adress;
    const date = new Date();

    pool.execute(`
        INSERT INTO orders(order_id, user_id, date, adress)
        VALUES (DEFAULT, "${userId}", "${date}", "${adress}")`, function(err, result) {
        if (err) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err });
            return;
        }  else {
            res.status(StatusCodes.OK).json({ result });
        }
    });
};

module.exports = { getAllProducts, getFilteredProducts, getSingleProduct, addOrder };