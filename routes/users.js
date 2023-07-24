const router = require('express').Router();
// eslint-disable-next-line import/no-extraneous-dependencies
const { celebrate, Joi } = require('celebrate');
const { regexLink } = require('../utils/constants');
const {
  getUsers,
  getUserId,
  editProfileAvatar,
  editProfileUser,
  getUserMe,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUserMe);
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24).required(),
  }),
}), getUserId);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), editProfileUser);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(regexLink).required(),
  }),
}), editProfileAvatar);
module.exports = router;
