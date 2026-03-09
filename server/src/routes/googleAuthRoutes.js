const express = require('express');
const router = express.Router();
const googleAuthController = require('../controllers/googleAuthController');

router.get('/', googleAuthController.getAuthUrl);
router.get('/callback', googleAuthController.googleCallback);

module.exports = router;
