const express = require('express');
const { auth, checkRole } = require('../middleware/auth');
const payoutController = require('../controllers/payoutController');

const router = express.Router();

// Alumni routes
router.get('/earnings', auth, checkRole(['alumni']), payoutController.getEarnings);
router.post('/request', auth, checkRole(['alumni']), payoutController.requestPayout);
router.put('/settings', auth, checkRole(['alumni']), payoutController.updatePaymentInfo);

// Admin routes
router.get('/admin/all', auth, checkRole(['admin']), payoutController.getAllPayouts);
router.put('/admin/:id', auth, checkRole(['admin']), payoutController.processPayout);
router.get('/admin/inbound', auth, checkRole(['admin']), payoutController.getInboundPayments);
router.put('/admin/confirm-payment/:id', auth, checkRole(['admin']), payoutController.confirmStudentPayment);

// Platform & Financial Overview
router.get('/admin/financials', auth, checkRole(['admin']), payoutController.getFinancialOverview);
router.get('/admin/config', auth, checkRole(['admin']), payoutController.getPlatformConfig);
router.put('/admin/config', auth, checkRole(['admin']), payoutController.updatePlatformConfig);
router.get('/platform/config/:key', payoutController.getConfigByKey); // Publicly accessible (for students to get UPI)

module.exports = router;
