const express = require('express');
const multer = require('multer');
const { auth } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// ----------------------------------------------------------------------------
// Cloudinary config - wait till you have real credentials in .env
// We will set up a dummy storage until real credentials are provided
// ----------------------------------------------------------------------------
let upload;
try {
    const cloudinary = require('cloudinary').v2;
    const { CloudinaryStorage } = require('multer-storage-cloudinary');

    if (process.env.CLOUDINARY_CLOUD_NAME) {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });

        const storage = new CloudinaryStorage({
            cloudinary: cloudinary,
            params: {
                folder: 'alumni_connect_profiles',
                allowedFormats: ['jpeg', 'png', 'jpg'],
            },
        });
        upload = multer({ storage: storage });
    } else {
        upload = multer({ dest: 'uploads/' }); // fallback for local if no cloudinary
    }
} catch (error) {
    upload = multer({ dest: 'uploads/' });
}

// POST /api/upload/profile-image
router.post('/profile-image', auth, upload.single('image'), async (req, res) => {
    try {
        if (!process.env.CLOUDINARY_CLOUD_NAME) {
            return res.status(400).json({ error: 'Cloudinary not configured in .env yet' });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'No image uploaded' });
        }

        // URL provided by cloudinary storage
        const imageUrl = req.file.path;

        // Update user
        const user = req.user;
        user.profileImage = imageUrl;
        await user.save();

        res.json({ url: imageUrl, message: 'Profile image updated successfully' });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Error uploading image' });
    }
});

module.exports = router;
