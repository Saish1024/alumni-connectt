const Post = require('../models/Post');

const createPost = async (req, res) => {
    try {
        const post = new Post({
            ...req.body,
            author: req.user._id
        });
        await post.save();
        // Populate author so the frontend can display user info immediately
        await post.populate('author', 'name profileImage role');
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('author', 'name profileImage role')
            .populate('comments.user', 'name')
            .sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ error: 'Post not found' });

        const index = post.likes.indexOf(req.user._id);
        if (index === -1) {
            post.likes.push(req.user._id);
        } else {
            post.likes.splice(index, 1);
        }

        await post.save();
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const commentPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ error: 'Post not found' });

        post.comments.push({
            user: req.user._id,
            text: req.body.text
        });

        await post.save();
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createPost, getPosts, likePost, commentPost };
