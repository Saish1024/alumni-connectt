const express = require('express');
const { getAlumniStats } = require('../controllers/alumniController');
const { auth, checkRole } = require('../middleware/auth');
const router = express.Router();

router.get('/stats', auth, checkRole(['alumni', 'admin']), getAlumniStats);

module.exports = router;
