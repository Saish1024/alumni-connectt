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

    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });

        const storage = new CloudinaryStorage({
            cloudinary: cloudinary,
            params: {
                folder: 'alumni_connect_profiles',
                allowedFormats: ['jpeg', 'png', 'jpg', 'webp'],
            },
        });
        upload = multer({ storage: storage });
        console.log('✅ Cloudinary storage initialized');
    } else {
        console.warn('⚠️ Cloudinary credentials missing, falling back to local storage');
        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                const dir = 'uploads/';
                cb(null, dir);
            },
            filename: (req, file, cb) => {
                cb(null, `${Date.now()}-${file.originalname}`);
            }
        });
        upload = multer({ storage });
    }
} catch (error) {
    console.error('❌ Cloudinary initialization error:', error.message);
    upload = multer({ dest: 'uploads/' });
}

// POST /api/upload/profile-image
router.post('/profile-image', auth, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image uploaded' });
        }

        let imageUrl;
        if (process.env.CLOUDINARY_CLOUD_NAME) {
            // URL provided by cloudinary storage
            imageUrl = req.file.path;
        } else {
            // Local storage URL - format it for the frontend
            // Assuming the server runs on PORT or localhost:5000
            const host = req.get('host');
            const protocol = req.protocol;
            imageUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
        }

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
