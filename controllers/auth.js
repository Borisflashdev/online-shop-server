const jwt = require('jsonwebtoken');
const pool = require('../db/connect');
const { StatusCodes } = require('http-status-codes');

const signup = async (req, res) => {
  const username = req.headers.username;
  const password = req.headers.password;
  const firstName = req.headers.first;
  const lastName = req.headers.last;

  if (!username) {
    res.status(StatusCodes.BAD_REQUEST).json({ msg: 'You must provide username.' });
    return;
  }
  if (!password) {
    res.status(StatusCodes.BAD_REQUEST).json({ msg: 'You must provide password.' });
    return;
  }
  if (!firstName) {
    res.status(StatusCodes.BAD_REQUEST).json({ msg: 'You must provide first name.' });
    return;
  }
  if (!lastName) {
    res.status(StatusCodes.BAD_REQUEST).json({ msg: 'You must provide last name.' });
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
      const token = jwt.sign({ username, firstName, lastName }, process.env.JWT_SECRET, {
        expiresIn: '30d',
      });
    
      pool.execute(`
        INSERT INTO users
        VALUES (DEFAULT, "${firstName}", "${lastName}", "${username}", "${password}", "${token}")`, function(err, result) {
        if (err || result.affectedRows === 0) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err });
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
  const username = req.headers.username;
  const password = req.headers.password;

  if (!username) {
    res.status(StatusCodes.BAD_REQUEST).json({ msg: 'You must provide username.' });
    return;
  }
  if (!password) {
    res.status(StatusCodes.BAD_REQUEST).json({ msg: 'You must provide password.' });
    return;
  }
  
  pool.execute(`
    SELECT *
    FROM users
    WHERE username = "${username}" AND password = "${password}"`, function(err, result) {
    if (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err });
        return;
    } else if (result.length === 0) {
        res.status(StatusCodes.NOT_FOUND).json({ msg: `User not Found` });
        return;
    } else {
        res.status(StatusCodes.OK).json({ result });
    }
  });
};

const deleteaccount = async (req, res) => {
    const user_id = req.headers.userid;

    if (!user_id) {
        res.status(StatusCodes.BAD_REQUEST).json({ msg: 'You must provide userId.' });
        return;
    }
    
    pool.execute(`
        DELETE FROM users
        WHERE user_id = "${user_id}"`, function(err, result) {
        if (err) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err });
            return;
        } else if (result.affectedRows === 0) {
            res.status(StatusCodes.NOT_FOUND).json({ msg: `User not Found` });
            return;
        } else {
            res.status(StatusCodes.OK).json({ result });
        }
    });
};

const editaccount = async (req, res) => {
    const user_id = req.headers.userid;
    const username = req.headers.username;
    const password = req.headers.password;
    const firstName = req.headers.first;
    const lastName = req.headers.last;

    if (!user_id) {
        res.status(StatusCodes.BAD_REQUEST).json({ msg: 'You must provide userId.' });
        return;
    }
    if (!username) {
        res.status(StatusCodes.BAD_REQUEST).json({ msg: 'You must provide username.' });
        return;
    }
      if (!password) {
        res.status(StatusCodes.BAD_REQUEST).json({ msg: 'You must provide password.' });
        return;
    }
      if (!firstName) {
        res.status(StatusCodes.BAD_REQUEST).json({ msg: 'You must provide first name.' });
        return;
    }
      if (!lastName) {
        res.status(StatusCodes.BAD_REQUEST).json({ msg: 'You must provide last name.' });
        return;
    }

    const token = jwt.sign({ username, firstName, lastName }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });

    pool.execute(`
        UPDATE users 
        SET 
        first_name = ${firstName},
        last_name = ${lastName},
        username = ${username},
        password = ${password},
        token = "${token}"
        WHERE user_id = "${user_id}";`, function(err, result) {
        if (err) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err });
            return;
        } else if (result.length === 0) {
            res.status(StatusCodes.NOT_FOUND).json({ msg: `User not Found` });
            return;
        } else {
          res.status(StatusCodes.OK).json({ result });
        }
    });
};

module.exports = { signup, login, deleteaccount, editaccount };