const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');
const { protect, authorize } = require('../middleware/auth');

// Public/Alumni routes
router.get('/campaigns', protect, donationController.getCampaigns);
router.post('/donate', protect, donationController.createDonation);
router.get('/my-history', protect, donationController.getMyDonations);

// Admin routes
router.post('/admin/campaigns', protect, authorize(['admin']), donationController.adminCreateCampaign);
router.put('/admin/verify', protect, authorize(['admin']), donationController.verifyDonation);

module.exports = router;
