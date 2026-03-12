const express = require('express');
const router = express.Router();
const facultyController = require('../controllers/facultyController');
const { protect, authorize } = require('../middleware/auth');

router.get('/stats', protect, authorize(['faculty', 'admin']), facultyController.getDashboardStats);
router.post('/requests', protect, authorize(['faculty']), facultyController.createSessionRequest);
router.get('/requests', protect, authorize(['faculty']), facultyController.getMySessionRequests);

module.exports = router;
