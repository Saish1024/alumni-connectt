const express = require('express');
const router = express.Router();
const competitionController = require('../controllers/competitionController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, competitionController.getCompetitions);
router.post('/', protect, authorize('faculty', 'admin'), competitionController.createCompetition);
router.delete('/:id', protect, authorize('faculty', 'admin'), competitionController.deleteCompetition);

module.exports = router;
