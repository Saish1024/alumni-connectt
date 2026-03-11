const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const { protect, authorize } = require('../middleware/auth');

router.post('/generate', protect, quizController.generateQuizAttempt);
router.post('/submit', protect, quizController.submitQuizAttempt);
router.get('/analytics', protect, authorize(['faculty', 'admin']), quizController.getQuizAnalytics);
router.get('/leaderboard', protect, authorize(['faculty', 'admin']), quizController.getQuizLeaderboard);
router.get('/gaps', protect, authorize(['faculty', 'admin']), quizController.getPerformanceGaps);

module.exports = router;
