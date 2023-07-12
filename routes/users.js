const router = require('express').Router();
const {
  getUsers,
  createUsers,
  getUserId,
  editProfileAvatar,
  editProfileUser,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserId);
router.post('/', createUsers);
router.patch('/me', editProfileUser);
router.patch('/me/avatar', editProfileAvatar);
module.exports = router;
