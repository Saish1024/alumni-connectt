const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

// Public/Alumni routes
router.get('/campaigns', auth, donationController.getCampaigns);
router.post('/donate', auth, donationController.createDonation);
router.get('/my-history', auth, donationController.getMyDonations);

// Admin routes
router.post('/admin/campaigns', auth, checkRole(['admin']), donationController.adminCreateCampaign);
router.put('/admin/verify', auth, checkRole(['admin']), donationController.verifyDonation);

module.exports = router;
