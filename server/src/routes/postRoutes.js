// postRoutes.js
const express = require('express');
const { createPost, getPosts, likePost, commentPost } = require('../controllers/postController');
const { auth } = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, getPosts);
router.post('/', auth, createPost);
router.post('/:id/like', auth, likePost);
router.post('/:id/comment', auth, commentPost);

module.exports = router;
