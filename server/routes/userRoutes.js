const express = require('express');
const router = express.Router();
const { getPublicUsers, addOfferedSkill, updateNeededSkills, getMatches } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.get('/', getPublicUsers); // Public search/explore
router.get('/matches', protect, getMatches);
router.post('/skills-offered', protect, addOfferedSkill);
router.put('/skills-needed', protect, updateNeededSkills);

module.exports = router;
