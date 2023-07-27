const Card = require('../models/card');
const ErrorBadRequest = require('../errors/ErrorBadRequest');
const ErrrorForbidden = require('../errors/ErrorForbidden');

const { OK, CREATE } = require('../utils/constants');

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(CREATE).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new ErrorBadRequest(
            ' Переданы некорректные данные при создании карточки.',
          ),
        );
      } else {
        next(err);
      }
    });
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((card) => res.status(OK).send(card))
    .catch(next);
};

module.exports.removeCardId = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new ErrorBadRequest('Карточка с указанным _id не найдена.');
      }
      if (String(card.owner) !== String(req.user._id)) {
        throw new ErrrorForbidden('Невозможно удалить чужую карточку');
      }
      return Card.findByIdAndRemove(req.params.cardId);
    })
    .then((card) => res.status(OK).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorBadRequest('Переданы некорректные данные карточки.'));
      } else {
        next(err);
      }
    });
};

module.exports.addLikes = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail()
    .then((card) => res.status(OK).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(
          new ErrorBadRequest(
            'Переданы некорректные данные для постановки лайка',
          ),
        );
      } else if (err.name === 'DocumentNotFoundError') {
        next(new ErrorBadRequest('Передан несуществующий _id карточки'));
      } else {
        next(err);
      }
    });
};
module.exports.removeLikes = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail()
    .then((card) => res.status(OK).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(
          new ErrorBadRequest('Переданы некорректные данные для снятия лайка'),
        );
      } else if (err.name === 'DocumentNotFoundError') {
        next(new ErrorBadRequest('Передан несуществующий _id карточки'));
      } else {
        next(err);
      }
    });
};
