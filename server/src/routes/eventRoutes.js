// eventRoutes.js
const express = require('express');
const { createEvent, getEvents, registerForEvent } = require('../controllers/eventController');
const { auth, checkRole } = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, getEvents);
router.post('/', auth, checkRole(['alumni', 'admin']), createEvent);
router.post('/:id/register', auth, registerForEvent);

module.exports = router;
