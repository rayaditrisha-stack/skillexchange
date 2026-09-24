import express from 'express';
import { createSwapSession, getMySwapSessions, signSwapConfirmation } from '../controllers/swapController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // Protect all swap routes

router.post('/', createSwapSession);
router.get('/', getMySwapSessions);
router.put('/:id/confirm', signSwapConfirmation);

export default router;
