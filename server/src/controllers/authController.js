const jwt = require('jsonwebtoken');
const User = require('../models/User');

const register = async (req, res) => {
    try {
        const { name, email, password, role, batchYear, phoneNumber, company, jobTitle, industry, location, skills, bio, linkedin } = req.body;

        // Block creating admin accounts through regular registration
        if (role === 'admin') {
            return res.status(403).json({ error: 'Admin accounts cannot be created through registration.' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const user = new User({
            name,
            email,
            password,
            role,
            batchYear,
            company,
            jobTitle,
            industry,
            location,
            skills,
            bio,
            linkedin,
            isApproved: false, // All users need approval by default. Admin must be manual in DB.
        });

        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });

        res.status(201).json({ user, token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Check if account is approved (Admins bypass this check)
        if (!user.isApproved && user.role !== 'admin') {
            return res.status(403).json({
                error: 'Pending Approval',
                message: 'Your account is currently pending admin approval. Please check back later.'
            });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });

        res.status(200).json({ user, token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getMe = async (req, res) => {
    res.status(200).json(req.user);
};

module.exports = { register, login, getMe };
