const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const { protect, authorize } = require('../middleware/auth');

router.post('/submit', protect, quizController.submitQuizAttempt);
router.get('/analytics', protect, authorize(['faculty', 'admin']), quizController.getQuizAnalytics);

module.exports = router;
