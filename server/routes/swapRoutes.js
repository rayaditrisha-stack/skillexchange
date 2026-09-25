const express = require('express');
const router = express.Router();
const { createSwapSession, getMySwaps, signSwapConfirmation } = require('../controllers/swapController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/', createSwapSession);
router.get('/', getMySwaps);
router.put('/:id/confirm', signSwapConfirmation);
router.patch('/:id/sign', signSwapConfirmation);

module.exports = router;
