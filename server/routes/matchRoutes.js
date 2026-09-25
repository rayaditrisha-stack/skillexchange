const express = require('express');
const router = express.Router();
const { getDirectMatches, getTriangularSwaps, getAllMatches } = require('../controllers/matchController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/direct', getDirectMatches);
router.get('/cycles', getTriangularSwaps);
router.get('/triangular', getTriangularSwaps);
router.get('/all', getAllMatches);

module.exports = router;
