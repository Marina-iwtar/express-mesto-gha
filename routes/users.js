const router = require('express').Router();
const {
  getUsers,
  getUserId,
  editProfileAvatar,
  editProfileUser,
  getUserMe,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUserMe);
router.get('/:userId', getUserId);
router.patch('/me', editProfileUser);
router.patch('/me/avatar', editProfileAvatar);
module.exports = router;
