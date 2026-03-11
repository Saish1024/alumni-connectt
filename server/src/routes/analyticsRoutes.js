const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { auth, checkRole } = require('../middleware/auth');

router.get('/dashboard', auth, checkRole(['admin']), analyticsController.getDashboardAnalytics);
router.get('/revenue', auth, checkRole(['admin']), analyticsController.getRevenueAnalytics);

module.exports = router;
