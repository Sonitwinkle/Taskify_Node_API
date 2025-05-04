const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (userId) => {
  return jwt.sign({ _id: userId.toString() }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};

exports.register = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    const token = generateToken(user._id);
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);
    const token = generateToken(user._id);
    res.send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
};
