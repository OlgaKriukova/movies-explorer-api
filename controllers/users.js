const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const UniqueError = require('../errors/UniqueError');
const WrongDataError = require('../errors/WrongDataError');

const { NODE_ENV, JWT_SECRET } = process.env;

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const newToken = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res
        .status(200)
        .cookie(
          'jwt',
          newToken,
          {
            maxAge: 604800000,
            httpOnly: true,
            sameSite: true,
          },
        )
        .send({
          message: 'authorization successful',
        });
    })
    .catch(next);
};

const logOut = (req, res) => {
  res.status(200).clearCookie('jwt').send({ message: 'Logged out' });
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(201).send({
      _id: user._id,
      email: user.email,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new WrongDataError());
      } else if (err.code === 11000) {
        next(new UniqueError());
      } else {
        next(err);
      }
    });
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(next);
};

const getUserMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.status(200).send(user))
    .catch(next);
};

const updateUser = (req, res, next) => {
  const newUserData = req.body;
  User.findByIdAndUpdate(req.user._id, newUserData, {
    new: true,
    runValidators: true,
    upsert: false,
  })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new WrongDataError());
      } else if (err.code === 11000) {
        next(new UniqueError());
      } else {
        next(err);
      }
    });
};

module.exports = {
  getUsers,
  getUserMe,
  login,
  logOut,
  createUser,
  updateUser,
};
