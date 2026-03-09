// messageRoutes.js
const express = require('express');
const { sendMessage, getMessages } = require('../controllers/messageController');
const { auth } = require('../middleware/auth');
const router = express.Router();

router.get('/:userId', auth, getMessages);
router.post('/', auth, sendMessage);

module.exports = router;
