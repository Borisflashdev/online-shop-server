const jwt = require('jsonwebtoken');
const User = require('../models/userModel.js');

const signup = async (req, res) => {
  const { username, password } = req.body;

  if (!username) {
    res.status(400).json({ msg: 'Username is not valid.' });
    return;
  }
  if (!password) {
    res.status(400).json({ msg: 'Password is not valid.' })
    return;
  }

  const existingUser = await User.exists({ username });
  if (existingUser !== null) {
    res.status(400).json({ msg: 'User with this Username already exists.' });
    return;
  }

  const token = jwt.sign({ username }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  const user = await User.create({ username, password, token });

  res.status(200).json({ msg: 'user created', user });
};

const login = async (req, res) => {
  const { username, password } = req.body;
  
  const existingUser = await User.findOne({ username, password });
  if (!existingUser) {
    res.status(400).json({ msg: 'User not found.' });
    return;
  }

  res.status(200).json({ existingUser });
};

module.exports = { signup, login };