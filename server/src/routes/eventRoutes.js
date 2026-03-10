// eventRoutes.js
const express = require('express');
const { createEvent, getEvents, registerForEvent, requestSession, acceptSession, rejectSession } = require('../controllers/eventController');
const { auth, checkRole } = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, getEvents);
router.post('/', auth, checkRole(['alumni', 'admin']), createEvent);
router.post('/:id/register', auth, registerForEvent);

// Mentoring specific endpoints
router.post('/request', auth, requestSession);
router.put('/:id/accept', auth, checkRole(['alumni', 'admin']), acceptSession);
router.put('/:id/reject', auth, checkRole(['alumni', 'admin']), rejectSession);

module.exports = router;
