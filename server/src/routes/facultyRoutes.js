const express = require('express');
const router = express.Router();
const facultyController = require('../controllers/facultyController');
const { protect, authorize } = require('../middleware/auth');

router.get('/stats', protect, authorize('faculty', 'admin'), facultyController.getDashboardStats);

module.exports = router;
