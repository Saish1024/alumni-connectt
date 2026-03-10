const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/auth');

router.get('/download/:type', protect, authorize(['faculty', 'admin']), reportController.downloadReportByType);
router.post('/custom', protect, authorize(['faculty', 'admin']), reportController.generateCustomReport);

module.exports = router;
