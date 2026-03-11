const { getAlumniStats, getLegacyData, updateMentoringSettings } = require('../controllers/alumniController');
const { auth, checkRole } = require('../middleware/auth');
const router = express.Router();

router.get('/stats', auth, checkRole(['alumni', 'admin']), getAlumniStats);
router.get('/legacy', auth, checkRole(['alumni']), getLegacyData);
router.put('/setup', auth, checkRole(['alumni']), updateMentoringSettings);

module.exports = router;
