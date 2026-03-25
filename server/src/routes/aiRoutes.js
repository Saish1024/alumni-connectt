const express = require('express');
const multer = require('multer');
const { auth } = require('../middleware/auth');
const aiController = require('../controllers/aiController');

const router = express.Router();

// Configure multer for temporary resume storage
const upload = multer({ dest: 'uploads/resumes/' });

// Ensure uploads/resumes directory exists
const fs = require('fs');
if (!fs.existsSync('uploads/resumes/')) {
    fs.mkdirSync('uploads/resumes/', { recursive: true });
}

router.post('/resume-analyze', auth, upload.single('resume'), aiController.analyzeResume);
router.post('/chat', auth, aiController.chatWithCoach);

module.exports = router;
