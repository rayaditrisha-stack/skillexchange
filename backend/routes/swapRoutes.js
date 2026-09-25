import express from 'express';
import { createSwapSession, getMySwapSessions, signSwapConfirmation } from '../controllers/swapController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', createSwapSession);
router.get('/', getMySwapSessions);
router.put('/:id/confirm', signSwapConfirmation);
router.patch('/:id/sign', signSwapConfirmation);

export default router;
