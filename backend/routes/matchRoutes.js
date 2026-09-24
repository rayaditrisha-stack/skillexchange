import express from 'express';
import { getDirectMatches, getTriangularSwaps, getAllMatches } from '../controllers/matchController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/direct', getDirectMatches);
router.get('/triangular', getTriangularSwaps);
router.get('/all', getAllMatches);

export default router;
