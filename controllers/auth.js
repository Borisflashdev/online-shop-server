const jwt = require('jsonwebtoken');
const pool = require('../db/connect');
const { StatusCodes } = require('http-status-codes');

const signup = async (req, res) => {
  const { username, password } = req.body;

  if (!username) {
    res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Username is not valid.' });
    return;
  }
  if (!password) {
    res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Password is not valid.' })
    return;
  }

  pool.execute(`
    SELECT *
    FROM users
    WHERE username = "${username}"`, function(err, result) {
    if (err || result.length > 0) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err || `User with this Username already exists.` });
      return;
    } else {
      const token = jwt.sign({ username }, process.env.JWT_SECRET, {
        expiresIn: '30d',
      });
    
      pool.execute(`
        INSERT INTO users
        VALUES (DEFAULT, "${username}", "${password}", "${token}")`, function(err, result) {
        if (err) {
          console.log(err || result.affectedRows === 0);
        } else {
          pool.execute(`
            SELECT *
            FROM users
            WHERE token = "${token}"`, function(err, result) {
            if (err) {
              res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err });
              return;
            } else {
              res.status(StatusCodes.CREATED).json({ msg: "user created", result });
            }
          });
        }
      });
    }
  });
};

const login = async (req, res) => {
  const { username, password } = req.body;
  
  pool.execute(`
    SELECT *
    FROM users
    WHERE username = "${username}" AND password = "${password}"`, function(err, result) {
    if (err || result.length === 0) {
      res.status(StatusCodes.NOT_FOUND).json({ msg: err || `User not Found` });
      return;
    } else {
      res.status(StatusCodes.OK).json({ result });
    }
  });
};

module.exports = { signup, login };