const express = require('express');
const router = express.Router();
const { createSwapSession, getMySwaps, signSwapConfirmation } = require('../controllers/swapController');
const { protect } = require('../middleware/auth');

router.use(protect); // Protect all swap routes

router.post('/', createSwapSession);
router.get('/', getMySwaps);
router.put('/:id/confirm', signSwapConfirmation);

module.exports = router;
