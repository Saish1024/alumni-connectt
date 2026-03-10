const User = require('../models/User');

// GET /api/users - get all alumni (for directory)
const getUsers = async (req, res) => {
    try {
        const { search, industry, batchYear, role } = req.query;
        const filter = { isApproved: true };

        if (role) filter.role = role;
        if (batchYear) filter.batchYear = batchYear;
        if (industry) filter.industry = industry;
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { company: { $regex: search, $options: 'i' } },
                { jobTitle: { $regex: search, $options: 'i' } },
                { skills: { $in: [new RegExp(search, 'i')] } },
            ];
        }

        const users = await User.find(filter)
            .select('-password')
            .sort({ createdAt: -1 });

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET /api/users/:id - get single user profile
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PUT /api/users/profile - update own profile
const updateProfile = async (req, res) => {
    try {
        const allowedUpdates = [
            'name', 'bio', 'location', 'company', 'jobTitle',
            'industry', 'skills', 'linkedin', 'profileImage', 'batchYear'
        ];
        const updates = {};
        allowedUpdates.forEach(key => {
            if (req.body[key] !== undefined) updates[key] = req.body[key];
        });

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $set: updates },
            { new: true, runValidators: true }
        ).select('-password');

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PUT /api/users/:id/approve - Admin approve alumni
const approveUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isApproved: true },
            { new: true }
        ).select('-password');
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.status(200).json({ message: 'User approved', user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE /api/users/:id - Admin delete user
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.status(200).json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET /api/users/pending - Admin: get pending alumni
const getPendingUsers = async (req, res) => {
    try {
        const users = await User.find({ isApproved: false })
            .select('-password')
            .sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PUT /api/users/:id - Admin: update any user profile
const adminUpdateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const { name, email, role, password, batchYear, company, jobTitle, location, bio, linkedin, industry, isApproved } = req.body;

        if (name) user.name = name;
        if (email) user.email = email;
        if (role) user.role = role;
        if (batchYear) user.batchYear = batchYear;
        if (company) user.company = company;
        if (jobTitle) user.jobTitle = jobTitle;
        if (location) user.location = location;
        if (bio) user.bio = bio;
        if (linkedin) user.linkedin = linkedin;
        if (industry) user.industry = industry;
        if (isApproved !== undefined) user.isApproved = isApproved;

        // If password is provided, set it (pre-save hook will hash it)
        if (password) user.password = password;

        await user.save();

        const updatedUser = user.toObject();
        delete updatedUser.password;

        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getUsers, getUserById, updateProfile, approveUser, deleteUser, getPendingUsers, adminUpdateUser };
