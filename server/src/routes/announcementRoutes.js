const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController');
const { protect, authorize } = require('../middleware/auth');

// Public/Auth routes
router.get('/', protect, announcementController.getAnnouncements);

// Admin only routes
router.post('/', protect, authorize(['admin']), announcementController.createAnnouncement);
router.delete('/:id', protect, authorize(['admin']), announcementController.deleteAnnouncement);

module.exports = router;
