const express = require('express');
const { 
    getAlumniStats, 
    getLegacyData, 
    updateMentoringSettings,
    getAvailableSessionRequests,
    acceptSessionRequest
} = require('../controllers/alumniController');
const { auth, checkRole } = require('../middleware/auth');
const router = express.Router();

router.get('/stats', auth, checkRole(['alumni', 'admin']), getAlumniStats);
router.get('/legacy', auth, checkRole(['alumni']), getLegacyData);
router.put('/setup', auth, checkRole(['alumni']), updateMentoringSettings);
router.get('/requests/available', auth, checkRole(['alumni']), getAvailableSessionRequests);
router.post('/requests/accept', auth, checkRole(['alumni']), acceptSessionRequest);

module.exports = router;
