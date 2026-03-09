// jobRoutes.js
const express = require('express');
const { createJob, getJobs, applyForJob } = require('../controllers/jobController');
const { auth, checkRole } = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, getJobs);
router.post('/', auth, checkRole(['alumni', 'admin']), createJob);
router.post('/:id/apply', auth, checkRole(['student']), applyForJob);

module.exports = router;
