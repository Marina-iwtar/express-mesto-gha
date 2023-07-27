const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ErrrorConflict = require('../errors/ErrorConflict');
const ErrorBadRequest = require('../errors/ErrorBadRequest');
const ErrorUnauthorized = require('../errors/ErrorUnauthorized');
const ErrorNotFound = require('../errors/ErrorNotFound');
const { OK, CREATE } = require('../utils/constants');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(OK).send(users))
    .catch(next);
};

module.exports.getUserId = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => res.status(OK).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(
          new ErrorBadRequest(
            'Переданы некорректные данные при выводе пользователя',
          ),
        );
      } else if (err.name === 'DocumentNotFoundError') {
        next(new ErrorNotFound('Пользователь с указанным _id не найден.'));
      } else {
        next(err);
      }
    });
};
module.exports.getUserMe = (req, res, next) => {
  const { userId } = req.user;
  User.findById(userId)
    .orFail(next(new ErrorNotFound('Пользователь с указанным _id не найден.')))
    .then((user) => res.status(OK).send(user))
    .catch(next);
};

module.exports.createUsers = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => {
      const { _id } = user;
      res.status(CREATE).send({
        email,
        name,
        about,
        avatar,
        _id,
      });
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.code === 11000) {
        next(
          new ErrrorConflict(`Пользователь с таким ${email} уже зарегистирован`),
        );
      } else if (err.name === 'ValidationError') {
        next(
          new ErrorBadRequest(
            'Переданы некорректные данные при создании пользователя',
          ),
        );
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', {
        expiresIn: '7d',
      });
      // вернём токен
      res.status(OK).send({ _id: token });
      throw new ErrorUnauthorized('Неправильные почта или пароль');
    })
    .catch(next);
};

module.exports.editProfileAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((users) => res.status(OK).send(users))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new ErrorBadRequest(
            'Переданы некорректные данные при обновлении аватара.',
          ),
        );
      } else if (err.name === 'DocumentNotFoundError') {
        next(new ErrorNotFound('Пользователь с указанным _id не найден.'));
      } else {
        next(err);
      }
    });
};

module.exports.editProfileUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((users) => res.status(OK).send(users))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new ErrorBadRequest(
            'Переданы некорректные данные при обновлении пользователя.',
          ),
        );
      } else if (err.name === 'DocumentNotFoundError') {
        next(new ErrorNotFound('Пользователь с указанным _id не найден.'));
      } else {
        next(err);
      }
    });
};
