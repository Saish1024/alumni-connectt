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

module.exports = router;
