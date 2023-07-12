const router = require('express').Router();
const {
  createCard,
  getCards,
  removeCardId,
  addLikes,
  removeLikes,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', createCard);
router.delete('/:cardId', removeCardId);
router.put('/:cardId/likes', addLikes);
router.delete('/:cardId/likes', removeLikes);
module.exports = router;
