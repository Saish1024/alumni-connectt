// eventRoutes.js
const express = require('express');
const {
    createEvent,
    getEvents,
    registerForEvent,
    requestSession,
    acceptSession,
    rejectSession,
    trackAttendance,
    trackAttendance,
    submitRating,
    deleteEvent
} = require('../controllers/eventController');
const { auth, checkRole } = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, getEvents);
router.post('/', auth, checkRole(['alumni', 'admin']), createEvent);
router.post('/:id/register', auth, registerForEvent);
router.post('/:id/attend', auth, trackAttendance);
router.post('/:id/rate', auth, submitRating);
router.delete('/:id', auth, deleteEvent);

// Mentoring specific endpoints
router.post('/request', auth, requestSession);
router.put('/:id/accept', auth, checkRole(['alumni', 'admin']), acceptSession);
router.put('/:id/reject', auth, checkRole(['alumni', 'admin']), rejectSession);

module.exports = router;
