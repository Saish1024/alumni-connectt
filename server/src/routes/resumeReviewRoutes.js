const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
    requestReview,
    getRequestsForAlumni,
    getRequestsForStudent,
    submitFeedback
} = require('../controllers/resumeReviewController');

// All routes are protected
router.use(auth);

// Student creates a request
router.post('/request', requestReview);

// Alumni gets their assigned requests
router.get('/alumni', getRequestsForAlumni);

// Student gets their sent requests
router.get('/student', getRequestsForStudent);

// Alumni submits feedback
router.put('/:id/feedback', submitFeedback);

module.exports = router;
