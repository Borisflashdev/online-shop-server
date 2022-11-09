const pool = require('../db/connect');
const { StatusCodes } = require('http-status-codes');

const getAllProducts = async (req, res) => {
    const price = req.headers.price;
    const category = req.headers.category;
    const author = req.headers.author;
    const language = req.headers.language;
    const sort = req.headers.sort;
    const search = req.headers.search;
    const page = req.headers.page;
    
    pool.execute(`
        SELECT *
        FROM products
        WHERE price <= ${price} AND
        category = ${category} AND
        author = ${author} AND
        language = ${language} AND
        name REGEXP "${search}"
        ORDER BY ${sort}`, function(err, result) {
        if (err) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err });
            return;
        }  else {
            const numPerPage = 12;
            const pagesNum = Math.ceil(result.length / numPerPage);
            const limit = (page-1) * 12 + ', ' + numPerPage;
            
            pool.execute(`
                SELECT *
                FROM products
                WHERE price <= ${price} AND
                category = ${category} AND
                author = ${author} AND
                language = ${language} AND
                name REGEXP "${search}"
                ORDER BY ${sort}
                LIMIT ${limit}`, function(err, result) {
                if (err) {
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err });
                    return;
                }  else {
                    res.status(StatusCodes.OK).json({ result, pagesNum });
                }
            });
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

module.exports = { getAllProducts, getSingleProduct, addOrder };